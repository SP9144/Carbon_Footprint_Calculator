import "./login.component.css"
import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'

import axios from 'axios';

import Manager from './manager.component';
import ExecutiveOfficer from './executiveofficer.component';

export default class LoginUser extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password:'',
            user_type:'',
            username_error:"",
            password_error:""
        }

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeusername_error= this.onChangeusername_error.bind(this);
        this.onChangepassword_error = this.onChangepassword_error.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.validate = this.validate.bind(this);
    }

    onChangeUsername(event) {
        this.setState({ username: event.target.value });
    }

    onChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    onChangeusername_error(event) {
        this.setState({ username_error: event.target.value });
    }

    onChangepassword_error(event) {
        this.setState({ password_error: event.target.value });
    }

    validate(){
        this.setState({
            email_error:"",
            password_error:"",
            username_error:"",
            usertype_error:""
        });
        let username_error=""
        let password_error=""
        if(!this.state.username){
            username_error="This field cannot be left empty."
        }
        if(!this.state.password){
            password_error="This field cannot be left empty."
        }
        if(password_error || username_error ){
            this.setState({password_error: password_error,username_error:username_error});
            return false;
        }
        return true;
    }

    onSubmit(e) {
        e.preventDefault();

        const newUser = {
            username: this.state.username,
            password : this.state.password
        }
        const isValid=this.validate();
        if(isValid){
        axios.post('http://127.0.0.1:5000/users/login',newUser)
             .then(
                 res =>
                 {
                    if(res.data.result=="false"){
                        this.setState({password_error:"User not registered."})
                    }
                    else if(res.data.result=="passnotmatch"){
                        this.setState({password_error:"Incorrect password."})
                    }
                    else{
                    console.log(res.data.result,res.data.token)
                    localStorage.setItem("token",res.data.token);
                    localStorage.setItem("username",newUser.username);
                     if(res.data.result.user_type==="Manager")
                     {
                        window.location= '/manager';
                        // window.open('http://localhost:3000/manager', '_blank');
                     }
                     else if (res.data.result.user_type==="Executive Officer")
                     {
                        window.location= '/executiveofficer';
                     }
                    }
                 }
             );
            }
        this.setState({
            username: '',
            password:'',
        });


    }

    render() {

        return(
            <Router>

           <div class="overlay">
            <div class="card">
            <article class="card-body mx-auto articleclass">
                <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
                <h4 class="card-title mt-3 text-center text-light ">Login</h4>
            <div>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text"> <i class="fa fa-user"></i> </span>
                    </div>
                        <input type="text"
                               className="form-control"
                               placeholder="Username"
                               value={this.state.username}
                               onChange={this.onChangeUsername}
                               />
                    </div>
                    {this.state.username_error ? (<div style={{color:"red", fontSize: 14, fontWeight: "bold", textAlign:"center" }}>{this.state.username_error}</div>) : null }
                    <div className="form-group input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text"> <i class="fa fa-lock"></i> </span>
                    </div>
                        <input type="password"
                               className="form-control"
                               placeholder="Enter password"
                               value={this.state.password}
                               onChange={this.onChangePassword}
                               />
                    </div>
                    {this.state.password_error ? (<div style={{color:"red", fontSize: 14, fontWeight: "bold", textAlign:"center" }}>{this.state.password_error}</div>) : null }
                    <div className="form-group">
                    <button type="submit" class="btn btn-primary btn-block bg-success"> Login  </button>
                    </div>
                </form>
            </div>
            <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
            <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
            <br></br><br></br><br></br>
            </article>
            </div>
            </div>

        <Route path="/manager" component={Manager}/>
        <Route path="/executiveofficer" component={ExecutiveOfficer}/>

        </Router>
        )
    }
}
