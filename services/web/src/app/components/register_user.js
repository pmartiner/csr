import React from 'react';
import 'materialize-css/dist/js/materialize.min.js';
import 'materialize-css/dist/css/materialize.min.css';
import { Row, Input, Col, Button } from 'react-materialize';
import update from 'immutability-helper';

import {GoogleApiWrapper} from 'google-maps-react';
const __GAPI_KEY__ = 'AIzaSyBjPqgfje7_Dg_qlZ9eiie7zLpw-9JN0SA';

var api = require('../utils/api');

export class RegisterUser extends React.Component {
  constructor(props) {
    super(props);
   
    this.state = {
      hasErrors: false,
      emExists: false,
      mobExists: false,
      success: false,
      courseInfo: {
        course_name: '',
        street: '',
        street_num: '',
        neighborhood: '',
        pc: '',
        municipality: '',
        state: '',
        phone: '',
        start_day: '',
        day: '',
        start_time: '',
        end_time: '',
        attendance_type: ''
      },
      inputValue: {
        name: '',
        surname_f: '',
        surname_m: '',
        email: '',
        pw: '',
        mobile: '',
        id_father: '',
        id_course: '',
        leader: false
      }
    };
  }


  componentDidMount() {
    this.setState({
      inputValue: update(this.state.inputValue, {
        id_course: {$set: this.getIdCourse(window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search)}
      })
    }, () => {
      api.courseInfo(this.state.inputValue.id_course).then((data) => {
        this.setState({
          courseInfo: update(this.state.courseInfo, {
            course_name: {$set: data.course_name},
            street: {$set: data.street},
            street_num: {$set: data.street_num},
            neighborhood: {$set: data.neighborhood},
            pc: {$set: data.pc},
            municipality: {$set: data.municipality},
            state: {$set: data.state},
            phone: {$set: data.phone},
            start_day: {$set: data.start_day},
            day: {$set: data.day},
            start_time: {$set: data.start_time},
            end_time: {$set: data.end_time},
            attendance_type: {$set: data.attendance_type},
          })
        });
      });
      
    });
  }

  handleDateChangeBirth(e){
    this.handleInputChange(e, 'birthdate', 'datepicker')
  }

  handleDateChangeFirst(e){
    this.handleInputChange(e, 'first_encounter_date', 'datepicker')
  }

  handleDateChangeConv(e){
    this.handleInputChange(e, 'conversion_date', 'datepicker')
  }

  handleInputChange(e, val, type) {
    if(e.select || type === 'datepicker'){
      console.log(e.select)
      this.setState({
        inputValue: update(this.state.inputValue, {[val]: {$set: this.pgFormatDate(e.select)}})
      });
    }
    else{
      var valu;

      if(e.target.type === 'checkbox'){
        if(e.target.checked)
          valu = true;
        else
          valu = false;
        this.setState({
          inputValue: update(this.state.inputValue, {[val]: {$set: valu}})
        });
      }

      else if(e.target.type === 'radio'){
        if(e.target.value === '1')
          valu = true;
        else
          valu = false;
        this.setState({
          inputValue: update(this.state.inputValue, {[val]: {$set: valu}})
        });
      }

      else{
        this.setState({
          inputValue: update(this.state.inputValue, {[val]: {$set: e.target.value}})
        });
      }
    }
      
  }

  spaceReplaceMap(string){
    return string.replace(' ', '%20')
  }

  getIdCourse = (url_string) => {
    var url = new URL(url_string);
    var c = url.searchParams.get("course");
    
    return c;
  }

  apiRegistro(){
    var info = this.state.inputValue;
    var isStateEmpty = !this.state.inputValue.name ||
      !this.state.inputValue.surname_f ||
      !this.state.inputValue.surname_m ||
      !this.state.inputValue.email ||
      !this.state.inputValue.pw ||
      !this.state.inputValue.mobile;

    console.log(isStateEmpty);
   
    if(!isStateEmpty){
      api.userExists({
        email: this.state.inputValue.email,
        mobile: this.state.inputValue.mobile
      })
      .then((response) => {
        console.log("ACÁAAA")
        console.log(response)
        if(response.mobile){
          alert('Ya existe el teléfono celular que ingresaste');
          this.setState({
            mobExists: true,
            hasErrors: true
          });
        }
        if(response.email){
          alert('Ya existe el email que ingresaste');
          this.setState({
            emExists: true,
            hasErrors: true
          });
        }
        else if(!response.mobile && !response.email){
          console.log(info)
          api.userCourseRegistry(info)
            .then(() => {
              this.setState({
                success: true
              })
            });
        }
      })
    }
    else {
      alert('Faltan campos por llenar');
      this.setState({
        hasErrors: true
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
    return [parsed.getUTCFullYear(), zeroPad(parsed.getMonth() + 1), zeroPad(parsed.getDate())].join("-");
  }

  getDayFormat = () => {
    var date = this.state.courseInfo.start_day;
    var dateFormat = date.split("T")[0]
    var dateRes = "";

    if(dateFormat.substring(5,7) === "01"){
      dateRes = dateFormat.substring(8,10) + " enero, " + dateFormat.substring(0,4)
    }
    else if(dateFormat.substring(5,7) === "02"){
      dateRes = dateFormat.substring(8,10) + " febrero, " + dateFormat.substring(0,4)
    }
    else if(dateFormat.substring(5,7) === "03"){
      dateRes = dateFormat.substring(8,10) + " marzo, " + dateFormat.substring(0,4)
    }
    else if(dateFormat.substring(5,7) === "04"){
      dateRes = dateFormat.substring(8,10) + " abril, " + dateFormat.substring(0,4)
    }
    else if(dateFormat.substring(5,7) === "05"){
      dateRes = dateFormat.substring(8,10) + " mayo, " + dateFormat.substring(0,4)
    }
    else if(dateFormat.substring(5,7) === "06"){
      dateRes = dateFormat.substring(8,10) + " junio, " + dateFormat.substring(0,4)
    }
    else if(dateFormat.substring(5,7) === "07"){
      dateRes = dateFormat.substring(8,10) + " julio, " + dateFormat.substring(0,4)
    }
    else if(dateFormat.substring(5,7) === "08"){
      dateRes = dateFormat.substring(8,10) + " agosto, " + dateFormat.substring(0,4)
    }
    else if(dateFormat.substring(5,7) === "09"){
      dateRes = dateFormat.substring(8,10) + " septiembre, " + dateFormat.substring(0,4)
    }
    else if(dateFormat.substring(5,7) === "10"){
      dateRes = dateFormat.substring(8,10) + " octubre, " + dateFormat.substring(0,4)
    }
    else if(dateFormat.substring(5,7) === "11"){
      dateRes = dateFormat.substring(8,10) + " noviembre, " + dateFormat.substring(0,4)
    }
    else{
      dateRes = dateFormat.substring(8,10) + " diciembre, " + dateFormat.substring(0,4)
    }
    
    return dateRes;
  }

  
  render() {
    if(this.state.hasErrors){
      var error = 'Este campo es obligatorio';
      var errorEm = '';
      var errorMob = '';

      if(!this.state.inputValue.name) var errorName = error;
      if(!this.state.inputValue.surname_f) var errorSurF = error;
      if(!this.state.inputValue.surname_m) var errorSurM = error;
      if(!this.state.inputValue.email) errorEm = error;
      if(this.state.emExists) errorEm = "Este correo ya está registrado";
      if(!this.state.inputValue.pw) var errorPw = error;
      if(!this.state.inputValue.mobile) errorMob = error;
      if(this.state.mobExists) errorMob = "Este teléfono ya está registrado";

      var active='active';
    }

    var map = 
      "https://www.google.com/maps/embed/v1/search?q=" + 
      this.state.courseInfo.street + "%20" + 
      this.state.courseInfo.street_num + "%20" + 
      this.state.courseInfo.neighborhood + "%20" + 
      this.state.courseInfo.municipality + "%20" + 
      this.state.courseInfo.pc + "%20" + 
      this.state.courseInfo.state +"&key=AIzaSyDE1ClcNrmXPnRk1nIhCaIzZKQ_3lSQCRU";

    if(!this.state.success)
      return (
        <section className="register">
          <Row className="back-blue no-margin">
            <Col s={1} m={1} l={1}></Col>
            <Col s={11} m={11} l={11} className="back-grey">
              <Row>
                <Col s={12} m={12} l={12}><h3>Registro de usuario a un curso</h3></Col>
                <Col s={12} m={12} l={12}>
                  <b>Curso: </b>{this.state.courseInfo.course_name}
                  <ul>
                    <li><b>Dirección: </b>{this.state.courseInfo.street} {this.state.courseInfo.street_num}, {this.state.courseInfo.neighborhood}, C.P: {this.state.courseInfo.pc}, {this.state.courseInfo.municipality}, {this.state.courseInfo.state}</li>
                    <li><b>Teléfono: </b>{this.state.courseInfo.phone}</li>
                    <li><b>Fecha de inicio: </b>{this.getDayFormat()}</li>
                    <li><b>Día del curso: </b>{this.state.courseInfo.day}</li>
                    <li><b>Horario: </b>{this.state.courseInfo.start_time} - {this.state.courseInfo.end_time}</li>
                    <li><b>Tipo de audiencia: </b> {this.state.courseInfo.attendance_type}</li>
                  </ul>
                </Col>
                <Col s={12} m={12} l={12}><h5>Sobre ti</h5></Col>
                <Input s={12} labelClassName={active} validate={true} error={errorName} label="Nombre" type="text" onChange = {(e) => this.handleInputChange(e, 'name')}/>
                <Input s={12} labelClassName={active} validate={true} error={errorSurF} label="Apellido paterno" type="text"  onChange = {(e) => this.handleInputChange(e, 'surname_f')}/>
                <Input s={12} labelClassName={active} validate={true} error={errorSurM} label="Apellido materno" type="text"  onChange = {(e) => this.handleInputChange(e, 'surname_m')}/>
              
                <Col s={12}><h5>Datos de contacto</h5></Col>
                  
                <Input s={12} labelClassName={active} validate={true} error={errorEm} type="email" label="Email" onChange={(e) => {this.handleInputChange(e, 'email')}}/>
                <Input s={12} labelClassName={active} validate={true} error={errorPw} type="password" label="Contraseña" onChange={(e) => {this.handleInputChange(e, 'pw')}}/>
                <Input s={12} labelClassName={active} validate={true} error={errorMob} type="tel" label="Celular" onChange={(e) => {this.handleInputChange(e, 'mobile')}}/>

                <Col s={12}><h5>Código de registro</h5></Col>
                  
                <Input s={12} disabled={true} labelClassName={active} validate={true} type="text" value={this.state.inputValue.id_course} label="Código de registro proporcionado por el líder" onChange={(e) => {this.handleInputChange(e, 'id_father')}}/>
              </Row>
              <Col l={12} s={12} className="center-align">
                <Button waves='light' className="blue-btn avenir-regular" node='a' onClick={this.apiRegistro.bind(this)}>Registrarse</Button>
              </Col>
            </Col>
          </Row>
        </section>
      );
    else
      return (
        <Row className="back-blue no-margin">
            <Col s={1} m={1} l={1}></Col>
            <Col s={11} m={11} l={11} className="back-grey">
              <Row>
                <Col s={12} m={12} l={12}>
                  <h3>Registro exitoso</h3>
                </Col>
                <Col s={12} m={12} l={12}>
                  <h4>Curso: {this.state.courseInfo.course_name}</h4>
                  <ul>
                    <li><b>Dirección: </b>{this.state.courseInfo.street} {this.state.courseInfo.street_num}, {this.state.courseInfo.neighborhood}, C.P: {this.state.courseInfo.pc}, {this.state.courseInfo.municipality}, {this.state.courseInfo.state}</li>
                    <li><b>Teléfono: </b>{this.state.courseInfo.phone}</li>
                    <li><b>Fecha de inicio: </b>{this.getDayFormat()}</li>
                    <li><b>Día del curso: </b>{this.state.courseInfo.day}</li>
                    <li><b>Horario: </b>{this.state.courseInfo.start_time} - {this.state.courseInfo.end_time}</li>
                    <li><b>Tipo de audiencia: </b> {this.state.courseInfo.attendance_type}</li>
                  </ul>
                  <Col l={12} s={12}>
                    <div className="center-align">
                      <iframe id="iframe_id" title="Google Maps" src={map} allowFullScreen width={"100%"} height={"300vh"} style={{border: 0, flex: 1}} frameBorder={0} />
                    </div>
                  </Col>
                </Col>
              </Row>
            </Col>
          </Row>
      );
  }
}

export default GoogleApiWrapper({
  apiKey: __GAPI_KEY__
})(RegisterUser)

