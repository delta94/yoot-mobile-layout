

import {
    SET_USER_DETAIL
} from '../actions/user'

const initialState = {
    profile: {
        fullName: "hoang hai long",
        point: 20,
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRDik_Tc8kiAcd80dH3S7I4sDJK76cbjidtyQ&usqp=CAU"
    },
    userDetail: null
};

export default (state = initialState, action) => {
    let {
        userDetail
    } = state

    switch (action.type) {
        case SET_USER_DETAIL: {
            return Object.assign({}, state, {
                userDetail: action.payload
            });
        }
        default:
            return state;
    }
};