# Node.js Sample MySQL App
This sample app is based on the Swisscom [Node.js Sample App](https://github.com/swisscom/cf-sample-app-nodejs.git) and adds a simple REST API showcasing the new MySQL service with mTLS connection.

Following REST Endpoints are available:  
`GET /mysql` Lists entries  
`POST /mysql/:entry` (no body) Writes the entry in the path to the database.

## Prerequisite
MySQL Database `mysqldb` is created, this can be done as follows:
```
cf create-service mysql xsmall mysql-cluster
cf create-service mysql-database default mysqldb -c "{\"parent_reference\":\"$(cf service mysql-cluster --guid)\"}"
```

## Deployment
All necessary config is taken care of, simply push the app with `cf push`.

https://docs.cloudfoundry.org/buildpacks/node/node-tips.html

