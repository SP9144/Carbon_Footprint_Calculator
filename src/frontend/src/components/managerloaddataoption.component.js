import React,{Component} from 'react';
import axios from 'axios';

import ManagerData from './mannagerloadata.component'
import ManagerMapLoadData from './Managerloaddatamap.component'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class ManagerChooseLoadOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
        v : false
    }
}

    render() {
      return(
        <Router>
       {/* <nav className="navbar navbar-expand-lg navbar-light bg-light">
         <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
             <li className="navbar-item">
                <Link to="/manager/uploaddatachoose/uploaddatamanual" className="nav-link">Add Nodes Manually</Link>
              </li>
              <li className="navbar-item">
                <Link to="/manager/uploaddatachoose/uploaddatamap" className="nav-link">Add Nodes on</Link>
              </li>
            </ul>
          </div>
        </nav>  */}
        <div class="col-md-12 text-center">
        <a class=" button btn-lg bg-primary btn-outline-primary px-2 py-2 text-light text-decoration-none font-weight-bold" style={{fontSize:"medium"}} href="/manager/uploaddatachoose/uploaddatamanual">Add Nodes Manually</a>
        <button class="navbar-toggler " data-toggle="collapse" type="button" data-toggle="collapse">
            <span class=""></span>
        </button>
        <a class="button btn-lg bg-info tn-outline-info  px-2 py-2 text-light text-decoration-none  font-weight-bold" style={{fontSize:"medium"}} href="/manager/uploaddatachoose/uploaddatamap">Add Nodes on Map</a>
        <button class="navbar-toggler " data-toggle="collapse" type="button" data-toggle="collapse">
            <span class="navbar-toggler-icon"></span>
        </button>
        </div>



     
        <Route path="/manager/uploaddatachoose/uploaddatamanual" component={ManagerData}/>  
        <Route path="/manager/uploaddatachoose/uploaddatamap" component={ManagerMapLoadData}/>
        </Router> 
    )
    }
  }

export default ManagerChooseLoadOption