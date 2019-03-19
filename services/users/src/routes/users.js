const express = require('express')
const router = express.Router();
const pgp = require('pg-promise')({
  /* initialization options */
  capSQL: true // capitalize all generated SQL
});

var mail = require('./templates/email/test_email');

var database_url= process.env.DB_URL || 'postgres://postgres:postgres@localhost:5432/csr';
const db = pgp(database_url);


router.get('/ping2', function (req, res){
  res.status(200).send('pong2');
});

router.put('/register/leader', function(req, res){
  var name = req.body.name;
  var surname_f = req.body.surname_f;
  var surname_m = req.body.surname_m;
  var birthdate = req.body.birthdate;
  var marital_status = req.body.marital_status;
  var academic_degree = req.body.academic_degree;
  var headquarters = req.body.headquarters;
  var network = req.body.network;
  var house_type = req.body.house_type;
  var conversion_date = req.body.conversion_date;
  var first_encounter_date = req.body.first_encounter_date;
  var email = req.body.email;
  var pw = req.body.pw;
  var mobile = req.body.mobile;
  var street = req.body.street;
  var street_num = req.body.street_num;
  var neighborhood = req.body.neighborhood;
  var municipality = req.body.municipality;
  var state = req.body.state;
  var pc = req.body.pc;
  var interested_people = req.body.interested_people;
  var notif_family = req.body.notif_family;
  var notif_kids = req.body.notif_kids;
  var notif_parents_school = req.body.notif_parents_school;
  var notif_marriage = req.body.notif_marriage;
  var notif_youth = req.body.notif_youth;
  var notif_teens = req.body.notif_teens;
  var notif_entrepreneurship = req.body.notif_entrepreneurship;
  var notif_reach = req.body.notif_reach;
  var notif_praise = req.body.notif_praise;
  var notif_againt_slave_traffic  = req.body.notif_againt_slave_traffic;
  var notif_good_news = req.body.notif_good_news;
  var notif_prayer = req.body.notif_prayer;
  var notif_older_adults = req.body.notif_older_adults;
  var id_father = req.body.id_father;
  var leader = req.body.leader;

  db.one('INSERT INTO users(name, surname_fath, surname_math, birthdate, marital_status, academic_degree, headquarters, network, house_type, conversion_date, first_encounter_date, email, password, mobile, street, street_num, neighborhood, municipality, state, pc, interested_people, notif_family, notif_kids, notif_parents_school, notif_marriage, notif_youth, notif_teens, notif_entrepreneurship, notif_reach, notif_praise, notif_againt_slave_traffic, notif_good_news, notif_prayer, notif_older_adults, id_father, leader, admin)' +
  'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37) returning id_leader',
  [name, surname_f, surname_m, birthdate, marital_status, academic_degree, headquarters, network, house_type, conversion_date, first_encounter_date, email, pw, mobile, street, street_num, neighborhood, municipality, state, pc, interested_people, notif_family, notif_kids, notif_parents_school, notif_marriage, notif_youth, notif_teens, notif_entrepreneurship, notif_reach, notif_praise, notif_againt_slave_traffic, notif_good_news, notif_prayer, notif_older_adults, id_father, leader, false])
    .then(function (data) {
      
      res.status(200);
      res.json({id_leader: data.id_leader});
      console.log("BUENA");
    })
    .catch(function (error) {
      res.status(400);
      console.log(error);
      console.log("MALA");
      res.send('<h2>Hubo un error</h2>');
    })
});


router.post('/leader/email', function (req, res){
  console.log(req.body);
  mail.sendPasswordReset(req.body.email, req.body.title, req.body.content)
  .then((resp) => {
    res.json({response: resp});
  });  
});

router.post('/course/registry', function (req, res){
  var id_course = req.body.id_course;
  var name = req.body.name;
  var surname_f = req.body.surname_f;
  var surname_m = req.body.surname_m;
  var birthdate = req.body.birthdate;
  var marital_status = req.body.marital_status;
  var academic_degree = req.body.academic_degree;
  var headquarters = req.body.headquarters;
  var network = req.body.network;
  var house_type = req.body.house_type;
  var conversion_date = req.body.conversion_date;
  var first_encounter_date = req.body.first_encounter_date;
  var email = req.body.email;
  var pw = req.body.pw;
  var mobile = req.body.mobile;
  var street = req.body.street;
  var street_num = req.body.street_num;
  var neighborhood = req.body.neighborhood;
  var municipality = req.body.municipality;
  var state = req.body.state;
  var pc = req.body.pc;
  var interested_people = req.body.interested_people;
  var notif_family = req.body.notif_family;
  var notif_kids = req.body.notif_kids;
  var notif_parents_school = req.body.notif_parents_school;
  var notif_marriage = req.body.notif_marriage;
  var notif_youth = req.body.notif_youth;
  var notif_teens = req.body.notif_teens;
  var notif_entrepreneurship = req.body.notif_entrepreneurship;
  var notif_reach = req.body.notif_reach;
  var notif_praise = req.body.notif_praise;
  var notif_againt_slave_traffic  = req.body.notif_againt_slave_traffic;
  var notif_good_news = req.body.notif_good_news;
  var notif_prayer = req.body.notif_prayer;
  var notif_older_adults = req.body.notif_older_adults;
  var leader = req.body.leader;

  function zeroPad(d) {
    return ("0" + d).slice(-2);
  }

  var parsed = new Date();
  console.log("parsed: " + parsed);
  var date = [parsed.getUTCFullYear(), zeroPad(parsed.getMonth() + 1), zeroPad(parsed.getDate())].join("-");

  db.task(t => {
    return t.one('SELECT id_leader FROM courses WHERE id_course=$1', id_course)
      .then(data => {
        return t.one('INSERT INTO users(name, surname_fath, surname_math, birthdate, marital_status, academic_degree, headquarters, network, house_type, conversion_date, first_encounter_date, email, password, mobile, street, street_num, neighborhood, municipality, state, pc, interested_people, notif_family, notif_kids, notif_parents_school, notif_marriage, notif_youth, notif_teens, notif_entrepreneurship, notif_reach, notif_praise, notif_againt_slave_traffic, notif_good_news, notif_prayer, notif_older_adults, id_father, leader, admin)' +
          'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37) returning id_leader',
          [name, surname_f, surname_m, birthdate, marital_status, academic_degree, headquarters, network, house_type, conversion_date, first_encounter_date, email, pw, mobile, street, street_num, neighborhood, municipality, state, pc, interested_people, notif_family, notif_kids, notif_parents_school, notif_marriage, notif_youth, notif_teens, notif_entrepreneurship, notif_reach, notif_praise, notif_againt_slave_traffic, notif_good_news, notif_prayer, notif_older_adults, data.id_father, leader, false])
          
      })
      .then(data => {
        return t.none('INSERT INTO registries(id_leader, id_course, date) VALUES($1, $2, $3)', [data.id_leader, id_course, date]);
      });
  })
  .then(events => {
    res.status(200);
    console.log("BUENA");
    res.json({registro: "correcto"});
  })
  .catch(error => {
    res.status(400);
    console.log("MALA");
    console.log(error);
    res.json({registro: "incorrecto1"});
  });

  // db.task(t => {
  //   t.one('SELECT id_leader FROM courses WHERE id_course=$1', id_course)
  //     .then(data => {
  //       console.log("sigo")
  //       return t.one('INSERT INTO users(name, surname_fath, surname_math, birthdate, marital_status, academic_degree, headquarters, network, house_type, conversion_date, first_encounter_date, email, password, mobile, street, street_num, neighborhood, municipality, state, pc, interested_people, notif_family, notif_kids, notif_parents_school, notif_marriage, notif_youth, notif_teens, notif_entrepreneurship, notif_reach, notif_praise, notif_againt_slave_traffic, notif_good_news, notif_prayer, notif_older_adults, id_father, leader, admin)' +
  //       'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37) returning id_leader',
  //       [name, surname_f, surname_m, birthdate, marital_status, academic_degree, headquarters, network, house_type, conversion_date, first_encounter_date, email, pw, mobile, street, street_num, neighborhood, municipality, state, pc, interested_people, notif_family, notif_kids, notif_parents_school, notif_marriage, notif_youth, notif_teens, notif_entrepreneurship, notif_reach, notif_praise, notif_againt_slave_traffic, notif_good_news, notif_prayer, notif_older_adults, data.id_father, leader, false])
  //         .then(data => {
  //             console.log("sigo en pie")
  //             return t.none('INSERT INTO registries(id_leader, id_course, date) VALUES($1, $2, $3)', data.id_leader, id_course, date);
  //         });
  //     })
  //   })


});

router.put('/register/exists', function(req, res){
  var email = req.body.email;
  var mobile = req.body.mobile;


db.any('SELECT * FROM users WHERE (email=$1 OR mobile=$2) AND leader', [email, mobile])
  .then(function (data) {
    res.status(200);
    if(data.length==!0){
      if(data[0].email===email && data[0].mobile!==mobile)
        res.json({
          email: true,
          mobile: false
        });
      else if(data[0].email!==email && data[0].mobile===mobile)
        res.json({
          email: false,
          mobile: true
        });
      else if(data[0].email===email && data[0].mobile===mobile)
        res.json({
          email: true,
          mobile: true
        });
    }
    else if(data.length===0){
      res.json({
        email: false,
        mobile: false
      });
      console.log("entré")
    }  
    console.log("BUENA");
  })
  .catch(function (error) {
    res.status(400);
    console.log(error);
    res.json({
      email: false,
      mobile: false
    });
    console.log("MALA");
    res.send('<h2>Hubo un error</h2>');
  })
});

module.exports = router
