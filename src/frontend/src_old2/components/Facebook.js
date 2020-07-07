import React, { Component } from 'react';
import ReactDOM from "react-dom"
import FacebookLogin from 'react-facebook-login';
import Fbpopup from './Fbpopup';
import {Button,ButtonToolbar} from 'react-bootstrap';
import axios from 'axios';

export default class Facebook extends Component {
    state={
        isLoggedin : false,
        userID : '',
        username: '',
        email:'',
        picture:'',
        flag: false,
    }
    componentClicked = () => console.log('clicked');
    responseFacebook = response => {
        console.log(response);
        this.setState({
            isLoggedin: true,
            userID : response.userID,
            username : response.name,
            email : response.email,
            picture : response.picture.data.url
        })
        localStorage.setItem("username",this.state.username)
        localStorage.setItem("email",this.state.email)
        axios.post('http://127.0.0.1:5000/users/register2', this.state)
             .then(res => console.log(res.data));
    }
    render() {
      let addModalClose =()=> this.setState({flag:false})
        let fbContent;
        if(this.state.isLoggedin){
            fbContent=(
              <div style={{
                width: '400px',
                margin: 'auto',
                background : '#f4f4f4',
                padding : '20px'
                }}>
                 <img src={this.state.picture} alt={this.state.username}/><br/><br/>
                 <h1 align="center"> Welcome </h1>
                 <h1 align="center"> {this.state.username}</h1><br/>
                 <h2 align="center"> Email : {this.state.email} </h2>
              <br/>
              <ButtonToolbar>
              <Button
              variant='success'
              onClick={()=>this.setState({flag:true})}
              >Click here</Button>
              </ButtonToolbar>
              <Fbpopup
              show={this.state.flag}
              onHide={addModalClose}
              dataFromParent={this.state.username}
              />
              <br/>
              <br/>
              </div>
            );
        }
        else{
            fbContent=(<FacebookLogin
    appId="516263635977586"
    autoLoad={false}
    fields="name,email,picture"
    onClick={this.componentClicked}
    callback={this.responseFacebook} />)
        }
        return(
            <div> {fbContent} </div>
        )
    }
}
