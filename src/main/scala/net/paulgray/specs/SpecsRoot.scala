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

  val db = SpecsConfigLoader.getConfig.db

  val xa = Transactor.fromDriverManager[IO](
    "org.postgresql.Driver", // driver classname
    db.jdbc, // connect URL (driver-specific)
    db.user,               // user
    db.pass                // password
  )

  type IOResp = IO[Response[IO]]
  type RequestHandler = PartialFunction[Request[IO], IOResp]

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
    case req @ GET -> _ =>
      Ok(html.index(s"${req.origin}"))
  }

}
