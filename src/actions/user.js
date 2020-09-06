
import {
    get
} from '../api'

export const SET_USER_DETAIL = "app@SET_USER_DETAIL"

export const setCurrenUserDetail = (user) => {
    return dispatch => {
        dispatch({
            type: SET_USER_DETAIL,
            payload: user
        })
    }
}




