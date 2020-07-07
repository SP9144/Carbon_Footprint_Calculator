import "./register.component.css"
import axios from 'axios';
import React, {Component} from 'react';
import Facebook from './Facebook'
import Google from './Google'
import LoginUser from './login.component'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password:'',
            user_type:'',
            email_error:"",
            password_error:"",
            username_error:"",
            usertype_error:"",
            users:[
                {
                  value:"",
                  display:"Select Usertype"
                },
                {
                  value:"Manager",
                  display:"Manager"
                },
                {
                  value:"Executive Officer",
                  display:"Executive Officer"
                }
              ],
        }

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeUser_type = this.onChangeUser_type.bind(this);
        this.onChangeemail_error = this.onChangeemail_error.bind(this);
        this.onChangepassword_error = this.onChangepassword_error.bind(this);
        this.onChangeusertype_error = this.onChangeusertype_error.bind(this);
        this.onChangeusername_error = this.onChangeusername_error.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.validate = this.validate.bind(this);
    }


    onChangeusertype_error(event) {
        this.setState({ usertype_error: event.target.value });
    }

    onChangeUsername(event) {
        this.setState({ username: event.target.value });
    }

    onChangeEmail(event) {
        this.setState({ email: event.target.value });
    }

    onChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    onChangeUser_type(event) {
        this.setState({ user_type: event.target.value });
    }

    onChangeemail_error(event) {
        this.setState({ email_error: event.target.value });
    }

    onChangeusername_error(event) {
        this.setState({ username_error: event.target.value });
    }

    onChangepassword_error(event) {
        this.setState({ password_error: event.target.value });
    }

    username_validate=async()=>{
        await axios.post('http://127.0.0.1:5000/users/usernamevalidation',this.state)
        .then(
            res=>{
                if(res.data.result=="true"){
                this.setState({username_error:"Username is already in use."})
                this.setState({username:""})
                }
            })
    }


    validate(){
        this.setState({
            email_error:"",
            password_error:"",
            username_error:"",
            usertype_error:""
        });
        let email_error="";
        let password_error="";
        let username_error="";
        let usertype_error="";
        if(!this.state.email.includes("@gmail.com")){
            email_error="Invalid Email address.";
            this.setState({email:""})
            if(!this.state.email) { email_error="This field cannot be left empty." ;}
        }
        // if(!(this.state.user_type=="Executive Officer")){
        //     if(!(this.state.user_type=="Manager")){
        //     usertype_error="Usertype can only be \"Manager\" or \"Executive Officer\"." 
        //     }
        //     if(!this.state.user_type){
        //         usertype_error="This field cannot be left empty."
        //     }
        // }
        if(!this.state.user_type){
                    usertype_error="You must select a usertype."
                }
        this.username_validate()
        if(!this.state.username){
            username_error="This field cannot be left empty."
        }
        let passwordlength_check= this.state.password.length >6 ? true : false
        let number_check = this.state.password.match(/\d+/g) != null ? true : false
        let uppercase_check=this.state.password.match(/[A-Z]/) != null ? true : false
        let symbols=new RegExp(/[^ A-Z a-z0-9]/);
        let symbol_check=symbols.test(this.state.password)
        if( !passwordlength_check || !number_check || !uppercase_check || !symbol_check ){
           password_error="Weak Password. Password should be of length more than 6. It should contain atleast one capital letter,number and special character."  
           this.setState({password:""})
           if(!this.state.password){
            password_error="This field cannot be left empty."
        }    
        }
        if(email_error || usertype_error || password_error || username_error ){
            this.setState({email_error : email_error,usertype_error : usertype_error,password_error: password_error,username_error:username_error});
            return false;
        }
        return true;
    };

    onSubmit(e) {
        e.preventDefault();

        const newUser = {
            username: this.state.username,
            email: this.state.email,
            password : this.state.password,
            user_type : this.state.user_type,
        }
        const isValid=this.validate();
        if(isValid){
        console.log(this.state)
        axios.post('http://127.0.0.1:5000/users/register', newUser)
             .then(res => console.log(res.data));
        alert("User registered.")
        this.setState({
            username: '',
            email: '',
            password:'',
            user_type:'',
        });
        }
    }

    // login=()=>
    // {
    //     let history=useHistory()
    //     history.push('/login')
    // }

    render(){
        return (
            <Router>
            <div class="overlay">
            <div class="card">
            <article class="card-body mx-auto articleclass">
            <div class="d-flex justify-content-center ">
                <h1 class="card-title mt-3 text-light">REGISTER</h1>
                </div>
                <br></br><br></br><br></br><br></br>
                {/* <p>
                <Facebook />
                </p> */}
                <div class="btn btn-block">
                <p>
                <Google />
                </p>
                </div>
                <p>
                <button type="submit" class="btn btn-primary btn-block bg-success" onClick={event =>  window.location.href='/login'}> Login </button>
                </p>
                
                <p class="divider-text">
                    <span class="bg-light text-dark mt-2 pt-2">OR</span>
                </p>

                <br></br>
                <form onSubmit={this.onSubmit}>
                <div class="form-group input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text"> <i class="fa fa-user"></i> </span>
                    </div>
                    <input name="" class="form-control" placeholder="Username" type="text"
                    value={this.state.username}
                    onChange={this.onChangeUsername} required
                    />
                </div>
                {this.state.username_error ? (<div class="pb-2" style={{color:"yellow", fontSize: 14, fontWeight: "bold", textAlign:"center" }}>{this.state.username_error}</div>) : null }
                <div class="form-group input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text"> <i class="fa fa-envelope"></i> </span>
                    </div>
                    <input name="" class="form-control" placeholder="Email address" type="text"
                    value={this.state.email} required
                    onChange={this.onChangeEmail}/>
                </div>
                {this.state.email_error ? (<div class="pb-2"  style={{color:"yellow", fontSize: 14, fontWeight: "bold", textAlign:"center" }}>{this.state.email_error}</div>) : null }
                {/* <div class="form-group input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text"> <i class="fa fa-envelope"></i> </span>
                    </div>
                    <input name="" class="form-control" placeholder="Manager or Executive Officer" type="text"
                    value={this.state.user_type} required
                    onChange={this.onChangeUser_type}
                    />
                </div> */}
                <div class="btn btn-block mt3">
                <span class="input-group-text"> <i class="fa fa-user pr-2 mr-2"></i>
                <select 
                  value={this.state.user_type}
                  onChange={e=>
                  this.setState({
                    user_type: e.target.value,
                    usertype_error:
                    e.target.value===""
                    ? "You must select a usertype."
                    : ""
                  })
                  }
                  >
                  {this.state.users.map(user => (
                  <option
                  key={user.value}
                  value={user.value}
                  >
                   {user.display}
                 </option>
                   ))}
                  </select>
                  </span>
                </div>
                {this.state.usertype_error ? (<div class="pb-2"  style={{color:"yellow", fontSize: 14, fontWeight: "bold", textAlign:"center" }}>{this.state.usertype_error}</div>) : null }
                <br></br>
                <div class="form-group input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text"> <i class="fa fa-lock"></i> </span>
                    </div>
                    <input class="form-control" placeholder="Createpassword" type="password"
                    value={this.state.password} required
                    onChange={this.onChangePassword}
                    />
                </div>
                {this.state.password_error ? (<div class="pb-3" style={{color:"yellow", fontSize: 14, fontWeight: "bold", textAlign:"center" }}>{this.state.password_error}</div>) : null }
                <div class="form-group">
                    <button type="submit" class="btn btn-primary btn-block bg-success"> Register </button>
                </div>
                <br></br>
                <br></br>
                <br></br><br></br><br></br><br></br><br></br><br></br>
                {/* <p class="text-center text-light ">  <a class=" btn  bg-warning text-dark" href=""> Have an account? Log In</a> </p>                                                                  */}
            </form>
            </article>
            </div>
            </div>
            <Route path="/login" component={LoginUser}/>
            </Router>
        )
    }
}