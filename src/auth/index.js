import {
  COMUNITY_ACCESS_KEY,
  SKILL_ACCESS_KEY,
  CAREER_GUIDANCE_ACCESS_KEY,
  USER_INFO
} from "../constants/localStorageKeys";

import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";

export const isSignedIn = () =>
  window.localStorage.getItem(COMUNITY_ACCESS_KEY) !== null && window.localStorage.getItem(SKILL_ACCESS_KEY) !== null && window.localStorage.getItem(CAREER_GUIDANCE_ACCESS_KEY) !== null;

let _currentUser = null;

// export const getCurrentUser = () => {
//   if (_currentUser === null) {
//     _currentUser = JSON.parse(window.localStorage.getItem(USER_INFO));
//   }
//   if (_currentUser === null) {
//     signOut()
//   }
//   return _currentUser;
// };

// export const setCurrentUser = user => {
//   _currentUser = user;
//   window.localStorage.setItem(USER_INFO, JSON.stringify(user));
// };

export const signOut = () => {
  window.localStorage.clear()
  window.history.go(0);
};

export const signIn = tokens => {
  const { comunityAccessToken, skillAccessToken, careerGuidanceAccessToken } = tokens;
  window.localStorage.setItem(COMUNITY_ACCESS_KEY, comunityAccessToken);
  window.localStorage.setItem(SKILL_ACCESS_KEY, skillAccessToken);
  window.localStorage.setItem(CAREER_GUIDANCE_ACCESS_KEY, careerGuidanceAccessToken);
};

export const IsAuthenticatedRedir = connectedRouterRedirect({
  ...IsAuthenticatedDefaults,
  authenticatedSelector: state =>
    window.localStorage.getItem(COMUNITY_ACCESS_KEY) !== null && window.localStorage.getItem(SKILL_ACCESS_KEY) !== null && window.localStorage.getItem(CAREER_GUIDANCE_ACCESS_KEY) !== null,
  redirectPath: "/sign-in"
});

const IsAuthenticatedDefaults = {
  wrapperDisplayName: "UserIsAuthenticated"
};
