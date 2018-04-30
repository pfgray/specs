package net.paulgray.specs.course

import doobie.free.connection.ConnectionIO
import doobie.implicits._

object OrgQueries {

  case class Organization(id: Long, name: String, clientId: Long)

  def createOrganization(name: String, clientId: Long): ConnectionIO[Int] =
    sql"insert into organizations (name, client_id) values ($name, $clientId)".update.run

  def getOrganizationsForClient(clientId: Long): ConnectionIO[List[Organization]] =
    sql"select id, name, client_id from organizations where client_id = $clientId".query[Organization].list

}
