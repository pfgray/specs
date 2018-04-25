package net.paulgray.specs.user

import cats.effect.IO
import doobie.free.connection.ConnectionIO
import io.circe.generic.auto._
import io.circe.syntax._
import net.paulgray.specs.ApiRouter.ApiRoot
import net.paulgray.specs.SpecsRoot.{IOResp, RequestHandler, xa}
import org.http4s.circe._
import org.http4s.dsl.io._
import doobie.implicits._
import cats.implicits.

object SessionRoutes {

  case class SignupRequest(username: String, password: String)
  case class SignupResponse(status: String)

  type Wut[A] = Either[IOResp, A]

  implicit val decoder = jsonOf[IO, SignupRequest]

  def routes: RequestHandler = {
    case req @ POST -> ApiRoot / "signup" =>
      for {
        signupRequest <- req.as[SignupRequest]
        resp <- {
          if(!validateSignupRequest(signupRequest))
            BadRequest("not a valid request")
          else
            for {
              exists <- ClientQueries.clientExists(signupRequest.username).transact(xa)
              resp <- {
                if(exists)
                  BadRequest("user already exists")
                else
                  for {
                    created <- ClientQueries.createClient(signupRequest.username, signupRequest.password).transact(xa)
                    resp <- {
                      if(created)
                        Ok(SignupResponse(s"accepted: ${signupRequest.username}").asJson)
                      else
                        InternalServerError()
                    }
                  } yield resp
              }
            } yield resp
        }
      } yield resp
  }

  def validateSignupRequest(signupRequest: SignupRequest): Boolean =
    signupRequest.username.trim != "" && signupRequest.password.trim != ""


}
