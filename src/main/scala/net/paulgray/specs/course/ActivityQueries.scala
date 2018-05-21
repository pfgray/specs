package net.paulgray.specs.course

import java.sql.Timestamp
import java.time.Instant

import doobie.free.connection.ConnectionIO
import doobie.implicits._
import doobie.util.meta.Meta
import doobie.util.query.Query0


object ActivityQueries {

  case class UpdateActivityRequest(
    name: String,
    resourceLinkId: String,
    url: String,
    oauthKey: String,
    oauthSecret: String,
    signatureMechanism: String
  )

  case class Activity(
    id: Long,
    name: String,
    resourceLinkId: String,
    url: String,
    oauthKey: String,
    oauthSecret: String,
    signatureMechanism: String,
    graded: Boolean,
    createdAt: Instant,
    courseId: Long
  )

  case class ActivityAggregates(launchCount: Int, usersLaunchedCount: Int)

  case class CourseWithAggregate(activity: Activity, aggregates: ActivityAggregates)

  def getActivity(activityId: Long, courseId: Long): Query0[Activity] =
    sql"""
      select id,
        resource_id,
        name,
        url,
        oauth_key,
        oauth_secret,
        signature_mechanism,
        graded,
        created_at,
        course_id
      from activities
      where id = $activityId
        and course_id = $courseId
       """.query[Activity]

  def updateActivity(activityId: Long, uar: UpdateActivityRequest): ConnectionIO[Int] = {
    sql"""
     update activities
       set
         resource_id = ${uar.resourceLinkId},
         name = ${uar.name},
         url = ${uar.url},
         oauth_key = ${uar.oauthKey},
         oauth_secret = ${uar.oauthSecret},
         signature_mechanism = ${uar.signatureMechanism},
         graded = true
     where id = $activityId
     """.update.run
  }

  def getActivitiesForCourse(courseId: Long): ConnectionIO[List[Activity]] =
    sql"""
         select
           a.id,
           a.resource_id,
           a.name,
           a.url,
           a.oauth_key,
           a.oauth_secret,
           a.signature_mechanism,
           a.graded,
           a.created_at,
           a.course_id
         from activities a
           join courses c on a.course_id = c.id
         where c.id = $courseId
         """.query[Activity].list

  def createActivity(uar: UpdateActivityRequest, courseId: Long): ConnectionIO[Int] =
    sql"""insert into activities (
      resource_id,
      name,
      url,
      oauth_key,
      oauth_secret,
      signature_mechanism,
      graded,
      course_id
    ) values (
      ${uar.resourceLinkId},
      ${uar.name},
      ${uar.url},
      ${uar.oauthKey},
      ${uar.oauthSecret},
      ${uar.signatureMechanism},
      true,
      ${courseId}
    )""".update.run

}
