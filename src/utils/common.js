import moment from "moment";
import { DATETIME_FORMAT, DATE_FORMAT } from "../constants/appSettings";
import { confirmAlert } from 'react-confirm-alert'

export const jsonFromUrlParams = search => {
  if (!search) return {};

  search = search.replace("?", "");

  return JSON.parse(
    '{"' +
    decodeURI(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"') +
    '"}'
  );
};

// var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
export const objToQuery = obj => {
  if (!obj) return "";

  var query = [];

  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      query.push(
        encodeURIComponent(prop) + "=" + encodeURIComponent(obj[prop])
      );
    }
  }

  return "?" + query.join("&");
};

export const formatDate = value => {
  return moment(value).format(DATE_FORMAT);
};
export const formatDateTime = value => {
  return moment(value).format(DATETIME_FORMAT);
};

export const objToArray = obj => {
  var keys = Object.keys(obj);
  var arr = [];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    arr.push(obj[key]);
  }
  return arr;
};

export const getBrowserName = () => {
  let isOpera =
    (!!window.opr && !!window.opr.addons) ||
    !!window.opera ||
    navigator.userAgent.indexOf(" OPR/") >= 0;
  if (isOpera) return "Opera";

  let isFirefox = typeof InstallTrigger !== "undefined";
  if (isFirefox) return "Firefox";

  let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (isSafari) return "Safari";

  let isIE = /*@cc_on!@*/ false || !!document.documentMode;
  if (isIE) return "Internet Explorer";

  let isEdge = !isIE && !!window.StyleMedia;
  if (isEdge) return "Microsoft Edge";

  let isChrome = !!window.chrome && !!window.chrome.webstore;
  if (isChrome) return "Google Chrome";

  return "Unknown";
};

export const confirmSubmit = (title, message, onOK, onCANCEL) => {
  confirmAlert({
    title: title,
    message: message,
    buttons: [
      {
        label: "Không",
        onClick: onCANCEL ? () => onCANCEL() : ""
      },
      {
        label: "Có",
        onClick: onOK ? () => onOK() : ""
      }
    ]
  });
};

export const getDate = () => {
  var now = moment().utc();
  var date = now.utcOffset('+7').toDate();

  return date;
}
