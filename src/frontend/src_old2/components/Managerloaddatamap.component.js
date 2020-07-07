import React,{Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios';

import ManagerChoosebetweenTwo from './managerchoosebetweentwo.component'

class ManagerMapLoadData extends Component {
  constructor(props) {
    super(props);
    this.state = {
        username :'',
        source_location: '',
        destination_location : '',
        no_of_vehicles: '',
        path1: [] ,
        path2: [] ,
        Getpathsvariable : false,
        nv_error:"",
        a : false,
        carbonfootprint1:"",
        carbonfootprint2:""
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeNoOfVehicles = this.onChangeNoOfVehicles.bind(this);
    this.OnChangemap = this.OnChangemap.bind(this);
    this.validate = this.validate.bind(this);
    this.onChangenv_error= this.onChangenv_error.bind(this);
}


onChangeNoOfVehicles(event) {
  this.setState({ no_of_vehicles: event.target.value });
}

OnChangemap(e){
    e.preventDefault(); 
    window.location= 'http://localhost:1234'  
}
onChangenv_error(event) {
  this.setState({ nv_error: event.target.value });
}
validate(){
  this.setState({
      nv_error:"" 
  });
let nv_error=""
if(!this.state.no_of_vehicles) { nv_error="This field cannot be left empty." ;}
if(nv_error){
           this.setState({nv_error : nv_error});
           return false;
       }
       return true;
};

onSubmit(e) {
    e.preventDefault();
    
    const data ={
      username: localStorage.getItem("username")
  }
  console.log(data)
  axios.post('http://localhost:5000/getsourcedestination' ,data)
       .then(response => {
          console.log(response.data['result']['source'])
          console.log(response.data['result']['destination'])
           this.setState({source_location: response.data['result']['source']});
           this.setState({destination_location: response.data['result']['destination']})
           this.setState({a:true})
  
           const Data = {
            username : localStorage.getItem("username") ,
            no_of_vehicles: this.state.no_of_vehicles,
            source_location : this.state.source_location,
            destination_location : this.state.destination_location
        }
      
        const isValid=this.validate();
        if(isValid){
        console.log(Data);
        axios.post('http://localhost:5000/gettwoshortestpaths',Data)
             .then(
                 res => 
                 {
                    this.setState({ path1:res.data['result']['paths'][0]});
                    this.setState({ path2:res.data['result']['paths'][1]});
                    this.setState({ carbonfootprint1:res.data['result']['cfp1']});
                    this.setState({ carbonfootprint2:res.data['result']['cfp2']});
                //   console.log(this.state.paths[0])
                //   console.log(res.data['result']['paths'])
                 }
             );
      
        this.setState({
            Getpathsvariable : true,
            a: false
        }); 
      }
  
  
       })
       .catch(function(error) {
           console.log(error);
       })
  
  
    
  //   const Data = {
  //       username : localStorage.getItem("username") ,
  //       no_of_vehicles: this.state.no_of_vehicles,
  //       source_location : this.state.source_location,
  //       destination_location : this.state.destination_location
  //   }
  
  //   const isValid=this.validate();
  //   if(isValid){
  //   console.log(Data);
  //   axios.post('http://localhost:5000/gettwoshortestpaths',Data)
  //        .then(
  //            res => 
  //            {
  //             this.setState({ path1:res.data['result']['paths'][0]});
  //             this.setState({ path2:res.data['result']['paths'][1]});
  //             console.log(this.state.paths[0])
  //             console.log(res.data['result']['paths'])
  //            }
  //        );
  
  //   this.setState({
  //       Getpathsvariable : true,
  //       a: false
  //   }); 
  // }
    
  }

    render() {
      return(

        <Router>
        <div>
        <form class="pt-5" onSubmit={this.onSubmit}>
            <div className="form-group">
                <label style={{color: "rgb(255,99,0)",fontSize: "large", fontWeight: "800"}}>Number Of Trucks: </label>
                <input type="number" min="1"
                       className="form-control" 
                       value={this.state.no_of_vehicles}
                       onChange={this.onChangeNoOfVehicles} required
                       />
            </div>
            {this.state.nv_error ? (<div style={{color:"red", fontSize: 14, fontWeight: "bold", textAlign:"center" }}>{this.state.nv_error}</div>) : null }
            <div className="form-group">
                <input type="submit" value="Submit" className="btn btn-warning"/>
            </div>
        </form>
    </div>
    <div>
            <button class="btn bg-success text-light" onClick={(e) => this.OnChangemap(e)}>Choose Nodes From Map</button>    
        </div>
    <div>
      {this.state.Getpathsvariable ?<ManagerChoosebetweenTwo Ppath1= {this.state.path1} carbonfootprint1={this.state.carbonfootprint1} Ppath2={this.state.path2} carbonfootprint2={this.state.carbonfootprint2} source_location={this.state.source_location} destination_location={this.state.destination_location} no_of_vehicles={this.state.no_of_vehicles}></ManagerChoosebetweenTwo>:null}
    </div>


    <Route path="/manager/choosebetweentwo" exact component={ManagerChoosebetweenTwo}/>
    </Router>


    )
    }
  }

export default ManagerMapLoadData