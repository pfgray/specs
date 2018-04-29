package net.paulgray.specs.client

import java.util.UUID

import cats.data.OptionT
import doobie.free.connection.ConnectionIO
import doobie.implicits._
import doobie.util.query.Query0
import net.paulgray.specs.client.ClientQueries.Client

object TokenQueries {

  case class Token(id: Int, guid: String, clientId: Int)

  def getToken(token: String): Query0[Token] =
    sql"select id, guid, client_id from tokens where guid = $token".query[Token]

  def getClientForToken(token: String): ConnectionIO[Option[Client]] =
    (for {
      token  <- OptionT(getToken(token).option)
      client <- OptionT(ClientQueries.getClient(token.clientId))
    } yield client).value

  def createToken(guid: String, clientId: Long): ConnectionIO[Int] =
    sql"insert into tokens (guid, client_id) values ($guid, $clientId)".update.run

  def createTokenForClient(clientId: Long): ConnectionIO[Token] = {
    val guid = UUID.randomUUID().toString
    for {
      _     <- createToken(guid, clientId)
      token <- getToken(guid).unique
    } yield token
  }

}
