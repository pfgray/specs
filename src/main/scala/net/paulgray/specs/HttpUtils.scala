package net.paulgray.specs

import java.net.URL
import javax.servlet.http.HttpServletRequest

import scala.util.Try

/**
  * @author pgray
  */
object HttpUtils {

  implicit class HttpRequestOps(req: HttpServletRequest){
    def origin = getOrigin(req).getOrElse("")
  }

  def getOrigin(req: HttpServletRequest): Option[String] =
    Try {
      val url = new URL(req.getRequestURL().toString())

      s"${url.getProtocol}://${url.getHost}${getPort(req)}"
    }.toOption

  def getPort(req: HttpServletRequest): String = {
    val port = req.getServerPort()
    //don't include the port if http 80 or https 443
    if(req.isSecure() && port == 443 || !req.isSecure() && port == 80){
      ""
    } else {
      ":" + port
    }
  }

}
