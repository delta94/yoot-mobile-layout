
import { get } from "../api"
import { SOCIAL_NET_WORK_API } from "../constants/appSettings"
import { objToQuery } from "../utils/common"
import moment from 'moment'

export const JON_GROUP = "user@SET_USER_DETAIL"
export const ACCEPT_GROUP = "user@ACCEPT_GROUP"

export const joinGroup = (groupId, successCallback, errorCallback) => {
    return dispatch => {
        let param = {
            groupid: groupId
        }
        let queryParam = objToQuery(param)
        get(SOCIAL_NET_WORK_API, "GroupUser/JoinGroupUser" + queryParam, result => {
            if (result.result == 1) {
                dispatch({
                    type: JON_GROUP,
                    payload: groupId
                })
                if (successCallback) successCallback()
            }
            else {
                if (errorCallback) errorCallback()
            }
        })

    }
}

export const acceptGroup = (groupId, successCallback, errorCallback) => {
    return dispatch => {
        let param = {
            groupid: groupId
        }
        let queryParam = objToQuery(param)
        get(SOCIAL_NET_WORK_API, "GroupUser/AcceptInviteGroupUser" + queryParam, result => {
            if (result.result == 1) {
                dispatch({
                    type: ACCEPT_GROUP,
                    payload: groupId
                })
                if (successCallback) successCallback()
            }
            else {
                if (errorCallback) errorCallback()
            }
        })

    }
}









