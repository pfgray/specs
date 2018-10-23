package net.paulgray.specs.core

import java.security.interfaces.RSAPublicKey

import cats.data.OptionT
import cats.effect.IO
import doobie.implicits._
import io.circe.Encoder
import net.paulgray.specs.ApiRouter.ApiRoot
import net.paulgray.specs.RequestUtil.{ConnectionIOOps, DbResultResponse, withClient, withClientAndBody}
import net.paulgray.specs.SpecsRoot.{RequestHandler, xa}
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
import net.paulgray.specs.RequestUtil._
import net.paulgray.specs.core.KeyQueries.Keypair
import org.apache.commons.codec.binary.Base64
import com.nimbusds.jose.jwk.RSAKey
import io.circe.parser._

object KeypairRoutes {

  object JWK {
    def fromKeypair(keypair: Keypair): RSAKey = {
      val pub = Base64.decodeBase64(keypair.publicKey)
      val (_, publicKey) = keypair.buildKeys
      // Convert to JWK format// Convert to JWK format

      val jwk = new RSAKey.Builder(publicKey.asInstanceOf[RSAPublicKey]).keyID(keypair.id.toString).build()

      jwk

      // Builder(keyPair.getPublic.asInstanceOf[RSAPublicKey]).privateKey(keyPair.getPrivate.asInstanceOf[RSAPrivateKey]).keyID(UUID.randomUUID.toString).build // Give the key some ID (optional)

      // new JWK("AQAB", "sig", "RS256", "RSA", Base64.encodeBase64URLSafeString(pub), keypair.id.toString)
    }
  }
  case class JWKSet(keys: List[RSAKey])

  implicit val encodeRSAKey: Encoder[RSAKey] = new Encoder[RSAKey] {
    final def apply(a: RSAKey): Json = parse(a.toJSONString).right.get
  }

  def routes: RequestHandler = {

    // list all
    case req @ GET -> ApiRoot / "keys" =>
      val resp = (for {
        keys <- getAllKeys
      } yield JWKSet(keys)).value.transact(xa)

      resp.map({
        case Left(r) => r
        case Right(ent) => Ok(ent.asJson)
      }).flatMap(identity)

    // list all encoded
    case req @ GET -> ApiRoot / "keysOld" =>
      val resp = (for {
        keys <- getAllKeys
      } yield JWKSet(keys)).value.transact(xa)

      resp.map({
        case Left(r) => r
        case Right(ent) => Ok(ent.asJson)
      }).flatMap(identity)
  }

  def getAllKeys: DbResultResponse[List[RSAKey]] =
    KeyQueries.getAllKeypairs.map(keys => {
      keys.map(JWK.fromKeypair)
    }).toRightResp

}
