import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"
import 'font-awesome/css/font-awesome.min.css'


// Importing all the Components
// import UsersList from './components/userslist.component'
import Register from './components/register.component'
import LoginUser from './components/login.component'
import Manager from './components/manager.component'
import ExecutiveOfficer from './components/executiveofficer.component'
import Index from './components/index.component'

function App() {
  
  return(<Router>
    <Route path="/manager" component={Manager}/>
    <Route path="/executiveofficer" component={ExecutiveOfficer}/>
    <Route path="/index" component={Index}/>
    <Route path="/register" component={Register}/>
    <Route path="/login" component={LoginUser}/>
</Router>);


}

export default App;
