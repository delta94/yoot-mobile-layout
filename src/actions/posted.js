
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
export const SET_CURRENT_POST = "posted@SET_CURRENT_POST"
export const DELETE_POST_SUCCESS = "posted@DELETE_POST_SUCCESS"
export const CREATE_POST_SUCCESS = "posted@CREATE_POST_SUCCESS"
export const SET_USER_POSTEDS = "posted@SET_USER_POSTEDS"
export const CHANGE_COMMENT_COUNT = "posted@CHANGE_COMMENT_COUNT"
export const CHANGE_COMMENT_COUNT_FOR_IMAGE = "posted@CHANGE_COMMENT_COUNT_FOR_IMAGE"
export const ENABLE_POST = "posted@ENABLE_POST"
export const SET_ALL_POSTED = "posted@SET_ALL_POSTED"
export const SET_VIDEO_POSTED = "posted@SET_VIDEO_POSTED"
export const SET_GROUP_POSTED = "posted@SET_GROUP_POSTED"
export const SET_CURRENT_GROUP_POSTED = "post@SET_CURRENT_GROUP_POSTED"
export const UPDATE_PRIVACY_POSTED = "post@UPDATE_PRIVACY_POSTED"
export const UPDATE_COMMENT_POSTED = "post@UPDATE_COMMENT_POSTED"

export const setMePosted = (posteds) => {
    return dispatch => {
        dispatch({
            type: SET_ME_POSTEDS,
            payload: posteds
        })

    }
}

export const setCurrentPosted = (post) => {
    return dispatch => {
        dispatch({
            type: SET_CURRENT_POST,
            payload: post
        })

    }
}

export const updatePosted = (posted, userId) => {
    return dispatch => {
        dispatch({
            type: UPDATE_POSTED,
            payload: posted,
            userId: userId
        })

    }
}

export const createPostSuccess = (post, userId) => {
    return dispatch => {
        dispatch({
            type: CREATE_POST_SUCCESS,
            payload: post,
            userId: userId
        })

    }
}

export const likePosted = (post, iconCode, targetKey, userId) => {
    return dispatch => {
        dispatch({
            type: LIKE_POSTED,
            payload: post,
            iconCode: iconCode,
            targetKey: targetKey,
            userId: userId
        })

    }
}

export const dislikePosted = (post, targetKey, userId) => {
    return dispatch => {
        dispatch({
            type: DISLIKE_POSTED,
            payload: post,
            targetKey: targetKey,
            userId: userId
        })

    }
}


export const likeImage = (post, imageId, iconCode, userId) => {
    return dispatch => {
        dispatch({
            type: LIKE_IMAGE,
            payload: post,
            imageId: imageId,
            iconCode: iconCode,
            userId: userId
        })

    }
}

export const dislikeImage = (post, imageId, userId) => {
    return dispatch => {
        dispatch({
            type: DISLIKE_IMAGE,
            payload: post,
            imageId: imageId,
            userId: userId
        })

    }
}



export const deletePostSuccess = (postId, userId) => {
    return dispatch => {
        dispatch({
            type: DELETE_POST_SUCCESS,
            payload: postId,
            userId: userId
        })

    }
}

export const setUserPosted = (posteds, userId) => {
    return dispatch => {
        dispatch({
            type: SET_USER_POSTEDS,
            payload: posteds,
            userId: userId
        })

    }
}


export const changeCommentCountForPost = (number, postId, userId) => {
    return dispatch => {
        dispatch({
            type: CHANGE_COMMENT_COUNT,
            payload: number,
            userId: userId,
            postId: postId
        })

    }
}


export const changeCommentCountForImage = (number, postId, userId, detailimageid) => {
    return dispatch => {
        dispatch({
            type: CHANGE_COMMENT_COUNT_FOR_IMAGE,
            payload: number,
            postId: postId,
            userId: userId,
            detailimageid: detailimageid
        })

    }
}


export const endablePost = (post) => {
    return dispatch => {
        dispatch({
            type: ENABLE_POST,
            payload: post,
        })

    }
}


export const setAllPosted = (posts) => {
    return dispatch => {
        dispatch({
            type: SET_ALL_POSTED,
            payload: posts,
        })

    }
}

export const setVideoPosted = (posts) => {
    return dispatch => {
        dispatch({
            type: SET_VIDEO_POSTED,
            payload: posts,
        })

    }
}
export const setGroupPosted = (posts) => {
    return dispatch => {
        dispatch({
            type: SET_GROUP_POSTED,
            payload: posts,
        })

    }
}

export const setCurrentGroupPosted = (posts) => {
    return dispatch => {
        dispatch({
            type: SET_CURRENT_GROUP_POSTED,
            payload: posts,
        })

    }
}


export const updatePrivacyPosted = (userId, postId, privacy) => {
    return dispatch => {
        dispatch({
            type: UPDATE_PRIVACY_POSTED,
            payload: postId,
            privacy: privacy,
            userId: userId
        })

    }
}

export const updateCommentPosted = (comments,postId) =>({
    type: UPDATE_COMMENT_POSTED,
    payload: {postId,comments}
})

