import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import update from 'immutability-helper';

import {Root} from "./layout/root";
import {Register} from './app/components/register';
import {RegisterUser} from './app/components/register_user';
import {Login} from './app/components/login';
import {Groups} from './app/components/groups';
import {Reports} from './app/components/reports';
import {RegisterGroups} from './app/components/register_groups';

var api = require('./app/utils/api');


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: 'init',
      inputValue: {
        email: '',
        pw: ''
      },
      remember: false
    }
  }

  componentDidMount() {
    this.session();
  }

  handleInputChange(e, val){
    if(e.target && e.target.type === 'checkbox'){
      var valu;
      if(e.target.checked)
        valu = true;
      else
        valu = false;
      this.setState({
        remember: valu
      });
    }
    else
      this.setState({
        inputValue: update(this.state.inputValue, {[val]: {$set: e}})
      });
  }

  logout(){
    this.setState({
      isLoggedIn: 'init',
      inputValue: {
        email: '',
        pw: ''
      }
    }, () => {
      window.location.replace("./");
      localStorage.removeItem('id_leader');
    });
  }

  session(){
    const cachedId = localStorage.getItem('id_leader');
    if (cachedId) {
      console.log('sessioned')
      this.setState({ isLoggedIn: cachedId });
    }
  }

  apiLogin(){
    var credentials = this.state.inputValue;
    
    api.leaderLogin(credentials)
      .then((data) => {
        if(data){
          this.setState({
            isLoggedIn: data.id_leader,
            inputValue: {
              email: '',
              pw: ''
            }
          });
          if(this.state.remember)
            localStorage.setItem('id_leader', data.id_leader); 
        }      
        else
          this.setState({
            isLoggedIn: false
          }); 
      })
  }

  render() {
    var logged = '';
    if(this.state.isLoggedIn !== false && this.state.isLoggedIn !== 'init')
      logged = [
        <Route exact path="/" render={()=><Groups id_leader={this.state.isLoggedIn}/>}/>,
        <Route path="/register" render={()=><Groups id_leader={this.state.isLoggedIn}/>}/>,
        <Route path="/login" render={()=><Groups id_leader={this.state.isLoggedIn}/>}/>,
        <Route path="/groups" render={()=><Groups handleInputChange={(e, val) => {this.handleInputChange(e, val)}} id_leader={this.state.isLoggedIn}/>}/>,
        <Route path="/reports" render={({location})=><Reports location={location} id_leader={this.state.isLoggedIn}/>}/>,
        <Route path="/register_groups" render={()=><RegisterGroups id_leader={this.state.isLoggedIn}/>}/>
      ];
      
    else if(this.state.isLoggedIn === false || this.state.isLoggedIn === 'init')
      logged = [
        <Route exact path="/" render={() => <Login isLoggedIn={this.state.isLoggedIn} handleInputChange={(e, val) => {this.handleInputChange(e, val)}} apiLogin={this.apiLogin.bind(this)}/>}/>,
        <Route path="/register" component={Register}/>,
        <Route path="/register_user" component={RegisterUser}/>,
        <Route path="/login" render={() => <Login isLoggedIn={this.state.isLoggedIn} handleInputChange={(e, val) => {this.handleInputChange(e, val)}} apiLogin={this.apiLogin.bind(this)}/>}/>
      ];

    return(
      <BrowserRouter basename="/">
          <Root isLoggedIn={this.state.isLoggedIn} logout={this.logout.bind(this)}>
            <Switch>
              {logged}
            </Switch>
          </Root>
      </BrowserRouter>
    );
  }
}

render(<App />, document.getElementById('root'));
