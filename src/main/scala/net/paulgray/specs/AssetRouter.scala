package net.paulgray.specs

import cats.effect._
import net.paulgray.specs.SpecsRoot.RequestHandler
import org.http4s.Uri.{Authority, RegName, Scheme}
import org.http4s._
import org.http4s.client.blaze._
import org.http4s.dsl.io._
import net.paulgray.specs.RequestOps._

object AssetRouter {

  val httpClient = PooledHttp1Client[IO]()

  def router: RequestHandler = {
    case req @ GET -> Root / "assets" / path =>
      val body: EntityBody[IO] = httpClient.streaming[Byte](req.toProxy(s"/assets/$path"))(_.body)
      IO(Response(
        status = Ok,
        body = body
      ))
  }

}


