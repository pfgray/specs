package net.paulgray.specs.client

import cats.data.OptionT
import cats.effect.IO
import doobie.implicits._
import io.circe.generic.auto._
import io.jsonwebtoken.SignatureAlgorithm
import net.paulgray.specs.ApiRouter.ApiRoot
import net.paulgray.specs.RequestUtil.{ConnectionIOOps, DbResultResponse, withClient, withClientAndBody}
import net.paulgray.specs.SpecsRoot.RequestHandler
import net.paulgray.specs.client.AppQueries.{AppOut, CreateAppRequest}
import net.paulgray.specs.core.KeyQueries._
import net.paulgray.specs.core.LaunchService.LaunchAppRequest
import net.paulgray.specs.core.{KeyQueries, LaunchService}
import org.http4s.circe._
import org.http4s.dsl.io._

object AppRoutes {

  // take in a name and logo, and generate a keypair, returning them.
  import AppQueries.App

  case class Apps[T](apps: List[T])
  case class IdTokenResponse(idToken: String)

  implicit val decoder = jsonOf[IO, CreateAppRequest]
  implicit val decoderLaunchApp = jsonOf[IO, LaunchAppRequest]

  def routes: RequestHandler = {

    // list all
    case req @ GET -> ApiRoot / "apps" / "all" =>
      withClient(req) {
        client =>
          for {
            apps <- getAllApps
          } yield Apps(apps)
      }

    // list
    case req @ GET -> ApiRoot / "apps" =>
      withClient(req) {
        client =>
          for {
            apps <- getApps(client.id)
          } yield Apps(apps)
      }

    // get
    case req @ GET -> ApiRoot / "apps" / LongVar(appId) =>
      withClient(req) {
        client =>
          for {
            app <- getApp(appId, client.id)
          } yield app
      }

    // put
    case req @ PUT -> ApiRoot / "apps" / LongVar(appId) =>
      withClientAndBody[App, CreateAppRequest](req) {
        (client, body) =>
          for {
            app <- getApp(appId, client.id)
            updated <- updateApp(appId, body)
          } yield app
      }

    // delete
    case req @ DELETE -> ApiRoot / "apps" / LongVar(appId) =>
      withClient[Boolean](req) {
        client =>
          for {
            app <- getApp(appId, client.id)
            updated <- deleteApp(appId)
          } yield updated
      }

    // create
    case req @ POST -> ApiRoot / "apps" =>
      withClientAndBody[AppOut, CreateAppRequest](req) {
        (client, req) =>
          for {
            app <- createApp(req, client.id)
          } yield app
      }

    // launch
    case req @ POST -> ApiRoot / "apps" / "launch" =>
      withClientAndBody[IdTokenResponse, LaunchAppRequest](req) {
        (client, req) =>
          for {
            idToken <- generateLaunch(req)
          } yield IdTokenResponse(idToken)
      }
  }

  def generateLaunch(lar: LaunchAppRequest): DbResultResponse[String] = {
    val res = for {
      keys <- KeyQueries.getAllKeypairs
    } yield {
      val key = keys.head
      val (privKey, pubKey) = key.buildKeys

      LaunchService
        .constructLaunchToken(lar)
        .toJWT(issuer = "https://specs.paulgray.net", audience = "tool")
        .setHeaderParam("kid", key.id.toString)
        .signWith(SignatureAlgorithm.RS256, privKey)
        .compact()
    }

    res.toRightResp
  }

  def getAllApps: DbResultResponse[List[App]] =
    AppQueries.getAllApps.toRightResp

  def getApp(id: Long, clientId: Long): DbResultResponse[App] =
    OptionT(AppQueries.getApp(id, clientId)).toRight(NotFound(s"No app with id: $id for client: $clientId"))

  def createApp(createAppRequest: CreateAppRequest, clientId: Long): DbResultResponse[AppOut] =
    AppQueries.initializeApp(createAppRequest, clientId).toRightResp

  def getApps(clientId: Long): DbResultResponse[List[App]] =
    AppQueries.getApps(clientId).toRightResp

  def updateApp(appId: Long, app: CreateAppRequest): DbResultResponse[Int] =
    AppQueries.updateApp(app, appId).toRightResp

  def deleteApp(appId: Long): DbResultResponse[Boolean] =
    AppQueries.deleteApp(appId).toRightResp

}
