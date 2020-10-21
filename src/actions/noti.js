
import { get } from "../api"
import { CurrentDate, SOCIAL_NET_WORK_API } from "../constants/appSettings"
import { objToQuery } from "../utils/common"
import moment from 'moment'

export const SET_WORLD_NOTI = "noti@SET_WORLD_NOTI"
export const DELETE_NOTI = "noti@DELETE_NOTI"
export const READ_NOTI = "noti@READ_NOTI"
export const SET_UNREAD_NOTI_COUNT = "noti@SET_UNREAD_NOTI_COUNT"
export const GET_WORLD_NOTI_SUCCESS = "noti@GET_WORLD_NOTI_SUCCESS"
export const GET_SKILL_NOTI_SUCCESS = "noti@GET_SKILL_NOTI_SUCCESS"
export const SET_SKILL_NOTI = "noti@SET_SKILL_NOTI"


export const getWorldNoti = () => {
    return dispatch => {
        let param = {
            currentpage: 0,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 30,
            typeproject: 1
        }
        get(SOCIAL_NET_WORK_API, "Notification/GetListNotification" + objToQuery(param), result => {
            if (result && result.result == 1) {
                dispatch({
                    type: GET_WORLD_NOTI_SUCCESS,
                    payload: result.content.notifications
                })
            }
        })
    }
}

export const getSkillNoti = () => {
    return dispatch => {
        let param = {
            currentpage: 0,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 30,
            typeproject: 2
        }
        get(SOCIAL_NET_WORK_API, "Notification/GetListNotification" + objToQuery(param), result => {
            if (result && result.result == 1) {
                dispatch({
                    type: GET_SKILL_NOTI_SUCCESS,
                    payload: result.content.notifications
                })
            }
        })
    }
}

export const setWorldNoti = (noties) => {
    return dispatch => {
        dispatch({
            type: SET_WORLD_NOTI,
            payload: noties
        })
    }
}

export const setSkillNoti = (noties) => {
    return dispatch => {
        dispatch({
            type: SET_SKILL_NOTI,
            payload: noties
        })
    }
}

export const deleteNoti = (notiId) => {
    return dispatch => {
        dispatch({
            type: DELETE_NOTI,
            payload: notiId
        })
    }
}

export const readNoti = (notiId) => {
    return dispatch => {
        dispatch({
            type: READ_NOTI,
            payload: notiId
        })
    }
}

export const setUnreadNotiCount = (number) => {
    return dispatch => {
        dispatch({
            type: SET_UNREAD_NOTI_COUNT,
            payload: number
        })
    }
}









