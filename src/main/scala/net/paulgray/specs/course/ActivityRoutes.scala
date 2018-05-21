package net.paulgray.specs.course


import cats.data.OptionT
import cats.effect.IO
import doobie.implicits._
import io.circe.Encoder
import net.paulgray.specs.ApiRouter.ApiRoot
import net.paulgray.specs.RequestUtil.{ConnectionIOOps, DbResultResponse, withClient, withClientAndBody}
import net.paulgray.specs.SpecsRoot.RequestHandler
import net.paulgray.specs.course.ActivityQueries.{Activity, UpdateActivityRequest}
import org.http4s.{EntityDecoder, EntityEncoder}
import org.http4s.circe._
import org.http4s.dsl.io._
import io.circe.syntax._
import io.circe._
import io.circe._, io.circe.generic.semiauto._
import io.circe.literal._
import io.circe.generic.auto._

import io.circe.java8.time.encodeInstant

object ActivityRoutes {

  import net.paulgray.specs.client.OrgRoutes._
  import net.paulgray.specs.course.CourseRoutes._

  implicit val decoder = jsonOf[IO, UpdateActivityRequest]

  implicit val encodeInt = implicitly[Encoder[Int]]

  case class Activities[T](activities: List[T])

  def routes: RequestHandler = {

    // get
    case req @ GET -> ApiRoot / "organizations" / LongVar(orgId) / "courses" / LongVar(courseId) / "activities" / LongVar(activityId) =>
      withClient(req)({
        client =>
          for {
            org      <- getOrganization(orgId, client.id)
            course   <- getCourse(courseId, org.id)
            activity <- getActivity(activityId, course.id)
          } yield activity
      })

    // edit
    case req @ PUT -> ApiRoot / "organizations" / LongVar(orgId) / "courses" / LongVar(courseId) / "activities" / LongVar(activityId) =>
      withClientAndBody[Int, UpdateActivityRequest](req)({
        (client, req) =>
          for {
            org     <- getOrganization(orgId, client.id)
            course  <- getCourse(courseId, org.id)
            result  <- updateActivity(activityId, req)
          } yield result
      })(encodeInt, decoder)

    // list
    case req @ GET -> ApiRoot / "organizations" / LongVar(orgId) / "courses" / LongVar(courseId) / "activities" =>
      withClient(req)({
        client =>
          for {
            org        <- getOrganization(orgId, client.id)
            courses    <- getCourse(courseId, orgId)
            activities <- getActivities(courseId)
          } yield Activities(activities)
      })

    // create
    case req @ POST -> ApiRoot / "organizations" / LongVar(orgId) / "courses" / LongVar(courseId) / "activities" =>
      withClientAndBody[Int, UpdateActivityRequest](req)({
        (client, req) =>
          for {
            org     <- getOrganization(orgId, client.id)
            course  <- getCourse(courseId, org.id)
            success <- createActivity(courseId, req)
          } yield success
      })(encodeInt, decoder)
  }

  def getActivity(activityId: Long, courseId: Long): DbResultResponse[Activity] =
    OptionT(ActivityQueries.getActivity(activityId, courseId).option)
      .toRight(NotFound(s"No activity with id: $activityId found in course: $courseId"))

  def updateActivity(activityId: Long, uar: UpdateActivityRequest): DbResultResponse[Int] =
    ActivityQueries.updateActivity(activityId, uar).toRightResp

  def getActivities(courseId: Long): DbResultResponse[List[Activity]] =
    ActivityQueries.getActivitiesForCourse(courseId).toRightResp

  def createActivity(courseId: Long, uar: UpdateActivityRequest): DbResultResponse[Int] =
    ActivityQueries.createActivity(uar, courseId).toRightResp

}
