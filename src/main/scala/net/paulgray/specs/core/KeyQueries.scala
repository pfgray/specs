package net.paulgray.specs.core

import doobie.free.connection.ConnectionIO
import doobie.implicits._

object KeyQueries {

  case class Keypair(id: Long, privateKey: String, publicKey: String)

  def createKeypair(privateKey: String, publicKey: String): ConnectionIO[Boolean] =
    sql"""insert into keypairs
         (public_key, private_key)
         values
         ($publicKey, $privateKey)""".update.run map {
      case 0 => false
      case _ => true
    }

  def getAllKeypairs: ConnectionIO[List[Keypair]] =
    sql"select id, public_key, private_key from keypairs".query[Keypair].list

}
