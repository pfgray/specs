package net.paulgray.specs.client

import cats.Applicative
import cats.data.EitherT
import cats.effect.IO
import doobie.free.connection.ConnectionIO
import doobie.implicits._
import net.paulgray.specs.ApiRouter.ApiRoot
import net.paulgray.specs.SpecsRoot.RequestHandler
import net.paulgray.specs.client.ClientQueries.Client
import org.http4s.dsl.io._
import net.paulgray.specs.RequestUtil._
import net.paulgray.specs.course.OrgQueries
import net.paulgray.specs.course.OrgQueries._
import org.http4s.circe._
import io.circe.generic.auto._
import io.circe.syntax._
import cats.syntax.either._
import org.http4s.Response

object OrgRoutes {

  case class CreateOrganizationRequest(name: String)
  implicit val decoder = jsonOf[IO, CreateOrganizationRequest]

  case class Orgs(organizations: List[Organization])

  def routes: RequestHandler = {

    // list
    case req @ GET -> ApiRoot / "organizations" =>
      withClient(req) {
        client =>
          EitherT(OrgQueries.getOrganizationsForClient(client.id).map(orgs => orgs.asRight[IO[Response[IO]]]))
      }

    // create
//    case req @ POST -> ApiRoot / "organizations" =>
//      withClient(req) {
//        client =>
//          // ConnectionIO[Int]
//
//
//          val wut = for {
//            create  <- req.as[CreateOrganizationRequest]
//            success <- OrgQueries.createOrganization(create.name, client.id)
//          } yield success
//          wut
//      }

  }


}
