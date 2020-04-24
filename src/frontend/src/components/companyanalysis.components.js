import React,{Component} from 'react';
import axios from 'axios';

class CompanyAnalysis extends Component {

  constructor(props) {
    super(props);
    this.state = {products: [],username:localStorage.getItem("username"),net_cfp:0}
}

async componentDidMount() {

    const data ={
        username : localStorage.getItem("username")
    }

    console.log(data)
    await axios.post('http://localhost:5000/companyanalysis' ,data)
         .then(response => {
             console.log(response.data['result']['d'])
             this.setState({products: response.data['result']['d']});
             console.log(this.state.products)
         })
         .catch(function(error) {
             console.log(error);
         })
    axios.post('http://localhost:5000/cfp' ,data)
         .then(res =>{
           console.log(res.data.result)
           this.setState({net_cfp: res.data.result.d[0]});
           console.log(this.state.net_cfp)
         })

}

    render() {
      return(

          <div>
            <h1 class="align-center text-info py-2 bg-dark text-center font-weight-bolder">MANAGER'S LOG</h1>
              <table className="table table-striped table-hover ">
                    <thead class="table-dark">
                        <tr>
                            <th>Date and Time</th>
                            <th>Number of Trucks</th>
                            <th>Source Node</th>
                            <th>Destination Node</th>
                            <th>Carbon Footprint</th>
                        </tr>
                    </thead>
                    <tbody>
                    { 
                        this.state.products.map((currentProduct, i) => {
                            return (
                                <tr>
                                    <td class="text-light">{currentProduct[0]}</td>
                                    <td class="text-light">{currentProduct[1]}</td>
                                    <td class="text-light">{currentProduct[2]}</td>
                                    <td class="text-light">{currentProduct[3]}</td>
                                    <td class="text-light">{currentProduct[4]}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
                <div class="d-flex justify-content-center">
                {this.state.net_cfp ? (<div class= "btn btn-primary font-weight-bold text-white">Total CFP : {this.state.net_cfp}</div>) : null }
                </div>
            </div>

            
      )
    }
  }

export default CompanyAnalysis
