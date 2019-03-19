import React from 'react';
import { Link, Route } from 'react-router-dom';
import { Row, Input, Col, Modal, Button } from 'react-materialize';
import update from 'immutability-helper';
import {GoogleApiWrapper} from 'google-maps-react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import { Reports } from './reports';
import hombres from '../../media/grupos/001_FOTO_HOMBRES.png';
import mujeres from '../../media/grupos/001_FOTO_MUJERES.png';
import ninos from '../../media/grupos/001_FOTO_NIÑOS.png';
import matrimonios from '../../media/grupos/001_FOTO_MATRIMONIOS.png';
import jovenes from '../../media/grupos/001_FOTO_JOVENES.png';
import mixto from '../../media/grupos/001_FOTO_MIXTOS.png';
import adultos_mayores from '../../media/grupos/001_FOTO_ADULTOSMAYORES.png';
import not1 from '../../media/grupos/001_FOTO_NOTICIAS.png';
import not2 from '../../media/grupos/002_FOTO_NOTICIAS.png';
import not3 from '../../media/grupos/003_FOTO_NOTICIAS.png';

var api = require('../utils/api');
const __GAPI_KEY__ = 'AIzaSyBjPqgfje7_Dg_qlZ9eiie7zLpw-9JN0SA';

// const EditorComponent = () => <Editor />

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

function BtnModal(props){
  return(
    <a className="turquoise-text avenir-medium btn-grupo-text modal-trigger margTextBtn" data-id_course={props.id_course} onClick={props.onClick} data-index={"" + props.index} href="#myModal">Editar grupo</a>
  );
}

export class Group extends React.Component{
  constructor(props) {
    super(props);
   
    this.state = {
      shouldReport: [0],
      selectedEmails: new Array(this.props.inputValue.length),
      checked: new Array(this.props.inputValue.length),
      indexCheckBox: 0,
      index: 0
    }

    this.state.checked.fill(false);
    for (var i = 0; i < this.state.selectedEmails.length; ++i) {
      this.state.selectedEmails[i] = new Set();
    }
  }

  componentDidMount(){
    // var boolArr = new Array(this.props.inputValue.length);
    // var setArr = new Array(this.props.inputValue.length);

    // boolArr.fill(false);
    // for (var i = 0; i < setArr.length; ++i) {
    //   setArr[i] = new Set();
    // }
    // this.setState({
    //   checked: boolArr,
    //   selectedEmails: setArr
    // })
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      shouldReport: nextProps.shouldReport,
      index: nextProps.index
    });
  }

  handleSelectedEmails (allSelected, individualSelected, selectedEmail, checked, i) {
    console.log("index: " + i)
    console.log('allSelected', allSelected)
    console.log('individualSelected', individualSelected)
    console.log('selectedEmail', selectedEmail)
    console.log('checked', checked)    
    let selectedEmails = this.state.selectedEmails.slice()
    var user_list = this.props.inputValue[this.state.index].user_list;

    // if(!i){
    //   user_list=this.props.inputValue[this.state.index].user_list
    // }
    console.log(user_list)
    if (allSelected && !individualSelected) {
        user_list.forEach((elem) => {        
          selectedEmails[this.state.index].add(elem.email)
        })  
    }
    else if(!allSelected && !individualSelected){
      selectedEmails[this.state.index].clear();
    }
    else if (individualSelected) {
      if (checked) { 
        selectedEmails[this.state.index].add(selectedEmail);
        console.log(user_list)
        if (selectedEmails[this.state.index].size === user_list.length) {
           this.checkAll()
           //this.setState({checked: !this.state.checked})
        }
      } 
      else {
        selectedEmails[this.state.index].delete(selectedEmail)
        this.setState({
          checked: update(this.state.checked, {[this.state.index]: {$set: checked}})
        })
      }
    }
    console.log('selectedEmails', this.state.selectedEmails)
    this.setState({selectedEmails})
    
  }

  checkAll = (e) => {
    if(e)
      this.props.onIndex(e);
    this.setState({
      checked: update(this.state.checked, {[this.state.index]: {$set: !this.state.checked[this.state.index]}})
    },
      () =>{
        console.log(this.state.checked)
      }
    )
    console.log('checkedClick', this.state.checked[this.state.index])
    this.handleSelectedEmails(!this.state.checked[this.state.index], false)
  }

  setIndex = (e) => {
    if(e)
      this.props.onIndex(e);
  }

  setIndexCheck = (e) => {
    console.log(Number(e.target.dataset.key))
    this.setState({
      indexCheckBox: Number(e.target.dataset.key)
    })
  }

  handleChipDelete = (elem) => {
    var selectedEmails = this.state.selectedEmails;

    selectedEmails[this.state.index].delete(elem);
    this.setState({
      selectedEmails: selectedEmails,
      checked: update(this.state.checked, {[this.state.index]: {$set: false}})
    })
  }

  reportDate = (i ,course_name) => {
    var obj = this.state.shouldReport[i];

    if(obj.reporte===true)
      return (
        <Link className="alignright turquoise-text avenir-medium btn-grupo-text margTextBtn" to={
          { pathname: '/reports',
            state: {
              key: i,
              id_course: this.props.inputValue[i].id_course,
              date_report: obj.fecha_reporte,
              course_name: course_name
            }
          }
        }>Hacer reporte</Link>
      );
  }

  getImgGroupType = (i) => {
    var img = '';

    if(this.props.inputValue[i].attendance_type==='Hombres')
      img = hombres;
    else if(this.props.inputValue[i].attendance_type==='Mujeres')
      img = mujeres;
    else if(this.props.inputValue[i].attendance_type==='Niños')
      img = ninos;
    else if(this.props.inputValue[i].attendance_type==='Matrimonios')
      img = matrimonios;
    else if(this.props.inputValue[i].attendance_type==='Jóvenes')
      img = jovenes;
    else if(this.props.inputValue[i].attendance_type==='Mixto')
      img = mixto;
    else if(this.props.inputValue[i].attendance_type==='Adultos mayores')
      img = adultos_mayores;
    
    return img;
  }

  getDayFormat = (i) => {
    var date = this.props.inputValue[i].start_day;
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

  copyToClipboard(id) {
    /* Get the text field */
    var copyText = document.getElementById(id);
  
    /* Select the text field */
    copyText.select();
  
    /* Copy the text inside the text field */
    document.execCommand("copy");
  
    /* Alert the copied text */
    alert("Vínculo copiado: " + copyText.value);
  } 

  render() {
    if(this.state.selectedEmails[this.state.index].size===0)
      var disabled = "disabled"  
    if(this.state.shouldReport.length===this.props.inputValue.length)
      var group = this.props.inputValue.map((value, i) => (
        <div className="card marg sticky-action">
          <div className="card-image waves-effect waves-block waves-light">
            <img className="activator" alt="" src={this.getImgGroupType(i)} data-index={"" + i} onClick={(e) => {this.setIndex(e)}}/>
          </div>
          <div className="card-content">
            <span className="card-title activator avenir-medium tit-grupo-nom" data-index={"" + i} onClick={(e) => {this.setIndex(e)}}>{this.props.inputValue[i].course_name}<i className="material-icons right">more_vert</i></span>
            <p className="avenir-ultralight head-men">{this.props.inputValue[i].description}</p>
          </div>
          <div className="card-action">
            <BtnModal id_course={this.props.inputValue[i].id_course} onClick={(e) => {this.props.onClick(e)}} index={i} href="#"/>
            {/* <Link className="alignright turquoise-text" to={
                { pathname: '/reports',
                  state: {
                    key: i,
                    id_course: this.props.inputValue[i].id_course
                  }
                }
              }>Hacer reporte</Link> */}    
            {this.reportDate(i, this.props.inputValue[i].course_name)}
          </div>
          <div className="card-reveal">
            <span className="card-title">{this.props.inputValue[i].course_name}<i className="material-icons right">close</i></span>
            <ul>
              <li><b>Dirección: </b>{this.props.inputValue[i].street} {this.props.inputValue[i].street_num}, {this.props.inputValue[i].neighborhood}, C.P: {this.props.inputValue[i].pc}, {this.props.inputValue[i].municipality}, {this.props.inputValue[i].state}</li>
              <li><b>Teléfono: </b>{this.props.inputValue[i].phone}</li>
              <li><b>Fecha de inicio: </b>{this.getDayFormat(i)}</li>
              <li><b>Día del curso: </b>{this.props.inputValue[i].day}</li>
              <li><b>Horario: </b>{this.props.inputValue[i].start_time} - {this.props.inputValue[i].end_time}</li>
              <li><b>Tipo de audiencia: </b> {this.props.inputValue[i].attendance_type}</li>
            </ul>
            <Row>
              <h5>Invitaciones: </h5> 
              <Input s={12} labelClassName={"active"} validate={true} value={"http://18.204.193.195/register_user?course=" + this.props.inputValue[i].id_course} id={"inv" + i} label="Vínculo para la invitación de un curso" type="text" disabled={true}/>
              <Col s={3} l={4} offset={"s2 l4"}>
                <button className="waves-effect waves-light blue-btn btn avenir-regular center" onClick={() => this.copyToClipboard("inv" + i)}>Copiar</button> 
              </Col>
            </Row>  
            <Row>
              <Col s={12} l={6}><h5>Asistentes: </h5></Col>
              <Col s={12} l={6}><span className="new badge blue asistBadge" style={{"marginTop": "5%"}} data-badge-caption="seleccionados">{this.state.selectedEmails[this.state.index].size}</span></Col>           
              {
                
                // console.log(this.state.selectedEmails[i].size) 
              }
            </Row>
            <Row>
                <Assistant disabled={disabled} indexkey={i} user_list={this.props.inputValue[i].user_list} handleSelectedEmails={this.handleSelectedEmails.bind(this)} checkedVal={this.state.checked[i]} selectedEmails={this.state.selectedEmails}/>
            </Row> 
            
          </div>
        </div>
      ));

    return (
      <Col l={12} s={12}>
        <MailModal mailList={this.state.selectedEmails[this.state.index]} handleChipDelete={this.handleChipDelete}/>
        {group}
      </Col>
    );
  }
}

function Assistant(props){
  var assistant = props.user_list.map((value, i) => (
  //   <li>{props.user_list[i].name} {props.user_list[i].surname_fath} {props.user_list[i].surname_math}</li>
  // ));

  <Input
      data-key={i}
      l={8}
      s={12}
      className = "blue-csr"
      labelClassName={props.active} 
      validate={true} 
      error={props.error}
      type="checkbox"
      data-mobile={props.user_list[i].mobile}
      data-text={props.user_list[i].name + ' ' + props.user_list[i].surname_fath + ' ' + props.user_list[i].surname_math}
      label={props.user_list[i].name + ' ' + props.user_list[i].surname_fath + ' ' + props.user_list[i].surname_math}
      value={props.user_list[i].email}
      checked = {props.checkedVal || props.selectedEmails[props.indexkey].has(props.user_list[i].email)}
      onChange={(e) => {
          console.log("dobleindex: " + props.indexkey)
          props.handleSelectedEmails(false, true, e.target.value, e.target.checked, props.indexkey)
        }
      }
    />
  ));

  return (
    <Row>
      {assistant}
      <Col s={4} l={1} offset={"s4 l11"} style={{marginTop: "5%", marginBottom: "10%"}}>
        <a className={"btn-floating btn-small waves-effect waves-light blue-btn modal-trigger " + props.disabled} href="#emailModal"><i className="material-icons">mail</i></a>
      </Col>
		</Row>
  );
}

export class MailTags extends React.Component{
  constructor(props) {
    super(props);
   
    this.state = {
      mailList: []
    }
  }

  componentDidMount(){
    this.setState({
      mailList: this.props.emails.toString().split(",")
    });
  }
  
  componentWillReceiveProps(nextProps){
    this.setState({
      mailList: nextProps.emails.toString().split(",")
    });
  }

  render() {
    var setArr = this.state.mailList;
    var tags = setArr.map((elem, int) => ( 
      <div className="chip">
      {console.log(int)}
        {elem}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {/* <i onClick={()=>{this.props.handleChipDelete(elem)}} className="close material-icons">close</i> */}
      </div>
    ));

    return(
      <Row>
        {tags}
      </Row>  
    );  
  }
}

export class EditorConvertToHTML extends React.Component {
  constructor(props) {
    super(props);
    //const html = '<p>Hey this <strong>editor</strong> rocks 😀</p>';
    const html = '';
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState,
        value: ""
      };
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  handleInputChange() {
    const { editorState } = this.state;

    this.setState({
      value: draftToHtml(convertToRaw(editorState.getCurrentContent()))
    },
      this.props.handleInputChange(this.state.value, 'mailContent')
    )
    
  }

  render() {
    const { editorState } = this.state;
    // var textval = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    return (
      <div>
        <Editor
          editorState={editorState}
          id="email_edit"
          wrapperClassName="email-editor-wrapper"
          editorClassName="email-editor"
          localization={{
            locale: 'es',
          }}
          hashtag={{
            separator: ' ',
            trigger: '#',
          }}
          onEditorStateChange={this.onEditorStateChange}
          onChange = {this.handleInputChange.bind(this)}
        />
        {/* <textarea
          disabled
          style = {{display: 'none'}}
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
          onChange = {this.handle}
        /> */}
      </div>
    );
  }
}

export class MailModal extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      mailTitle: "",
      mailContent: "",
      mailList: [],
      index: 0,
      hasErrors: false
    }
  }

  handleInputChange = (e, val) => {
    if (!e.target){
      this.setState({
        [val]: e
      });
    }
    else
    this.setState({
      [val]: e.target.value
    });
  }

  componentDidMount(){
    if(this.props.mailList.size===!0){
      var maillist = Array.from(this.props.mailList);
      var maillist_s = maillist.join()

      this.setState({
        mailList: maillist_s
      });
    }

  }

  componentWillReceiveProps(nextProps){
    
    var maillist = Array.from(nextProps.mailList);
    var maillist_s = maillist.join()

    this.setState({
      mailList: maillist_s,
      index: nextProps.index
    });
  }

  apiCorreo(){
    var info = {
      email: this.state.mailList,
      title: this.state.mailTitle,
      content: this.state.mailContent
    }
    var isStateEmpty = !this.state.mailList || !this.state.mailTitle

    if(!isStateEmpty){
      api.userSendMail(info);
    }
    else {
      alert('Faltan campos por llenar');
      this.setState({
        hasErrors: true
      });
    } 
  }

  render(){
    if(this.state.hasErrors){
      var error = 'Este campo es obligatorio';

      // if(!this.state.mailContent) var errorContent = error;
      if(!this.state.mailTitle) var errorTitle = error;

      var active='active';
    }
    return(
      <div id="emailModal" className="modal modal-fixed-footer">
        <div className="modal-content">
          <h4>Redactar correo</h4>
          <p className="input-label-text avenir-medium ">Recipientes:</p>
          <MailTags handleChipDelete={this.props.handleChipDelete} emails={this.state.mailList}/>
          <Input className="avenir-regular" s={12} error={errorTitle} labelClassName={'avenir-regular input-label-text ' + active} validate={true} type="text" label="Título del correo" onChange = {(e) => this.handleInputChange(e, 'mailTitle')}/>
          {/* <Input className="avenir-regular" s={12} error={errorContent} labelClassName={'avenir-regular input-label-text' + active} validate={true} type="textarea" label="Contenido del correo" onChange = {(e) => this.handleInputChange(e, 'mailContent')}/> */}
          <Col s={12}>
            <label style={{'fontSize': '1rem'}} className="input-field avenir-regular">Contenido del correo:</label>
            <br/>
            <EditorConvertToHTML handleInputChange={this.handleInputChange}/>
          </Col>

              
        </div>
        <div className="modal-footer">
          <a href="#!" onClick={this.apiCorreo.bind(this)} className="modal-action modal-close waves-effect waves-bluecsr btn-flat turquoise-text">Enviar Correo</a>
        </div>
      </div>
    );
  }
}

export class GroupModal extends React.Component {
  constructor(props) {
    super(props);
   
    this.state = {
      index: 0,
      courseInfo: [],
      inputValue: {
        "id_leader": 0,
        "id_course": 0,
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

  componentDidMount(){
    
    this.setState({
      courseInfo: this.props.courses
    }, () => {
      this.preLoadState(this.state.courseInfo[this.state.index]);
      window.$('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        closeOnSelect: false,  // Close upon selecting a date,
  
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

        container: 'body',
        
        onSet: this.handleDateChange.bind(this)
      });
    });

    window.$(document).ready(function(){
      // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
      window.$('.modal').modal();
    });
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      index: nextProps.index,
      inputValue: update(this.state.inputValue, {id_course: {$set: nextProps.course}}),
      courseInfo: nextProps.courses
    }, () => {
      this.preLoadState(this.state.courseInfo[nextProps.index]);
      window.$('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        closeOnSelect: false,  // Close upon selecting a date,
  
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

        container: 'body',
        
        onSet: this.handleDateChange.bind(this)
      });
    });
  }

  handleDateChange(e){
    this.handleInputChange(e, 'start_day', 'datepicker')
  }

  handleInputChange(e, val, type) {
    if(e.select || type === 'datepicker'){
      console.log(this.pgFormatDate(e.select))
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

  preLoadState(data){
    this.setState({
      inputValue: update(this.state.inputValue, {
        id_leader: {$set: this.props.id_leader},
        id_course: {$set: data.id_course},
        start_day: {$set: data.start_day},
        day: {$set: data.day},
        start_time: {$set: data.start_time},
        end_time: {$set: data.end_time},
        attendance_type: {$set: data.attendance_type},
        course_name: {$set: data.course_name},
        description: {$set: data.description},
        house_type: {$set: data.house_type},
        street: {$set: data.street},
        street_num: {$set: data.street_num},
        interior_num: {$set: data.interior_num},
        latitude: {$set: data.latitude},
        longitude: {$set: data.longitude},
        neighborhood: {$set: data.neighborhood},
        municipality: {$set: data.municipality},
        state: {$set: data.state},
        pc: {$set: data.pc},
        phone: {$set: data.phone}
      })
    })
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

    if (time.includes('12:')){
      if(time.includes('AM')){
        time_m = split[1].replace('AM', '');
      }
      else{
        time_m = split[1].replace('PM', '');
      }
      time_h = time_h - 12;
    }
    if(time.includes('PM')){
      time_m = split[1].replace('PM', '');
      time_h = time_h + 12;
    }
    else{
      time_m = split[1].replace('AM', '');
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

  spaceReplaceMap(string){
    return string.replace(' ', '%20')
  }


  apiEdit(id_course){
    var info = this.state.inputValue;
    var id = this.props.id_leader;

    api.leaderCourseEdit(info)
    .then((data) => {
      api.leaderCourseInfo(id)
      .then((data) => {
        this.props.editCourses(data);
        window.$('#myModal').modal('close');
      }); 
    });
    
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

  render() {
    if(this.state.courseInfo.length){
      var str = "";
      var neigh = "";
      var mun = "";
      var num_str = "";
      var pc = "";
      var state = "";
      var map = "";
      var date = this.state.courseInfo[this.state.index].start_day;
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

      if(this.state.inputValue.street && this.state.inputValue.street_num && this.state.inputValue.neighborhood && this.state.inputValue.municipality && this.state.inputValue.state && this.state.inputValue.pc){
        str = this.spaceReplaceMap(this.state.inputValue.street)
        neigh = this.spaceReplaceMap(this.state.inputValue.neighborhood)
        mun = this.spaceReplaceMap(this.state.inputValue.municipality)
        num_str = this.state.inputValue.street_num
        pc = this.state.inputValue.pc
        state = this.state.inputValue.state

        map = "https://www.google.com/maps/embed/v1/search?q=" + str + "%20" + num_str + "%20" + neigh + "%20" + mun + "%20" + pc + "%20" + state +"&key=AIzaSyDE1ClcNrmXPnRk1nIhCaIzZKQ_3lSQCRU";
      }
      else {
        str = this.spaceReplaceMap(this.state.courseInfo[this.state.index].street)
        neigh = this.spaceReplaceMap(this.state.courseInfo[this.state.index].neighborhood)
        mun = this.spaceReplaceMap(this.state.courseInfo[this.state.index].municipality)
        num_str = this.state.courseInfo[this.state.index].street_num
        pc = this.state.courseInfo[this.state.index].pc
        state = this.state.courseInfo[this.state.index].state

        map = "https://www.google.com/maps/embed/v1/search?q=" + str + "%20" + num_str + "%20" + neigh + "%20" + mun + "%20" + pc + "%20" + state +"&key=AIzaSyDE1ClcNrmXPnRk1nIhCaIzZKQ_3lSQCRU";
      }
      

      if(this.state.inputValue.street && this.state.inputValue.street_num && this.state.inputValue.neighborhood && this.state.inputValue.municipality && this.state.inputValue.state && this.state.inputValue.pc){
        this.geocode(window.google);
        var nota = <div className="card-panel light-blue lighten-1 center-align">
          <span className="grey-text text-lighten-4">Si la dirección del mapa es incorrecta, verifique los datos ingresados</span>
        </div> 
      }

      if(this.state.inputValue.start_time_h !== "" || this.state.inputValue.start_time_m !== "" || this.state.inputValue.ampm !== "")
        var activeT='active';
      if(this.state.inputValue.end_time_h !== "" || this.state.inputValue.end_time_m !== "" || this.state.inputValue.ampmE !== "")
        var activeE='active';

      var modal = (
        <div className="modal-content">
          <h4>Editar información del grupo:</h4>
          <Row>
            <Input s={12} key={"1" + this.state.index} type="text" defaultValue={this.state.courseInfo[this.state.index].course_name} label="Nombre del curso" onChange = {(e) => this.handleInputChange(e, 'course_name')}/>
            <Input s={12} key={"2" + this.state.index} type="textarea" defaultValue={this.state.courseInfo[this.state.index].description} label="Descripción del curso" onChange = {(e) => this.handleInputChange(e, 'description')}/>
            
            <Input s={12} key={"3" + this.state.index} type='select' defaultValue={this.state.courseInfo[this.state.index].day} label="Día en que se imparte" onChange = {(e) => this.handleInputChange(e, 'day')}>
              <option key='nada1' value="nada">Seleccione un día de la semana</option>
              <option key='Lunes' value="Lunes">Lunes</option>
              <option key='Martes' value="Martes">Martes</option>
              <option key='Miércoles' value="Miércoles">Miércoles</option>
              <option key='Jueves' value="Jueves">Jueves</option>
              <option key='Viernes' value="Viernes">Viernes</option>
              <option key='Sábado' value="Sábado">Sábado</option>
              <option key='Domingo' value="Domingo">Domingo</option>
            </Input>
            {/* <Input s={12} key={"4" + this.state.index} className="timepicker" defaultValue={this.state.courseInfo[this.state.index].start_time} label="Hora inicio" name='on' type='time' onChange = {(e) => this.handleInputChange(e, 'start_time', 'timepicker')} />
            <Input s={12} key={"5" + this.state.index} className="timepicker" defaultValue={this.state.courseInfo[this.state.index].end_time} label="Hora final" name='on' type='time' onChange = {(e) => this.handleInputChange(e, 'end_time', 'timepicker')}  /> */}

            <Input 
                onFocus={this.openStart} 
                defaultValue={this.state.courseInfo[this.state.index].start_time}
                value={this.state.inputValue.start_time_h + this.state.inputValue.start_time_m + this.state.inputValue.ampm} 
                className="avenir-regular" 
                s={12} 
                labelClassName={'avenir-regular input-label-text ' + activeT} 
                validate={true}
                type="text" 
                label="Hora de inicio" 
                onChange = {(e) => this.handleInputChange(e, 'start_time')}
              />

              <Input 
                onFocus={this.openEnd} 
                defaultValue={this.state.courseInfo[this.state.index].end_time}
                value={this.state.inputValue.end_time_h + this.state.inputValue.end_time_m + this.state.inputValue.ampmE} 
                className="avenir-regular" 
                s={12} 
                labelClassName={'avenir-regular input-label-text ' + activeE} 
                validate={true}
                type="text" 
                label="Hora final" 
                onChange = {(e) => this.handleInputChange(e, 'end_time')}
              />

            <Input s={12} key={"6" + this.state.index} id="datepicker" className="datepicker" defaultValue={dateRes} label="Fecha de inicio" type='text' />
            <Input s={12} key={"7" + this.state.index} type="text" defaultValue={this.state.courseInfo[this.state.index].phone} label="Teléfono" onChange = {(e) => this.handleInputChange(e, 'phone')}/>
            <Input s={12} key={"8" + this.state.index} type='select' defaultValue={this.state.courseInfo[this.state.index].house_type} label="Tipo de casa" id="tipo_casa" onChange = {(e) => this.handleInputChange(e, 'house_type')}>
              <option key='nada2' value="nada">Seleccione un tipo de casa</option>
              <option key='Estudio bíblico' value="Estudio bíblico">Estudio bíblico</option>
              <option key='Discipulado' value="Discipulado">Discipulado</option>
            </Input>
            <Input s={12} key={"9" + this.state.index} type='select' defaultValue={this.state.courseInfo[this.state.index].attendance_type} label="Tipo de público" onChange = {(e) => this.handleInputChange(e, 'attendance_type')}>
              <option key='nada3' value="nada">Seleccione un tipo de público</option>
              <option key='Mujeres' value="Mujeres" >Mujeres</option>
              <option key='Hombres' value="Hombres" >Hombres</option>
              <option key='Matrimonios' value="Matrimonios" >Matrimonios</option>
              <option key='Mixto' value="Mixto" >Mixto</option>
              <option key='Jóvenes' value="Jóvenes" >Jóvenes</option>
              <option key='Niños' value="Niños" >Niños</option>
              <option key='Adultos mayores' value="Adultos mayores" >Adultos mayores</option>
            </Input>
            <Col s={12} key={"10" + this.state.index}><h5>Dirección donde se imparte el curso:</h5></Col>
            <Input s={12} key={"11" + this.state.index} type="text" defaultValue={this.state.courseInfo[this.state.index].street} label="Calle" onChange = {(e) => this.handleInputChange(e, 'street')}/>
            <Input s={12} key={"12" + this.state.index} type="text" defaultValue={this.state.courseInfo[this.state.index].street_num} label="Número exterior" onChange = {(e) => this.handleInputChange(e, 'street_num')}/>
            <Input s={12} key={"13" + this.state.index} type="text" defaultValue={this.state.courseInfo[this.state.index].interior_num} label="Número interior" onChange = {(e) => this.handleInputChange(e, 'interior_num')}/>
            <Input s={12} key={"14" + this.state.index} type="text" defaultValue={this.state.courseInfo[this.state.index].neighborhood} label="Colonia" onChange = {(e) => this.handleInputChange(e, 'neighborhood')}/>
            <Input s={12} key={"15" + this.state.index} type="text" defaultValue={this.state.courseInfo[this.state.index].municipality} label="Delegación/Municipio" onChange = {(e) => this.handleInputChange(e, 'municipality')}/>
            <Input s={12} key={"16" + this.state.index} type="text" defaultValue={this.state.courseInfo[this.state.index].state} label="Estado" onChange = {(e) => this.handleInputChange(e, 'state')}/>
            <Input s={12} key={"17" + this.state.index} type="text" defaultValue={this.state.courseInfo[this.state.index].pc} label="Código postal" onChange = {(e) => this.handleInputChange(e, 'pc')}/>
            <Col l={12} s={12}>
              <div className="center-align">
                <iframe title="Google Maps" id="iframe_id" src={map} allowFullScreen width={"100%"} height={"300vh"} style={{border: 0, flex: 1}} frameBorder={0} />
              </div>
              {nota}
            </Col>
          </Row>
          <a className="waves-effect waves-light blue-btn btn avenir-regular right" style={{ 'marginBottom':'1em' }} onClick={this.apiEdit.bind(this)}>Guardar cambios</a>
          {/* <a className="waves-effect waves-light btn right" style={{ 'marginBottom':'1em' }} onClick={() => {alert('WIP'); }}>Guardar cambios</a> */}
        </div>
      );
    }
    return(
      <div id="myModal" className="modal">
        <Modal id='myModal1' className="modalHora" header='' actions={
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
        <Modal id='myModal2' header='' className="modalHora" actions={
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
        {modal}
      </div>
      
    );
  }
}

export class Groups extends React.Component {
	constructor(props) {
    super(props);
   
    this.state = {
      index: 0,
      course: 0,
      shouldReport: [0],
      courseInfo: [],
      inputValue: {
        "id_leader": 0,
        "id_course": 0,
        "day": "",
        "start_day": "",
        "start_time": "",
        "end_time": "",
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
    }
  }

  editCourses(data){
    this.setState({
      courseInfo: data.courses
    });
  }

  componentDidMount() {
    var id = this.props.id_leader;

    api.leaderCourseInfo(id)
      .then((data) => {
        this.setState({
          inputValue: update(this.state.inputValue, {id_leader: {$set: this.props.id_leader}}),
          courseInfo: data.courses
        });
      })
      .then(() => {
        var i = 0;
        var res = [];

        this.state.courseInfo.forEach((elem) => {
          var id_course = elem.id_course;

          api.userShouldReport(id_course)
          .then((data) => {
            var response = data;

            response.index = i;
            res[i] = response;
          })
          .then(() => {
            i++;
            this.setState({
              shouldReport: res
            })
          });
        });
        
      }); 
  }

  open = (e) => {
    this.setState({
      index: e.target.dataset.index,
      course: e.target.dataset.id_course
    }, () => {
      window.$('#myModal').modal('open');
    });
  }

  indexing = (e) => {
    this.setState({
      index: e.target.dataset.index
    })
  }

  render() {
    if(this.state.courseInfo.length){
      if(this.state.shouldReport.length!==0){
        var report = this.state.shouldReport;
      }
      var group = <Group index={this.state.index} inputValue={this.state.courseInfo.slice()} shouldReport={report} isLoggedIn={this.props.isLoggedIn} onIndex={(e) => this.indexing(e)} onClick={(e) => this.open(e)}/>;
      var gm = <GroupModal index={this.state.index} course={this.state.course} id_leader={this.props.id_leader} courses={this.state.courseInfo.slice()} editCourses={(data) => {this.editCourses(data)}}/>;
    }
    return (
      <section>
        {gm}
        <Row className="back-blue no-margin">
          <Col s={1} m={1} l={1}></Col>
          <Col s={11} m={11} l={11} className="back-grey">
            <Row>
              <Col l={8} m={8} s={12}>
                <span className="avenir-regular tit-grupo">Grupos activos</span>
                <div className="scrollBar">
                  <Route path="/reports" render={({location})=><Reports location={location} id_leader={this.props.isLoggedIn}/>}/>
                  {group}
                </div>
              </Col>
              <Col l={4} m={4} s={12}>
                <span className="avenir-regular tit-grupo">Noticias</span>
                <div className="scrollBar">
                  <div className="card marg margMob horizontal">
                    <div className="card-image">
                      <img alt="Portada de la noticia" src={not1} />
                    </div>
                    <div className="card-stacked">
                      <div className="card-content">
                        <span className="avenir-medium noticia-sub">Lorem ipsum</span>
                        <p className="avenir-regular noticia-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam a arcu ac nisl lobortis pretium. Curabitur ac ultrices lorem, eu euismod turpis. In libero justo, semper quis efficitur vitae, consectetur eu est. </p>
                      </div>
                      <div className="card-action">
                        <a className="turquoise-text avenir-medium tit-foot" href="http://reforma.com">Abrir noticia</a>
                      </div>
                    </div>
                  </div>

                  <div className="card marg margMob horizontal">
                    <div className="card-image">
                      <img alt="Portada de la noticia" src={not2} />
                    </div>
                    <div className="card-stacked">
                      <div className="card-content">
                        <span className="avenir-medium noticia-sub">Lorem ipsum</span>
                        <p className="avenir-regular noticia-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam a arcu ac nisl lobortis pretium. Curabitur ac ultrices lorem, eu euismod turpis. In libero justo, semper quis efficitur vitae, consectetur eu est. </p>
                      </div>
                      <div className="card-action">
                        <a className="turquoise-text avenir-medium tit-foot" href="http://reforma.com">Abrir noticia</a>
                      </div>
                    </div>
                  </div>

                  <div className="card marg margMob horizontal">
                    <div className="card-image">
                      <img alt="Portada de la noticia" src={not3} />
                    </div>
                    <div className="card-stacked">
                      <div className="card-content">
                        <span className="avenir-medium noticia-sub">Lorem ipsum</span>
                        <p className="avenir-regular noticia-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam a arcu ac nisl lobortis pretium. Curabitur ac ultrices lorem, eu euismod turpis. In libero justo, semper quis efficitur vitae, consectetur eu est. </p>
                      </div>
                      <div className="card-action">
                        <a className="turquoise-text avenir-medium tit-foot" href="http://reforma.com">Abrir noticia</a>
                      </div>
                    </div>
                  </div>

                  <div className="card marg margMob horizontal">
                    <div className="card-image">
                      <img alt="Portada de la noticia" src={not1} />
                    </div>
                    <div className="card-stacked">
                      <div className="card-content">
                        <span className="avenir-medium noticia-sub">Lorem ipsum</span>
                        <p className="avenir-regular noticia-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam a arcu ac nisl lobortis pretium. Curabitur ac ultrices lorem, eu euismod turpis. In libero justo, semper quis efficitur vitae, consectetur eu est. </p>
                      </div>
                      <div className="card-action">
                        <a className="turquoise-text avenir-medium tit-foot" href="http://reforma.com">Abrir noticia</a>
                      </div>
                    </div>
                  </div>

                  <div className="card marg margMob horizontal">
                    <div className="card-image">
                      <img alt="Portada de la noticia" src={not2} />
                    </div>
                    <div className="card-stacked">
                      <div className="card-content">
                        <span className="avenir-medium noticia-sub">Lorem ipsum</span>
                        <p className="avenir-regular noticia-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam a arcu ac nisl lobortis pretium. Curabitur ac ultrices lorem, eu euismod turpis. In libero justo, semper quis efficitur vitae, consectetur eu est. </p>
                      </div>
                      <div className="card-action">
                        <a className="turquoise-text avenir-medium tit-foot" href="http://reforma.com">Abrir noticia</a>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </section>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: __GAPI_KEY__
})(Groups)