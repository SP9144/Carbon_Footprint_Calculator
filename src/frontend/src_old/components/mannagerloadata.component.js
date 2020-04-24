import React,{Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios';

import ManagerChoosebetweenTwo from './managerchoosebetweentwo.component'

class ManagerData extends Component {
  constructor(props) {
    super(props);
      this.state = {
        no_of_vehicles: '',
        source_location:'',
        destination_location:'',
        path1: [] ,
        path2: [] ,
        Getpathsvariable : false,
        nv_error:"",
        sl_error:"",
        dl_error:"",
        carbonfootprint1:"",
        carbonfootprint2:""
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeNoOfVehicles = this.onChangeNoOfVehicles.bind(this);
    this.onChangeSourceLocation = this.onChangeSourceLocation.bind(this);
    this.onChangeDestinationlocation = this.onChangeDestinationlocation.bind(this);
    this.validate = this.validate.bind(this);
    this.onChangenv_error= this.onChangenv_error.bind(this);
    this.onChangesl_error = this.onChangesl_error.bind(this);
    this.onChangedl_error = this.onChangedl_error.bind(this);
}

onChangeNoOfVehicles(event) {
  this.setState({ no_of_vehicles: event.target.value });
}

onChangeSourceLocation(event) {
  this.setState({ source_location: event.target.value });
}
onChangeDestinationlocation(event) {
  this.setState({ destination_location: event.target.value });
}
onChangenv_error(event) {
  this.setState({ nv_error: event.target.value });
}

onChangesl_error(event) {
  this.setState({ sl_error: event.target.value });
}
onChangedl_error(event) {
  this.setState({ dl_error: event.target.value });
}
validate(){
        this.setState({
            nv_error:"",
            sl_error:"",
            dl_error:""
        });
      let nv_error=""
      let sl_error=""
      let dl_error=""
     if(!this.state.no_of_vehicles) { nv_error="This field cannot be left empty." ;}
     if(!this.state.source_location) { sl_error="This field cannot be left empty." ;}
     if(!this.state.destination_location) { dl_error="This field cannot be left empty." ;}
     if(nv_error || sl_error || dl_error){
                 this.setState({nv_error : nv_error,sl_error : sl_error,dl_error: dl_error});
                 return false;
             }
             return true;
};
onSubmit(e) {
  e.preventDefault();
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
            // console.log(this.state.paths[0])
            console.log(res.data['result']['paths'])
           }
       );

  this.setState({
      Getpathsvariable : true
  });
}
}

    render() {
      return(
        <Router>
        <div>
            <form onSubmit={this.onSubmit}>
                <div className="form-group">
                    <label>NumberOfVehicles: </label>
                    <input type="number"
                           className="form-control"
                           value={this.state.no_of_vehicles}
                           onChange={this.onChangeNoOfVehicles}
                           />
                </div>
                {this.state.nv_error ? (<div style={{color:"red", fontSize: 14, fontWeight: "bold", textAlign:"center" }}>{this.state.nv_error}</div>) : null }
                <div className="form-group">
                    <label>Source_location: </label>
                    <input type="number"
                           className="form-control"
                           value={this.state.source_location}
                           onChange={this.onChangeSourceLocation}
                           />
                </div>
                {this.state.sl_error ? (<div style={{color:"red", fontSize: 14, fontWeight: "bold", textAlign:"center" }}>{this.state.sl_error}</div>) : null }
                <div className="form-group">
                    <label>Destination_location: </label>
                    <input type="number"
                           className="form-control"
                           value={this.state.destination_location}
                           onChange={this.onChangeDestinationlocation}
                           />
                </div>
                {this.state.dl_error ? (<div style={{color:"red", fontSize: 14, fontWeight: "bold", textAlign:"center" }}>{this.state.dl_error}</div>) : null }
                <div className="form-group">
                    <input type="submit" value="GetPossiblepaths" className="btn btn-primary"/>
                </div>
            </form>
        </div>
        <div>
          {this.state.Getpathsvariable ?<ManagerChoosebetweenTwo Ppath1= {this.state.path1} carbonfootprint1={this.state.carbonfootprint1} Ppath2={this.state.path2} carbonfootprint2={this.state.carbonfootprint2} source_location={this.state.source_location} destination_location={this.state.destination_location} no_of_vehicles={this.state.no_of_vehicles}></ManagerChoosebetweenTwo>:null}
        </div>


        <Route path="/manager/choosebetweentwo" exact component={ManagerChoosebetweenTwo}/>
        </Router>

      )
    }
  }

export default ManagerData