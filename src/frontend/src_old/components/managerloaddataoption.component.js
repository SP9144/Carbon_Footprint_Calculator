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
         <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          {/* <Link to="/manager/shortestpath" className="navbar-brand">ShortestPath</Link> */}
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
             <li className="navbar-item">
                <Link to="/manager/uploaddatachoose/uploaddatamanual" className="nav-link">UploaddataManual</Link>
              </li>
              <li className="navbar-item">
                <Link to="/manager/uploaddatachoose/uploaddatamap" className="nav-link">UploaddataMap</Link>
              </li>
            </ul>
          </div>
        </nav>
        </div>
        <Route path="/manager/uploaddatachoose/uploaddatamanual" component={ManagerData}/>  
        <Route path="/manager/uploaddatachoose/uploaddatamap" component={ManagerMapLoadData}/>
        </Router> 
    )
    }
  }

export default ManagerChooseLoadOption