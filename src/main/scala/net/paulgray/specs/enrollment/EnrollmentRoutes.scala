package net.paulgray.specs.enrollment

import cats.data.{EitherT, OptionT}
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
import net.paulgray.specs.user.UserQueries
import org.http4s.circe._
import org.http4s.dsl.io._
import cats.syntax.applicative._
import cats.syntax.list._

object EnrollmentRoutes {

  case class CreateEnrollmentRequest(userIds: List[Long], role: String)
  implicit val decoder = jsonOf[IO, CreateEnrollmentRequest]

  case class EnrollmentData(user: User, enrollment: Enrollment)

  def routes: RequestHandler = {
    // get
    case req @ GET -> ApiRoot / "organizations" / LongVar(orgId) / "courses" / LongVar(courseId) / "enrollments" =>
      withClient(req) {
        client =>
          for {
            org <- getOrganization(orgId, client.id)
            course <- getCourse(courseId, orgId)
            enrollments <- getEnrollments(course.id)
          } yield enrollments.map { case (u, e) => EnrollmentData(u, e) }
      }

    case req @ GET -> ApiRoot / "organizations" / LongVar(orgId) / "courses" / LongVar(courseId) / "usersNotInCourse" =>
      withClient(req) {
        client =>
          for {
            org <- getOrganization(orgId, client.id)
            course <- getCourse(courseId, orgId)
            users <- getUsersNotInCourse(course.id)
          } yield users
      }

    // create
    case req @ PUT -> ApiRoot / "organizations" / LongVar(orgId) / "courses" / LongVar(courseId) / "enrollments" =>
      withClientAndBody[Int, CreateEnrollmentRequest](req) {
        (client, req) =>
          for {
            org <- getOrganization(orgId, client.id)
            course <- getCourse(courseId, orgId)
            users   <- getUsers(req.userIds, org.id)
            result <- createEnrollments(course.id, filterUsers(users, req), req.role)
          } yield result.length
      }
  }

  def filterUsers(users: List[User], cer: CreateEnrollmentRequest): List[Long] = {
    val userIds = users.map(_.id)
    cer.userIds.filter(userIds.contains)
  }

  def getUsers(users: List[Long], orgId: Long): DbResultResponse[List[User]] =
    EitherT(UserQueries.getUsers(users.toNel.get, orgId).map(_.asRight[IO[Response[IO]]]))

  def getUsersNotInCourse(courseId: Long): DbResultResponse[List[User]] =
    EitherT(EnrollmentQueries.getUsersNotInCourse(courseId).map(_.asRight[IO[Response[IO]]]))

  def getEnrollments(courseId: Long): DbResultResponse[List[(User, Enrollment)]] =
    EitherT(EnrollmentQueries.getEnrollmentsInCourse(courseId).map(_.asRight[IO[Response[IO]]]))

  def createEnrollments(courseId: Long, users: List[Long], role: String): DbResultResponse[List[Int]] =
    EitherT(EnrollmentQueries.createEnrollments(courseId, users, role).map(_.asRight[IO[Response[IO]]]))

  def createEnrollment(courseId: Long, userId: Long, role: String): DbResultResponse[Int] =
    EitherT(EnrollmentQueries.createEnrollment(courseId, userId, role).map(_.asRight[IO[Response[IO]]]))

}
