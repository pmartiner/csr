const express = require('express')
const router = express.Router();
const pgp = require('pg-promise')({
  /* initialization options */
  capSQL: true // capitalize all generated SQL
});

var database_url= process.env.DB_URL || 'postgres://postgres:postgres@localhost:5432/csr';
const db = pgp(database_url);

router.get('/ping3', function (req, res){
  res.status(200).send('pong3');
});

router.post('/login', function(req, res){
  var email = req.body.email;
  var pw = req.body.pw;


  db.oneOrNone('SELECT id_leader FROM users WHERE email = $1 AND password = $2', [email, pw])
    .then(function (data) {
      if(data!=null){
        res.status(200);
        console.log("BUENA");
        res.json({id_leader: data.id_leader});
      }
      else{
        res.status(400);
        console.log("MALA");
        res.json({});
      }
    //res.send('<h2>Todo en orden</h2>');
    })
    .catch(function (error) {
      res.status(400);
      console.log(error);
      console.log("MALA");
      res.send('<h2>Hubo un error</h2>');
    })
});

router.put('/change/password', function(req, res){
  var id_leader = req.body.id_leader;
  var old_pw = req.body.old_pw;
  var new_pw = req.body.new_pw;


  db.task(t => {
    return t.oneOrNone('SELECT id_leader FROM users WHERE id_leader = $1 AND password = $2', [id_leader, old_pw])
        .then(data => {
          if(data != null)
            return t.none('UPDATE users SET password = $1 WHERE id_leader = $2', [new_pw, data.id_leader]);
          else
            return "error";
        });
  })
  .then(data => {
    console.log(data);
    if(data==null){
      res.status(200);
      console.log("BUENA");
      res.send('<h2>Todo en orden.</h2>');
    }
    else{
      res.status(400);
      console.log("MALA");
      res.send('<h2>Hubo un error.</h2>');
    }
  })
  .catch(error => {
    res.status(400);
    console.log(error);
    console.log("MALA");
    res.send('<h2>Hubo un error</h2>');
  });

});


module.exports = router
