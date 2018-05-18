package net.paulgray.specs.user

import cats.data.{EitherT, OptionT}
import cats.syntax.either._
import cats.effect.IO
import net.paulgray.specs.ApiRouter.ApiRoot
import net.paulgray.specs.RequestUtil.{DbResultResponse, withClient, withClientAndBody}
import net.paulgray.specs.client.OrgRoutes.getOrganization
import org.http4s.dsl.io.{->, /, GET, POST, PUT}
import org.http4s.circe._
import org.http4s.dsl.io._
import io.circe.syntax._
import io.circe.generic.auto._
import doobie.implicits._
import net.paulgray.specs.SpecsRoot.RequestHandler
import net.paulgray.specs.course.CourseQueries
import net.paulgray.specs.course.CourseQueries.Course
import net.paulgray.specs.user.UserQueries.{CreateUserRequest, User}
import org.http4s.Response

object UserRoutes {

  case class UsersResponse(users: Seq[User])
  implicit val decoder = jsonOf[IO, CreateUserRequest]

  def routes: RequestHandler = {
    // get
    case req @ GET -> ApiRoot / "organizations" / LongVar(orgId) / "users" / LongVar(userId) =>
      withClient[User](req) {
        client =>
          for {
            org <- getOrganization(orgId, client.id)
            user <- getUser(userId, org.id)
          } yield user
      }

    // edit
    case req @ PUT -> ApiRoot / "organizations" / LongVar(orgId) / "users" / LongVar(userId) =>
      withClientAndBody[Int, CreateUserRequest](req) {
        (client, req) =>
          for {
            org <- getOrganization(orgId, client.id)
            result <- updateUser(userId, req.username)
          } yield result
      }

    // list
    case req @ GET -> ApiRoot / "organizations" / LongVar(orgId) / "users" =>
      withClient[UsersResponse](req) {
        client =>
          for {
            org <- getOrganization(orgId, client.id)
            users <- getUsers(org.id)
          } yield UsersResponse(users)
      }

    // create
    case req @ POST -> ApiRoot / "organizations" / LongVar(orgId) / "users" =>
      withClientAndBody[Int, CreateUserRequest](req) {
        (client, req) =>
          for {
            org <- getOrganization(orgId, client.id)
            success <- createUser(req, org.id)
          } yield success
      }
  }

  def getUser(userId: Long, orgId: Long): DbResultResponse[User] =
    OptionT(UserQueries.getUser(userId, orgId)).toRight(NotFound(s"No course with id: $userId found in organization: $orgId"))

  def updateUser(userId: Long, name: String): DbResultResponse[Int] =
    EitherT(UserQueries.updateUser(userId, name).map(_.asRight[IO[Response[IO]]]))

  def getUsers(orgId: Long): DbResultResponse[List[User]] =
    EitherT(UserQueries.getUsersForOrganization(orgId).map(_.asRight[IO[Response[IO]]]))

  def createUser(cur: CreateUserRequest, organization: Long): DbResultResponse[Int] =
    EitherT(UserQueries.createUser(cur, organization).map(_.asRight[IO[Response[IO]]]))

}
