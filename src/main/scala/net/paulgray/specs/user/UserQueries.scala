package net.paulgray.specs.user

import cats.data.NonEmptyList
import doobie.free.connection.ConnectionIO
import doobie.implicits._
import doobie.util.fragment.Fragment
import doobie.util.param.Param
import doobie.util.fragments
import org.specs2.specification.core.Fragments

object UserQueries {

  case class User(
    id: Long,
    username: String,
    givenName: String,
    familyName: String,
    fullName: String,
    contactEmail: String,
    sourcedid: String,
    image: String,
    organizationId: Long
  )

  case class CreateUserRequest(
    username: String,
    givenName: String,
    familyName: String,
    fullName: String,
    contactEmail: String,
    sourcedid: String,
    image: String
  )

  def getUser(userId: Long, orgId: Long): ConnectionIO[Option[User]] =
    sql"""
         select id, username, given_name, family_name, full_name, contact_email, sourcedid, image, organization_id
           from users
         where id = $userId
           and organization_id = $orgId
      """.query[User].option

  def getUsers(userIds: NonEmptyList[Long], orgId: Long): ConnectionIO[List[User]] = {
    val q = fr"""
         select id, username, given_name, family_name, full_name, contact_email, sourcedid, image, organization_id
           from users
         where organization_id = $orgId
          and """ ++ fragments.in(fr"id", userIds)
    q.query[User].list
  }

  def updateUser(userId: Long, name: String): ConnectionIO[Int] =
    sql"update users set username = $name where id = $userId".update.run

  def getUsersForOrganization(organizationId: Long): ConnectionIO[List[User]] =
    sql"""
         select u.id, u.username, u.given_name, u.family_name, u.full_name, u.contact_email, u.sourcedid, u.image, u.organization_id
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

  def createUser(cur: CreateUserRequest, organizationId: Long): ConnectionIO[Int] =
    sql"""
      insert into users
        (username, given_name, family_name, full_name, contact_email, sourcedid, image, organization_id)
      values (
        ${cur.username},
        ${cur.givenName},
        ${cur.familyName},
        ${cur.fullName},
        ${cur.contactEmail},
        ${cur.sourcedid},
        ${cur.image},
        $organizationId
      )
      """.update.run

}
