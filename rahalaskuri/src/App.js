import React from 'react';

function formatMoney(number) {
  return number.toLocaleString('fi-FI', { style: 'currency', currency: 'EUR' });
}

function formatPercentage(number) {
  return number.toLocaleString('fi-FI', { style: 'percent' });
}

class Calculator extends React.Component {

  state = {
    amount: 100,
    percentages: ["50", "50"]
  };

  addPercentage = () => {
    this.setState({ percentages: [...this.state.percentages, "0"] })
  };

  removePercentage = (index) => {
    let newPercentages = [...this.state.percentages];
    newPercentages.splice(index, 1);
    this.setState({ percentages: newPercentages });
  };

  onAmountChange = (e) => {
    this.setState({ amount: e.target.value });
  };

  onPercentageChange = (index, e) => {
    let newPercentages = [...this.state.percentages];
    newPercentages[index] = e.target.value;
    this.setState({ percentages: newPercentages });
  };

  render() {
    return (
      <div className="calculator-container">
        <div className="panel calculator">
          <table>
            <tbody>
            <tr>
              <th>Summa</th>
              <td>
                <div style={{maxHeight: 20}}>
                  <div style={{position: 'relative'}}>
                    <input value={this.state.amount}
                           onChange={this.onAmountChange} />
                  </div>
                  <span style={{position: 'relative', top: -20, left: -6, color: '#666666'}}>€</span>
                </div>
              </td>
              <td/>
            </tr>

            <tr>
              <th>Prosenttiosuus</th>
              <th style={{textAlign: 'right'}}>
                <div style={{marginRight: 6}}>Osuus summasta</div>
              </th>
              <th/>
            </tr>
            {
              this.state.percentages.length === 0 &&
                <tr>
                  <td colSpan={3}>Ei prosenttiosuuksia</td>
                </tr>
            }
            {
              this.state.percentages.map((percentage, i) =>
                <tr key={i}>
                  <td>
                    <input value={percentage}
                           onChange={e => this.onPercentageChange(i, e)}
                           tabIndex="0" />
                  </td>
                  <td>
                    <div style={{marginRight: 6}}>
                    {
                      formatMoney(parseFloat(this.state.amount) * parseFloat(percentage) / 100)
                    }
                    </div>
                  </td>
                  <td>
                    <button onClick={() => this.removePercentage(i)}
                            tabIndex={1}>Poista</button>
                  </td>
                </tr>
              )
            }
            </tbody>
            <tfoot>
            <tr>
              <th>
                Yhteensä&nbsp;
                {
                  formatPercentage(
                    this.state.percentages.length > 0 ?
                    this.state.percentages.reduce((acc, percentage) => parseFloat(acc) + parseFloat(percentage)) / 100 :
                    0
                  )
                }
              </th>
              <th style={{textAlign: 'right'}}>
                <div style={{marginRight: 6}}>
                {
                  formatMoney(
                    this.state.percentages.length > 0 ?
                      this.state.percentages.reduce((acc, percentage) => parseFloat(acc) + parseFloat(percentage) * parseFloat(this.state.amount) / 100) :
                      0
                  )
                }
                </div>
              </th>
              <td>
                <button onClick={this.addPercentage} tabIndex={1}>Lisää</button>
              </td>
            </tr>
            </tfoot>
          </table>
        </div>

        <div className="panel application-state">
          <h4>Sovelluksen tila</h4>
          <pre>
            {JSON.stringify(this.state, null, 2)}
          </pre>
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <div className="header">
        <div className="brand">Rahalaskuri</div>
      </div>
      <div style={{height: 60}} />
      <Calculator />
    </div>
  );
}

export default App;
