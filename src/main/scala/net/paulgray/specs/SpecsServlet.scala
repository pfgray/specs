package net.paulgray.specs


import java.net.HttpURLConnection
import org.apache.commons.io.IOUtils

class SpecsServlet extends SpecsStack {

  get("/*") {
    contentType = "text/html"
    jade("index",
      "origin" -> "wooo?"
    )
  }

  get("/okayy") {
    contentType = "text/html"
    jade("hello-scalate")
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
