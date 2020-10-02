import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import 'materialize-css/dist/css/materialize.min.css';
import M from "materialize-css";
import './navbar.css';


class Navbar extends Component {

    componentDidMount() {
        M.Sidenav.init(this.Sidenav);
    }

    render() {
        return (
            <nav id="nav-container">
                <Link to="/" id="logo">Google Cloud Vision API Image Label Classification</Link>

                <div className="nav-links-container">
                    <NavLink to="#" data-target="mobile-menu" id="mobile-menu-hamburger" className="sidenav-trigger">
                        <i className="material-icons" id="hamburger">menu</i></NavLink>
                    <ul id="nav-ul">
                        <li className="nav-li"><NavLink to="/"><i className="tiny material-icons">home</i> Home</NavLink></li>
                        <li className="nav-li"><NavLink to="/gallery"><i className="tiny material-icons">image</i> Gallery</NavLink></li>
                    </ul>

                    <ul className="sidenav" id="mobile-menu" ref={Sidenav => {this.Sidenav = Sidenav; }}>
                        <li className="nav-li"><NavLink to="/"><i className="tiny material-icons">home</i> Home</NavLink></li>
                        <li className="nav-li"><NavLink to="/gallery"><i className="tiny material-icons">image</i> Gallery</NavLink></li>
                    </ul>
                    </div>
            </nav>
        );
    }
  }
   
  export default Navbar;