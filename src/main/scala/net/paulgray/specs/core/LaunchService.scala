package net.paulgray.specs.core
import java.time.Instant
import java.time.temporal.TemporalAmount
import java.util.UUID

import com.auth0.jwt.JWT
import com.auth0.jwt.interfaces.Claim
import io.circe.generic.extras._
import io.circe.syntax._
import io.jsonwebtoken.{Claims, JwtBuilder, Jwts, SignatureAlgorithm}
import io.circe._
import io.circe.generic.semiauto._

import scala.concurrent.duration.Duration

object LaunchService {

  implicit val config: Configuration = Configuration.default

  case class LaunchAppRequest(url: String)
  case class IdToken(token: String)

  def constructLaunchToken(): LtiJsonLaunch = {
    // build it?
    LtiJsonLaunch(
      "LtiResourceLinkRequest",
      "LTI-1p3",
      "Harry",
      "Potter",
      "",
      "",
      "",
      "Harry Potter",
      List("http://purl.imsglobal.org/vocab/lis/v2/institution/person#Student"),
      ResourceLink(
        "abcd",
        "My Resource",
        ""
      ),
      Context(
        "1234",
        "my_course",
        "My Course",
        List("course_offering")
      ),
      ToolPlatform(
        "",
        "",
        "",
        "",
        "",
        ""
      ),
      AGS(),
      LaunchPresentation(
        "_blank",
        0,0,
        "todo"
      ),
      Map(),
      "1",
      iss = "",
      aud = "",
      iat = (Instant.now.toEpochMilli / 1000).toString,
      exp = (Instant.now.plus(java.time.Duration.ofSeconds(60)).toEpochMilli / 1000).toString,
      sub = "bueller?",
      nonce = UUID.randomUUID().toString
    )
  }

  @ConfiguredJsonCodec case class LtiJsonLaunch(
    @JsonKey("http://imsglobal.org/lti/message_type") messageType: String,
    @JsonKey("http://imsglobal.org/lti/version") version: String,
    given_name: String,
    family_name: String,
    middle_name: String,
    picture: String,
    email: String,
    name: String,
    @JsonKey("http://imsglobal.org/lti/roles") roles: List[String],
    @JsonKey("http://imsglobal.org/lti/resource_link") resourceLink: ResourceLink,
    @JsonKey("http://imsglobal.org/lti/context") context: Context,
    @JsonKey("http://imsglobal.org/lti/tool_platform") toolPlatform: ToolPlatform,
    @JsonKey("http://imsglobal.org/lti/ags") ags: AGS,
    @JsonKey("http://imsglobal.org/lti/launch_presentation") launchPresentation: LaunchPresentation,
    @JsonKey("http://imsglobal.org/lti/custom") custom: Map[String, String],
    @JsonKey("http://imsglobal.org/lti/deployment_id") deploymentId: String,
    iss: String,
    aud: String,
    iat: String, // date?
    exp: String, // date?
    sub: String,
    nonce: String
  )

  @ConfiguredJsonCodec case class LaunchPresentation(
    document_target: String,
    height: Int,
    width: Int,
    return_url: String
  )

  @ConfiguredJsonCodec case class AGS() // todo

  @ConfiguredJsonCodec case class ToolPlatform(
    name: String,
    contact_email: String,
    description: String,
    url: String,
    product_family_code: String,
    version: String
  )

  @ConfiguredJsonCodec case class ResourceLink(
    id: String,
    title: String,
    description: String
  )

  @ConfiguredJsonCodec case class Context(
    id: String,
    label: String,
    title: String,
    `type`: List[String]
  )

  implicit class LtiJsonLaunchOps(jsonLaunch: LtiJsonLaunch) {
    def toJWT(issuer: String, audience: String): JwtBuilder = {
      Jwts.builder()
        .setPayload(jsonLaunch.copy(iss = issuer, aud = audience).asJson.toString)
    }
  }

}
