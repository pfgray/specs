FROM hseeberger/scala-sbt

RUN apt-get update
RUN apt-get -y install apt-transport-https software-properties-common
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update
RUN apt-get -y install nodejs yarn

COPY ./ /app
WORKDIR /app
RUN sbt allDependencies
RUN yarn install
RUN sbt assembly

CMD ["java", "-jar", "/app/target/scala-2.12/Specs-assembly-0.1.0-SNAPSHOT.jar"]