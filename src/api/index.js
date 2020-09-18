import { COMUNITY_ACCESS_KEY, SKILL_ACCESS_KEY, CAREER_GUIDANCE_ACCESS_KEY } from "../constants/localStorageKeys";
import { SOCIAL_NET_WORK_API, SCHOOL_API, BUILD_YS_API, SYSTEM_API } from "../constants/appSettings"
import { showError, showInfo } from "../utils/app";
import { signOut } from "../auth";
import $ from 'jquery'

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json"
};

export async function getAsync(endpoint, successCallback, errorCallback) {
  return myFetchAsync("GET", endpoint, undefined, successCallback, errorCallback);
}

export function get(api, endpoint, successCallback, errorCallback) {
  myFetch("GET", endpoint, undefined, successCallback, errorCallback, api);
}

export function post(api, endpoint, body, successCallback, errorCallback) {
  myFetch("POST", endpoint, body, successCallback, errorCallback, api);
}

export function put(api, endpoint, body, successCallback, errorCallback) {
  myFetch("PUT", endpoint, body, successCallback, errorCallback, api);
}
export function _delete(api, endpoint, body, successCallback, errorCallback) {
  myFetch("DELETE", endpoint, body, successCallback, errorCallback, api);
}
export function postFormData(api, endpoint, data, successCallback, errorCallback) {
  let url = api + "api/" + endpoint;

  let ACCESS_TOKEN = null;

  switch (api) {
    case SOCIAL_NET_WORK_API: {
      ACCESS_TOKEN = window.localStorage.getItem(COMUNITY_ACCESS_KEY);
      break
    }
    case SCHOOL_API: {
      ACCESS_TOKEN = window.localStorage.getItem(SKILL_ACCESS_KEY);
      break
    }
    case SYSTEM_API: {
      ACCESS_TOKEN = "Geso@Key!SNet#Admin2020";
      break
    }
    case BUILD_YS_API: {
      ACCESS_TOKEN = window.localStorage.getItem(CAREER_GUIDANCE_ACCESS_KEY);
      break
    }
    default: break
  }

  let response = fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: ACCESS_TOKEN
    },
    body: data
  });

  handleResponse(response, successCallback, errorCallback, endpoint);
}

function myFetch(method, endpoint, body, successCallback, errorCallback, api) {

  const response = myFetchAsync(method, endpoint, body, successCallback, errorCallback, api)

  handleResponse(response, successCallback, errorCallback, endpoint);
}


var proccess = []

function myFetchAsync(method, endpoint, body, successCallback, errorCallback, api) {

  let url = api + "api/" + endpoint;
  if (api == SYSTEM_API) url = SOCIAL_NET_WORK_API + "api/" + endpoint;

  body = JSON.stringify(body);

  proccess.push(endpoint)

  let headers = defaultHeaders;

  let ACCESS_TOKEN = null;

  switch (api) {
    case SOCIAL_NET_WORK_API: {
      ACCESS_TOKEN = window.localStorage.getItem(COMUNITY_ACCESS_KEY);
      break
    }
    case SCHOOL_API: {
      ACCESS_TOKEN = window.localStorage.getItem(SKILL_ACCESS_KEY);
      break
    }
    case SYSTEM_API: {
      ACCESS_TOKEN = "Geso@Key!SNet#Admin2020";
      break
    }
    case BUILD_YS_API: {
      ACCESS_TOKEN = window.localStorage.getItem(CAREER_GUIDANCE_ACCESS_KEY);
      break
    }
    default: break
  }

  headers["Authorization"] = ACCESS_TOKEN;

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
