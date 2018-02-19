package net.paulgray.specs

import cats._
import cats.effect._
import cats.implicits._
import fs2.{Scheduler, Stream}
import io.circe.Json
import org.http4s._
import org.http4s.MediaType._
import org.http4s.circe._
import org.http4s.client.blaze.PooledHttp1Client
import org.http4s.dsl.Http4sDsl
import org.http4s.dsl.impl.Root
import org.http4s.headers._
import org.http4s.server._
import org.http4s.server.middleware.authentication.BasicAuth
import org.http4s.server.middleware.authentication.BasicAuth.BasicAuthenticator
import org.http4s.twirl._
import org.http4s.dsl.io._

import scala.concurrent._
import scala.concurrent.duration._

object ProviderController {


  val service = HttpService[IO] {

    case req @ POST -> Root / "provider" =>
      // get secret for key for this request
      // return launch to the browser
      req
        .decode[UrlForm] { data =>
        val membershipUrl = data.get("custom_context_memberships_url")
        Ok(html.provider(membershipUrl.head))
      }

  }

}
