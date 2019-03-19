import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'react-materialize';
import 'materialize-css/dist/js/materialize.min.js';
import 'materialize-css/dist/css/materialize.min.css';

import logo from '../../media/inicio/LOGO_CSR_INICIO.png'

// var Img = <img alt="logo" className="cntr center-align" src={logo}/>

export class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: 'init',
    }
  }

  componentDidMount(){
    window.$('.button-collapse').sideNav({
      menuWidth: 250, // Default is 300
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true, // Choose whether you can drag to open on touch screens,
    }); 
    
    
    window.$('.dropdown-button').dropdown({
      hover: true, // Activate on hover
      belowOrigin: false, // Displays dropdown below the button
    });
      
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      isLoggedIn: nextProps.isLoggedIn
    }, () => {
      window.$('.button-collapse').sideNav({
        menuWidth: 250, // Default is 300
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true, // Choose whether you can drag to open on touch screens,
      });   

      window.$('.dropdown-button').dropdown({
        hover: true, // Activate on hover
        belowOrigin: false, // Displays dropdown below the button Stops event propagation
      });
    });
  }

  dropdown(e){
    window.$('.dropdown-button').dropdown();
  }

  render() {
    if (this.state.isLoggedIn === 'init' || this.state.isLoggedIn === false)  
      return ( 
        <header> 
          <nav> 
            <div className="nav-wrapper"> 
              <a href="./" className="brand-logo">
                <img alt="logo" src={logo} className="logo cntr center-align"/> 
              </a> 
              <a href="#!" data-activates="mobile-demo2" className="button-collapse"><Icon>menu</Icon></a>
              <ul className="avenir-medium right hide-on-med-and-down"> 
                <li><Link className="head-men" to="login">Iniciar sesión</Link></li> 
                <li><Link className="head-men" to="register">Registrarse</Link></li>                
              </ul>
              <ul className="side-nav" id="mobile-demo2">
                <li><Link className="head-men" to="login">Iniciar sesión</Link></li> 
                <li><Link className="head-men" to="register">Registrarse</Link></li>          
              </ul>
            </div> 
          </nav> 
          {/* <Navbar options={{ draggable: true, menuWidth: 250 }} brand={Img} right>
            <NavItem><Link className="head-men no-marg-left" to="login">Iniciar sesión</Link></NavItem>
            <NavItem><Link className="head-men no-marg-left" to="register_leader">Registrarse</Link></NavItem>
            <NavItem>
              <Dropdown trigger={
                <a href="#!">Registrarse<Icon className="arrMen right">arrow_drop_down</Icon></a>
              }>
                <NavItem><Link className="head-men turquoise-text" to="register_leader">Nuevo líder</Link></NavItem>
                <NavItem><Link className="head-men turquoise-text" to="register_user">Nuevo usuario</Link></NavItem>
              </Dropdown>
            </NavItem>
          </Navbar> */}
        </header> 
      ); 
    else 
      return ( 
        <header> 
          <ul id="dropdown1" className="dropdown-content"> 
            <li><Link className="head-men" to="groups">Grupos activos</Link></li> 
            <li><Link className="head-men" to="register_groups">Nuevo grupo</Link></li> 
          </ul>
          <nav> 
            <div className="nav-wrapper"> 
              <a href="./" className="brand-logo">
                <img alt="logo" src={logo} className="logo cntr center-align"/> 
              </a>  
              <a href="#!" data-activates="mobile-demo1" className="button-collapse"><Icon>menu</Icon></a>
              <ul className="avenir-medium right hide-on-med-and-down"> 
                <li><a className="dropdown-button" onClick={(e) => {this.dropdown(e)}} data-activates="dropdown1">Grupos<i className="material-icons right">arrow_drop_down</i></a></li> 
                <li><a onClick={this.props.logout}>Cerrar sesión</a></li>  
              </ul>
              <ul className="side-nav" id="mobile-demo1">
                <li>
                  <ul class="collapsible">
                    <li>
                      <div class="collapsible-header colorBlackText boldDropdown padLeftLi">Grupos</div>
                      <div class="collapsible-body padLeft backgroundSideActive">
                        <li><Link className="head-men turquoise-text" to="groups">Grupos activos</Link></li> 
                        <li><Link className="head-men turquoise-text" to="register_groups">Nuevo grupo</Link></li> 
                      </div>
                    </li>
                  </ul>
                </li> 
                <li><a onClick={this.props.logout}>Cerrar sesión</a></li>  
              </ul> 
            </div> 
          </nav> 
          {/* <ul id="dropdown1" className="dropdown-content"> 
            <li><Link className="head-men turquoise-text" to="groups">Grupos activos</Link></li> 
            <li><Link className="head-men turquoise-text" to="register_groups">Nuevo grupo</Link></li> 
          </ul>
          <Navbar brand={Img} options={{ closeOnClick: true, draggable: true, menuWidth: 250 }} right>
            <NavItem className="hide-on-med-and-down">
              <Dropdown options={{ belowOrigin: false, hover: true }} trigger={
                <a href="#!" className="hide-on-med-and-down">Grupos<Icon className="arrMen right">arrow_drop_down</Icon></a>
              }>
                <NavItem><Link className="head-men turquoise-text" to="groups">Grupos activos</Link></NavItem>
                <NavItem><Link className="head-men turquoise-text" to="register_groups">Nuevo grupo</Link></NavItem>
              </Dropdown>
            </NavItem>
            <NavItem>
              <Collapsible className="show-on-medium-and-down hide-on-large">
                <CollapsibleItem className="show-on-medium-and-down hide-on-large" header='Grupos' icon='class'>
                  <Link className="show-on-medium-and-down hide-on-large head-men turquoise-text" to="groups">Grupos activos</Link>
                  <Link className="show-on-medium-and-down hide-on-large head-men turquoise-text" to="register_groups">Nuevo grupo</Link>
                </CollapsibleItem>
              </Collapsible>
            </NavItem>
            <NavItem onClick={this.props.logout} href='./'>Cerrar sesión</NavItem>
          </Navbar> */}
        </header> 
      );
  }
}

export default Header;
