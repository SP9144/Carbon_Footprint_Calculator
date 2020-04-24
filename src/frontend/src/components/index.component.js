import "./index.component.css"
import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import bgimage from "../CarbonFp.jpg";

import Register from './register.component'
import LoginUser from './login.component'

export default class Index extends Component {
    constructor(props) {
        super(props);
        //using parent class' variables in the child class
        this.state = {      
            isLogin : false,
            isRegister : false
        }
    }



    OnChangestatetoLogin(e,currentProduct) {
        this.setState({isLogin : true})
        window.location= '/login';
     }

     OnChangestatetoRegister(e,currentProduct) {
        this.setState({isRegister : true})
        window.location= '/register';
     }
    render(){
        return (

        <Router>
        <div>
              <img src={bgimage}/>
              <div class="head"> Quantifying Carbon Footprint</div>
              <button class="btn1" onClick={(e) => this.OnChangestatetoLogin(e)}>Log In</button>
              <button class="btn2"onClick={(e) => this.OnChangestatetoRegister(e)}>Register</button>
        </div>

         <Route path="/login" component={LoginUser}/>
        <Route path="/register" component={Register}/>
    
    </Router>
        )
    
    }

}