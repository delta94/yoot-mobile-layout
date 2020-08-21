import {
  ACCESS_TOKEN,
  TOKEN_EXPIRED,
  USER_INFO
} from "../constants/localStorageKeys";

import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";
import { getDate } from "../utils/common";
import { MetubRoles } from "../constants/constants";

export const isSignedIn = () =>
  window.localStorage.getItem(ACCESS_TOKEN) !== null;

let _currentUser = null;

export const getCurrentUser = () => {
  if (_currentUser === null) {
    _currentUser = JSON.parse(window.localStorage.getItem(USER_INFO));
  }
  if (_currentUser === null) {
    signOut()
  }
  return _currentUser;
};

export const setCurrentUser = user => {
  _currentUser = user;
  window.localStorage.setItem(USER_INFO, JSON.stringify(user));
};

export const isInRole = (role, exceptionFunction) => {
  const user = getCurrentUser();
  var isInRole = false
  if (!user || !user.roles) signOut();
  isInRole = user.roles.includes(role);
  if (exceptionFunction) {
    isInRole = (user.roles.includes(role) && exceptionFunction());
  } else {
    isInRole = user.roles.includes(role);
  }
  if (user.roleCode === MetubRoles.ADMIN || user.roleCode === role) isInRole = true
  return isInRole
};

export const isInAccessibleFeatures = (role) => {
  var user = getCurrentUser();
  var isInAccessibleFeatures = false
  if (!user || !user.accessibleFeatures) signOut();
  isInAccessibleFeatures = user.accessibleFeatures.includes(role);
  if (user.roleCode === MetubRoles.ADMIN) isInAccessibleFeatures = true
  return isInAccessibleFeatures
}

export const signOut = () => {
  window.localStorage.clear()
  window.history.go(0);
};

export const signIn = token => {
  const { accessToken } = token;
  window.localStorage.setItem(ACCESS_TOKEN, accessToken);
};

export const getTokenExpired = () => {
  return new Date(window.localStorage.getItem(TOKEN_EXPIRED));
};

export const IsAuthenticatedRedir = connectedRouterRedirect({
  ...IsAuthenticatedDefaults,
  authenticatedSelector: state =>
    window.localStorage.getItem(ACCESS_TOKEN) !== null,
  redirectPath: "/sign-in"
});

const IsAuthenticatedDefaults = {
  wrapperDisplayName: "UserIsAuthenticated"
};
