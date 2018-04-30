package net.paulgray.specs.course

import doobie.free.connection.ConnectionIO
import doobie.implicits._

object CourseQueries {

  def createCourse(name: String, clientId: Long): ConnectionIO[Int] =
    sql"insert into tokens (guid, client_id) values ($name, $clientId)".update.run

}
