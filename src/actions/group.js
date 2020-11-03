
import { get } from "../api"
import { SOCIAL_NET_WORK_API } from "../constants/appSettings"
import { objToQuery } from "../utils/common"
import moment from 'moment'

export const JON_GROUP = "user@SET_USER_DETAIL"
export const ACCEPT_GROUP = "user@ACCEPT_GROUP"
export const SET_JOINED_GROUP = "group@SET_JOINED_GROUP"
export const SET_MY_GROUP = "group@SET_MY_GROUP"
export const SET_INVITED_GROUP = "group@SET_INVITED_GROUP"
export const ACCEPT_GROUP_SUCCESS = "group@ACCEPT_GROUP_SUCCESS"
export const JOIN_GROUP_SUCCESS = "group@JOIN_GROUP_SUCCESS"
export const SET_CURRENT_GROUP = "group@SET_CURRENT_GROUP"
export const LEAVE_GROUP = "group@LEAVE_GROUP"
export const CREATE_GROUP_SUCCESS = "group@CREATE_GROUP_SUCCESS"

export const joinGroup = (groupId, successCallback, errorCallback) => {
    return dispatch => {
        let param = {
            groupid: groupId
        }
        let queryParam = objToQuery(param)
        get(SOCIAL_NET_WORK_API, "GroupUser/JoinGroupUser" + queryParam, result => {
            if (result && result.result == 1) {
                dispatch({
                    type: JOIN_GROUP_SUCCESS,
                    payload: groupId,
                })
                if (successCallback) successCallback()
            }
            else {
                if (errorCallback) errorCallback()
            }
        })

    }
}

export const acceptGroup = (groupId, successCallback, errorCallback, currentGroup) => {
    return dispatch => {
        let param = {
            groupid: groupId
        }
        let queryParam = objToQuery(param)
        get(SOCIAL_NET_WORK_API, "GroupUser/AcceptInviteGroupUser" + queryParam, result => {
            if (result && result.result == 1) {
                dispatch({
                    type: ACCEPT_GROUP_SUCCESS,
                    payload: groupId,
                    currentGroup: currentGroup
                })
                if (successCallback) successCallback()
            }
            else {
                if (errorCallback) errorCallback()
            }
        })

    }
}


export const setJoinedGroup = (groups, total) => {
    return dispatch => {
        dispatch({
            type: SET_JOINED_GROUP,
            payload: groups,
            total: total
        })
    }
}

export const setMyGroup = (groups) => {
    return dispatch => {
        dispatch({
            type: SET_MY_GROUP,
            payload: groups
        })
    }
}


export const setInvitedGroup = (groups) => {
    return dispatch => {
        dispatch({
            type: SET_INVITED_GROUP,
            payload: groups
        })
    }
}


export const setCurrentGroup = (group) => {
    return dispatch => {
        dispatch({
            type: SET_CURRENT_GROUP,
            payload: group
        })
    }
}

export const leaveGroup = (group) => {
    return dispatch => {
        dispatch({
            type: LEAVE_GROUP,
            payload: group
        })
    }
}

export const createGroupSuccess = (group) => {
    return dispatch => {
        dispatch({
            type: CREATE_GROUP_SUCCESS,
            payload: group
        })
    }
}








