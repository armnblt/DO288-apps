var express = require('express'),
  app = express();

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
  ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var route = express.Router();

// global var to track app health
var liveness_healthy = true;
var startup_healthy = false;
var readiness_healthy = true;

app.use('/', route);

// A route that says hello
route.get('/', function (req, res) {
  res.send('Hello! This is the index page for the app.\n');
});

// A route that returns readiness status
// simulates readiness 30 seconds after start up
route.get('/readiness_healthz', function (req, res) {
  if (readiness_healthy) {
    console.log('ping /readiness_healthz => pong [healthy]');
    res.send('OK\n');
  }
  else {
    console.log('ping /readiness_healthz => pong [unhealthy]');
    res.status(503);
    res.send('Error!. App not healthy!\n');
  }
});

// A route that returns readiness status
// simulates readiness 30 seconds after start up
route.get('/startup_healthz', function (req, res) {
  var now = Math.floor(Date.now() / 1000);
  var lapsed = now - started;
  if (lapsed > 60) {
    console.log('ping /startup_healthz => pong [ready]');
    res.send('Ready for service requests...\n');
  }
  else {
    console.log('ping /startup_healthz => pong [notready]');
    res.status(503);
    res.send('Error! Service not ready for requests...\n');
  }
});

// A route that returns health status
route.get('/liveness_healthz', function (req, res) {
  if (liveness_healthy) {
    console.log('ping /liveness_healthz => pong [healthy]');
    res.send('OK\n');
  }
  else {
    console.log('ping /liveness_healthz => pong [unhealthy]');
    res.status(503);
    res.send('Error!. App not healthy!\n');
  }
});

// This route handles switching the state of the app
route.route('/flip').get(function (req, res) {

  var flag = req.query.op;
  if (flag == "liveness_kill") {
    console.log('Received kill request. Changing app state to unhealthy...');
    liveness_healthy = false;
    res.send('Switched app state to liveness unhealthy...\n');
  }
  else if (flag == "liveness_awaken") {
    console.log('Received awaken request. Changing app state to healthy...');
    liveness_healthy = true;
    res.send('Switched app state to liveness healthy...\n');
  }
  else if (flag == "startup_kill") {
    console.log('Received awaken request. Changing app state to healthy...');
    startup_healthy = false;
    res.send('Switched app state to startup unhealthy...\n');
  }
  else if (flag == "startup_awaken") {
    console.log('Received awaken request. Changing app state to healthy...');
    startup_healthy = true;
    res.send('Switched app state to startup healthy...\n');
  }
  else if (flag == "readiness_kill") {
    console.log('Received awaken request. Changing app state to healthy...');
    readiness_healthy = false;
    res.send('Switched app state to readiness unhealthy...\n');
  }
  else if (flag == "readiness_awaken") {
    console.log('Received awaken request. Changing app state to healthy...');
    readiness_healthy = true;
    res.send('Switched app state to readiness healthy...\n');
  }
  else {
    res.send('Error! unknown flag...\n');
  }
});

app.listen(port, ip);
console.log('nodejs server running on http://%s:%s', ip, port);
var started = Math.floor(Date.now() / 1000);

module.exports = app;
