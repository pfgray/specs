package net.paulgray.specs.course


import cats.Applicative
import cats.data.{EitherT, OptionT}
import cats.effect.IO
import cats.syntax.either._
import doobie.free.connection.ConnectionIO
import doobie.implicits._
import io.circe.Encoder
import io.circe.syntax._
import io.circe.generic.auto._
import net.paulgray.specs.SpecsRoot.{RequestHandler, xa}
import net.paulgray.specs.client.ClientQueries.Client
import net.paulgray.specs.client.TokenQueries
import net.paulgray.specs.course.CourseQueries.Course
import org.http4s.circe._
import org.http4s.dsl.io._
import org.http4s.{EntityDecoder, Request, Response}
import net.paulgray.specs.ApiRouter.ApiRoot
import net.paulgray.specs.RequestUtil.DbResultResponse
import net.paulgray.specs.RequestUtil.{withClient, withClientAndBody}
import net.paulgray.specs.course.OrgQueries.Organization

object CourseRoutes {

  import net.paulgray.specs.client.OrgRoutes._

  case class CreateCourseRequest(name: String)
  implicit val decoder = jsonOf[IO, CreateCourseRequest]
  case class CoursesResponse(courses: List[Course])

  def routes: RequestHandler = {

    // list
    case req @ GET -> ApiRoot / "organizations" / LongVar(orgId) / "courses" =>
      withClient[CoursesResponse](req) {
        client =>
          for {
            org     <- getOrganization(orgId, client.id)
            courses <- getCourses(org.id)
          } yield CoursesResponse(courses)
      }

    // create
    case req @ POST -> ApiRoot / "organizations" / LongVar(orgId) / "courses" =>
      withClientAndBody[Int, CreateCourseRequest](req) {
        (client, req) =>
          for {
            org     <- getOrganization(orgId, client.id)
            success <- createCourse(req.name, org.id)
          } yield success
      }
  }

  def getCourses(orgId: Long): DbResultResponse[List[Course]] =
    EitherT(CourseQueries.getCoursesForOrganization(orgId).map(_.asRight[IO[Response[IO]]]))

  def createCourse(name: String, organization: Long): DbResultResponse[Int] =
    EitherT(CourseQueries.createCourse(name, organization).map(_.asRight[IO[Response[IO]]]))

  def orgIsForClient(organization: Organization, clientId: Long): DbResultResponse[Boolean] =
    if (organization.clientId == clientId) {
      EitherT(Applicative[ConnectionIO].pure(true.asRight[IO[Response[IO]]]))
    } else {
      EitherT(Applicative[ConnectionIO].pure(NotFound.apply(s"No organization with id: ${organization.id}".asJson).asLeft[Boolean]))
    }

}
