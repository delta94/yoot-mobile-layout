import { toast } from "react-toastify";

export const showError = message => {
    if (!message)
        return;
    toast.error(message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 5000
    });
};

export const showInfo = message => {
    if (!message)
        return;
    toast.info(message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 5000
    });
};

export const showSuccess = message => {
    if (!message)
        return;
    toast.success(message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 5000
    });
};

export const putInProcess = element => {
    element.setAttribute("disabled", true);
    element.closest(".submit-form").className += " submit";

    var loading = document.createElement("div");
    loading.className = "lds-facebook";
    loading.id = "lds-facebook";
    var icon1 = document.createElement("div");
    var icon2 = document.createElement("div");
    var icon3 = document.createElement("div");
    loading.appendChild(icon1);
    loading.appendChild(icon2);
    loading.appendChild(icon3);
    element.after(loading);
};
export const takeOutProcess = element => {
    element.removeAttribute("disabled");
    element.closest(".submit-form").className = element.closest(".submit-form").className.replace(" submit", "");

    var dd = document.getElementById("lds-facebook");
    element.closest(".submit-form").removeChild(dd);
};
