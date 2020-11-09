import {
  SET_USER_DETAIL,
  SET_USER_PROFILE,
  GET_FOLOWED_ME,
  GET_ME_FOLOWING,
  FOLLOW_FRIEND,
  UN_FOLLOW_FRIEND,
  UPDATE_CHANGE_FOLLOWED,
  UPDATE_CHANGE_FOLLOWING
} from "../actions/user";

const initialState = {
  profile: null,
  userDetail: null,
};

export default (state = initialState, action) => {
  let { userDetail, profile } = state;

  switch (action.type) {
    case SET_USER_PROFILE: {
      return Object.assign({}, state, {
        profile: action.payload,
      });
    }
    case SET_USER_DETAIL: {
      return Object.assign({}, state, {
        userDetail: action.payload,
      });
    }
    case GET_FOLOWED_ME: {
      let foloweds = action.payload;
      if (profile) {
        if (profile.foloweds && profile.foloweds.length > 0) {
          profile.foloweds = profile.foloweds.concat(foloweds);
        } else {
          profile.foloweds = foloweds;
        }
      }
      return Object.assign({}, state, {
        profile,
      });
    }
    case GET_ME_FOLOWING: {
      let folowings = action.payload;
      if (profile) {
        if (profile.folowings && profile.folowings.length > 0) {
          profile.folowings = profile.folowings.concat(folowings);
        } else {
          profile.folowings = folowings;
        }
      }
      return Object.assign({}, state, {
        profile,
      });
    }
    case UPDATE_CHANGE_FOLLOWED:
      return {
        ...state,
        profile: { ...state.profile, foloweds: action.payload },
      };
    case UPDATE_CHANGE_FOLLOWING:
      return {
        ...state,
        profile: { ...state.profile, folowings: action.payload },
      };
    case FOLLOW_FRIEND:
      return {
        ...state,
        profile: {
          ...state.profile,
          folowings: state.profile.folowings.map((item) =>
            item.friendid === action.payload ? { ...item, ismefollow: 1 } : item
          ),
          foloweds: state.profile.foloweds.map((item) =>
            item.friendid === action.payload ? { ...item, ismefollow: 1 } : item
          ),
        },
      };
    case UN_FOLLOW_FRIEND:
      return {
        ...state,
        profile: {
          ...state.profile,
          folowings: state.profile.folowings.map((item) =>
            item.friendid === action.payload ? { ...item, ismefollow: 0 } : item
          ),
          foloweds: state.profile.foloweds.map((item) =>
            item.friendid === action.payload ? { ...item, ismefollow: 0 } : item
          ),
        },
      };
    default:
      return state;
  }
};
