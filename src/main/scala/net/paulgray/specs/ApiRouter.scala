package net.paulgray.specs

import cats.effect.IO
import net.paulgray.specs.SpecsRoot.RequestHandler
import org.http4s.dsl.io._
import org.http4s.dsl.impl.Root
import org.http4s.{Method, Response, Status}
import io.circe.syntax._
import io.circe.generic.auto._
import cats.effect._
import io.circe._
import io.circe.literal._
import org.http4s._
import org.http4s.dsl.io._
import org.http4s.circe._
import SpecsRoot.pfSemigroup
import cats.implicits._
import net.paulgray.specs.client.{OrgRoutes, SessionRoutes}
import net.paulgray.specs.course.CourseRoutes

object ApiRouter {

  val ApiRoot = Root / "api"

  type Path = String

  type ApiHandler = PartialFunction[(Method, Path), IO[Response[IO]]]

  case class Example(name: String, wootLevel: Int)

  def router: RequestHandler =
    SessionRoutes.routes |+|
      OrgRoutes.routes |+|
      CourseRoutes.routes |+| {
      case GET -> ApiRoot / "test" =>
        IO(Response(Status.Ok))
      case GET -> ApiRoot / "statistics" =>
        Ok(Example("Paul", 5).asJson)
  }

}
