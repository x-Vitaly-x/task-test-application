import React from 'react'
import MortgageForm from './mortgage/mortgage_form'
import MortgageField from './mortgage/mortgage_field'
import axios from 'axios'
import { Modal } from 'bootstrap.native/dist/bootstrap-native-v4'
import MortgageMenu from "./mortgage/mortgage_menu";

class Mortgages extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      mortgages: []
    };
  }

  componentDidMount () {
    this.fetchMortgages();
  }

  fetchMortgages () {
    axios.get('/api/v1/mortgages')
      .then(response => {
        this.setState({ mortgages: response.data })
      })
      .catch(error => console.log(error));
  }

  addMortgage (mortgage) {
    return axios.post('/api/v1/mortgages', mortgage, {
      headers: {
        'X-CSRF-Token': document.querySelector('meta[name=csrf-token]').content
      }
    }).then(response => {
      let mortgages = this.state.mortgages;
      mortgages.push(response.data);
      this.setState({ mortgages });
      this.myModalInstance.hide();
    });
  }

  deleteMortgage (mortgageId) {
    return axios.delete('/api/v1/mortgages/' + mortgageId, {
      headers: {
        'X-CSRF-Token': document.querySelector('meta[name=csrf-token]').content
      }
    }).then(() => {
      let mortgages = this.state.mortgages.filter(mortgage => {
        return mortgage.id !== mortgageId
      });
      this.setState({ mortgages });
    });
  }

  render () {
    return (
      <div>
        <MortgageMenu/>
        <MortgageForm successCallback={this.addMortgage.bind(this)}/>
        <table className='table'>
          <thead>
            <tr>
              <td>ID</td>
              <td>Title</td>
              <td>Bank</td>
              <td>Risk</td>
              <td>Due Date</td>
              <td>Amount</td>
              <td>Interest Rate</td>
              <td>Updated</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {this.state.mortgages.map((mortgage, index) => {
              return (<MortgageField
                key={mortgage.id}
                mortgageId={mortgage.id}
                title={mortgage.title}
                bankName={mortgage.bank_name}
                riskClassification={mortgage.risk_classification}
                dueDate={mortgage.due_date}
                amount={mortgage.amount}
                interestRate={mortgage.interest_rate}
                updatedAt={mortgage.updated_at}
                deleteCall={this.deleteMortgage.bind(this)}
              />)
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Mortgages
