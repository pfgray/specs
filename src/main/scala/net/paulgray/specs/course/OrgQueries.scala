package net.paulgray.specs.course

import doobie.free.connection.ConnectionIO
import doobie.implicits._
import doobie.util.query.{Query, Query0}

object OrgQueries {

  case class Organization(id: Long, name: String, clientId: Long)

  case class OrganizationWithAggregate(id: Long, name: String, clientId: Long, usersCount: Long, coursesCount: Long)

  def createOrganization(name: String, clientId: Long): ConnectionIO[Int] =
    sql"insert into organizations (name, client_id) values ($name, $clientId)".update.run

  def updateOrganization(id: Long, name: String): ConnectionIO[Int] =
    sql"update organizations set name = $name where id = $id".update.run

  def getOrganizationsForClient(clientId: Long): ConnectionIO[List[Organization]] =
    sql"select id, name, client_id from organizations where client_id = $clientId".query[Organization].list

  def getOrganizationsForClientWithAggregates(clientId: Long): ConnectionIO[List[OrganizationWithAggregate]] =
    sql"""
      select o.id, o.name, client_id, count(distinct u.id) AS userCount, count(distinct c.id) AS courseCount
        from organizations o
          left join courses c on c.organization_id = o.id
          left join users u on u.organization_id = o.id
        where o.client_id = 1
          group by o.id
    """.query[OrganizationWithAggregate].list

  def getOrganization(id: Long): Query0[Organization] =
    sql"select id, name, client_id from organizations where id = $id".query[Organization]

}
