package net.paulgray.specs.user

import cats.effect.IO
import io.circe.generic.auto._
import io.circe.syntax._
import net.paulgray.specs.ApiRouter.ApiRoot
import net.paulgray.specs.SpecsRoot.RequestHandler
import org.http4s.circe._
import org.http4s.dsl.io._
import doobie.implicits._
import net.paulgray.specs.SpecsRoot.xa

object SessionRoutes {

  case class SignupRequest(username: String, password: String)
  case class SignupResponse(status: String, num: Int, random: Double)

  implicit val decoder = jsonOf[IO, SignupRequest]

  def routes: RequestHandler = {
    case req @ POST -> ApiRoot / "signup" =>
      for {
        signupRequest <- req.as[SignupRequest]
        tup <- UserService.getUser.transact(xa)
        resp <- Ok(SignupResponse(s"accepted: ${signupRequest.username}", tup._1, tup._2).asJson)
      } yield resp
  }

}
