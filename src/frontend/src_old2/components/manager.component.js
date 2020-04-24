import "./manager.component.css"
import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import Register from './register.component'
import ManagerChooseLoadOption from './managerloaddataoption.component';
import ManagerShortestPath from './managershortestpath.component';
// import ManagerPreemptive from './managerpreemptive.component';
import CompanyAnalysis from './companyanalysis.components'

export default class Manager extends Component {
    constructor(props) {
        super(props);
        //using parent class' variables in the child class
        this.state = {
            //the id of vendor is received as parameter while this page is rendered
            manager: this.props.match.params.id            
        }
        this.OnChangemap = this.OnChangemap.bind(this);
        this.OnChangeLoadData = this.OnChangeLoadData.bind(this)
    }

OnChangemap(e){
        e.preventDefault(); 
        window.location= 'http://localhost:1234'  
    }

OnChangeLoadData(e){
      e.preventDefault();
      window.location= '/manager/managerdata'
}

logout(){
    localStorage.clear();
}

    render(){
        return (

            <Router>
                {/* <div>

                <body class="sidebar-is-reduced">
                <header class="l-header">
                    <div class="l-header__inner clearfix">
                    <div class="c-header-icon js-hamburger">
                        <div class="hamburger-toggle"><span class="bar-top"></span><span class="bar-mid"></span><span class="bar-bot"></span></div>
                    </div>
                    <div class="c-header-icon has-dropdown"><span class="c-badge c-badge--header-icon animated shake">87</span><i class="fa fa-bell"></i>
                        <div class="c-dropdown c-dropdown--notifications">
                        <div class="c-dropdown__header"></div>
                        <div class="c-dropdown__content"></div>
                        </div>
                    </div>
                    <div class="c-search">
                        <input class="c-search__input u-input" placeholder="Search..." type="text"/>
                    </div>
                    <div class="header-icons-group">
                        <div class="c-header-icon basket"><span class="c-badge c-badge--header-icon animated shake">12</span><i class="fa fa-user-circle-o"></i></div>
                        <div class="c-header-icon logout"><i class="fa fa-power-off"></i></div>
                    </div>
                    </div>
                </header>
                <div class="l-sidebar">
                    <div class="logo">
                    <div class="logo__txt">M</div>
                    </div>
                    <div class="l-sidebar__content">
                    <nav class="c-menu js-menu">
                        <ul class="u-list">
                        <li class="c-menu__item is-active" data-toggle="tooltip" title="InputData">
                            
                        </li>
                        <li class="c-menu__item has-submenu" data-toggle="tooltip" title="Modules">
                            <div class="c-menu__item__inner"><i class="fa fa-puzzle-piece"></i>
                            <div class="c-menu-item__title"><span>Modules</span></div>
                            <div class="c-menu-item__expand js-expand-submenu"><i class="fa fa-angle-down"></i></div>
                            </div>
                            <ul class="c-menu__submenu u-list">
                            <li>Payments</li>
                            <li>Maps</li>
                            <li>Notifications</li>
                            </ul>
                        </li>
                        <li class="c-menu__item has-submenu" data-toggle="tooltip" title="Statistics">
                            <div class="c-menu__item__inner"><i class="fa fa-bar-chart"></i>
                            <div class="c-menu-item__title"><span>Statistics</span></div>
                            </div>
                        </li>
                        <li class="c-menu__item has-submenu" data-toggle="tooltip" title="Gifts">
                            <div class="c-menu__item__inner"><i class="fa fa-gift"></i>
                            <div class="c-menu-item__title"><span>Gifts</span></div>
                            </div>
                        </li>
                        <li class="c-menu__item has-submenu" data-toggle="tooltip" title="Settings">
                            <div class="c-menu__item__inner"><i class="fa fa-cogs"></i>
                            <div class="c-menu-item__title"><span>Settings</span></div>
                            </div>
                        </li>
                        </ul>
                    </nav>
                    </div>
                </div>
                </body>
                
                <main class="l-main">
                <div class="content-wrapper content-wrapper--with-bg">
                    <h1 class="page-title">Dashboard</h1>
                    <div class="page-content">Content goes here</div>
                </div> */}
                
                {/* <div>
                <button onClick={(e) => this.OnChangemap(e)}>ChooseFromMap</button>
                </div>
                <div>
                <button onClick={(e) => this.OnChangeLoadData(e)}>LoadData</button>
                </div>

                </main>
                
                </div> */}

                {/* <Route path="/manager/managerdata" component={ManagerData}/> */}

    <div className="container my-0">
        <nav className="navbar navbar-expand-lg navbar-grey bg-dark">
        <div class="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
        <a class="nav-link text-danger font-weight-bolder" href="/manager">Manager</a>
        <button class="navbar-toggler " type="button" data-toggle="collapse" data-target=".dual-collapse2">
            <span class="navbar-toggler-icon"></span>
        </button>
        <a class="navbar-brand mx-0 px-1 py-1  button  font-weight-bolder  text-success pt-2 font-weight-bold" href="/manager/uploaddatachoose">CFP Calculation</a>
        <button class="navbar-toggler " type="button" data-toggle="collapse" data-target=".dual-collapse2">
            <span class="navbar-toggler-icon"></span>
        </button>
        <a class="navbar-brand mx-3 px-1 py-1 button font-weight-bolder pt-2 font-weight-bold text-primary" href="/manager/analysis">Log Book</a>
        <button class="navbar-toggler " type="button" data-toggle="collapse" data-target=".dual-collapse2">
            <span class="navbar-toggler-icon"></span>
        </button>
        </div>
{/*           
            <ul className="navbar-nav mr-auto list-group list-unstyled">
             
             <li className="list-group-item nav-link hover bg-warning">
                <Link to="/manager/uploaddatachoose" className="text-dark nav-item text-lg">Carbon Footprint Calculation</Link>
              </li>
              
              <li className="list-group-item  bg-danger">
                <Link to="/manager/analysis" className="text-dark">Logbook</Link>
              </li>
              </ul> */}
            
    <div class="navbar-collapse collapse w-100 order-3 dual-collapse2">
        <ul class="navbar-nav ml-auto">
            <li class="nav-item ">
                <a class="nav-link text-danger font-weight-bolder" href="/register" onClick={this.logout()}><h6 class=" pt-3 font-weight-bold">Logout</h6></a>
            </li>
            </ul>
    </div>
        </nav>

        <br/>
             
                <Route path="/manager/shortestpath" exact component={ManagerShortestPath}/>
                <Route path="/manager/uploaddatachoose" component={ManagerChooseLoadOption}/>
                {/* <Route path="/manager/preemptivecarbonfootprint" component={ManagerPreemptive}/> */}
                <Route path="/manager/analysis" component={CompanyAnalysis}/>
                <Route path="/register" component={Register}/>

    
      </div>
            </Router>
        )
    }

}