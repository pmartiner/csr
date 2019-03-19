import React from 'react';
import 'materialize-css/dist/js/materialize.min.js';
import 'materialize-css/dist/css/materialize.min.css';
import { Row, Input, Col, Button } from 'react-materialize';
import update from 'immutability-helper';
import {GoogleApiWrapper} from 'google-maps-react';

var api = require('../utils/api');
const __GAPI_KEY__ = 'AIzaSyBjPqgfje7_Dg_qlZ9eiie7zLpw-9JN0SA';

export class Register extends React.Component {
  constructor(props) {
    super(props);
   
    this.state = {
      hasErrors: false,
      emExists: false,
      mobExists: false,
      inputValue: {
        name: '',
        surname_f: '',
        surname_m: '',
        birthdate: '',
        marital_status: '',
        academic_degree: '',
        headquarters: '',
        network: '',
        house_type: '',
        conversion_date: '',
        first_encounter_date: '',
        email: '',
        pw: '',
        mobile: '',
        street: '',
        street_num: '',
        neighborhood: '',
        municipality: '',
        state: '',
        pc: '',
        interested_people: false,
        notif_family: false,
        notif_kids: false,
        notif_parents_school: false,
        notif_marriage: false,
        notif_youth: false,
        notif_teens: false,
        notif_entrepreneurship: false,
        notif_reach: false,
        notif_praise: false,
        notif_againt_slave_traffic: false,
        notif_good_news: false,
        notif_prayer: false,
        notif_older_adults: false,
        leader: true
      }
    };
  }

  componentDidMount() {
    window.$('#birthdate').pickadate({
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
      
      onSet: this.handleDateChangeBirth.bind(this)
    });

    window.$('#first_encounter_date').pickadate({
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
      
      onSet: this.handleDateChangeFirst.bind(this)
    });

    window.$('#conversion_date').pickadate({
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
      
      onSet: this.handleDateChangeConv.bind(this)
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
    else {
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

  apiRegistro(){
    var info = this.state.inputValue;
    var isStateEmpty = !this.state.inputValue.name ||
      !this.state.inputValue.surname_f ||
      !this.state.inputValue.surname_m ||
      !this.state.inputValue.birthdate ||
      !this.state.inputValue.marital_status ||
      !this.state.inputValue.academic_degree ||
      !this.state.inputValue.headquarters ||
      !this.state.inputValue.network ||
      !this.state.inputValue.house_type ||
      !this.state.inputValue.conversion_date ||
      !this.state.inputValue.first_encounter_date ||
      !this.state.inputValue.email ||
      !this.state.inputValue.pw ||
      !this.state.inputValue.mobile ||
      !this.state.inputValue.street ||
      !this.state.inputValue.street_num ||
      !this.state.inputValue.neighborhood ||
      !this.state.inputValue.municipality ||
      !this.state.inputValue.state ||
      !this.state.inputValue.pc;

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
          api.leaderRegister(info);
          window.location.replace('./login');
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

  

  render() {
    if(this.state.hasErrors){
      var error = "Este campo es obligatorio";
      var errorEm = "";
      var errorMob = "";

      if(!this.state.inputValue.name) var errorName = error;
      if(!this.state.inputValue.surname_f) var errorSurF = error;
      if(!this.state.inputValue.surname_m) var errorSurM = error;
      if(!this.state.inputValue.birthdate) var errorBir = error;
      if(!this.state.inputValue.marital_status) var errorMar = error;
      if(!this.state.inputValue.academic_degree) var errorAc = error;
      if(!this.state.inputValue.headquarters) var errorHQ = error;
      if(!this.state.inputValue.network) var errorNet = error;
      if(!this.state.inputValue.house_type) var errorHT = error;
      if(!this.state.inputValue.conversion_date) var errorConv = error;
      if(!this.state.inputValue.first_encounter_date) var errorFirst = error;
      if(!this.state.inputValue.email) errorEm = error;
      if(this.state.emExists) errorEm = "Este correo ya está registrado";
      if(!this.state.inputValue.pw) var errorPw = error;
      if(!this.state.inputValue.mobile) errorMob = error;
      if(this.state.mobExists) errorMob = "Este teléfono ya está registrado";
      if(!this.state.inputValue.street) var errorStr = error;
      if(!this.state.inputValue.street_num) var errorStrN = error;
      if(!this.state.inputValue.neighborhood) var errorNei = error;
      if(!this.state.inputValue.municipality) var errorMun = error;
      if(!this.state.inputValue.state) var errorSta = error;
      if(!this.state.inputValue.pc) var errorPC = error;

      var active='active';
    }

    // if(this.state.inputValue.house_type === 'Estudio bíblico'){
    //   var question = [
    //     <p>¿Te gustaría que te enviemos los datos de personas interesadas en asistir a un grupo de estudio bíblico en esta zona?</p>,
    //     <Row>
    //       <Input className="rblue-csr" name='group1' type='radio' value='1' label='Sí' onChange={(e) => {this.handleInputChange(e, 'interested_people')}}/>
    //       <Input className="rblue-csr" name='group1' type='radio' value='0' label='No' onChange={(e) => {this.handleInputChange(e, 'interested_people')}}/>
    //     </Row>
    //   ];
    // }

    var str = this.spaceReplaceMap(this.state.inputValue.street);
    var neigh = this.spaceReplaceMap(this.state.inputValue.neighborhood);
    var mun = this.spaceReplaceMap(this.state.inputValue.municipality);
    var num_str = this.state.inputValue.street_num;
    var pc = this.state.inputValue.pc;
    var state = this.state.inputValue.state;

    var map = "https://www.google.com/maps/embed/v1/search?q=" + str + "%20" + num_str + "%20" + neigh + "%20" + mun + "%20" + pc + "%20" + state +"&key=AIzaSyDE1ClcNrmXPnRk1nIhCaIzZKQ_3lSQCRU";
    
    if(this.state.inputValue.street && this.state.inputValue.street_num && this.state.inputValue.neighborhood && this.state.inputValue.municipality && this.state.inputValue.state && this.state.inputValue.pc){
      var nota = <div className="card-panel blue lighten-1 center-align">
        <span className="grey-text text-lighten-4">Si la dirección del mapa es incorrecta, verifique los datos ingresados</span>
      </div> 
    }

    // const style = {
    //   width: '100vw',
    //   height: '100vh'
    // }

    return (
      <section className="register">
        <Row className="back-blue no-margin">
          <Col s={1} m={1} l={1}></Col>
          <Col s={11} m={11} l={11} className="back-grey">
            <Row>
              <Col s={12} m={12} l={12}><h3>Registro de líder</h3></Col>
              <Col s={12} m={12} l={12}><h5>Sobre ti</h5></Col>
              <Input s={12} labelClassName={active} validate={true} error={errorName} label="Nombre" type="text" onChange = {(e) => this.handleInputChange(e, 'name')}/>
              <Input s={12} labelClassName={active} validate={true} error={errorSurF} label="Apellido paterno" type="text"  onChange = {(e) => this.handleInputChange(e, 'surname_f')}/>
              <Input s={12} labelClassName={active} validate={true} error={errorSurM} label="Apellido materno" type="text"  onChange = {(e) => this.handleInputChange(e, 'surname_m')}/>
              <Input s={12} labelClassName={active} validate={true} error={errorMar} label="Estado civil" type="text"  onChange = {(e) => this.handleInputChange(e, 'marital_status')}/>
              <Input s={12} labelClassName={active} validate={true} error={errorBir} id="birthdate" label="Fecha de nacimiento" type="text" className="datepicker" onChange = {(e) => this.handleInputChange(this.pgFormatDate(e), 'birthdate')} />
              <Input s={12} labelClassName={active} error={errorFirst} id="first_encounter_date" label="Fecha de primer encuentro" type="text" className="datepicker" onChange = {(e) => this.handleInputChange(this.pgFormatDate(e), 'first_encounter_date')}/>
              <Input s={12} labelClassName={active} error={errorConv} id="conversion_date" label="Fecha aproximada de conversión" type="text" className="datepicker" onChange = {(e) => this.handleInputChange(this.pgFormatDate(e), 'conversion_date')}/>
              <Input s={12} labelClassName={active} error={errorAc} type='select' label="Grado academico" onChange = {(e) => this.handleInputChange(e, 'academic_degree')}>
                <option key='nada' value="nada">Seleccione un grado académico</option>
                <option key='primaria' value="Primaria">Primaria</option>
                <option key='secundaria' value="Secundaria">Secundaria</option>
                <option key='preparatoria' value="Preparatoria">Preparatoria</option>
                <option key='licenciatura' value="Licenciatura">Licenciatura</option>
                <option key='posgrado' value="Posgrado">Posgrado</option>
              </Input>
              {/* <Input s={12} labelClassName={active} validate={true} error={errorHQ} label="¿A qué sede asistes?" type="text"  onChange = {(e) => this.handleInputChange(e, 'headquarters')}/> */}
              <Input s={12} labelClassName={active} error={errorHQ} type='select' label="¿A qué sede asistes?" onChange = {(e) => this.handleInputChange(e, 'headquarters')}>
                <option key='nada' value="nada">Seleccione una sede</option>
                <option value="Sur">Sur</option>
                <option value="Oriente">Oriente</option>
                <option value="Norte">Norte</option> 
                <option value="Ajusco">Ajusco</option>
                <option value="Tláhuac">Tláhuac</option>
                <option value="Tecámac">Tecámac</option>
                <option value="Xicalhuacán">Xicalhuacán</option>
                <option value="Cancún">Cancún</option>
                <option value="Cocoyoc">Cocoyoc</option>
                <option value="Playa del Carmen">Playa del Carmen</option>
                <option value="Puente de Ixtla">Puente de Ixtla</option>
                <option value="Querétaro">Querétaro</option>
              </Input>
              <Input s={12} labelClassName={active} error={errorNet} type='select' label="¿A través de qué red ingresaste?" onChange = {(e) => this.handleInputChange(e, 'network')}>
                <option key='nada' value="nada">Seleccione una red</option>
                <option value="Orozco">Orozco</option>
                <option value="Caso">Caso</option>
                <option value="Cantero">Cantero</option>
                <option value="Cervino">Cervino</option>
                <option value="Dergal">Dergal</option>
                <option value="Delgado">Delgado</option>
                <option value="Salgado">Salgado</option>
                <option value="Zezatti">Zezatti</option>
                <option value="Jóvenes">Jóvenes</option>
                <option value="Ajusco">Ajusco</option>
                <option value="Tláhuac">Tláhuac</option>
                <option value="Tecámac">Tecámac</option>
                <option value="Xicalhuacán">Xicalhuacán</option>
                <option value="Cancún">Cancún</option>
                <option value="Cocoyoc">Cocoyoc</option>
                <option value="Playa del Carmen">Playa del Carmen</option>
                <option value="Puente de Ixtla">Puente de Ixtla</option>
                <option value="Querétaro">Querétaro</option>
              </Input>
              <Input s={12} labelClassName={active} error={errorHT} type='select' label="Tipo de casa" id="tipo_casa" onChange={(e) => {this.handleInputChange(e, 'house_type')}}>
                <option key='nada' value="nada">Seleccione un tipo de casa</option>
                <option key='estudio_biblico' value="Estudio bíblico">Estudio bíblico</option>
                <option key='discipulado' value="Discipulado">Discipulado</option>
              </Input>
            
              <Col s={12}><h5>Datos de contacto</h5></Col>
                
              <Input s={12} labelClassName={active} validate={true} error={errorEm} type="email" label="Email" onChange={(e) => {this.handleInputChange(e, 'email')}}/>
              <Input s={12} labelClassName={active} validate={true} error={errorPw} type="password" label="Contraseña" onChange={(e) => {this.handleInputChange(e, 'pw')}}/>
              <Input s={12} labelClassName={active} validate={true} error={errorMob} type="tel" label="Celular" onChange={(e) => {this.handleInputChange(e, 'mobile')}}/>
              <Input s={12} labelClassName={active} validate={true} error={errorStr} type="text" label="Calle" onChange={(e) => {this.handleInputChange(e, 'street')}}/>
              <Input s={12} labelClassName={active} validate={true} error={errorStrN} type="text" label="Número" onChange={(e) => {this.handleInputChange(e, 'street_num')}}/>
              <Input s={12} labelClassName={active} validate={true} error={errorNei} type="text" label="Colonia" onChange={(e) => {this.handleInputChange(e, 'neighborhood')}}/>
              <Input s={12} labelClassName={active} validate={true} error={errorMun} type="text" label="Delegación o municipio" onChange={(e) => {this.handleInputChange(e, 'municipality')}}/>
              <Input s={12} labelClassName={active} validate={true} error={errorSta} type="text" label="Estado" onChange={(e) => {this.handleInputChange(e, 'state')}}/>
              <Input s={12} labelClassName={active} validate={true} error={errorPC} type="text" label="Código postal" onChange={(e) => {this.handleInputChange(e, 'pc')}}/>
              <Col l={12} s={12}>
                <div className="center-align">
                  <iframe id="iframe_id" title="Google Maps" src={map} allowFullScreen width={"100%"} height={"300vh"} style={{border: 0, flex: 1}} frameBorder={0} />
                </div>
                {nota}
              </Col>

              {/* <div className="interests">
                <Col l={12} s={12}>{ question }</Col>
                <Col l={12} s={12}><p>¿De qué temas quisieras que te enviemos notificaciones a tu correo?</p></Col>           
                <Row>
                  <Col l={12} s={12}>
                    <Input className="blue-csr" l={3} s={12} name='familia' type='checkbox' defaultValue='0' value='1' label='Familia' onChange={(e) => {this.handleInputChange(e, 'notif_family')}}/>
                    <Input className="blue-csr" l={3} s={12} name='escuela de padres' type='checkbox' defaultValue='0' value='1' label='Escuela de Padres' onChange={(e) => {this.handleInputChange(e, 'notif_parents_school')}}/>
                    <Input className="blue-csr" l={3} s={12} name='matrimonios' type='checkbox' defaultValue='0' value='1' label='Matrimonios' onChange={(e) => {this.handleInputChange(e, 'notif_marriage')}}/>
                    <Input className="blue-csr" l={3} s={12} name='ninos' type='checkbox' defaultValue='0' value='1' label='Niños' onChange={(e) => {this.handleInputChange(e, 'notif_kids')}}/>
                    <Input className="blue-csr" l={3} s={12} name='jovenes' type='checkbox' defaultValue='0' value='1' label='Jóvenes' onChange={(e) => {this.handleInputChange(e, 'notif_youth')}}/>
                    <Input className="blue-csr" l={3} s={12} name='adolescentes' type='checkbox' defaultValue='0' value='1' label='Adolescentes' onChange={(e) => {this.handleInputChange(e, 'notif_teens')}}/>
                    <Input className="blue-csr" l={3} s={12} name='empredurismo' type='checkbox' defaultValue='0' value='1' label='Emprendedurismo' onChange={(e) => {this.handleInputChange(e, 'notif_entrepreneurship')}}/>
                    <Input className="blue-csr" l={3} s={12} name='alcance' type='checkbox' defaultValue='0' value='1' label='Alcance' onChange={(e) => {this.handleInputChange(e, 'notif_reach')}}/>
                    <Input className="blue-csr" l={3} s={12} name='alabanza' type='checkbox' defaultValue='0' value='1' label='Alabanza' onChange={(e) => {this.handleInputChange(e, 'notif_praise')}}/>
                    <Input className="blue-csr" l={3} s={12} name='lucha contra la trata de blancas' type='checkbox' defaultValue='0' value='1' label='Lucha contra la trata de personas' onChange={(e) => {this.handleInputChange(e, 'notif_againt_slave_traffic')}}/>
                    <Input className="blue-csr" l={3} s={12} name='buenas noticias' type='checkbox' defaultValue='0' value='1' label='Buenas Noticias' onChange={(e) => {this.handleInputChange(e, 'notif_good_news')}}/>
                    <Input className="blue-csr" l={3} s={12} name='cadena de oracion' type='checkbox' defaultValue='0' value='1' label='Cadena de oración' onChange={(e) => {this.handleInputChange(e, 'notif_prayer')}}/>
                    <Input className="blue-csr" l={3} s={12} name='adultos mayores' type='checkbox' defaultValue='0' value='1' label='Adultos Mayores' onChange={(e) => {this.handleInputChange(e, 'notif_older_adults')}}/>
                  </Col>
                </Row>
              </div> */}
            </Row>
            <Col l={12} s={12} className="center-align">
              <Button waves='light' className="blue-btn avenir-regular" node='a' onClick={this.apiRegistro.bind(this)}>Registrarse</Button>
            </Col>
          </Col>
        </Row>
      </section>
    );
    
  }
}

export default GoogleApiWrapper({
  apiKey: __GAPI_KEY__
})(Register)
