import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import {Button,ButtonToolbar} from 'react-bootstrap';
import Fbpopup from './Fbpopup';
import axios from 'axios';


export default class Google extends Component {
    state={
        isLoggedin : false,
        userID : '',
        name: '',
        email:'',
        picture:'',
        flag:false
    }

    componentClicked = () => console.log('clicked');
    responseGoogle = response => {
        console.log(response);
        this.setState({
            isLoggedin: true,
            userID : response.profileObj.name,
            username : response.profileObj.name,
            email : response.profileObj.email,
            picture : response.profileObj.imageUrl
        })
        localStorage.setItem("username",this.state.username)
        localStorage.setItem("email",this.state.email)
        axios.post('http://127.0.0.1:5000/users/register2', this.state)
             .then(res => console.log(res.data));

    }

    render() {
      let addModalClose =()=> this.setState({flag:false})
        let ggContent;
        if(this.state.isLoggedin){
            ggContent=(
                <div style={{
                width: '400px',
                margin: 'auto',
                background : '#f4f4f4',
                padding : '20px'
                }}>
                 <img src={this.state.picture} alt={this.state.username}/>
                 <h1 align="center"> Welcome </h1>
                 <h1 align="center"> {this.state.username}</h1>
                 <h2 align="center"> Email : {this.state.email} </h2>
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
            ggContent=(<GoogleLogin
                clientId="866983284821-9742v69d8t11lhnl25alcc83gu49rbjr.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
                cookiePolicy={'single_host_origin'}
              />)
        }
        return(
            <div> {ggContent} </div>
        )
    }
}
