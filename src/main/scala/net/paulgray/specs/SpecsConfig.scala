package net.paulgray.specs

import java.io.File

import com.typesafe.config.{Config, ConfigFactory}

object SpecsConfigLoader {

  sealed trait Environment
  case object Prod extends Environment
  case object Dev extends Environment

  case class SpecsConfig(db: DbConfig, env: Option[Environment])

  case class DbConfig(jdbc: String, user: String, pass: String)

  private lazy val config: Config =
    Option(System.getenv("SPECS_CONFIG"))
      .filter(!_.isEmpty)
      .map(fileName => new File(fileName))
      .filter(_.exists())
      .fold(ConfigFactory.load)(ConfigFactory.parseFile)

  def getConfig: SpecsConfig = {

    val db = config.getConfig("specs.db")
    val dbConfig = DbConfig(
      db.getString("jdbc"),
      db.getString("user"),
      db.getString("pass")
    )

    val env = config.getString("specs.env") match {
      case "prod" => Some(Prod)
      case "dev" => Some(Dev)
      case _ => None
    }

    SpecsConfig(
      dbConfig,
      env
    )
  }


}
