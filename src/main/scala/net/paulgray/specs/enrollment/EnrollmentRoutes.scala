package net.paulgray.specs.enrollment

import cats.data.EitherT
import cats.effect.IO
import net.paulgray.specs.ApiRouter.ApiRoot
import net.paulgray.specs.RequestUtil.{DbResultResponse, withClient, withClientAndBody}
import net.paulgray.specs.SpecsRoot.RequestHandler
import net.paulgray.specs.client.OrgRoutes.getOrganization
import net.paulgray.specs.course.CourseQueries
import net.paulgray.specs.course.CourseRoutes._
import net.paulgray.specs.user.UserRoutes._
import net.paulgray.specs.enrollment.EnrollmentQueries.Enrollment
import net.paulgray.specs.user.UserQueries.User
import org.http4s.Response
import org.http4s.dsl.impl.LongVar
import org.http4s.dsl.io.{->, /, GET, PUT}
import cats.syntax.either._
import io.circe.generic.auto._
import doobie.implicits._
import org.http4s.circe._
import org.http4s.dsl.io._

object EnrollmentRoutes {

  case class CreateEnrollmentRequest(userId: Long, role: String)
  implicit val decoder = jsonOf[IO, CreateEnrollmentRequest]

  def routes: RequestHandler = {
    // get
    case req @ GET -> ApiRoot / "organizations" / LongVar(orgId) / "courses" / LongVar(courseId) / "enrollments" =>
      withClient(req) {
        client =>
          for {
            org <- getOrganization(orgId, client.id)
            course <- getCourse(courseId, orgId)
            enrollments <- getEnrollments(course.id)
          } yield enrollments
      }

    // create
    case req @ PUT -> ApiRoot / "organizations" / LongVar(orgId) / "courses" / LongVar(courseId) / "enrollments" =>
      withClientAndBody[Int, CreateEnrollmentRequest](req) {
        (client, req) =>
          for {
            org <- getOrganization(orgId, client.id)
            course <- getCourse(courseId, orgId)
            user   <- getUser(req.userId, org.id)
            result <- createEnrollment(course.id, req.userId, req.role)
          } yield result
      }
  }

  def getEnrollments(courseId: Long): DbResultResponse[List[(User, Enrollment)]] =
    EitherT(EnrollmentQueries.getEnrollmentsInCourse(courseId).map(_.asRight[IO[Response[IO]]]))

  def createEnrollment(courseId: Long, userId: Long, role: String): DbResultResponse[Int] =
    EitherT(EnrollmentQueries.createEnrollment(courseId, userId, role).map(_.asRight[IO[Response[IO]]]))

}
