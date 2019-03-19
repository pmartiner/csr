const express = require('express')
const router = express.Router();
var pgp = require('pg-promise')({
  /* initialization options */
  capSQL: true // capitalize all generated SQL
});

var database_url= process.env.DB_URL || 'postgres://postgres:postgres@localhost:5432/csr';
const db = pgp(database_url);

router.get('/ping8', function (req, res){
  res.status(200).send('pong8');
});

router.post('/course/registry', function(req, res){
  var id_leader = req.body.id_leader;
  var id_course = req.body.id_course;
  var date = req.body.date;

  db.none('INSERT INTO registries(id_leader, id_course, date) VALUES($1, $2, $3)', [id_leader, id_course, date])
    .then(function (data) {
      res.status(200);
      console.log("BUENA");
      res.send('<h2>Todo en orden</h2>');
    })
    .catch(function (error) {
      res.status(400);
      console.log(error);
      console.log("MALA");
      res.send('<h2>Hubo un error</h2>');
    })
});

module.exports = router