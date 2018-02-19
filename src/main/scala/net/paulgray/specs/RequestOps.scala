package net.paulgray.specs

import org.http4s.{Request, Uri}
import org.http4s.Uri.{Authority, RegName, Scheme}

object RequestOps {

  implicit class RequestOpsWrapper[F[_]](req: Request[F]) {
    def origin: String = {
      val scheme = if (req.isSecure.getOrElse(false)) "https" else "http"
      val host = req.remoteHost.getOrElse("")
      val port = req.serverPort
      s"$scheme://$host:$port"
    }

    def toProxy(path: String): Request[F] = {
      req.withUri(
        Uri(
          scheme = Some(Scheme.http),
          authority = Some(Authority(host = RegName("localhost"), port = Some(9000))),
          path = path
        ))
    }
  }

}