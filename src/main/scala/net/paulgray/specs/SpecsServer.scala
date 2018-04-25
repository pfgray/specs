package net.paulgray.specs

import cats.effect._
import fs2.{Stream, StreamApp}
import fs2.StreamApp.ExitCode
import org.http4s.server.blaze.BlazeBuilder

import scala.concurrent.ExecutionContext.Implicits.global
import scala.io.Source
import doobie.implicits._
import doobie.util.fragment.Fragment
import doobie._

object SpecsServer extends StreamApp[IO] {

  override def stream(args: List[String], requestShutdown: IO[Unit]): Stream[IO, ExitCode] = {
    init()
    BlazeBuilder[IO]
      .bindHttp(8080, "localhost")
      .mountService(SpecsRoot.service, "/")
      .mountService(ProviderController.service, "/lti")
      .serve
  }

  def init(): Unit = {
    implicit val xa = SpecsRoot.xa

    val init = Fragment.const(Source.fromResource("init.sql").getLines().mkString("\n"))

    init.updateWithLogHandler(LogHandler.jdkLogHandler).run.transact(xa).unsafeRunSync()
  }

}
