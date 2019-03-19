import React from 'react';
import { Row, Input, Col, Modal, Button } from 'react-materialize';
import update from 'immutability-helper';
import  { Redirect } from 'react-router-dom';
import {GoogleApiWrapper} from 'google-maps-react';
import moment from 'moment';

const format = 'h:mm a';
const now = moment();

var api = require('../utils/api');

const __GAPI_KEY__ = 'AIzaSyBjPqgfje7_Dg_qlZ9eiie7zLpw-9JN0SA';

export class Minutes extends React.Component{
  
  render(){
    var min = "";
    var minutes = [];

    for(var i=0; i<60; i++){
      if(i<10)
        min = "0" + i;
      else
        min = i.toString();
      minutes.push(<option value={":" + min}>{min}</option>);
    }

    return (
      <Input className="avenir-regular" s={4} labelClassName={'avenir-regular input-label-text'} type='select' label="Minutos" onChange = {this.props.onChange}>
        <option className="avenir-ultralight-italic input-label-text" key='nada' value="nada">Minutos</option>
        {minutes}
      </Input>
    );
  }
  
}

export class RegisterGroups extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isRegistered: false,
      hasErrors: false,
      inputValue: {
        "id_leader": 0,
        "day": "",
        "start_day": "",
        "start_time": "",
        "start_time_h": "",
        "start_time_m": "",
        "ampm": "",
        "end_time": "",
        "end_time_h": "",
        "end_time_m": "",
        "ampmE": "",
        "attendance_type": "",
        "course_name": "",
        "description": "",
        "street": "",
        "street_num": "",
        "interior_num": "",
        "latitude": "19.432049",
        "longitude": "-99.132374",
        "neighborhood": "",
        "municipality": "",
        "state": "",
        "pc": "",
        "phone": ""
      }
    };
  }

  componentDidMount() {
    window.$('#dateIni').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 100,
      closeOnSelect: false,  // Close upon selecting a date,

      min: new Date(1900, 1, 1),
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

      onSet: this.handleDateChange.bind(this)
    });

    window.$(document).ready(function(){
      // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
      window.$('.modal').modal();
    });

    this.setState({
      inputValue: update(this.state.inputValue, {
        id_leader: {$set: this.props.id_leader}
      })
    });
  }

  handleDateChange(e){
    this.handleInputChange(e, 'start_day', 'datepicker')
  }

  handleInputChange(e, val, type) {
    if(e.select || type === 'datepicker'){
      this.setState({
        inputValue: update(this.state.inputValue, {[val]: {$set: this.pgFormatDate(e.select)}})
      });
    }
    else if (type === 'timepicker'){
      this.setState({
        inputValue: update(this.state.inputValue, {[val]: {$set: this.pgFormatTime(e.target.value)}})
      });
    }
    else
      if(e.target.type === 'checkbox' || e.target.type === 'radio'){
        var valu;
        if(e.target.checked)
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

  pgFormatTime(time){
    var format = '';
    var split = time.split(':');
    var time_h = Number(split[0]);
    var time_m = '';

    var spaceless;
    if(split[1]){
      spaceless = split[1].replace(' ', '');
      split[1] = spaceless;
    }

    if (time.includes('12:')){
      if(time.includes('am') || time.includes('AM')){
        if(time.includes('AM'))
          time_m = split[1].replace('AM', '');
        else
          time_m = split[1].replace('am', '');
      }
      else{
        if(time.includes('PM') || time.includes('pm'))
          time_m = split[1].replace('PM', '');
        else
          time_m = split[1].replace('pm', '');
      }
      time_h = time_h - 12;
    }
    if(time.includes('PM') || time.includes('pm')){
      if(time.includes('PM'))
        time_m = split[1].replace('PM', '');
      else
        time_m = split[1].replace('pm', '');
      time_h = time_h + 12;
    }
    else{
      if(time.includes('AM') || time.includes('am'))
        if(time.includes('AM'))
          time_m = split[1].replace('AM', '');
        else
          time_m = split[1].replace('am', '');
      if(time_h.toString().length < 2)
        time_h = '0' + time_h.toString();
    } 
    format = [time_h, time_m].join(':');

    return format;
  }

  geocode = (google) => {
    var geocoder = new google.maps.Geocoder();

    var str = this.state.inputValue.street
    var neigh = this.state.inputValue.neighborhood
    // var mun = this.state.inputValue.municipality
    var num_str = this.state.inputValue.street_num
    var pc = this.state.inputValue.pc
    var state = this.state.inputValue.state

    var address = str + ' ' + num_str + ', '+ neigh + ', ' + pc + ' ' + state;

    geocoder.geocode( { 'address': address}, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          this.setState({
            inputValue: update(this.state.inputValue, {
              latitude: {$set: results[0].geometry.location.lat()},
              longitude: {$set: results[0].geometry.location.lng()} 
            })
          });
        } 
        else {
          console.log("Geocode was not successful for the following reason: " + status);
        }
    });
  }

  onChangeTime(value) {
    console.log(now)
    console.log(this.pgFormatTime(value.format(format)));
  }

  spaceReplaceMap(string){
    return string.replace(' ', '%20')
  }

  apiRegistro(){
    var info = this.state.inputValue;
    var isStateEmpty = !this.state.inputValue.day ||
      !this.state.inputValue.start_day ||
      !this.state.inputValue.start_time ||
      !this.state.inputValue.end_time ||
      !this.state.inputValue.attendance_type ||
      !this.state.inputValue.house_type ||
      !this.state.inputValue.course_name ||
      !this.state.inputValue.description ||
      !this.state.inputValue.street ||
      !this.state.inputValue.street_num ||
      !this.state.inputValue.latitude ||
      !this.state.inputValue.longitude ||
      !this.state.inputValue.neighborhood ||
      !this.state.inputValue.municipality ||
      !this.state.inputValue.state ||
      !this.state.inputValue.pc ||
      !this.state.inputValue.phone;

    if(!isStateEmpty){
      api.leaderCourseRegister(info).then((data) => {
        this.setState({
          isRegistered: true,
        });
      });
    }
    else {
      alert('Faltan campos por llenar');
      this.setState({
        hasErrors: true
      });
    }    
  }

  openStart() { 
    window.$('#myModal1').modal('open'); 
  } 

  openEnd() { 
    window.$('#myModal2').modal('open'); 
  } 

  setStartHour = () => {
    this.setState({
      inputValue: update(this.state.inputValue, {
        start_time: {$set: this.pgFormatTime(this.state.inputValue.start_time_h + this.state.inputValue.start_time_m + this.state.inputValue.ampm)}
      })
    })
  }

  setEndHour = () => {
    this.setState({
      inputValue: update(this.state.inputValue, {
        end_time: {$set: this.pgFormatTime(this.state.inputValue.end_time_h + this.state.inputValue.end_time_m + this.state.inputValue.ampmE)}
      })
    })
  }

  setValHour() {
    if(this.state.inputValue.start_time_h +this.state.inputValue.start_time_m + this.state.inputValue.ampm === "")
      return ""
    else
      return 
  }

  render() {
    if (this.state.isRegistered === true)
      return <Redirect to='./groups' />;
    if(this.state.hasErrors){
      var error = 'Este campo es obligatorio';

      if(!this.state.inputValue.day) var errorDay = error;
      if(!this.state.inputValue.start_day) var errorStDay = error;
      if(!this.state.inputValue.attendance_type) var errorAtt = error;
      if(!this.state.inputValue.house_type) var errorHT = error;
      if(!this.state.inputValue.course_name) var errorCN = error;
      if(!this.state.inputValue.description) var errorDescr = error;
      if(!this.state.inputValue.street) var errorStr = error;
      if(!this.state.inputValue.street_num) var errorStrNum = error;
      if(!this.state.inputValue.neighborhood) var errorNei = error;
      if(!this.state.inputValue.municipality) var errorMun = error;
      if(!this.state.inputValue.state) var errorSta = error;
      if(!this.state.inputValue.pc) var errorPC = error;
      if(!this.state.inputValue.phone) var errorPhone = error;


      var active='active';
    }
    if(this.state.inputValue.start_time_h !== "" || this.state.inputValue.start_time_m !== "" || this.state.inputValue.ampm !== "")
      var activeT='active';
    if(this.state.inputValue.end_time_h !== "" || this.state.inputValue.end_time_m !== "" || this.state.inputValue.ampmE !== "")
      var activeE='active';

    var str = this.spaceReplaceMap(this.state.inputValue.street)
    var neigh = this.spaceReplaceMap(this.state.inputValue.neighborhood)
    var mun = this.spaceReplaceMap(this.state.inputValue.municipality)
    var num_str = this.state.inputValue.street_num
    var pc = this.state.inputValue.pc
    var state = this.state.inputValue.state

    var map = "https://www.google.com/maps/embed/v1/search?q=" + str + "%20" + num_str + "%20" + neigh + "%20" + mun + "%20" + pc + "%20" + state +"&key=AIzaSyDE1ClcNrmXPnRk1nIhCaIzZKQ_3lSQCRU";

    if(this.state.inputValue.street && this.state.inputValue.street_num && this.state.inputValue.neighborhood && this.state.inputValue.municipality && this.state.inputValue.state && this.state.inputValue.pc){
      this.geocode(window.google);
      var nota = <div className="card-panel light-blue lighten-1 center-align">
        <span className="grey-text text-lighten-4">Si la dirección del mapa es incorrecta, verifique los datos ingresados</span>
      </div> 
    }

    return (
      <section>    
          <Modal className="modalHora" id='myModal1' header='' actions={
            <div>
              <Button flat modal="close" onClick={this.setStartHour.bind(this)} className="confirmarHora" waves="light">CONFIRMAR</Button>
              <Button flat modal="close" className="red-text waves-red" waves="light">CERRAR</Button>
            </div>
          }>
            <Row className="back-blue no-margin">
              <Col s={12} m={12} l={4}>
                <Row className="back-blue no-margin pad-hora">
                  <Col offset={"s4 m4 l3"} s={8} m={8} l={9}>
                    <span className="avenir-medium registro-grupo-tit white-text ">{this.state.inputValue.start_time_h +this.state.inputValue.start_time_m + this.state.inputValue.ampm}</span>
                  </Col>
                </Row>
              </Col>
              <Col s={12} m={12} l={8} className="back-grey">
                <Input className="avenir-regular" s={4} labelClassName={'avenir-regular input-label-text'} type='select' label="Hora" onChange = {(e) => this.handleInputChange(e, 'start_time_h')}>
                  <option className="avenir-ultralight-italic input-label-text" key='nada' value="nada">Hora</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </Input>
                <Minutes onChange = {(e) => this.handleInputChange(e, 'start_time_m')}/>
                <Input className="avenir-regular" s={4} labelClassName={'avenir-regular input-label-text'} type='select' label="AM o PM" onChange = {(e) => this.handleInputChange(e, 'ampm')}>
                  <option className="avenir-ultralight-italic input-label-text" key='nada' value="nada">AM o PM</option>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </Input>
                    {/* <TimePicker
                      id="hora"
                      placeholder="Hora"
                      showSecond={false}
                      defaultValue={now}
                      className="cien_width active"
                      onChange={(value) => this.onChangeTime(value)}
                      format={format}
                      use12Hours
                      inputReadOnly
                    /> */}
                    {/* <label for="hora">First Name</label> */}
                  
              </Col>
            </Row>
          </Modal>
          <Modal id='myModal2' className="modalHora" header='' actions={
            <div>
              <Button flat modal="close" onClick={this.setEndHour.bind(this)} className="confirmarHora" waves="light">CONFIRMAR</Button>
              <Button flat modal="close" className="red-text waves-red" waves="light">CERRAR</Button>
            </div>
          }>
            <Row className="back-blue no-margin">
              <Col s={12} m={12} l={4}>
                <Row className="back-blue no-margin pad-hora">
                  <Col offset={"s4 m4 l3"} s={8} m={8} l={9}>
                    <span className="avenir-medium registro-grupo-tit white-text ">{this.state.inputValue.end_time_h +this.state.inputValue.end_time_m + this.state.inputValue.ampmE}</span>
                  </Col>
                </Row>
              </Col>
              <Col s={12} m={12} l={8} className="back-grey">
                <Input className="avenir-regular" s={4} labelClassName={'avenir-regular input-label-text'} type='select' label="Hora" onChange = {(e) => this.handleInputChange(e, 'end_time_h')}>
                  <option className="avenir-ultralight-italic input-label-text" key='nada' value="nada">Hora</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </Input>
                <Minutes onChange = {(e) => this.handleInputChange(e, 'end_time_m')}/>
                <Input className="avenir-regular" s={4} labelClassName={'avenir-regular input-label-text'} type='select' label="AM o PM" onChange = {(e) => this.handleInputChange(e, 'ampmE')}>
                  <option className="avenir-ultralight-italic input-label-text" key='nada' value="nada">AM o PM</option>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </Input>
                    {/* <TimePicker
                      id="hora"
                      placeholder="Hora"
                      showSecond={false}
                      defaultValue={now}
                      className="cien_width active"
                      onChange={(value) => this.onChangeTime(value)}
                      format={format}
                      use12Hours
                      inputReadOnly
                    /> */}
                    {/* <label for="hora">First Name</label> */}
                  
              </Col>
            </Row>
          </Modal>       
         <Row className="back-blue no-margin">
          <Col s={1} m={1} l={1}></Col>
          <Col s={11} m={11} l={11} className="back-grey">
            <Row>
              <Col s={12}><span className="avenir-medium registro-grupo-tit">Registra un grupo nuevo</span></Col>
              <Input className="avenir-regular" s={12} labelClassName={'avenir-regular input-label-text ' + active} validate={true} error={errorCN} type="text" label="Nombre del curso" onChange = {(e) => this.handleInputChange(e, 'course_name')}/>
              <Input className="avenir-regular" s={12} labelClassName={'avenir-regular input-label-text ' + active} validate={true} error={errorDescr} type="textarea" label="Descripción del curso" onChange = {(e) => this.handleInputChange(e, 'description')}/>
              
              <Input className="avenir-regular" s={12} labelClassName={'avenir-regular input-label-text ' + active} error={errorDay} type='select' label="Día en que se imparte" onChange = {(e) => this.handleInputChange(e, 'day')}>
                <option className="avenir-ultralight" key='nada' value="nada">Seleccione un día de la semana</option>
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
              </Input>

              {/* <Input className="avenir-regular" s={12} labelClassName={'avenir-regular input-label-text ' + active} validate={true} error={errorStTime} className="timepicker" label="Hora inicio" name='on' type='time' onChange = {(e) => this.handleInputChange(e, 'start_time', 'timepicker')} />
              <Input className="avenir-regular" s={12} labelClassName={'avenir-regular input-label-text ' + active} validate={true} error={errorEndTime} className="timepicker" label="Hora final" name='on' type='time' onChange = {(e) => this.handleInputChange(e, 'end_time', 'timepicker')}  />
               */}
              <Input 
                onFocus={this.openStart} 
                value={this.state.inputValue.start_time_h + this.state.inputValue.start_time_m + this.state.inputValue.ampm} 
                className="avenir-regular" 
                s={12} 
                labelClassName={'avenir-regular input-label-text ' + activeT} 
                validate={true} error={errorCN} 
                type="text" 
                label="Hora de inicio" 
                onChange = {(e) => this.handleInputChange(e, 'start_time')}
              />

              <Input 
                onFocus={this.openEnd} 
                value={this.state.inputValue.end_time_h + this.state.inputValue.end_time_m + this.state.inputValue.ampmE} 
                className="avenir-regular" 
                s={12} 
                labelClassName={'avenir-regular input-label-text ' + activeE} 
                validate={true} error={errorCN} 
                type="text" 
                label="Hora final" 
                onChange = {(e) => this.handleInputChange(e, 'end_time')}
              />
              
              <Input className="avenir-regular" s={12} labelClassName={'avenir-regular input-label-text ' + active} validate={true} error={errorStDay} id="dateIni" label="Fecha de inicio" name='on' type='text' />
              <Input className="avenir-regular" s={12} labelClassName={'avenir-regular input-label-text ' + active} validate={true} error={errorPhone} type="tel" label="Teléfono" onChange = {(e) => this.handleInputChange(e, 'phone')}/>
              
              <Input className="avenir-regular" s={12} labelClassName={'avenir-regular input-label-text ' + active} error={errorHT} type='select' label="Tipo de casa" id="tipo_casa" onChange = {(e) => this.handleInputChange(e, 'house_type')}>
                <option key='nada' value="nada">Seleccione un tipo de casa</option>
                <option value="Estudio bíblico">Estudio bíblico</option>
                <option value="Discipulado">Discipulado</option>
              </Input>

               <Input className="avenir-regular" s={12} labelClassName={'avenir-regular input-label-text ' + active} error={errorAtt} type='select' label="Tipo de público" onChange = {(e) => this.handleInputChange(e, 'attendance_type')}>
                <option className="avenir-ultralight-italic input-label-text" key='nada' value="nada">Seleccione un tipo de público</option>
                <option value="Mujeres" >Mujeres</option>
                <option value="Hombres" >Hombres</option>
                <option value="Matrimonios" >Matrimonios</option>
                <option value="Mixto" >Mixto</option>
                <option value="Jóvenes" >Jóvenes</option>
                <option value="Niños" >Niños</option>
                <option value="Adultos mayores" >Adultos mayores</option>
              </Input>

              <Col s={12}><span className="avenir-medium direcc-registro-grupo">Dirección donde se imparte el curso</span></Col>
              <Input className="avenir-regular" s={12} labelClassName={'avenir-regular input-label-text ' + active} validate={true} error={errorStr} type="text" label="Calle" onChange = {(e) => this.handleInputChange(e, 'street')}/>
              <Input className="avenir-regular" s={12} labelClassName={'avenir-regular input-label-text ' + active} validate={true} error={errorStrNum} type="text" label="Número exterior" onChange = {(e) => this.handleInputChange(e, 'street_num')}/>
              <Input className="avenir-regular" s={12} labelClassName={'avenir-regular input-label-text'} type="text" label="Número interior" onChange = {(e) => this.handleInputChange(e, 'interior_num')}/>
              <Input className="avenir-regular" s={12} labelClassName={'avenir-regular input-label-text ' + active} validate={true} error={errorNei} type="text" label="Colonia" onChange = {(e) => this.handleInputChange(e, 'neighborhood')}/>
              <Input className="avenir-regular" s={12} labelClassName={'avenir-regular input-label-text ' + active} validate={true} error={errorMun} type="text" label="Delegación/Municipio" onChange = {(e) => this.handleInputChange(e, 'municipality')}/>
              <Input className="avenir-regular" s={12} labelClassName={'avenir-regular input-label-text ' + active} validate={true} error={errorSta} type="text" label="Estado" onChange = {(e) => this.handleInputChange(e, 'state')}/>
              <Input className="avenir-regular" s={12} labelClassName={'avenir-regular input-label-text ' + active} validate={true} error={errorPC} type="text" label="Código postal" onChange = {(e) => this.handleInputChange(e, 'pc')}/>
              <Col l={12} s={12}>
                <div className="center-align">
                  <iframe id="iframe_id" title = "Google Maps" src={map} allowFullScreen width={"100%"} height={"300vh"} style={{flex: 1, border: 0}} frameBorder={0} />
                </div>
                {nota}
              </Col>
            </Row>
            <Col l={12} s={12} className="center-align">
              <a className="waves-effect waves-light blue-btn btn avenir-regular center-align" onClick={this.apiRegistro.bind(this)}>Registrar</a>
            </Col>
          </Col>
        </Row>
      </section>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: __GAPI_KEY__
})(RegisterGroups)
