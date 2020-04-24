import "./manager.component.css"

import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import Register from './register.component'
import ExexutiveData from './Executiveloaddata.component'
import ExecutiveVisualize from './Executivevisualize.component'

export default class ExecutiveOfficer extends Component {
    constructor(props) {
        super(props);
        //using parent class' variables in the child class
        this.state = {
            //the id of vendor is received as parameter while this page is rendered
            engineer: this.props.match.params.id
        }
        this.handleClick = this.handleClick.bind(this);

    }

    handleClick(e){
      e.preventDefault();
      localStorage.clear();
      window.location= '/register'
     }

    render(){
        return (
                // <div>
                // <body class="sidebar-is-reduced">
                // <header class="l-header">
                //     <div class="l-header__inner clearfix">
                //     <div class="c-header-icon js-hamburger">
                //         <div class="hamburger-toggle"><span class="bar-top"></span><span class="bar-mid"></span><span class="bar-bot"></span></div>
                //     </div>
                //     <div class="c-header-icon has-dropdown"><span class="c-badge c-badge--header-icon animated shake">87</span><i class="fa fa-bell"></i>
                //         <div class="c-dropdown c-dropdown--notifications">
                //         <div class="c-dropdown__header"></div>
                //         <div class="c-dropdown__content"></div>
                //         </div>
                //     </div>
                //     <div class="c-search">
                //         <input class="c-search__input u-input" placeholder="Search..." type="text"/>
                //     </div>
                //     <div class="header-icons-group">
                //         <div class="c-header-icon basket"><span class="c-badge c-badge--header-icon animated shake">12</span><i class="fa fa-user-circle-o"></i></div>
                //         <div class="c-header-icon logout"><i class="fa fa-power-off"></i></div>
                //     </div>
                //     </div>
                // </header>
                // <div class="l-sidebar">
                //     <div class="logo">
                //     <div class="logo__txt">E</div>
                //     </div>
                //     <div class="l-sidebar__content">
                //     <nav class="c-menu js-menu">
                //         <ul class="u-list">
                //         <li class="c-menu__item is-active" data-toggle="tooltip" title="InputData">
                //             <div class="c-menu__item__inner"><i class="fa fa-file"></i>
                //             <div class="c-menu-item__title"><span>Input Data</span></div>
                //             </div>
                //         </li>
                //         <li class="c-menu__item has-submenu" data-toggle="tooltip" title="Modules">
                //             <div class="c-menu__item__inner"><i class="fa fa-puzzle-piece"></i>
                //             <div class="c-menu-item__title"><span>Modules</span></div>
                //             <div class="c-menu-item__expand js-expand-submenu"><i class="fa fa-angle-down"></i></div>
                //             </div>
                //             <ul class="c-menu__submenu u-list">
                //             <li>Payments</li>
                //             <li>Maps</li>
                //             <li>Notifications</li>
                //             </ul>
                //         </li>
                //         <li class="c-menu__item has-submenu" data-toggle="tooltip" title="Statistics">
                //             <div class="c-menu__item__inner"><i class="fa fa-bar-chart"></i>
                //             <div class="c-menu-item__title"><span>Statistics</span></div>
                //             </div>
                //         </li>
                //         <li class="c-menu__item has-submenu" data-toggle="tooltip" title="Gifts">
                //             <div class="c-menu__item__inner"><i class="fa fa-gift"></i>
                //             <div class="c-menu-item__title"><span>Gifts</span></div>
                //             </div>
                //         </li>
                //         <li class="c-menu__item has-submenu" data-toggle="tooltip" title="Settings">
                //             <div class="c-menu__item__inner"><i class="fa fa-cogs"></i>
                //             <div class="c-menu-item__title"><span>Settings</span></div>
                //             </div>
                //         </li>
                //         </ul>
                //     </nav>
                //     </div>
                // </div>
                // </body>
                // <main class="l-main">
                // <div class="content-wrapper content-wrapper--with-bg">
                //     <h1 class="page-title">Dashboard</h1>
                //     <div class="page-content">Content goes here</div>
                // </div>
                // </main>
                // </div>

                <Router>
                <div className="mt-4  container my-0">
                    <nav style= {{backgroundColor:"rgb(80,80,80)"}} className="border border-dark navbar navbar-expand-lg navbar-dark">

                      <div className="collapse navbar-collapse">
                      <a style={{fontSize:"large"}} class=" nav-link text-success font-weight-bolder" href="/executiveofficer">EXECUTIVE</a>
                        <button class="navbar-toggler " type="button" data-toggle="collapse" data-target=".dual-collapse2">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <ul className="navbar-nav mr-auto">

                        <li className="navbar-item">
                            <Link to="/executive/uploaddata" style={{color:"white"}} class="btn btn-outline-dark navbar-brand mx-0 ml-4 px-2 py-2  button  font-weight-bolder  pt-2 font-weight-bold" >Upload Data</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/executive/visualize" style={{color:"white"}} class="btn btn-outline-dark navbar-brand mx-3 px-2 py-2 button font-weight-bolder pt-2 font-weight-bold" >Visualize</Link>
                        </li>
                        </ul>
                      </div>

                      <div class="ml-auto">
                      <a class="btn bg-danger my-1 nav-link text-light  font-weight-bolder" href="/register" onClick={this.handleClick}><h6 class="font-weight-bold">Logout</h6></a>
                      </div>
                    </nav>

                    {/* <div className="container my-0">
                            <nav className="navbar navbar-expand-lg navbar-grey bg-dark">
                            <div class="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
                            <a class="navbar-brand mx-0 px-1 py-1  button  font-weight-bolder  text-success" href="/executive/uploaddata"><h1 style={{color:"rgb(90,166,255)"}} class=" pt-3 font-weight-bold">Upload Data</h1></a>
                            <button class="navbar-toggler " type="button" data-toggle="collapse" data-target=".dual-collapse2">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            <a class="navbar-brand mx-3 px-1 py-1 button font-weight-bolder  text-primary" href="/executive/visualize"><h1 style={{color:"rgb(58,200,18)"}} class=" pt-3 font-weight-bold">Heat Maps</h1></a>
                            <button class="navbar-toggler " type="button" data-toggle="collapse" data-target=".dual-collapse2">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            </div>


    <div class="navbar-collapse collapse w-100 order-3 dual-collapse2">
        <ul class="navbar-nav ml-auto">
            <li class="nav-item ">
                <a class="nav-link text-danger font-weight-bolder" href="#"><h6 class=" pt-3 font-weight-bold">Executive Officer</h6></a>
            </li>
            </ul>
    </div>
        </nav> */}

                    <br/>
                    <Route path="/register" component={Register}/>
                <Route path="/executive/uploaddata" component={ExexutiveData}/>
                <Route path="/executive/visualize" component={ExecutiveVisualize}/>
              </div>
            </Router>
        )
    }

}
