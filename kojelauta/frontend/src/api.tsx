import React, { Component }  from 'react';

export interface Event {
  type: string;
}

export interface EventProps {
  event: Event;
}

interface WebSocketMessageState {
  event?: Event;
}

export function withWebSocketMessage(WrappedComponent: any) {

  return class extends Component<any, WebSocketMessageState> {

    ws: WebSocket | null = null;

    state: WebSocketMessageState = {};

    initWebsocket() {
      this.ws = new WebSocket("ws://localhost:8080/events");
      this.ws.onopen = () => { console.log('connection established') };
      this.ws.onclose = () => {
        console.log('Connection closed. Trying to reconnect in 5 seconds...');
        window.setTimeout(() => this.initWebsocket(), 5000);
      };
      this.ws.onerror = (err) => { console.log('error: ', err)};
      this.ws.onmessage = (event) => this.setState({event: JSON.parse(event.data)});
    }

    componentDidMount(): void {
      this.initWebsocket();
    }

    componentWillUnmount(): void {
      if (this.ws) {
        this.ws.close();
      }
    }

    render() {
      return <WrappedComponent event={this.state.event} {...this.props} />;
    }
  };
}
