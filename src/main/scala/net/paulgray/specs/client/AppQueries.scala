package net.paulgray.specs.client

import doobie.free.connection.ConnectionIO
import doobie.implicits._
import net.paulgray.specs.core.KeypairService
import net.paulgray.specs.core.KeypairService._


object AppQueries {

  case class CreateAppRequest(name: String, description: Option[String], logo: Option[String])

  case class AppIn(name: String, description: Option[String], logo: Option[String], publicKey: String)
  case class App(id: Long, name: String, description: Option[String], logo: Option[String], publicKey: String)
  case class AppOut(name: String, description: Option[String], logo: Option[String], publicKey: String, privateKey: String)

  def getAllApps: ConnectionIO[List[App]] =
    sql"select id, name, logo, public_key from apps".query[App].list

  def getApps(clientId: Long): ConnectionIO[List[App]] =
    sql"select id, name, logo, public_key from apps where client_id = $clientId".query[App].list

  def getApp(id: Long, clientId: Long): ConnectionIO[Option[App]] =
    sql"select id, name, logo, public_key from apps where id = $id and client_id = $clientId".query[App].option

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
    println(
      s"""
        |Generated:
        |  Public Key:
        |    $pubKey
        |  Private Key:
        |    $privateKey
      """.stripMargin)
    val appIn = AppIn(app.name, app.description, app.logo, pubKey)
    createApp(appIn, clientId).map(bool => {
      AppOut(app.name, app.description, app.logo, pubKey, privateKey)
    })
  }

}
