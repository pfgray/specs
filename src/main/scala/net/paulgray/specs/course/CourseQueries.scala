package net.paulgray.specs.course

import doobie.free.connection.ConnectionIO
import doobie.implicits._
import doobie.util.query.Query0

object CourseQueries {

  case class Course(id: Long, name: String, groupType: String, label: String, organizationId: Long)

  case class CourseAggregates(activityCount: Int, enrollmentCount: Int)
  case class CourseWithAggregate(course: Course, aggregates: CourseAggregates)

  def getCourse(courseId: Long, orgId: Long): Query0[Course] =
    sql"select id, name, group_type, label, organization_id from courses where id = $courseId and organization_id = $orgId".query[Course]

  def updateCourse(courseId: Long, name: String, groupType: String, label: String): ConnectionIO[Int] =
    sql"""
         update courses
           set name = $name,
               group_type = $groupType,
               label = $label
         where id = $courseId
         """.update.run

  def getCoursesForOrganization(organizationId: Long): ConnectionIO[List[CourseWithAggregate]] =
    sql"""
         select co.id, co.name, co.group_type, co.label, co.organization_id, count(distinct e.id), count(distinct a.id)
           from courses co
           join organizations org
             on co.organization_id = org.id
           left join enrollments e
             on e.course_id = co.id
           left join activities a
             on a.course_id = co.id
         where org.id = $organizationId
           group by co.id
         """.query[CourseWithAggregate].list

  def countCoursesForOrganization(organizationId: Long): ConnectionIO[Int] =
    sql"""
         select count(c.id)
           from courses c
           join organizations org
             on c.organization_id = org.id
         where org.id = $organizationId
           group by org.id
         """.query[Int].unique

  def createCourse(name: String, groupType: String, label: String, organizationId: Long): ConnectionIO[Int] =
    sql"insert into courses (name, group_type, label, organization_id) values ($name, $groupType, $label, $organizationId)".update.run

}
