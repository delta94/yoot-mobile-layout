import {
  CONNECT_WEBSOCKET,
  RENEW_WEBSOCKET,
  OFF_WEBSOCKET
} from "../actions/websocketActions";
import { SOCKET_API } from "../constants/appSettings";
import { getAccessToken } from "../auth";

const initialState = {
  hubConnection: null,
  hubConnectionString: null,
  methods: [],
  fixedMethods: []
};

export default function func(state, action) {

  if (typeof state === "undefined") {
    return initialState;
  }
  switch (action.type) {
    case CONNECT_WEBSOCKET:
      const { method, onMessage, allOfTime } = action.payload;
      var hubConnectionString = SOCKET_API
      var isNewConnection = false;

      if (state.hubConnection != null && state.hubConnectionString != hubConnectionString) {
        state.controlStop = true;
        state.hubConnection.stop();
        state.hubConnection = null;
        isNewConnection = true;
      } else if (state.hubConnection == null) {
        isNewConnection = true;
      }

      state.hubConnectionString = hubConnectionString;

      if (isNewConnection) {
        const signalR = require("@aspnet/signalr");
        state.hubConnection = new signalR.HubConnectionBuilder()
          .withUrl(hubConnectionString, {
            transport: signalR.HttpTransportType.WebSockets
          })
          .build();

        state.hubConnection.KeepAliveInterval = 540000;
        state.hubConnection.connection.onclose = () => {
          setTimeout(() => window.history.go(0))
        }

        const connect = () => {
          if (state.hubConnection.connection.connectionState != 1) {
            state.hubConnection
              .start()
              .then(() => {
                console.log("Websocket is connected!")
              })
              .catch(err => {
                console.log("Error while connect Websocket!");
              });
          }
        }

        connect();
      }

      if (allOfTime) {
        if (state.fixedMethods.indexOf(method) < 0) {
          state.fixedMethods.push(method);
        } else {
          return state;
        }
      } else {
        if (state.methods.indexOf(method) < 0) {
          state.methods.push(method);
        } else {
          return state;
        }
      }

      state.hubConnection.on(method, receivedMessage => {
        onMessage(receivedMessage);
      });
      return state;
    case RENEW_WEBSOCKET:
      let { methods } = state;
      for (let index = 0; index < methods.length; index++) {
        state.hubConnection.off(methods[index]);
      }
      state.methods = [];
      return state;
    case OFF_WEBSOCKET:
      {
        const method = action.payload;
        let { methods } = state;
        state.hubConnection.off(method);
        state.methods = methods.filter(x => x !== method);
        return state;
      }
    default:
      return state;
  }
}
