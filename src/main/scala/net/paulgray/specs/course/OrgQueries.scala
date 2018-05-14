package net.paulgray.specs.course

import java.sql.Timestamp
import java.time.Instant
import java.util.Date

import doobie.free.connection.ConnectionIO
import doobie.implicits._
import doobie.util.meta.Meta
import doobie.util.query.{Query, Query0}

object OrgQueries {

  implicit val InstantMeta: Meta[Instant] =
    Meta[Timestamp].nxmap(_.toInstant, Timestamp.from)

  case class Organization(
    id: Long,
    guid: String,
    name: String,
    description: String,
    url: String,
    contactEmail: String,
    createdAt: Instant,
    clientId: Long
  )

  case class OrganizationWithAggregate(org: Organization, aggregates: UserCourseCount)

  case class UserCourseCount(usersCount: Long, coursesCount: Long)

  def createOrganization(name: String, description: String, guid: String, url: String, contactEmail: String, clientId: Long): ConnectionIO[Int] =
    sql"insert into organizations (name, description, guid, url, contact_email, client_id) values ($name, $description, $guid, $url, $contactEmail, $clientId)".update.run

  def updateOrganization(id: Long, name: String, description: String, guid: String, url: String, contactEmail: String): ConnectionIO[Int] =
    sql"""
        update organizations
          set name = $name,
              description = $description,
              guid = $guid,
              url = $url,
              contact_email = $contactEmail
          where id = $id
     """.update.run

  def getOrganizationsForClient(clientId: Long): ConnectionIO[List[Organization]] =
    sql"select * from organizations where client_id = $clientId".query[Organization].list

  def getOrganizationsForClientWithAggregates(clientId: Long): ConnectionIO[List[OrganizationWithAggregate]] =
    sql"""
      select o.id, o.guid, o.name, o.description, o.url, o.contact_email, o.created_at, o.client_id, count(distinct u.id) AS userCount, count(distinct c.id) AS courseCount
        from organizations o
          left join courses c on c.organization_id = o.id
          left join users u on u.organization_id = o.id
        where o.client_id = 1
          group by o.id
    """.query[OrganizationWithAggregate].list

  def getOrganization(id: Long): Query0[Organization] =
    sql"""select o.id, o.guid, o.name, o.description, o.url, o.contact_email, o.created_at, o.client_id
         from organizations o where id = $id""".query[Organization]

}
