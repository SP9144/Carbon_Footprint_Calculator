import React,{Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css



class ExexutiveData extends Component {
  constructor(props) {
    super(props);
      this.state = {
       selectedFile : null,
       username : localStorage.getItem("gotname") 
    }

    this.onClickUploadShape = this.onClickUploadShape.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    
}

onFileChange = (e) => {
  this.setState({
    selectedFile: e.target.files[0],
  })
}
onClickUploadShape = (e) => {
  confirmAlert({
    title: 'Confirm to submit',
    message: 'Are you sure to do this.',
    buttons: [
      {
        label: 'Yes',
        onClick: () => {
          const data = new FormData()
          data.append('file', this.state.selectedFile)
          data.append('username',this.state.username)
          console.log(data)
          axios.post('http://localhost:5000/executiveupload',data)
               .then(
                   res => 
                   {
                    console.log(res.data)
                   }
               )
               .catch(err => {
                try {
                  alert(`Error: ${err.response.data.error}`)
                }
                catch(e) {
                  alert(err)
                }
              });
        }
      },
      {
        label: 'No',
        onClick: () => alert('Clicked No')
      }
    ]
  });
}

onClickUpload = (e) => {

      confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure to do this.',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
            const data = new FormData()
            data.append('file', this.state.selectedFile)
            data.append('username',this.state.username)
            console.log(data)
            axios.post('http://localhost:5000/executiveuploaddata',data)
            .then(
            res => 
            {
             console.log(res.data)
             }
            )
            .catch(err => {
            try {
              alert(`Error: ${err.response.data.error}`)
            }
            catch(e) {
             alert(err)
            }
             });     
            }
          },
          {
            label: 'No',
            onClick: () => alert('Clicked No')
          }
        ]
      });
}

    render() {
      return(
        <Router>
        <div class="">
          <div class="">
        <p style={{color: "rgba(0, 128, 248, 0.897)", fontSize: "x-large" ,fontWeight: "600"}}>Upload Shape File:</p>
        <input style={{fontSize:"large"}} class="pt-3 text-light" type="file" name="file" onChange={this.onFileChange}/>
        <button class="ml-3 btn btn-large bg-success" type="button" onClick={this.onClickUploadShape}>Upload</button>
        </div>
        <br>
        </br>
        <hr class="mt-3 pt-1 bg-warning"></hr>
        <br>
        </br>
        <div >
        <p class="pt-6" style={{color: "rgba(0, 128, 248, 0.897)", fontSize: "x-large" ,fontWeight: "600"}}>Upload Data File:</p>
        <input style={{fontSize:"large"}} class="pt-4 text-light"  type="file" name="file" onChange={this.onFileChange}/>
        <button class="ml-3 btn btn-large bg-success" type="button" onClick={this.onClickUpload}>Upload</button>
        </div>
        </div>
       
        </Router>

      )
    }
  }

export default ExexutiveData