const express = require('express')
const bodyParser = require('body-parser');
const routesLeader = require('./routes/users');
const routesCourse = require('./routes/courses');
const routesLogin = require('./routes/login');
const routesRegistry = require('./routes/registries');

const app = express()

app.use(bodyParser.json());
app.use('/users', routesLeader);
app.use('/users', routesCourse);
app.use('/users', routesLogin);
app.use('/users', routesRegistry);
app.use('/users/courses', routesCourse);

app.listen(process.env.USERS_PORT, () => console.log('App listening on port ' + process.env.USERS_PORT + '!'))
