import React from "react";

import {Header} from '../app/components/header';
import {Footer} from '../app/components/footer';


export class Root extends React.Component {
  render() {
    return (
      <div id="stickyBody">
        <Header isLoggedIn={this.props.isLoggedIn} logout={this.props.logout}/>
        <main>
          <div className="row no-margin back-grey"><br/>&nbsp;</div>
          {this.props.children}
          <div className="row no-margin back-grey"><br/>&nbsp;</div>
        </main>
        <Footer />
      </div>
    );
  }
}

export default Root;
