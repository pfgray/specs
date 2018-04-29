
import sys.process._
import webpack.WebpackPlugin
import webpack.WebpackPlugin.autoImport._

organization := "net.paulgray"

name := "Specs"

version := "0.1.0-SNAPSHOT"

scalaVersion := "2.12.4"

resolvers += Classpaths.typesafeReleases

fork := true

lazy val startServer = taskKey[Int]("start me up")

startServer := {
  val cp: Seq[File] = (fullClasspath in Runtime).value.files

  val cpOpt = s""""${cp.map(_.getAbsolutePath).mkString(":")}""""
  streams.value.log.warn(s"got cp: ${cpOpt}")

  val hmm = Fork.java(
    ForkOptions().withEnvVars(Map("CLASSPATH" -> cpOpt)),
    Seq("net.paulgray.specs.SpecsServer")
  )
  streams.value.log.warn(s"started server process #$hmm")
  hmm
}

val http4sVersion = "0.18.0"

libraryDependencies ++= Seq(
  "org.http4s" %% "http4s-blaze-server" % http4sVersion,
  "org.http4s" %% "http4s-blaze-client" % http4sVersion,
  "org.http4s" %% "http4s-core" % http4sVersion,
  "org.http4s" %% "http4s-server" % http4sVersion,
  "org.http4s" %% "http4s-dsl" % http4sVersion,
  // "org.http4s" %% "http4s-argonaut" % http4sVersion,
  "org.http4s" %% "http4s-twirl" % http4sVersion,

  "org.http4s" %% "http4s-circe" % http4sVersion,
  // Optional for auto-derivation of JSON codecs
  "io.circe" %% "circe-generic" % "0.9.1",
  // Optional for string interpolation to JSON model
  "io.circe" %% "circe-literal" % "0.9.1",

  "org.apache.httpcomponents" % "httpclient" % "4.5.3",
  "commons-io" % "commons-io" % "2.5",

  "net.oauth.core" % "oauth" % "20100527",
  "oauth.signpost" % "signpost-core" % "1.2.1.2",
  "oauth.signpost" % "signpost-commonshttp4" % "1.2.1.2",

  "com.github.t3hnar" %% "scala-bcrypt" % "3.1",

  // doobie for db access
  "org.tpolecat" %% "doobie-core"      % "0.5.0",
  "org.tpolecat" %% "doobie-hikari"    % "0.5.0", // HikariCP transactor.
  "org.tpolecat" %% "doobie-postgres"  % "0.5.0", // Postgres driver 42.2.1 + type mappings.
  "org.tpolecat" %% "doobie-specs2"    % "0.5.0", // Specs2 support for typechecking statements.
  "org.tpolecat" %% "doobie-scalatest" % "0.5.0",  // ScalaTest support for typechecking statements.

  "ch.qos.logback" % "logback-classic" % "1.1.5" % "runtime"
)

enablePlugins(SbtTwirl, WebpackPlugin)
addCompilerPlugin("org.scalamacros" % "paradise" % "2.1.0" cross CrossVersion.full)

lazy val yarnInstall = taskKey[Unit]("yarnInstall")

yarnInstall := {
  val wut = Process("yarn install", cwd = baseDirectory.value)
}

lazy val yarnBuild = taskKey[Seq[File]]("yarnBuild") := {
  val wut = Process("yarn build", cwd = baseDirectory.value)
  Seq.empty[File]
}


