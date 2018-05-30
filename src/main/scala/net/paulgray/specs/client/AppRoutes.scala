package net.paulgray.specs.client

import java.security.KeyFactory
import java.security.interfaces.{RSAPrivateKey, RSAPublicKey}
import java.security.spec.PKCS8EncodedKeySpec

import cats.data.OptionT
import cats.effect.IO
import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.interfaces.RSAKeyProvider
import doobie.implicits._
import io.circe.Encoder
import net.paulgray.specs.ApiRouter.ApiRoot
import net.paulgray.specs.RequestUtil.{ConnectionIOOps, DbResultResponse, withClient, withClientAndBody}
import net.paulgray.specs.SpecsRoot.RequestHandler
import net.paulgray.specs.course.ActivityQueries.{Activity, UpdateActivityRequest}
import org.http4s.{EntityDecoder, EntityEncoder}
import org.http4s.circe._
import org.http4s.dsl.io._
import io.circe.syntax._
import io.circe._
import io.circe._
import io.circe.generic.semiauto._
import io.circe.literal._
import io.circe.generic.auto._
import io.circe.java8.time.encodeInstant
import net.paulgray.specs.RequestUtil
import net.paulgray.specs.client.AppQueries.{AppOut, CreateAppRequest}
import net.paulgray.specs.core.{KeyQueries, KeypairService, LaunchService}
import net.paulgray.specs.core.LaunchService.LaunchAppRequest
import org.apache.commons.codec.binary.Base64
import java.security.PublicKey
import java.security.spec.EncodedKeySpec
import java.security.spec.X509EncodedKeySpec
import javax.xml.crypto.dsig.SignatureMethod

import KeyQueries._
import LaunchAppRequest._
import io.jsonwebtoken.SignatureAlgorithm

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

    // create
    case req @ POST -> ApiRoot / "apps" =>
      withClientAndBody[AppOut, CreateAppRequest](req) {
        (client, req) =>
          for {
            app <- createApp(req, client.id)
          } yield app
      }

    // launch
    case req @ POST -> ApiRoot / "apps" / LongVar(appId) / "launch" =>
      withClientAndBody[IdTokenResponse, LaunchAppRequest](req) {
        (client, req) =>
          for {
            idToken <- generateLaunch()
          } yield IdTokenResponse(idToken)
      }

    case req @ GET -> ApiRoot / "apps" / LongVar(appId) / "launch" =>
      withClient(req) {
        client =>
          for {
            idToken <- generateLaunch()
          } yield IdTokenResponse(idToken)
      }
  }

  def generateLaunch(): DbResultResponse[String] = {

    val res = for {
      keys <- KeyQueries.getAllKeypairs
    } yield {
      val key = keys.head
      val (privKey, pubKey) = key.buildKeys

      LaunchService
        .constructLaunchToken()
        .toJWT(issuer = "https://paulgray.net", audience = "chuck")
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

}
