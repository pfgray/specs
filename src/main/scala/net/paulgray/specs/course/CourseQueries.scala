package net.paulgray.specs.course

import doobie.free.connection.ConnectionIO
import doobie.implicits._
import doobie.util.query.Query0

object CourseQueries {

  case class Course(id: Long, name: String, organizationId: Long)

  def getCourse(courseId: Long, orgId: Long): Query0[Course] =
    sql"select id, name, organization_id from courses where id = $courseId and organization_id = $orgId".query[Course]

  def updateCourse(courseId: Long, name: String): ConnectionIO[Int] =
    sql"update courses set name = $name where id = $courseId".update.run

  def getCoursesForOrganization(organizationId: Long): ConnectionIO[List[Course]] =
    sql"""
         select co.id, co.name, co.organization_id
           from courses co
           join organizations org
             on co.organization_id = org.id

         where org.id = $organizationId
         """.query[Course].list

  def countCoursesForOrganization(organizationId: Long): ConnectionIO[Int] =
    sql"""
         select count(c.id)
           from courses c
           join organizations org
             on c.organization_id = org.id
         where org.id = $organizationId
           group by org.id
         """.query[Int].unique

  def createCourse(name: String, organizationId: Long): ConnectionIO[Int] =
    sql"insert into courses (name, organization_id) values ($name, $organizationId)".update.run

}
