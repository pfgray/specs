package net.paulgray.specs.client

import doobie.free.connection.ConnectionIO
import doobie.implicits._


object ClientQueries {

  case class Client(id: Int, username: String)

  def getClient(id: Int): ConnectionIO[Option[Client]] =
    sql"select id, username from clients where id = $id".query[Client].option

  def getClientByUsername(username: String): ConnectionIO[Option[Client]] =
    sql"select id, username from clients where username = $username".query[Client].option

  def getPasswordForClient(username: String): ConnectionIO[Option[String]] =
    sql"select password from clients where username = $username".query[String].option

  def clientExists(username: String): ConnectionIO[Boolean] =
    (sql"select count(1) from clients where username = $username".query[Int] map {
      case 0 => false
      case _ => true
    }).unique

  def createClient(username: String, password: String): ConnectionIO[Boolean] =
    sql"insert into clients (username, password) values ($username, $password)".update.run map {
      case 0 => false
      case _ => true
    }

}
