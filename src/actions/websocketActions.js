export const CONNECT_WEBSOCKET = "websocketActions@CONNECTION_WEBSOCKET";
export const RENEW_WEBSOCKET = "websocketActions@RENEW_WEBSOCKET";
export const OFF_WEBSOCKET = "websocketActions@OFF_WEBSOCKET";

export const connectWebsocket = (method, onMessage, allOfTime) => {
  return dispath => {
    dispath({
      type: CONNECT_WEBSOCKET,
      payload: {
        method,
        onMessage,
        allOfTime
      }
    });
  };
};

export const renewWebsocket = () => {
  return dispath => {
    dispath({
      type: RENEW_WEBSOCKET
    });
  };
};

export const offWebsocket = (method) => {
  return dispath => {
    dispath({
      type: OFF_WEBSOCKET,
      payload: method
    });
  };
};
