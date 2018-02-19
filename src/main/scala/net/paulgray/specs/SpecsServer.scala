package net.paulgray.specs

import cats.implicits._
import org.http4s.server.blaze._
import cats.effect._
import fs2.Stream
import fs2.StreamApp
import fs2.StreamApp.ExitCode
import scala.concurrent.ExecutionContext.Implicits.global

import org.http4s.server.blaze.BlazeBuilder


object SpecsServer extends StreamApp[IO] {

  override def stream(args: List[String], requestShutdown: IO[Unit]): Stream[IO, ExitCode] =
    BlazeBuilder[IO]
      .bindHttp(8080, "localhost")
      .mountService(SpecsRoot.service, "/")
      .mountService(ProviderController.service, "/lti")
      .serve

}
