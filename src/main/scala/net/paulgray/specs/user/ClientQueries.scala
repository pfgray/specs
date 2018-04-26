package net.paulgray.specs.user

import doobie.free.connection.ConnectionIO
import doobie.implicits._


object ClientQueries {

  case class Client(username: String)

  def clientExists(username: String): ConnectionIO[Boolean] =
    (sql"select count(1) from clients where username = $username".query[Int] map {
      case 0 => false
      case _ => true
    }).unique

  def createClient(username: String, password: String): ConnectionIO[Boolean] =
    sql"insert into clients (username, password) values ($username, $password)".update.run map {
      case 0 => true
      case _ => false
    }

}
