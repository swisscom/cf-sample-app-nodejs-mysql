var express = require( 'express')
var app = express()
var cf_app = require( './app/vcap_application')
var cf_svc = require( './app/vcap_services')
var mysql = require('mysql')

const testtable = 'testtable2'

var credentials = cf_svc.get_mysql_credentials()
var con = mysql.createConnection({
  host: credentials.hostname,
  user: credentials.username,
  password: credentials.password,
  database: credentials.database,
  ssl: {
    cert: credentials.certificate,
    key: credentials.private_key,
    ca: credentials.ca
  }
})

app.set( 'views', __dirname + '/views');
app.set( 'view engine', 'jade');
app.use( express.static( __dirname + '/public'));

app.get( '/', function ( req, res) {
 
  res.render( 'pages/index', {
    app_environment:    app.settings.env,
    application_name:   cf_app.get_app_name(),
    app_uris:           cf_app.get_app_uris(),
    app_space_name:     cf_app.get_app_space(),
    app_index:          cf_app.get_app_index(),
    app_mem_limits:     cf_app.get_app_mem_limits(),
    app_disk_limits:    cf_app.get_app_disk_limits(),
    service_label:      cf_svc.get_service_label(),
    service_name:       cf_svc.get_service_name(),
    service_plan:       cf_svc.get_service_plan()
  })
});

app.get( '/mysql/', function ( req, res) {
  const sql = `SELECT * FROM ${testtable};`
  res.set('Content-Type', 'application/json');
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
    res.send(result);
  });
});

app.post( '/mysql/:entry', function ( req, res) {
  const sql = `INSERT INTO ${testtable} (value) VALUES ('${req.params.entry}');`
  res.set('Content-Type', 'application/json');
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
    res.send('{"status": "success"}');
  });
});

function bootstrap() {
  console.log("Bootstrapping test application")
  const sql = `CREATE TABLE IF NOT EXISTS ${testtable} (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, value VARCHAR(250));`
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
  });
}

bootstrap();

app.listen( process.env.PORT || 4000);
