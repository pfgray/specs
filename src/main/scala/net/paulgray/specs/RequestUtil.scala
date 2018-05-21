package net.paulgray.specs

import cats.data.{EitherT, OptionT}
import cats.effect.IO
import doobie.free.connection.ConnectionIO
import doobie.implicits._
import io.circe.Encoder
import io.circe.syntax._
import net.paulgray.specs.SpecsRoot.xa
import net.paulgray.specs.client.ClientQueries.Client
import net.paulgray.specs.client.TokenQueries
import org.http4s.circe._
import org.http4s.dsl.io._
import org.http4s.{EntityDecoder, Request, Response}
import cats.syntax.either._

object RequestUtil {

  type DbResultResponse[A] = EitherT[ConnectionIO, IO[Response[IO]], A]

  def findUserForToken(token: String): DbResultResponse[Client] =
    OptionT(TokenQueries.getClientForToken(token)).toRight(Forbidden("The token included in this request is invalid."))

  def withClient[A](req: Request[IO])(f: Client => DbResultResponse[A])(implicit encoder: Encoder[A]): IO[Response[IO]] = {
    req.headers.find(_.name == "Authorization".ci)
      .fold[IO[Response[IO]]](BadRequest("You must include a token in this request.".asJson)) {
      auth =>
        val resp = for {
          client   <- findUserForToken(auth.value)
          result   <- f(client)
        } yield result

        resp.value.map({
          case Left(r) => r
          case Right(ent) => Ok(ent.asJson)
        }).transact(xa).flatMap(identity)
    }
  }

  def withClientAndBody[A, B](req: Request[IO])(f: (Client, B) => DbResultResponse[A])(implicit encoder: Encoder[A], decoder: EntityDecoder[IO, B]) =
    req.headers.find(_.name == "Authorization".ci)
      .fold[IO[Response[IO]]](BadRequest("You must include a token in this request.".asJson)) {
      auth =>
        val result = for {
          body <- req.as[B]
        } yield {

          val resp = for {
            client   <- findUserForToken(auth.value)
            result   <- f(client, body)
          } yield result

          resp.value.map({
            case Left(r) => r
            case Right(ent) => Ok(ent.asJson)
          }).transact(xa)
        }

        result.flatMap(identity).flatMap(identity)
    }

  implicit class ConnectionIOOps[A](c: ConnectionIO[A]) {
    def toRightResp: DbResultResponse[A] =
      EitherT(c.map(_.asRight[IO[Response[IO]]]))
  }

}
