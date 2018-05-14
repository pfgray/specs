package net.paulgray.specs.client

import java.sql.Timestamp
import java.time.Instant

import cats.Applicative
import cats.data.{EitherT, OptionT}
import cats.effect.IO
import doobie.free.connection.ConnectionIO
import doobie.implicits._
import net.paulgray.specs.ApiRouter.ApiRoot
import net.paulgray.specs.SpecsRoot.RequestHandler
import net.paulgray.specs.client.ClientQueries.Client
import org.http4s.dsl.io._
import net.paulgray.specs.RequestUtil._
import net.paulgray.specs.course.{CourseQueries, OrgQueries}
import net.paulgray.specs.course.OrgQueries._
import org.http4s.circe._
import io.circe.generic.auto._
import io.circe.syntax._
import cats.syntax.either._
import doobie.util.meta.Meta
import net.paulgray.specs.course.CourseRoutes.orgIsForClient
import org.http4s.Response
import io.circe.java8.time.encodeInstant

object OrgRoutes {

  case class CreateOrganizationRequest(name: String, description: String, guid: String, url: String, contactEmail: String)
  implicit val decoder = jsonOf[IO, CreateOrganizationRequest]

  case class Orgs[T](organizations: List[T])

  def routes: RequestHandler = {

    // get one
    case req @ GET -> ApiRoot / "organizations" / LongVar(orgId) =>
      withClient(req) {
        client =>
          for {
            org <- getOrganization(orgId, client.id)
          } yield org
      }

    // edit
    case req @ PUT -> ApiRoot / "organizations" / LongVar(orgId) =>
      withClientAndBody[Int, CreateOrganizationRequest](req) {
        (client, req) =>
          for {
            org    <- getOrganization(orgId, client.id)
            update <- updateOrg(org.id, req.name, req.description, req.guid, req.url, req.contactEmail)
          } yield 1
      }

    // list
    case req @ GET -> ApiRoot / "organizations" =>
      withClient(req) {
        client =>
          EitherT(OrgQueries.getOrganizationsForClientWithAggregates(client.id).map(orgs => Orgs(orgs).asRight[IO[Response[IO]]]))
      }

    // create
    case req @ POST -> ApiRoot / "organizations" =>
      withClientAndBody[Int, CreateOrganizationRequest](req) {
        (client, req) =>
          EitherT(OrgQueries.createOrganization(req.name, req.description, req.guid, req.url, req.contactEmail, client.id).map(_.asRight[IO[Response[IO]]]))
      }

  }

  def updateOrg(orgId: Long, name: String, description: String, guid: String, url: String, contactEmail: String): DbResultResponse[Int] =
    EitherT(updateOrganization(orgId, name, description, guid, url, contactEmail).map(_.asRight[IO[Response[IO]]]))

  def getOrganization(orgId: Long, clientId: Long): DbResultResponse[Organization] =
    for {
      org <- OptionT(OrgQueries.getOrganization(orgId).option).toRight(NotFound(s"No organization with id: $orgId"))
      _   <- orgIsForClient(org, clientId)
    } yield org

}
