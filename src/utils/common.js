import React from 'react';
import moment from "moment";
import { DATETIME_FORMAT, DATE_FORMAT } from "../constants/appSettings";
import { confirmAlert } from 'react-confirm-alert'
import NumberFormat from 'react-number-format';
import { showInfo } from './app';
import {
  FiberManualRecord as FiberManualRecordIcon
} from '@material-ui/icons'
import {
  Button
} from '@material-ui/core'

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

export const showConfirm = (title, message, onOK, onCancel, okButton, cancelButton, className) => {
  confirmAlert({
    title: title,
    message: message,
    customUI: ({ onClose }) => <div className={"custom-confirm-alert " + className}>
      <h1>{title}</h1>
      <p>{message}</p>
      <div>
        <Button onClick={() => {
          onOK()
          onClose()
        }}>{okButton}</Button>
      </div>
    </div>,
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
      allowLeadingZeros
      format={"##########"}
    />
  );
}

export const fromNow = (date = moment().now(), now, hideDate) => {
  if (moment(now).dayOfYear() - moment(date).dayOfYear() < 100 && moment(now).dayOfYear() - moment(date).dayOfYear() > -100) {
    let result = moment(date).from(moment(now))
    let output = ""
    if (result.indexOf('a few seconds') >= 0 || result.indexOf('in a minute') >= 0) {
      output = 'Vừa đăng';
    }
    if (result.indexOf('AM') >= 0 || result.indexOf('Am') >= 0 || result.indexOf('am') >= 0) {
      output = 'sa';
    }
    if (result.indexOf('PM') >= 0 || result.indexOf('Pm') >= 0 || result.indexOf('pm') >= 0) {
      output = 'ch';
    }

    if (result.indexOf('a minute ago') >= 0)
      output = result.replace('a minute ago', '1 phút trước');

    if (result.indexOf('minutes ago') >= 0)
      output = result.replace('minutes ago', 'phút trước');

    if (result.indexOf('an hour ago') >= 0)
      output = result.replace('an hour ago', '1 giờ trước');

    if (result.indexOf('hours ago') >= 0)
      output = result.replace('hours ago', 'giờ trước');

    if (result.indexOf('a day ago') >= 0)
      output = result.replace('a day ago', 'hôm qua');

    if (result.indexOf('days ago') >= 0)
      return <span style={{ display: "flex", alignItems: "center" }}>
        {
          hideDate ? "" : moment(date).format("DD/MM/yyyy HH:mm")
        }
        {
          hideDate ? "" : <FiberManualRecordIcon style={{ width: 6, height: 6, opacity: 0.5, margin: '0px 5px' }} />
        }
        {result.replace('days ago', 'ngày trước')}
      </span>

    if (result.indexOf('a month ago') >= 0)
      return <span style={{ display: "flex", alignItems: "center" }}>
        {
          hideDate ? "" : moment(date).format("DD/MM/yyyy HH:mm")
        }
        {
          hideDate ? "" : <FiberManualRecordIcon style={{ width: 6, height: 6, opacity: 0.5, margin: '0px 5px' }} />
        }
        {result.replace('a month ago', '1 tháng trước')}
      </span>

    if (result.indexOf('months ago') >= 0)
      return <span style={{ display: "flex", alignItems: "center" }}>
        {
          hideDate ? "" : moment(date).format("DD/MM/yyyy HH:mm")
        }
        {
          hideDate ? "" : <FiberManualRecordIcon style={{ width: 6, height: 6, opacity: 0.5, margin: '0px 5px' }} />
        }
        {result.replace('months ago', 'tháng trước')}
      </span>

    return output
  }
  return ""
  // return moment(date).format('DD/MM/YYYY HH:mm');
};


export const srcToFile = (src, fileName, mimeType) => {
  return (fetch(src)
    .then(function (res) { return res.arrayBuffer(); })
    .then(function (buf) { return new File([buf], fileName, { type: mimeType }); })
  );
}

export const getFileSize = size => {
  if (size > 1048576) return `${parseInt(size / 1048576)}MB`
  if (size > 1024) return `${parseInt(size / 1024)}KB`
  return `${size}Bytes`
}

export const copyToClipboard = (str, successCallback) => {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  showInfo("Đã sao chép liên kết")
};

export const removeAccents = (str) => {
  var AccentsMap = [
    "aàảãáạăằẳẵắặâầẩẫấậ",
    "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
    "dđ", "DĐ",
    "eèẻẽéẹêềểễếệ",
    "EÈẺẼÉẸÊỀỂỄẾỆ",
    "iìỉĩíị",
    "IÌỈĨÍỊ",
    "oòỏõóọôồổỗốộơờởỡớợ",
    "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
    "uùủũúụưừửữứự",
    "UÙỦŨÚỤƯỪỬỮỨỰ",
    "yỳỷỹýỵ",
    "YỲỶỸÝỴ"
  ];
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
    var char = AccentsMap[i][0];
    str = str.replace(re, char);
  }
  return str;
}

export const formatCurrency = (value, fix) => {
  if (!value || value == 0 || Math.abs(value) < 0.00000001) return "";
  // value = round(value, 0);
  // var fix = getFix(value, fix);
  var result = parseFloat(value).toFixed(0).replace(/\d(?=(\d{3})+\.)/g, "$&.");

  return result;
};