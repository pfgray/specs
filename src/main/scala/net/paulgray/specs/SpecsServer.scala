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
import net.paulgray.specs.core.{KeyQueries, KeypairService}
import net.paulgray.specs.core.KeypairService._
import org.apache.commons.codec.binary.Base64

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

    val keypair = KeypairService.generateKeypair()
    println(
      s"""
         |Private Key: ${keypair.getPrivate.getAlgorithm} ~> ${keypair.getPrivate.getFormat}
         |  Bytes:
         |${new String(keypair.getPrivate.getEncoded)}
         |Base64 encoded:
         |${Base64.encodeBase64String(keypair.getPrivate.getEncoded)}
         |Reverse reverse:
         |${new String(Base64.decodeBase64(Base64.encodeBase64String(keypair.getPrivate.getEncoded)))}
         |
         |
         |{Public Key: ${keypair.getPublic.getAlgorithm} ~> ${keypair.getPublic.getFormat}
         |  Bytes:
         |${new String(keypair.getPublic.getEncoded)}
         |Base64 encoded:
         |${Base64.encodeBase64String(keypair.getPublic.getEncoded)}
         |Reverse reverse:
         |${new String(Base64.decodeBase64(Base64.encodeBase64String(keypair.getPublic.getEncoded)))}
       """.stripMargin)
    val (privateKey, publicKey) = keypair.getEncoded
    val addKey = KeyQueries.createKeypair(privateKey, publicKey)

    addKey.transact(xa).unsafeRunSync()

    init.updateWithLogHandler(LogHandler.jdkLogHandler).run.transact(xa).unsafeRunSync()
  }

}
