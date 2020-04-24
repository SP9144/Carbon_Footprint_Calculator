import React,{Component} from 'react';
import axios from 'axios';

class CompanyAnalysis extends Component {

  constructor(props) {
    super(props);
    this.state = {products: []}
}

componentDidMount() {

    const data ={
        username : localStorage.getItem("gotname")
    }

    console.log(data)
    axios.post('http://localhost:5000/companyanalysis' ,data)
         .then(response => {
             console.log(response.data['result']['d'])
             this.setState({products: response.data['result']['d']});
             console.log(this.state.products)
         })
         .catch(function(error) {
             console.log(error);
         })

}

    render() {
      return(

          <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>nooftrucks</th>
                            <th>Source</th>
                            <th>Destination</th>
                            <th>carbonfootprint</th>
                            <th>creditsspent</th>
                        </tr>
                    </thead>
                    <tbody>
                    { 
                        this.state.products.map((currentProduct, i) => {
                            return (
                                <tr>
                                    <td>{currentProduct[0]}</td>
                                    <td>{currentProduct[1]}</td>
                                    <td>{currentProduct[2]}</td>
                                    <td>{currentProduct[3]}</td>
                                    <td>{currentProduct[4]}</td>
                                    <td>{currentProduct[5]}</td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>

            
      )
    }
  }

export default CompanyAnalysis