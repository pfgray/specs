package net.paulgray.specs.client

import cats.effect.IO
import doobie.free.connection.ConnectionIO
import doobie.implicits._
import doobie.util.meta.Meta
import io.circe.{Decoder, Encoder, Json}
import net.paulgray.specs.core.KeypairService
import net.paulgray.specs.core.KeypairService._
import org.postgresql.util.PGobject

import scala.reflect.runtime.universe._
import io.circe.syntax._
import io.circe._
import io.circe.generic.semiauto._
import io.circe.literal._
import io.circe.generic.auto._
import io.circe.parser._
import cats.syntax.either._
import doobie.util.composite.Composite
import io.circe.generic.JsonCodec
import org.http4s.circe.jsonOf

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
  case class Placement(place: String, url: String)

  implicit val PlacementsMeta = codecMeta[Placements]

  case class CreateAppRequest(name: String, description: Option[String], logo: Option[String])

  case class AppIn(name: String, description: Option[String], logo: Option[String], publicKey: String)
  case class App(id: Long, name: String, description: Option[String], logo: Option[String], placements: Placements, publicKey: String)
  case class AppOut(name: String, description: Option[String], logo: Option[String], publicKey: String, privateKey: String)

  def getAllApps: ConnectionIO[List[App]] =
    sql"select id, name, description, logo, placements, public_key from apps".query[App].list

  def getApps(clientId: Long): ConnectionIO[List[App]] =
    sql"select id, name, description, logo, placements, public_key from apps where client_id = $clientId".query[App].list

  def getApp(id: Long, clientId: Long): ConnectionIO[Option[App]] =
    sql"select id, name, description, logo, placements, public_key from apps where id = $id and client_id = $clientId".query[App].option

  def createApp(app: AppIn, clientId: Long): ConnectionIO[Boolean] =
    sql"""insert into apps
         (name, logo, public_key, client_id)
         values
         (${app.name}, ${app.logo}, ${app.publicKey}, $clientId)""".update.run map {
      case 0 => false
      case _ => true
    }

  def initializeApp(app: CreateAppRequest, clientId: Long): ConnectionIO[AppOut] = {
    val (privateKey, pubKey) = KeypairService.generateKeypair().getEncoded
    val appIn = AppIn(app.name, app.description, app.logo, pubKey)
    createApp(appIn, clientId).map(bool => {
      AppOut(app.name, app.description, app.logo, pubKey, privateKey)
    })
  }

}
