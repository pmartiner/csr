const express = require('express')
const router = express.Router();
const moment = require('moment-timezone');

const pgp = require('pg-promise')({
  /* initialization options */
  capSQL: true // capitalize all generated SQL
});

var database_url= process.env.DB_URL || 'postgres://postgres:postgres@localhost:5432/csr';
const db = pgp(database_url);

router.get('/ping1', function (req, res){
  res.status(200).send('pong1');
});

router.post('/course', function(req, res){
  var dayC = req.body.day;
  var start_day = req.body.start_day;
  var start_time = req.body.start_time;
  var end_time = req.body.end_time;
  var attendance_type = req.body.attendance_type;
  var course_name = req.body.course_name;
  var description = req.body.description;
  var house_type = req.body.house_type;
  var street = req.body.street;
  var street_num = req.body.street_num;
  var interior_num = req.body.interior_num;
  var latitude = req.body.latitude;
  var longitude = req.body.longitude;
  var neighborhood = req.body.neighborhood;
  var municipality = req.body.municipality;
  var state = req.body.state;
  var pc = req.body.pc;
  var phone = req.body.phone;
  var id_leader = req.body.id_leader;

  db.none('INSERT INTO courses(id_leader, day, start_day, start_time, end_time, attendance_type, course_name, description, house_type, street, street_num, interior_num, latitude, longitude, neighborhood, municipality, state, pc, phone)' +
  'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)',
  [id_leader, dayC, start_day, start_time, end_time, attendance_type, course_name, description, house_type, street, street_num, interior_num, latitude, longitude, neighborhood, municipality, state, pc, phone])
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

router.put('/course/edit', function(req, res){
  var dayC = req.body.day;
  var start_day = req.body.start_day;
  var start_time = req.body.start_time;
  var end_time = req.body.end_time;
  var attendance_type = req.body.attendance_type;
  var course_name = req.body.course_name;
  var description = req.body.description;
  var house_type = req.body.house_type;
  var street = req.body.street;
  var street_num = req.body.street_num;
  var interior_num = req.body.interior_num;
  var latitude = req.body.latitude;
  var longitude = req.body.longitude;
  var neighborhood = req.body.neighborhood;
  var municipality = req.body.municipality;
  var state = req.body.state;
  var pc = req.body.pc;
  var phone = req.body.phone;
  var id_leader = req.body.id_leader;
  var id_course = req.body.id_course;

  db.none('UPDATE courses SET(day, start_day, start_time, end_time, attendance_type, course_name, description, house_type, street, street_num, interior_num, latitude, longitude, neighborhood, municipality, state, pc, phone)' +
  '= ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) WHERE id_leader = $19 AND id_course = $20',
  [dayC, start_day, start_time, end_time, attendance_type, course_name, description, house_type, street, street_num, interior_num, latitude, longitude, neighborhood, municipality, state, pc, phone, id_leader, id_course])
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

router.get('/courses', function(req, res){
  var datos_usuario = [];
  var result = [];
  var courses_length = 0;
  var i = 0;

  db.task(t => {
    return t.each('SELECT * FROM courses WHERE id_leader = $1 ORDER BY id_course ASC', req.query.id_leader, function (row) {
      t.task(ta => {
        return ta.any('SELECT DISTINCT (users.id_leader), name, surname_fath, surname_math, email, mobile FROM registries, users WHERE id_course = $1 AND users.id_leader = registries.id_leader', row.id_course)
          .then(info_user => {
            var obj = {
              "id_course": row.id_course,
              "start_day": row.start_day,
              "day": row.day,
              "start_time": row.start_time,
              "end_time": row.end_time,
              "attendance_type": row.attendance_type,
              "course_name": row.course_name,
              "description": row.description,
              "house_type": row.house_type,
              "street": row.street,
              "street_num": row.street_num,
              "interior_num": row.interior_num,
              "latitude": row.latitude,
              "longitude": row.longitude,
              "neighborhood": row.neighborhood,
              "municipality": row.municipality,
              "state": row.state,
              "pc": row.pc,
              "phone": row.phone,
              "id_leader": row.id_leader,
              "user_list": info_user
            };
            result.push(obj);
            i++;
            return result;
          })
          .then(function (data) {
            if (i == courses_length) {
              res.status(200);
              console.log("BUENA");
              res.json({
                courses: data
              });
            }
          })
          .catch(function (error) {
            res.status(400);
            console.log(error);
            console.log("MALA");
            res.send('<h2>Hubo un error</h2>');
          });
      });

    });

  })
    .then(data => {
      courses_length = data.length;
    })

});

router.post('/course/report', function(req, res){
  var id_course = req.body.id_course;
  var tithe = req.body.tithe;
  var donation = req.body.donation;
  var date_course = req.body.date_course;
  var date_report = req.body.date_report;
  var user_list = req.body.user_list;
  var attendance_mails = [];
  var users_to_insert = [];


  // user_list.forEach(function(element) {
  //   //Checa si existe el atributo de user_id en cada JSON del arreglo de JSONs user_list
  //   //Si no existe ese atributo es porque no se dio en la user_list
  //   //Si no se dio en la user_list es porque son nuevos
  //   if (!('id_user' in element)){
  //     users_to_insert.push(element);
  //   }
  // });

  // const cs = new pgp.helpers.ColumnSet(['email', 'name', 'surname_fath', 'surname_math', 'mobile'], {table: 'users'});
  // if(users_to_insert.length !== 0)
  //   const query = pgp.helpers.insert(users_to_insert, cs);

  for(var i = 0; i<user_list.length; i++){
    attendance_mails[i]=user_list[i].email;
  }

  db.task(t => {
    return t.any('SELECT id_leader FROM users WHERE email IN ($1:csv)', [attendance_mails])
      .then(data => {
        console.log(data);
        attendances = JSON.stringify(data);
        return db.none('INSERT INTO attendances(tithe, donation, date_course, date_report, attendances, id_course ) VALUES ($1, $2, $3, $4, $5, $6)', [tithe, donation, date_course, date_report, attendances, id_course])
          .then(data => {
            res.status(200);
            console.log("BUENA");
          })
          .catch(error => {
            res.status(400);
            console.log(error);
            console.log("MALA");
          });
      });
  })
  .then(data => {
    res.status(200);
    console.log("BUENA");
  })
  .catch(error => {
    res.status(400);
    console.log(error);
    console.log("MALA");
  });
});

router.get('/info', function(req, res){
  var id_course = req.query.id_course;

  db.one('SELECT * FROM courses WHERE id_course=$1', id_course)
    .then(function (data) {
      res.status(200);
      console.log("BUENA");
      res.json(data);
    })
    .catch(function (error) {
      res.status(400);
      console.log(error);
      console.log("MALA");
    })
});

router.get('/courses/report/date_report', function(req, res){
  var id_course = req.query.id_course;

  db.task(function * (t) {
    let course_start_day = yield db.one('SELECT start_day FROM courses WHERE id_course=$1', [id_course]);
    let fecha_reporte = yield db.any('SELECT date_report FROM attendances WHERE id_course=$1 ORDER BY date_course DESC', [id_course]);
    let date_course = yield db.any('SELECT date_course FROM attendances WHERE id_course=$1 ORDER BY date_course DESC', [id_course]);
    let day = yield t.one('SELECT day FROM courses WHERE id_course=$1;', [id_course]);

    console.log(date_course);
    return {
      course_start_day: course_start_day,
      date_course: date_course, 
      fecha_reporte: fecha_reporte,
      day: day
    }
  })
  .then(data => {
    var day = data.day.day
    var dia = -1;

    if(day==='Lunes')
      dia = 1;
    else if(day==='Martes') 
      dia = 2;
    else if(day==='Miércoles') 
      dia = 3;
    else if(day==='Jueves') 
      dia = 4;
    else if(day==='Viernes') 
      dia = 5;
    else if(day==='Sábado') 
      dia = 6;
    else 
      dia = 0;

    var today = moment().tz('America/Mexico_City').weekday(moment().tz('America/Mexico_City').weekday());
    var c_day = moment().tz('America/Mexico_City').weekday(dia);

    if(today<c_day)
      var next_day = moment().tz('America/Mexico_City').weekday(dia);
    else
      var next_day = moment().tz('America/Mexico_City').weekday(dia + 7);

    var start_day = data.course_start_day.start_day;
    var resp = false;

    if(typeof data.fecha_reporte[0] !== 'undefined')
      var fecha_reporte = data.fecha_reporte[0].date_report;
    if(typeof data.date_course[0] !== 'undefined')
      var date_course = data.date_course[0].date_course;

    if (today.toDate()>=start_day){
      if(fecha_reporte===null || !fecha_reporte){
        fecha_reporte = start_day;
        resp = true; 
        console.log("primer curso")
      }  
      else{
        if(today>=moment(date_course).add(7, 'days')){
          resp = true;
          fecha_reporte = moment(date_course).add(7, 'days');
          console.log("NO es primer curso")
        }
      }
    }

    res.status(200);
    res.json({
      reporte: resp,
      fecha_reporte: fecha_reporte
    });      
    console.log("BUENA");
  })
  .catch(error => {
    res.status(400);
    console.log(error);
    console.log("MALA");
  });
});

module.exports = router
