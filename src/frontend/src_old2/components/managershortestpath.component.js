import React,{Component} from 'react';
import axios from 'axios';

class ManagerShortestPath extends Component {
  constructor(props) {
    super(props);
    this.state = {
        products: []
    }
    this.OnChangemap = this.OnChangemap.bind(this);
}

OnChangemap(e){
    e.preventDefault(); 
    window.location= 'http://localhost:1234'  
}
    render() {
      return(
        <div>
            <button onClick={(e) => this.OnChangemap(e)}>ChooseFromMap</button>    
          </div>
    )
    }
  }

export default ManagerShortestPath