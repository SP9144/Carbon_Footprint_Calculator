import React, {Component} from 'react';
import {Modal,Button,Row,Col,Form} from 'react-bootstrap';
import axios from 'axios'


export default class Fbpopup extends Component {
    constructor(props){
        super(props);
        this.state = {
            user_type:'',
            error:"",
            username:this.props.dataFromParent,
            // username:localStorage.getItem("username"),
            flag:0,
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onSubmit2 = this.onSubmit2.bind(this);
        this.validate = this.validate.bind(this);
        this.onChangeUser_type = this.onChangeUser_type.bind(this);
        this.onChangeerror = this.onChangeerror.bind(this);
        this.onChangeflag = this.onChangeflag.bind(this);
    }
    onChangeUser_type(event) {
        this.setState({ user_type: event.target.value });
    }
    onChangeerror(event) {
      this.setState({ error: event.target.value });
    }
    onChangeflag(event) {
      this.setState({ flag: event.target.value });
    }

     
   validate(){
      this.setState({
        error:"",
       });
    let error=""
    if(!(this.state.user_type=="Manager")){
      if(!(this.state.user_type=="Executive Officer")){
        error="Usertype can only be \"Manager\" or \"Executive Officer\"." 
      }
      if(!this.state.user_type){
        error="This field cannot be left empty."
      }
    }
    if(error ){
      this.setState({error: error});
      return false;
     }
     this.setState({
      user_type: this.state.user_type
      })
      console.log(this.state)
      axios.post('http://127.0.0.1:5000/users/register3', this.state)
         .then(res => {
          console.log(res.data)
         });
     return true;
   }

    componentDidMount(){
      axios.post('http://127.0.0.1:5000/users/logincheck',this.state)
      .then(res=> {
        console.log(res.data.result)
        if(res.data.result=="notfound")
        {
        this.setState({flag:0})
        }
        else if(res.data.result.username===res.data.result.user_type)
        {
        console.log("here")
        this.setState({flag:0})
        }
        else
        {
        this.setState({
          user_type:res.data.result.user_type,
          flag:1,
        })
       }
       }
      )}

    async onSubmit(e) {
        e.preventDefault();
        let isValid=await this.validate();
        console.log(this.state.error)
        if(isValid)
        {
        if(this.state.user_type==="Manager"){
          window.location= '/manager';
        }
        if(this.state.user_type==="Executive Officer"){
          window.location= '/executiveofficer';
        }
        }
    }

    onSubmit2(e) {
      e.preventDefault();
      if(this.state.user_type==="Manager"){
        window.location= '/manager';
      }
      if(this.state.user_type==="Executive Officer"){
        window.location= '/executiveofficer';
      }
    }

    render(){
      if (!this.state.flag)
      {
        return (
        <Modal
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Fill in the Form
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>User-type</h4>
            <br></br>
            <form onSubmit={this.onSubmit}>
            <input type="text" class="form-control" placeholder="Manager or Executive Officer" type="text"
            value={this.state.user_type}
            onChange={this.onChangeUser_type}
            />
            {this.state.error ? (<div style={{color:"red", fontSize: 14, fontWeight: "bold", textAlign:"center" }}>{this.state.error}</div>) : null }
            <br></br>
            <button type="submit" class="btn btn-primary btn-block bg-success"> Login  </button>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
        );
        }
        else
        {
         return(
         <Modal
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Do you want to login?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
            <button type="submit" class="btn btn-primary btn-block bg-success" onClick={this.onSubmit2}> Login  </button>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
         )}
    }
}
