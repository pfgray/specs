# Specs #

## Build & Run ##

```sh
$ cd Specs
$ ./sbt

start the backend:
```
> reStart
```
After making changes, restart the backend:
```
reStart
```

the app will start listening on port 8080

start the frontend:
```
> webpack:start
```
The webpack server will watch for changes and automatically re-compile
If you make changes to the webpack configuration itself, then you'll need to stop and start webpack:
```
> ;webpack:stop;webpack:start
```

