export const none = (entity, value) => {
  return ""
}

export const notEmpty = (entity, value) => {
  if (!value || !value.trim()) return entity + " không được bỏ trống";
  return "";
};

export const emailAddress = (entity, value) => {
  // if (value && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))
  if (value && !/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value))
    return "Vui lòng nhập đúng định dạng email. Ví dụ: example@gmail.com";
  return "";
};

export const urlFormat = (entity, value) => {
  if (
    value &&
    !/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(
      value
    )
  )
    return "Vui lòng nhập đầy đủ đường dẫn website.";
  return "";
};

export const justNumber = (entity, value) => {
  if (value && !/^[0-9.,]*$/g.test(value)) return entity + " phải là số.";
  return "";
};

export const password = (entity, value) => {
  if (
    value &&
    !/^(?=.*[A-Za-z*!@#$%^&()])(?=.*\d)[A-Za-z*!@#$%^&()\d]{8,}$/g.test(value)
  )
    return (
      entity +
      " must be minimum eight characters, at least one letter and one number."
    );
  return "";
};

export const isValid = validationData => {
  if (!validationData) return true;
  var fieldNames = Object.keys(validationData);
  let valid = true;
  for (let i = 0; i < fieldNames.length; i++) {
    const fieldName = fieldNames[i];
    const validations = validationData[fieldName];
    if (!validations) return true;
    if (!validate(fieldName, validations)) valid = false;
  }

  return valid;
};

export const isValidAsync = async validationData => {
  if (!validationData) return true;
  var fieldNames = Object.keys(validationData);
  let valid = true;
  for (let i = 0; i < fieldNames.length; i++) {
    const fieldName = fieldNames[i];
    const validations = validationData[fieldName];
    if (!validations) return true;
    if (!(await validateAsync(fieldName, validations))) valid = false;
  }
  return valid;
};

export const validate = (fieldName, validations) => {
  if (!fieldName || !validations) return true;
  var element = document.getElementById(fieldName);
  var errorElement = document.getElementById("validator-for-" + fieldName);
  var errorElementContainer = document.getElementById(
    "validator-for-" + fieldName + "-container"
  );
  var displayElement = document.getElementById("validator-name-" + fieldName);

  if (!element || !errorElement || !errorElementContainer || !displayElement)
    return true;

  var displayName = displayElement.innerHTML;

  let errors = "";
  for (let i = 0; i < validations.length; i++) {
    const validate = validations[i];
    var error = validate(displayName, element.value);
    if (error) errors += errors === "" ? error : "\n" + error;
  }

  errorElement.innerHTML = errors;

  if (errors) {
    if (!errorElementContainer.className.includes("show")) {
      errorElementContainer.className += " show";
    }
    if (!element.className.includes("error")) {
      element.className += " error";
    }
  } else {
    errorElementContainer.className = errorElementContainer.className.replace(
      " show",
      ""
    );
    element.className = errorElement.className.replace(" error", "");
  }
  if (errors) return false;
  return true;
};

export const validateAsync = async (fieldName, validations) => {
  if (!fieldName || !validations) return true;
  var element = document.getElementById(fieldName);
  var errorElement = document.getElementById("validator-for-" + fieldName);
  var errorElementContainer = document.getElementById(
    "validator-for-" + fieldName + "-container"
  );
  var displayElement = document.getElementById("validator-name-" + fieldName);

  if (!element || !errorElement || !errorElementContainer || !displayElement)
    return true;

  var displayName = displayElement.innerHTML;

  let errors = "";
  for (let i = 0; i < validations.length; i++) {
    const validate = validations[i];
    var error = await validate(displayName, element.value);
    if (error) errors += errors === "" ? error : "\n" + error;
  }

  errorElement.innerHTML = errors;

  if (errors) {
    if (!errorElementContainer.className.includes("show")) {
      errorElementContainer.className += " show";
    }
    if (!element.className.includes("error")) {
      element.className += " error";
    }
  } else {
    errorElementContainer.className = errorElementContainer.className.replace(
      " show",
      ""
    );

    element.className = errorElement.className.replace(" error", "");
  }
  if (errors) return false;
  return true;
};
