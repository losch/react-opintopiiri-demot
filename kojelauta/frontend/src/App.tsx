import React, { Component } from 'react';
import './App.css';
import './components/Icons.tsx';
import ClockWidget from './widgets/ClockWidget';
import {EventProps, withWebSocketMessage} from './api';
import AlertWidget from './widgets/AlertWidget';
import TemperatureWidget from './widgets/TemperatureWidget';

class App extends Component<EventProps, any> {

  state = {
    widgets: [AlertWidget, TemperatureWidget, ClockWidget]
  };

  private addRandomWidget = () => {
    const allWidgets = [AlertWidget, TemperatureWidget, ClockWidget];
    const newWidget = allWidgets[Math.floor(Math.random() * allWidgets.length)];
    this.setState({
      widgets: [...this.state.widgets, newWidget]
    })
  };

  private removeWidget = () => {
    let widgets = [...this.state.widgets];
    widgets.pop();
    this.setState({ widgets: widgets });
  };

  render() {

    const event = this.props.event;

    return (
      <div>
        <div className="App">
          {
            this.state.widgets.map((Widget, i) =>
              <Widget key={i} event={event} />
            )
          }
        </div>

        <div className="App">
          <button className="button" onClick={this.addRandomWidget}>
            Lisää näitä!
          </button>
          <button className="button" onClick={this.removeWidget}>
            Vähemmän, kiitos.
          </button>
        </div>
      </div>
    );
  }
}

export default withWebSocketMessage(App);
