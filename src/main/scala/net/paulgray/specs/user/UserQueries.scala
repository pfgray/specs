package net.paulgray.specs.user

import doobie.free.connection.ConnectionIO
import doobie.implicits._

object UserQueries {

  case class User(id: Long, username: String, organizationId: Long)

  def getUser(userId: Long, orgId: Long): ConnectionIO[Option[User]] =
    sql"select id, username, organization_id from users where id = $userId and organization_id = $orgId".query[User].option

  def updateUser(userId: Long, name: String): ConnectionIO[Int] =
    sql"update users set username = $name where id = $userId".update.run

  def getUsersForOrganization(organizationId: Long): ConnectionIO[List[User]] =
    sql"""
         select u.id, u.username, u.organization_id
           from users u
           join organizations org
             on u.organization_id = org.id
         where org.id = $organizationId
         """.query[User].list

  def countUsersForOrganization(organizationId: Long): ConnectionIO[Int] =
    sql"""
         select count(u.id)
           from users u
           join organizations org
             on u.organization_id = org.id
         where org.id = $organizationId
           group by org.id
         """.query[Int].unique

  def createUser(username: String, organizationId: Long): ConnectionIO[Int] =
    sql"insert into users (username, organization_id) values ($username, $organizationId)".update.run

}
