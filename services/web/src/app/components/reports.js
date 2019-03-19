import React from 'react';
import { Input, Row, Col, Icon } from 'react-materialize';
import update from 'immutability-helper';

var api = require('../utils/api');

function Assistant(props){
  var assistant = props.inputValue.map((value, i) => (

    <Input
      data-key={i}
      l={12}
      s={12}
      className = "blue-csr"
      labelClassName={props.active} 
      validate={true} 
      error={props.error}
      type="checkbox"
      data-mobile={props.inputValue[i].mobile}
      data-text={props.inputValue[i].name + ' ' + props.inputValue[i].surname_fath + ' ' + props.inputValue[i].surname_math}
      label={props.inputValue[i].name + ' ' + props.inputValue[i].surname_fath + ' ' + props.inputValue[i].surname_math}
      value={props.inputValue[i].email}
      onChange={props.inputOnChange}
    />
  ));

  return (
    <Col l={12} s={12}>
      {assistant}
		</Col>
  );
}

export class Reports extends React.Component {
	constructor(props) {
    super(props);

    this.state = {
      courseInfo: {},
      hasErrors: false,
      hasErrorsAtt: false,
      emExists: false,
      mobExists: false,
      array: [],
      inputValue: {
        id_course: 0,
        tithe: "",
        donation: "",
        date_course: "",
        date_report: "",
        user_list: []
      },
      newUser: {
        email: "",
	      mobile: "",
	      name: "",
	      surname_f: "",
	      surname_m: "",
        pw: "",
        id_father: "",
        leader: false
      },
      new: false
    };
  }

	componentDidMount() {
    const component = this;

    window.$('#fechaRepo').pickadate({
			selectMonths: true, // Creates a dropdown to control month
      selectYears: 100,
      closeOnSelect: false,  // Close upon selecting a date,

      min: new Date(1900, 1, 1),
      max: new Date(),
      monthsFull: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      monthsShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'Jul', 'ago', 'sep', 'oct', 'nov', 'dec'],
      weekdaysFull: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      weekdaysShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      showMonthsShort: undefined,
      showWeekdaysFull: undefined,
      // Buttons
      today: 'Hoy',
      clear: 'Limpiar',
      close: 'Ok',
      // Accessibility labels
      labelMonthNext: 'Siguiente mes',
      labelMonthPrev: 'Mes anterior',
      labelMonthSelect: 'Seleccione un mes',
      labelYearSelect: 'Seleccione un año',

			onStart: function() {
        var date = new Date(component.props.location.state.date_report);
        date = date.setTime(date.getTime() + date.getTimezoneOffset()*60*1000);
        
        this.set('select', date);
      },
      onSet: this.handleDateChange.bind(this)
    });


		window.$(document).ready(function(){
      // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
      window.$('.modal').modal();
    });

    var id = this.props.id_leader;

    api.leaderCourseInfo(id)
      .then((data) => {
        this.setState({
          courseInfo: data.courses[this.props.location.state.key],
          inputValue: update(this.state.inputValue, {
            id_course: {$set: this.props.location.state.id_course},
            date_report: {$set: this.props.location.state.date_report}
          }),
          newUser: update(this.state.newUser, {
            pw: {$set: this.randomPw()},
            id_father: {$set: id}
          }),
        });
      });
  }

	open() {
    window.$('#myModal').modal('open');
  }

  close() {
    window.$('#myModal').modal('close');
  }

  handleDateChange(e){
    this.handleInputChange(e, 'date_course', 'datepicker')
  }

  handleInputChange(e, text, type, value) {
    if(type === 'datepicker'){
      console.log(this.pgFormatDate(e.select));
      this.setState({
        inputValue: update(this.state.inputValue, {[text]: {$set: this.pgFormatDate(e.select)}})
      });
    }
    else if(type === 'user'){
      this.setState({
        newUser: update(this.state.newUser, {[text]: {$set: e.target.value}})
      });
    }
    else
      if(e.target.type === 'checkbox'){;
				var array = this.state.array;

				if(e.target.checked)
					array.push(this.state.courseInfo.user_list[e.target.dataset.key]);
        else if(array.length !== 0)
          array.pop(this.state.courseInfo.user_list[e.target.dataset.key]);
        this.setState({
          inputValue: update(this.state.inputValue, {[text]: {$set: array}})
        });
      }
      else{
        this.setState({
          inputValue: update(this.state.inputValue, {[text]: {$set: e.target.value}})
        });
      }
	}

  pgFormatDate(date) {
    /* Via http://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date */
    console.log("date:  " + date);
    console.log("type: " + typeof date);
    function zeroPad(d) {
      return ("0" + d).slice(-2);
    }

    var parsed = new Date(date);
    console.log("parsed: " + parsed);
    console.log("zeropad: " + date)
    return [parsed.getUTCFullYear(), zeroPad(parsed.getMonth() + 1), zeroPad(parsed.getDate())].join("-");
  }

  randomPw() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

	apiReporte(){
    var info = this.state.inputValue;
    var isStateEmpty = !this.state.inputValue.tithe ||
      !this.state.inputValue.donation ||
      !this.state.inputValue.date_course ||
      !this.state.inputValue.user_list.length;

    if(!isStateEmpty){
      api.leaderCourseReport(info)
      window.location.replace("./groups");
      
    }
    else {
      alert('Faltan campos por llenar');
      this.setState({
        hasErrors: true
      });
    }
  }

  apiGetUsers(){
    var id = this.props.id_leader;

    api.leaderCourseInfo(id);
  }

  apiNewUser(){
    var info = this.state.newUser;
    var id = this.props.id_leader;
    var isStateEmpty = !this.state.newUser.email ||
      !this.state.newUser.surname_f ||
      !this.state.newUser.surname_m ||
      !this.state.newUser.mobile ||
      !this.state.newUser.name ||
      !this.state.newUser.pw;

    if(!isStateEmpty){
      api.userExists({
        email: this.state.newUser.email,
        mobile: this.state.newUser.mobile
      })
      .then((data) => {
        console.log("ACAÁAA")
        console.log(data)
        if(data.mobile){
          alert('Ya existe el teléfono celular que ingresaste');
          this.setState({
            hasErrorsAtt: true,
            mobExists: true
          });
        }
        if(data.email){
          alert('Ya existe el email que ingresaste');
          this.setState({
            hasErrorsAtt: true,
            emExists: true
          });
        }
        else if(!data.mobile && !data.email){
          api.leaderRegister(info)
          .then((data) => {
            api.userRegistry({
              id_leader: data.id_leader,
              id_course: this.state.inputValue.id_course,
              date: this.state.inputValue.date_course
            })
            .then((data) => {
              this.close();
              api.leaderCourseInfo(id)
              .then((data) => {
                this.setState({
                  courseInfo: data.courses[this.props.location.state.key]
                });
              });
            });
          });
        }
      });
    }
    else{
      alert('Faltan campos por llenar');
      this.setState({
        hasErrorsAtt: true
      });
    }
    
  }

	render() {
    console.log(this.state.inputValue);
    var active = "";
    if(this.state.hasErrors){
      var error = 'Este campo es obligatorio';

      if(!this.state.inputValue.date_course) var errorDate = error;
      if(!this.state.inputValue.tithe) var errorTithe = error;
      if(!this.state.inputValue.donation) var errorDona = error;
      if(!this.state.inputValue.user_list.length) {
        var errorUserList = <p className='red-text'>No hay asistentes registrados</p>;
        var errorUL = error;
      } 

      active='active';
    }
    if(this.state.hasErrorsAtt){
      var errorEm = "";
      var errorMob = "";

      if(!this.state.newUser.email) errorEm = error;
      if(!this.state.newUser.mobile) errorMob = error;
      if(!this.state.newUser.name) var errorName = error;
      if(!this.state.newUser.surname_f) var errorSurF = error;
      if(!this.state.newUser.surname_m) var errorSurM = error;
      if(this.state.emExists) errorEm = "Este correo ya está registrado";
      if(this.state.mobExists) errorMob = "Este teléfono ya está registrado";

      active='active';
    }
    if(this.state.courseInfo.user_list)
      var attendance = <Assistant inputValue={this.state.courseInfo.user_list.slice()} error={errorUL} active={active} inputOnChange={(e, value) => {this.handleInputChange(e, 'user_list', 'checkbox', value)}}/>;
    return (
			<section>
        <Row className="back-blue no-margin">
          <Col s={1} m={1} l={1}></Col>
          <Col s={11} m={11} l={11} className="back-grey">
            <div className="fixed-action-btn">
              <a onClick={this.open} className="btn-floating btn-large turquoise-add">
                <Icon>person_add</Icon>
              </a>
            </div>

            <div id="myModal" className="modal">
              <div className="modal-content">
                <h4>Registro de nuevos asistentes:</h4>
                  <Row>
                    <Input l={12} s={12} labelClassName={active} validate={true} error={errorName} type="text" name="nombre" id="first_name" label="Nombre:" onChange={(e) => {this.handleInputChange(e, 'name', 'user')}}/>
                    <Input l={12} s={12} labelClassName={active} validate={true} error={errorSurF} type="text" name="apellido_pat" id="last_name" label="Apellido Paterno:" onChange={(e) => {this.handleInputChange(e, 'surname_f', 'user')}}/>
                    <Input l={12} s={12} labelClassName={active} validate={true} error={errorSurM} type="text" name="apellido_mat" id="second_name" label="Apellido Materno:" onChange={(e) => {this.handleInputChange(e, 'surname_m', 'user')}}/>
                    <Input l={12} s={12} labelClassName={active} validate={true} error={errorEm} type="email" label="Email:" onChange={(e) => {this.handleInputChange(e, 'email', 'user')}}/>
                    <Input l={12} s={12} labelClassName={active} validate={true} error={errorMob} type="tel" name="celular" id="last_name" label="Celular:" onChange={(e) => {this.handleInputChange(e, 'mobile', 'user')}}/>
                    <Col s={12} m={12} l={12}><a className="waves-effect waves-light blue-btn btn avenir-regular right" onClick={this.apiNewUser.bind(this)}>Registrar asistente</a></Col>
                  </Row>
              </div>
            </div>
            
            <Row>
              <Col s={12} m={12} l={12}><h3>Reporte</h3></Col>
              <Col s={12} m={12} l={12}><h5><b>Curso:</b> {this.props.location.state.course_name}</h5></Col>
              <Input style={{cursor: "not-allowed"}} l={12} s={12} labelClassName={active} validate={true} error={errorDate} id="fechaRepo" label="Fecha del curso:" name='on' type='text' disabled/>

              <Col l={12} s={12}>
                <p>Asistentes:</p>
                {errorUserList}
              </Col>

              <Row>
                {attendance}
              </Row>
              
              <Input l={12} s={12} validate={true} error={errorDona} type="text" label="Donación:" labelClassName="active" placeholder="Por ejemplo: 100.50" onChange={(e) => {this.handleInputChange(e, 'donation')}}/>
              <Input l={12} s={12} validate={true} error={errorTithe} type="text" label="Diezmo" labelClassName="active" placeholder="Por ejemplo: 20.00" onChange={(e) => {this.handleInputChange(e, 'tithe')}}/>
            </Row>
            <a className="waves-effect waves-light blue-btn btn avenir-regular" onClick={this.apiReporte.bind(this)}>Generar reporte</a>
          </Col>
        </Row>
      </section>
    );
  }
}

export default Reports;
