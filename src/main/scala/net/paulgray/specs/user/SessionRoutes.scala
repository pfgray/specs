package net.paulgray.specs.user

import cats.data.EitherT
import cats.effect.IO
import doobie.free.connection.ConnectionIO
import io.circe.generic.auto._
import io.circe.syntax._
import net.paulgray.specs.ApiRouter.ApiRoot
import net.paulgray.specs.SpecsRoot.{IOResp, RequestHandler, xa}
import org.http4s.circe._
import org.http4s.dsl.io._
import doobie.implicits._
import cats.implicits
import net.paulgray.specs.user.ClientQueries.Client
import org.http4s.{Response, Status}
import io.circe.syntax._
import io.circe.generic.auto._

object SessionRoutes {

  case class SignupRequest(username: String, password: String)
  case class SignupResponse(status: String)

  type Wut[A] = Either[IOResp, A]

  implicit val decoder = jsonOf[IO, SignupRequest]

  def routes: RequestHandler = {
    case req @ POST -> ApiRoot / "signup" =>
      val resp = for {
        signupRequest <- req.as[SignupRequest]
        result <- processRequest(signupRequest).transact(xa)
      } yield {
        result match {
          case Left(r) => r
          case Right(client) => Ok(client.asJson)
        }
      }
      resp.flatMap(identity)
  }

  def validateSignupRequest(signupRequest: SignupRequest): Boolean =
    signupRequest.username.trim != "" && signupRequest.password.trim != ""

  type DbResult[A] = ConnectionIO[Either[IO[Response[IO]], A]]

  def processRequest(signupRequest: SignupRequest): DbResult[Client] =
    (for {
      _      <- EitherT(userExists(signupRequest))
      client <- EitherT(createClient(signupRequest))
    } yield client).value

  def createClient(signupRequest: SignupRequest): DbResult[Client] =
    ClientQueries.createClient(signupRequest.username, signupRequest.password) map {
      case true => Right(Client(signupRequest.username))
      case _ => Left(InternalServerError("Error creating user"))
    }

  def userExists(signupRequest: SignupRequest): DbResult[Boolean] =
    ClientQueries.clientExists(signupRequest.username) map {
      case true => Left(BadRequest("User already exists"))
      case _ => Right(false)
    }

}
