package net.paulgray.specs.course

import doobie.free.connection.ConnectionIO
import doobie.implicits._

object CourseQueries {

  case class Course(id: Long, name: String, organizationId: Long)

  def getCoursesForOrganization(organizationId: Long): ConnectionIO[List[Course]] =
    sql"""
         select co.id, co.name, co.organization_id
           from courses co
           join organizations org
             on co.organization_id = org.id

         where org.id = $organizationId
         """.query[Course].list

  def createCourse(name: String, organizationId: Long): ConnectionIO[Int] =
    sql"insert into courses (name, organization_id) values ($name, $organizationId)".update.run

}
