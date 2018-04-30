package net.paulgray.specs.client

import cats.data.{EitherT, OptionT}
import cats.effect.IO
import doobie.free.connection.ConnectionIO
import io.circe.generic.auto._
import io.circe.syntax._
import net.paulgray.specs.ApiRouter.ApiRoot
import net.paulgray.specs.SpecsRoot.{IOResp, RequestHandler, xa}
import org.http4s.circe._
import org.http4s.dsl.io._
import doobie.implicits._
import cats.{Applicative, Monad, implicits}
import io.circe.{Encoder, Json}
import net.paulgray.specs.client.ClientQueries.Client
import org.http4s.{EntityBody, EntityEncoder, Request, Response, Status}
import io.circe.syntax._
import io.circe.generic.auto._
import com.github.t3hnar.bcrypt._
import net.paulgray.specs.client.TokenQueries.Token
import org.http4s.syntax._

object SessionRoutes {

  case class SignupRequest(username: String, password: String)
  type LoginRequest = SignupRequest
  case class SignupResponse(status: String)

  case class TokenResponse(token: String)

  type DbResultResponse[A] = EitherT[ConnectionIO, IO[Response[IO]], A]

  implicit val decoder = jsonOf[IO, SignupRequest]

  def routes: RequestHandler = {

    // Signup
    case req @ POST -> ApiRoot / "signup" =>
      val resp = for {
        signupRequest <- req.as[SignupRequest]
        result <- processSignup(signupRequest).transact(xa)
      } yield {
        result match {
          case Left(r) => r
          case Right(client) =>
            Ok(client.asJson)
        }
      }
      resp.flatMap(identity)

    // Login
    case req @ POST -> ApiRoot / "login" =>
      val resp = for {
        login <- req.as[LoginRequest]
        result <- processLogin(login).value.transact(xa)
      } yield result match {
        case Left(r) => r
        case Right(token) =>
          Ok(TokenResponse(token.guid).asJson)
      }
      resp.flatMap(identity)

    // echo
    case req @ GET -> ApiRoot / "self" =>
      withClient[Client](req) {
        client =>
          EitherT(Applicative[ConnectionIO].pure(Right(client)))
      }
  }

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

  def findUserForToken(token: String): DbResultResponse[Client] =
    OptionT(TokenQueries.getClientForToken(token)).toRight(Forbidden("The token included in this request is invalid."))

  def processLogin(login: LoginRequest): DbResultResponse[Token] =
    for {
      _     <- EitherT(validatePassword(login.username, login.password))
      token <- createToken(login.username)
    } yield token

  def createToken(username: String): DbResultResponse[Token] =
    for {
      client <- getClient(username)
      token  <- createToken(client.id)
    } yield token

  def getClient(username: String): DbResultResponse[Client] =
    OptionT(ClientQueries.getClientByUsername(username)).toRight(BadRequest(s"user: $username doesn't exist"))

  def createToken(clientId: Long): DbResultResponse[Token] =
    EitherT(TokenQueries.createTokenForClient(clientId).map(t => Right(t)))

  def validatePassword(username: String, password: String): DbResult[Boolean] =
    ClientQueries.getPasswordForClient(username) map {
      case Some(hashed) =>
        if(password.isBcrypted(hashed))
          Right(true)
        else
          Left(BadRequest("password is incorrect".asJson))
      case _ => Left(BadRequest("password is incorrect".asJson))
    }

  def validateSignupRequest(signupRequest: SignupRequest): Boolean =
    signupRequest.username.trim != "" && signupRequest.password.trim != ""

  type DbResult[A] = ConnectionIO[Either[IO[Response[IO]], A]]

  def processSignup(signupRequest: SignupRequest): DbResult[String] =
    (for {
      _      <- EitherT(userExists(signupRequest))
      client <- EitherT(createClient(signupRequest))
    } yield client).value

  def createClient(signupRequest: SignupRequest): DbResult[String] =
    ClientQueries.createClient(signupRequest.username, signupRequest.password.bcrypt) map {
      case true => Right(signupRequest.username)
      case _ => Left(InternalServerError("Error creating user".asJson))
    }

  def userExists(signupRequest: SignupRequest): DbResult[Boolean] =
    ClientQueries.clientExists(signupRequest.username) map {
      case true => Left(BadRequest("User already exists".asJson))
      case _ => Right(false)
    }

}
