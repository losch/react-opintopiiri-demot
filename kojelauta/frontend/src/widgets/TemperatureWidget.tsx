import React, {Component} from 'react';
import Panel from '../components/Panel';
import {Event} from '../api';

interface TemperatureEvent extends Event {
  type: "temperature";
  measurements: {first: string; second: string;}[];
}

interface TemperatureWidgetProps {
  event: Event;
}

interface TemperatureWidgetState {
  latestEvent: null | TemperatureEvent;
}

export default class TemperatureWidget extends Component<TemperatureWidgetProps,
                                                         TemperatureWidgetState> {

  state: TemperatureWidgetState = {
    latestEvent: null
  };

  componentWillReceiveProps(nextProps: Readonly<TemperatureWidgetProps>): void {
    if (nextProps.event.type === "temperature") {
      this.setState({latestEvent: nextProps.event as TemperatureEvent});
    }
  }

  render() {
    const event = this.state.latestEvent;

    return (
      <Panel>
        {!event && <div>Ei lämpötiloja</div>}
        {
          event &&
          <div>
            {
              event.measurements.map((measurement, i) =>
                <div key={i}>
                  {measurement.first} - {measurement.second} &deg;C
                </div>
              )
            }
          </div>
        }
      </Panel>
    )
  }
}
