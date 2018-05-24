package net.paulgray.specs.core

import java.security.{KeyFactory, PrivateKey, PublicKey}
import java.security.interfaces.{RSAPrivateKey, RSAPublicKey}
import java.security.spec.{PKCS8EncodedKeySpec, X509EncodedKeySpec}

import doobie.free.connection.ConnectionIO
import doobie.implicits._
import org.apache.commons.codec.binary.Base64

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
    sql"select id, private_key, public_key from keypairs".query[Keypair].list

  implicit class KeypairOps(keypair: Keypair) {
    implicit def buildKeys: (PrivateKey, PublicKey) = {

      val keyFactory = KeyFactory.getInstance(KeypairService.ALG)

      val publicKeyStr = keypair.publicKey
      val privateKeyStr = keypair.privateKey

      val publicKeySpec = new X509EncodedKeySpec(Base64.decodeBase64(keypair.publicKey))
      val pubKey = keyFactory.generatePublic(publicKeySpec)

      val privateKeySpec = new PKCS8EncodedKeySpec(Base64.decodeBase64(keypair.privateKey))
      val privateKey = keyFactory.generatePrivate(privateKeySpec)

      (privateKey, pubKey)
    }

  }
}
