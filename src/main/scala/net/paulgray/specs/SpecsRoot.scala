package net.paulgray.specs

import cats.Semigroup
import cats.effect._
import cats.implicits._
import doobie.util.transactor.Transactor
import org.http4s._
import org.http4s.dsl.io._
import org.http4s.twirl._
import net.paulgray.specs.RequestOps._

object SpecsRoot {

  val xa = Transactor.fromDriverManager[IO](
    "org.postgresql.Driver", // driver classname
    "jdbc:postgresql://localhost:5436/specs", // connect URL (driver-specific)
    "myuser",               // user
    "mypass"                // password
  )

  type RequestHandler = PartialFunction[Request[IO], IO[Response[IO]]]

  implicit def pfSemigroup = new Semigroup[RequestHandler] {
    override def combine(a: RequestHandler, b: RequestHandler): RequestHandler = a orElse b
  }

  val service = HttpService[IO](
    AssetRouter.router |+| ApiRouter.router |+| rootRouter
  )

  def rootRouter: RequestHandler = {
    // hmm, can we combine these?
    case req @ GET -> Root =>
      Ok(html.index(s"${req.origin}"))
    case req @ GET -> Root / _ =>
      Ok(html.index(s"${req.origin}"))
  }

}
