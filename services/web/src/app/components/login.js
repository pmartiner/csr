import React from 'react';
import { Row, Col, Input, Button } from 'react-materialize';
import  { Redirect } from 'react-router-dom';

export class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      logged: 'init',
      remember: false
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      logged: nextProps.isLoggedIn
    });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.props.apiLogin();
    }
  }

  render() {
    var input = [];

    if (this.state.logged === false){
      var error_email = ' ';
      var error_pw = 'Usuario y/o contraseña incorrecta';

      input = [
        <Input l={12} s={12} error={error_email} type='email' id='email' label='Correo electrónico' onKeyPress={this.handleKeyPress.bind(this)} onChange={(e) => {this.props.handleInputChange(e.target.value, 'email')}}/>,
        <Input l={12} s={12} error={error_pw} type='password' id='password' label='Contraseña' onKeyPress={this.handleKeyPress.bind(this)} onChange={(e) => {this.props.handleInputChange(e.target.value, 'pw')}}/>
      ];
    }
    else
      input = [
        <Input l={12} s={12} type='email' id='email' label='Correo electrónico' onKeyPress={this.handleKeyPress.bind(this)} onChange={(e) => {this.props.handleInputChange(e.target.value, 'email')}}/>,
        <Input l={12} s={12} type='password' id='password' label='Contraseña' onKeyPress={this.handleKeyPress.bind(this)} onChange={(e) => {this.props.handleInputChange(e.target.value, 'pw')}}/>
      ];

    if (this.state.logged !== false && this.state.logged !== 'init')
      return <Redirect to='./groups' />;

    return(
      <div>
        <Row className="no-margin back-blue">
          <Col l={1} m={1} s={1} className="hide-on-med-and-down"></Col>
          <Col l={10} s={12} className="spec back-grey">
            <center className="container">
              <h3 className="greyy-text avenir-medium center-align bienv">Bienvenido</h3>
              <div className="center-align z-depth-1 white lighten-4 row logBox">
                <h5 className="greyy-text avenir-regular ini">Inicia sesión</h5>
                <Row>
                  {input}
                  <Row>
                    <Col l={12} s={12}>
                      <Input className="blue-csr" type='checkbox' value='remember' label='Recuérdame' onChange={(e) => {this.props.handleInputChange(e)}}/>
                    </Col>
                    <br/>
                    <Col l={12} s={12}>
                      <Button large waves='light' style={{marginTop: '6vh'}} className='avenir-regular white-btn' onClick={this.props.apiLogin}>Iniciar sesión</Button>
                    </Col>
                  </Row>
                </Row>
              </div>
            </center>
          </Col>
          <Col l={1} m={1} s={1} className="hide-on-med-and-down"></Col>
        </Row>    
      </div>
    );
  }
}

export default Login;
