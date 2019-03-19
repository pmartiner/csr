import React from 'react';

import fb from "../../media/inicio/FACEBOOK_LOGO.png";
import tw from "../../media/inicio/TWITTER_LOGO.png";
import yt from "../../media/inicio/YOUTUBE_LOGO.png";

export class Footer extends React.Component {
  render() {
    return (
      <footer className="page-footer">
          <div className="container">
            <div className="row">
              <div className="col l6 s12">
                <p className="tit-foot white-text avenir-medium">INFORMACIÓN DE CONTACTO</p>
                <p className="tit-foot white-text text-lighten-4 avenir-ultralight">
                  Liga Periférico Insurgentes sur 4903-1<br />
                  Col. Parques del Pedregal, Delegación<br />
                  Tlalpan. CP. 14010<br />
                  <br />
                  Teléfono: 50900620
                </p>
                <a className="tit-foot white-text" href="#!">AVISO DE PRIVACIDAD</a>
              </div>
              <div className="col l5 offset-l1 s12">
                <div className="row avenir-ultralight">
                  <div className="col s12 m12 l12">
                    <p className="tit-foot white-text avenir-medium">NUESTRAS REDES SOCIALES</p>
                  </div>
                  <div className="col s2 m2 l2">
                    <a href="#!"><img alt="Facebook" src={fb}></img></a>
                  </div>
                  <div className="col s2 m2 l2">
                    <a href="#!"><img alt="Twitter" src={tw}></img></a>
                  </div>
                  <div className="col s2 m2 l2">
                    <a href="#!"><img alt="YouTube" src={yt}></img></a>
                  </div>
                </div>
                <div className="row avenir-ultralight">
                  <div className="col s12 m12 l12">
                    <p className="tit-foot white-text avenir-medium">NUESTROS ALIADOS</p>
                    <span className="tit-foot">Colegio de Estudios Superiores de México</span>
                    <br/>
                    <span className="tit-foot">Gooster</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </footer>
    );
  }
}

export default Footer;
