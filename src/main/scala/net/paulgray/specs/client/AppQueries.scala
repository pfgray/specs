package net.paulgray.specs.client

import cats.syntax.either._
import doobie.free.connection.ConnectionIO
import doobie.implicits._
import doobie.util.meta.Meta
import io.circe.generic.auto._
import io.circe.parser._
import io.circe.syntax._
import io.circe.{Decoder, Encoder, Json}
import net.paulgray.specs.core.KeypairService
import net.paulgray.specs.core.KeypairService._
import org.postgresql.util.PGobject

import scala.reflect.runtime.universe._

object AppQueries {

  implicit val JsonMeta: Meta[Json] =
    Meta.other[PGobject]("json").xmap[Json](
      a => parse(a.getValue).leftMap[Json](e => throw e).merge,
      a => {
        val o = new PGobject
        o.setType("json")
        o.setValue(a.noSpaces)
        o
      }
    )

  def codecMeta[A: Encoder : Decoder : TypeTag]: Meta[A] =
    Meta[Json].xmap[A](
      _.as[A].fold[A](throw _, identity),
      _.asJson
    )

  case class Placements(placements: List[Placement])
  case class Placement(name: String, url: String, launchType: String, customParameters: Map[String, String])

  implicit val PlacementsMeta = codecMeta[Placements]

  case class CreateAppRequest(name: String, description: Option[String], logo: Option[String], placements: Placements)

  case class AppIn(name: String, description: Option[String], logo: Option[String], placements: Placements, publicKey: String)
  case class App(id: Long, name: String, description: Option[String], logo: Option[String], placements: Placements, publicKey: String)
  case class AppOut(name: String, description: Option[String], logo: Option[String], publicKey: String, privateKey: String)

  def updateApp(app: CreateAppRequest, appId: Long): ConnectionIO[Int] =
    sql"""
         update apps
           set name = ${app.name},
             description = ${app.description},
             logo = ${app.logo},
             placements = ${app.placements}
           where id = $appId
      """.update.run

  def updateUser(userId: Long, name: String): ConnectionIO[Int] =
    sql"update users set username = $name where id = $userId".update.run

  def getAllApps: ConnectionIO[List[App]] =
    sql"select id, name, description, logo, placements, public_key from apps".query[App].list

  def getApps(clientId: Long): ConnectionIO[List[App]] =
    sql"select id, name, description, logo, placements, public_key from apps where client_id = $clientId".query[App].list

  def getApp(id: Long, clientId: Long): ConnectionIO[Option[App]] =
    sql"select id, name, description, logo, placements, public_key from apps where id = $id and client_id = $clientId".query[App].option

  def createApp(app: AppIn, clientId: Long): ConnectionIO[Boolean] =
    sql"""insert into apps
         (name, logo, public_key, placements, client_id)
         values
         (${app.name}, ${app.logo}, ${app.publicKey}, ${app.placements}, $clientId)""".update.run map {
      case 0 => false
      case _ => true
    }

  def deleteApp(appId: Long): ConnectionIO[Boolean] =
    sql"""delete from apps
         where id = $appId""".update.run map {
      case 0 => false
      case _ => true
    }

  def initializeApp(app: CreateAppRequest, clientId: Long): ConnectionIO[AppOut] = {
    val (privateKey, pubKey) = KeypairService.generateKeypair().getEncoded
    val appIn = AppIn(app.name, app.description, app.logo, app.placements, pubKey)
    createApp(appIn, clientId).map(bool => {
      AppOut(app.name, app.description, app.logo, pubKey, privateKey)
    })
  }

}
