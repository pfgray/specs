package net.paulgray.specs

import cats.effect._
import net.paulgray.specs.SpecsRoot.RequestHandler
import org.http4s._
import org.http4s.client.blaze._
import org.http4s.dsl.io._
import net.paulgray.specs.RequestOps._
import net.paulgray.specs.SpecsConfigLoader.{Dev, Prod}

object AssetRouter {

  val httpClient = PooledHttp1Client[IO]()

  def router: RequestHandler = {
    case req@GET -> Root / "assets" / path =>
      // if this is dev, then serve it up from proxy...
      SpecsConfigLoader.getConfig.env match {
        case Some(Prod) =>
          StaticFile.fromURL(this.getClass.getClassLoader.getResource(s"assets/$path"), Some(req))
            .getOrElseF(NotFound())
        case Some(Dev) =>
          val body = httpClient.streaming[Byte](req.toProxy(s"/assets/$path"))(_.body)
          IO(Response(
            status = Ok,
            body = body
          ))
        case _ =>
          NotFound()
      }

  }

}
