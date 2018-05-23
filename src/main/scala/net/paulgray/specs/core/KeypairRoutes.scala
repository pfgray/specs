package net.paulgray.specs.core

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

object KeypairRoutes {

  case class JWK(
    e: String,
    use: String,
    alg: String,
    kty: String,
    n: String,
    kid: String
  )

  object JWK {
    def fromKeypair(keypair: Keypair): JWK = {
      new JWK("AQAB", "sig", "RS256", "RSA", keypair.publicKey, keypair.id.toString)
    }
  }
  case class JWKSet(keys: List[JWK])

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
  }

  def getAllKeys: DbResultResponse[List[JWK]] =
    KeyQueries.getAllKeypairs.map(keys => {
      keys.map(JWK.fromKeypair)
    }).toRightResp

}
