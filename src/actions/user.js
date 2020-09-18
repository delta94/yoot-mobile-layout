import { get } from "../api"
import { SOCIAL_NET_WORK_API } from "../constants/appSettings"
import { objToQuery } from "../utils/common"
import moment from 'moment'

export const SET_USER_DETAIL = "user@SET_USER_DETAIL"
export const SET_USER_PROFILE = "user@SET_USER_PROFILE"
export const GET_FOLOWED_ME = "user@GET_FOLOWED_ME"
export const GET_ME_FOLOWING = "user@GET_ME_FOLOWING"

export const setUserProfile = (user) => {
    return dispatch => {
        dispatch({
            type: SET_USER_PROFILE,
            payload: user
        })
    }
}

export const setCurrenUserDetail = (user) => {
    return dispatch => {
        dispatch({
            type: SET_USER_DETAIL,
            payload: user
        })
    }
}
export const getFolowedMe = (currentpage) => {
    return dispatch => {
        let param = {
            currentpage: currentpage,
            currentdate: moment(new Date).format("YYYY-MM-DD hh:mm:ss"),
            limit: 20,
            status: "Followed",
            forFriendId: 0,
            groupid: 0
        }
        let queryParam = objToQuery(param)
        get(SOCIAL_NET_WORK_API, "Friends/GetListFriends" + queryParam, result => {
            if (result.result == 1) {
                dispatch({
                    type: GET_FOLOWED_ME,
                    payload: result.content.userInvites
                })
            }
        })

    }
}
export const getMeFolowing = (currentpage) => {
    return dispatch => {
        let param = {
            currentpage: currentpage,
            currentdate: moment(new Date).format("YYYY-MM-DD hh:mm:ss"),
            limit: 20,
            status: "Following",
            forFriendId: 0,
            groupid: 0
        }
        let queryParam = objToQuery(param)
        get(SOCIAL_NET_WORK_API, "Friends/GetListFriends" + queryParam, result => {
            if (result.result == 1) {
                dispatch({
                    type: GET_ME_FOLOWING,
                    payload: result.content.userInvites
                })
            }
        })

    }
}






