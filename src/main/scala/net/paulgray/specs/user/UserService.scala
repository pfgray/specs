package net.paulgray.specs.user

import doobie.implicits._


object UserService {

  def getUser =
    for {
      a <- sql"select 42".query[Int].unique
      b <- sql"select random()".query[Double].unique
    } yield (a, b)

}
