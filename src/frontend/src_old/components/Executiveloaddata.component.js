import React,{Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios';


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

onClickUpload = (e) => {
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

    render() {
      return(
        <Router>
        <div>
        <p>Upload Shape File:</p>
        <input type="file" name="file" onChange={this.onFileChange}/>
        <button type="button" onClick={this.onClickUploadShape}>UploadShape</button>
        <p>Upload Data File:</p>
        <input type="file" name="file" onChange={this.onFileChange}/>
        <button type="button" onClick={this.onClickUpload}>UploadData </button>
        </div>

        </Router>

      )
    }
  }

export default ExexutiveData