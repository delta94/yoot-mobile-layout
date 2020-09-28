
import { get } from "../api"
import { SOCIAL_NET_WORK_API } from "../constants/appSettings"
import { objToQuery } from "../utils/common"
import moment from 'moment'

export const SET_ME_POSTEDS = "posted@SET_ME_POSTEDS"
export const UPDATE_POSTED = "posted@UPDATE_POSTED"
export const LIKE_POSTED = "posted@LIKE_POSTED"
export const DISLIKE_POSTED = "posted@DISLIKE_POSTED"
export const LIKE_IMAGE = "posted@LIKE_IMAGE"
export const DISLIKE_IMAGE = "posted@DISLIKE_IMAGE"

export const setMePosted = (posteds) => {
    return dispatch => {
        dispatch({
            type: SET_ME_POSTEDS,
            payload: posteds
        })

    }
}

export const updatePosted = (posted, targetKey) => {
    return dispatch => {
        dispatch({
            type: UPDATE_POSTED,
            payload: posted,
            targetKey: targetKey
        })

    }
}

export const likePosted = (postId, iconCode, targetKey) => {
    return dispatch => {
        dispatch({
            type: LIKE_POSTED,
            postId: postId,
            iconCode: iconCode,
            targetKey: targetKey
        })

    }
}

export const dislikePosted = (postId, targetKey) => {
    return dispatch => {
        dispatch({
            type: DISLIKE_POSTED,
            postId: postId,
            targetKey: targetKey
        })

    }
}


export const likeImage = (postId, imageId, iconCode, targetKey) => {
    return dispatch => {
        dispatch({
            type: LIKE_IMAGE,
            postId: postId,
            imageId: imageId,
            iconCode: iconCode,
            targetKey: targetKey
        })

    }
}

export const dislikeImage = (postId, imageId, targetKey) => {
    return dispatch => {
        dispatch({
            type: DISLIKE_IMAGE,
            postId: postId,
            imageId: imageId,
            targetKey: targetKey
        })

    }
}





