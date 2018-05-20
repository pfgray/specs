package net.paulgray.specs.enrollment

import doobie.free.connection.ConnectionIO
import doobie.implicits._
import net.paulgray.specs.user.UserQueries.User
import cats.implicits._

object EnrollmentQueries {

  case class Enrollment(id: Long, userId: Long, courseId: Long, role: String)

  def getEnrollment(enrollmentId: Long): ConnectionIO[Enrollment] =
    sql"select id, user_id, course_id from enrollments where id = $enrollmentId".query[Enrollment].unique

  def createEnrollment(courseId: Long, userId: Long, role: String): ConnectionIO[Int] =
    sql"insert into enrollments (user_id, course_id, role) values ($userId, $courseId, $role)".update.run

  def createEnrollments(courseId: Long, userIds: List[Long], role: String): ConnectionIO[List[Int]] =
    userIds.traverse[ConnectionIO, Int] { userId =>
      sql"insert into enrollments (user_id, course_id, role) values ($userId, $courseId, $role)".update.run
    }

  def countEnrollmentsForCourse(courseId: Long) =
    sql"select count(id) from enrollments where course_id = $courseId".query[Int].unique

  def getEnrollmentsInCourse(courseId: Long) =
    sql"""
         select u.id, u.username, u.given_name, u.family_name, u.full_name, u.contact_email, u.sourcedid, u.image, u.organization_id,
                e.id, e.user_id, e.course_id, e.role
           from enrollments e
           join users u on e.user_id = u.id
         where e.course_id = $courseId
      """.query[(User, Enrollment)].list

  def getUsersNotInCourse(courseId: Long): ConnectionIO[List[User]] =
    sql"""
         select u.id, u.username, u.given_name, u.family_name, u.full_name, u.contact_email, u.sourcedid, u.image, u.organization_id
           from users u
         where u.i not in (
           select e.user_id from enrollments e
             where e.course_id = $courseId
         )
      """.query[User].list


}
