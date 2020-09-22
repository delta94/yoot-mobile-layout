import React from 'react';
import moment from "moment";
import { DATETIME_FORMAT, DATE_FORMAT } from "../constants/appSettings";
import { confirmAlert } from 'react-confirm-alert'
import NumberFormat from 'react-number-format';

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

export const showNotification = (title, message, onOK) => {
  confirmAlert({
    title: title,
    message: message,
    buttons: [
      {
        label: "Đồng ý",
        onClick: onOK ? () => onOK() : ""
      }
    ]
  });
};

export const showConfirm = (title, message, onOK, onCancel, okLabel, cancelLabel) => {
  confirmAlert({
    title: title,
    message: message,
    buttons: [
    ],
  });
};

export const getDate = () => {
  var now = moment().utc();
  var date = now.utcOffset('+7').toDate();

  return date;
}

export const NumberFormatCustom = (props) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      isNumericString
    />
  );
}
export const fromNow = (date = moment().now(), now) => {
  if (moment(now).dayOfYear() - moment(date).dayOfYear() < 4 && moment(now).dayOfYear() - moment(date).dayOfYear() > -100) {
    let result = moment(date).from(moment(now))
    if (result.indexOf('a few seconds') >= 0 || result.indexOf('in a minute') >= 0) {
      return 'Vài giây trước';
    }
    if (result.indexOf('AM') >= 0 || result.indexOf('Am') >= 0 || result.indexOf('am') >= 0) {
      return 'sa';
    }
    if (result.indexOf('PM') >= 0 || result.indexOf('Pm') >= 0 || result.indexOf('pm') >= 0) {
      return 'ch';
    }
    if (result.indexOf('a minute ago') >= 0) return result.replace('a minute ago', '1 phút trước');
    if (result.indexOf('minutes ago') >= 0) return result.replace('minutes ago', 'phút trước');
    if (result.indexOf('an hour ago') >= 0) return result.replace('an hour ago', '1 giờ trước');
    if (result.indexOf('hours ago') >= 0) return result.replace('hours ago', 'giờ trước');
    if (result.indexOf('months ago') >= 0) return result.replace('months ago', 'tháng trước');
    if (result.indexOf('a day ago') >= 0) return result.replace('a day ago', 'hôm qua');

    if (parseInt(result.split('days ago')[0]) <= 5) return result.replace('days ago', 'ngày trước');
  }
  // return result
  return moment(date).format('DD/MM/YYYY HH:mm');
};
