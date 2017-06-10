package net.paulgray.specs

import java.net.HttpURLConnection
import java.util.AbstractMap.SimpleEntry

import net.oauth.{OAuthAccessor, OAuthConsumer, OAuthMessage}
import org.apache.commons.io.IOUtils
import net.paulgray.specs.HttpUtils.HttpRequestOps

import scala.collection.JavaConverters._

class SpecsServlet extends SpecsStack {

  get("/*") {
    contentType = "text/html"
    jade("index",
      "origin" -> request.origin
    )
  }

  get("/api/signedLaunch") {
    val params = request.getParameterMap.asScala.mapValues(_(0)).toMap
    val debug = params.get("custom_debug").map(_ == "true").getOrElse(false)

    val url = params.getOrElse("url", "")
    val key = params.getOrElse("key", "")
    val secret = params.getOrElse("secret", "")

    val nonLaunchParams = Seq("key", "secret", "url", "outcomes1", "outcomes2", "debug")
    val unsignedParams =
      params.filterKeys(s => !nonLaunchParams.contains(s)).toList.map {
        case (a, b) => new SimpleEntry[String, String](a, b)
      }

    // val consumer: OAuthConsumer = new DefaultOAuthConsumer(key, secret)
    val message = new OAuthMessage("POST", url, unsignedParams.asJava)
    val consumer = new OAuthConsumer(null, key, secret, null)
    val accessor = new OAuthAccessor(consumer)

    message.addRequiredParameters(accessor)

    val signedParams = message.getParameters.asScala map {
      e => (e.getKey, e.getValue)
    }

    contentType = "text/html"
    jade("autopost",
      "url" -> url,
      "signedParams" -> signedParams.toMap,
      "debug" -> debug
    )
  }

  val proxyConfig: Option[ProxyConfig] = None

  get("/assets/*") {
    // is webpack dev server active? then proxy this stuff... otherwise
    val requestPath = request.getPathInfo

    val url = new java.net.URL(s"http://localhost:9000${requestPath}")

    val con = url.openConnection().asInstanceOf[HttpURLConnection]
    con.setRequestMethod("GET")
    // go get it
    response.setStatus(con.getResponseCode)
    response.setContentLengthLong(con.getContentLengthLong)
    response.setContentType(con.getContentType)
    IOUtils.copy(con.getInputStream, response.getOutputStream)

  }

  post("/proxy") {
    "woo?"
  }

  case class ProxyConfig(baseUrl: String)

}
