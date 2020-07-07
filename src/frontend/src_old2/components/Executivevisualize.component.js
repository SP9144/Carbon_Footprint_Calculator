import React,{Component} from 'react';
import axios from 'axios';

class ExecutiveVisualize extends Component {
  constructor(props) {
    super(props);
    this.state = {
        products: []
    }
    // this.OnChangemap = this.OnChangemap.bind(this);
}

componentDidMount() {
    window.location= 'http://localhost:4000'
}

    render() {
      return(
        <div>
            {/* <button onClick={(e) => this.OnChangemap(e)}>ChooseFromMap</button>     */}
        </div>
    )
    }
  }

export default ExecutiveVisualize