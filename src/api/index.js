import { BASE_API } from "../constants/appSettings";
import { ACCESS_TOKEN } from "../constants/localStorageKeys";
import { showError, showInfo } from "../utils/app";
import { signOut } from "../auth";
import $ from 'jquery'

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json"
};

export async function getAsync(endpoint, successCallback, errorCallback, hideLoader) {
  return myFetchAsync("GET", endpoint, undefined, successCallback, errorCallback, hideLoader);
}

export function get(endpoint, successCallback, errorCallback, hideLoader) {
  myFetch("GET", endpoint, undefined, successCallback, errorCallback, hideLoader);
}

export function post(endpoint, body, successCallback, errorCallback, hideLoader) {
  myFetch("POST", endpoint, body, successCallback, errorCallback, hideLoader);
}

export function put(endpoint, body, successCallback, errorCallback, hideLoader) {
  myFetch("PUT", endpoint, body, successCallback, errorCallback, hideLoader);
}
export function _delete(endpoint, body, successCallback, errorCallback, hideLoader) {
  myFetch("DELETE", endpoint, body, successCallback, errorCallback, hideLoader);
}
export function postFormData(endpoint, data, successCallback, errorCallback) {
  let url = BASE_API + "api/" + endpoint;

  let response = fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "bearer " + window.localStorage.getItem(ACCESS_TOKEN)
    },
    body: data
  });

  handleResponse(response, successCallback, errorCallback, endpoint);
}

function myFetch(method, endpoint, body, successCallback, errorCallback, hideLoader) {

  const response = myFetchAsync(method, endpoint, body, successCallback, errorCallback, hideLoader)

  handleResponse(response, successCallback, errorCallback, endpoint);
}


var proccess = []

function myFetchAsync(method, endpoint, body, successCallback, errorCallback, hideLoader) {
  let url = BASE_API + "api/" + endpoint;

  body = JSON.stringify(body);

  proccess.push(endpoint)

  if (!hideLoader)
    $("#proccess").removeClass("hide")

  let headers = defaultHeaders;
  headers["Authorization"] =
    "bearer " + window.localStorage.getItem(ACCESS_TOKEN);

  let response = null;

  if (body === undefined)
    response = fetch(url, {
      method: method,
      headers: headers
    });
  else {
    response = fetch(url, {
      method: method,
      headers: headers,
      body: body
    });
  }
  setTimeout(() => {
    proccess = proccess.filter(e => e != endpoint)
    if (proccess.length == 0)
      $("#proccess").addClass("hide")
  }, 500);
  return response;
}

var isSessionTimeOut = false;
const handleResponse = (response, successCallback, errorCallback, endpoint) => {
  response.then(r => {
    setTimeout(() => {
      proccess = proccess.filter(e => e != endpoint)
      if (proccess.length == 0)
        $("#proccess").addClass("hide")
    }, 500);
    if (r.status === 200) {
      if (successCallback) {
        r.json()
          .then(result => {
            if (successCallback) successCallback(result);
          })
          .catch(() => {
            if (successCallback) successCallback();
          });
      }
    } else if (r.status === 400) {
      r.json()
        .then(result => {
          handleError(errorCallback, result, endpoint);
        })
        .catch(() => {
          handleError(errorCallback, "Unknown error occurred", endpoint);
        });
    } else if (r.status === 401) {
      if (!isSessionTimeOut) {
        isSessionTimeOut = true;
        handleError(errorCallback, "Session timeout", endpoint);
        // signOut();
      }
    } else {
      handleError(errorCallback, "Unhandled response", endpoint);
    }
  });
};

const handleError = (errorCallback, error, endpoint) => {
  setTimeout(() => {
    proccess = proccess.filter(e => e != endpoint)
    if (proccess.length == 0)
      $("#proccess").addClass("hide")
  }, 500);
  if (error.errorCode === "Info") {
    showInfo(error.message);
    if (errorCallback) errorCallback(error);
  } else {
    showError(error.message);
    if (errorCallback) errorCallback(error);
  }
};
