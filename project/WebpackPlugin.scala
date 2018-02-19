package webpack

import java.util.concurrent.atomic.AtomicReference

import sys.process._
import sbt._
import sbt.Keys._

object WebpackPlugin extends AutoPlugin {
  // by defining autoImport, the settings are automatically imported into user's `*.sbt`
  object autoImport {
    // configuration points, like the built-in `version`, `libraryDependencies`, or `compile`
    lazy val Webpack = config("webpack") describedAs("Webpack configurations")
    lazy val devServerExecutable = settingKey[File]("The webpack-dev-server executable.")
    lazy val devServerPort = settingKey[Int]("Port to run webpack-dev-server on.")
    lazy val start = taskKey[Process]("starts webpack-dev-server")
    lazy val stop = taskKey[Unit]("stops webpack-dev-server")
    // default values for the tasks and settings
    lazy val baseWebpackSettings: Seq[Def.Setting[_]] = Seq(
      start := startServer.value,
      stop := stopServer.value,
      devServerExecutable := baseDirectory.value / "node_modules" / ".bin" / "webpack-dev-server",
      devServerPort := 9000,
      devServerInstance := new AtomicReference(None),
      onLoad in Global   := onLoadSetting.value
    )
  }

  private lazy val devServerInstance =
    settingKey[AtomicReference[Option[Process]]]("current dev server process")

  import autoImport._

  // a group of settings that are automatically added to projects.
  override val projectSettings =
    inConfig(Webpack)(baseWebpackSettings)

  private def startServer =
    Def.task {
      val log = streams.value.log
      log.info("starting webpack-dev-server...")
      val process = Process(devServerExecutable.value.absolutePath, Seq("--port", devServerPort.value.toString)).run()
      devServerInstance.value.set(Some(process))
      process
    }

  private def stopServer =
    Def.task {
      val log = streams.value.log
      devServerInstance.value.get foreach stopProcess(log)
    }

  private def stopProcess(l: Logger)(p: Process): Unit = {
    l.info("waiting for webpack dev server to shut down...")
    p.destroy()
    val err = System.err
    val devNull: java.io.PrintStream =
      new java.io.PrintStream(
        new java.io.OutputStream {
          def write(b: Int): Unit = {}
        }
      )
    System.setErr(devNull)
    p.exitValue()
    System.setErr(err)
  }

  private def onLoadSetting: Def.Initialize[State => State] =
    Def.setting {
      (onLoad in Global).value compose { state: State =>
        state.addExitHook(
          devServerInstance.value.get foreach stopProcess(state.log)
        )
      }
    }

}