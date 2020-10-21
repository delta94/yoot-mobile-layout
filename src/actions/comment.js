
import { get } from "../api"
import { SOCIAL_NET_WORK_API } from "../constants/appSettings"
import { objToQuery } from "../utils/common"
import moment from 'moment'

export const SET_COMMENTS = "comment@SET_COMMENTS"
export const COMMENT_SUCCESS = "comment@COMMENT_SUCCESS"
export const REPLY_SUCCESS = "comment@REPLY_SUCCESS"
export const DELETE_SUCCESS = "comment@DELETE_SUCCESS"
export const DELETE_IMAGE_COMMENT_SUCCESS = "comment@DELETE_IMAGE_COMMENT_SUCCESS"
export const SET_COMMENTS_IMAGE = "comment@SET_COMMENTS_IMAGE"
export const COMMENT_IMAGE_SUCCESS = "comment@COMMENT_IMAGE_SUCCESS"
export const REPLY_IMAGE_COMMENT_SUCCESS = "comment@REPLY_IMAGE_COMMENT_SUCCESS"
export const LIKE_POST_COMMENT_SUCCESS = "comment@LIKE_POST_COMMENT_SUCCESS"
export const DISLIKE_POST_COMMENT_SUCCESS = "comment@DISLIKE_POST_COMMENT_SUCCESS"
export const LIKE_IMAGE_COMMENT_SUCCESS = "comment@LIKE_IMAGE_COMMENT_SUCCESS"
export const DISLIKE_IMAGE_COMMENT_SUCCESS = "comment@DISLIKE_IMAGE_COMMENT_SUCCESS"

export const setComment = (comments, postId) => {
    return dispatch => {
        dispatch({
            type: SET_COMMENTS,
            payload: comments,
            postId: postId
        })

    }
}
export const setCommentImage = (comments, nameImage) => {
    return dispatch => {
        dispatch({
            type: SET_COMMENTS_IMAGE,
            payload: comments,
            nameImage: nameImage
        })

    }
}


export const commentSuccess = (comments, postId) => {
    return dispatch => {
        dispatch({
            type: COMMENT_SUCCESS,
            payload: comments,
            postId: postId
        })

    }
}

export const replySuccess = (comments, replyId, postId) => {
    return dispatch => {
        dispatch({
            type: REPLY_SUCCESS,
            payload: comments,
            postId: postId,
            replyId: replyId
        })

    }
}

export const deleteCommentSuccess = (commentId, postId, parent) => {
    return dispatch => {
        dispatch({
            type: DELETE_SUCCESS,
            payload: commentId,
            postId: postId,
            parent: parent
        })
    }
}

export const deleteImageCommentSuccess = (commentId, nameImage, parent) => {
    return dispatch => {
        dispatch({
            type: DELETE_IMAGE_COMMENT_SUCCESS,
            payload: commentId,
            nameImage: nameImage,
            parent: parent
        })
    }
}

export const commentImageSuccess = (comment, nameImage) => {
    return dispatch => {
        dispatch({
            type: COMMENT_IMAGE_SUCCESS,
            payload: comment,
            nameImage: nameImage,
        })

    }
}

export const replyImageCommentSuccess = (comment, replyId, nameImage) => {
    return dispatch => {
        dispatch({
            type: REPLY_IMAGE_COMMENT_SUCCESS,
            payload: comment,
            replyId: replyId,
            nameImage: nameImage,
        })

    }
}

export const likePostComment = (comment, icon, postId, parent) => {
    return dispatch => {
        dispatch({
            type: LIKE_POST_COMMENT_SUCCESS,
            payload: comment,
            icon: icon,
            postId: postId,
            parent: parent
        })

    }
}
export const dislikePostComment = (comment, postId, parent) => {
    return dispatch => {
        dispatch({
            type: DISLIKE_POST_COMMENT_SUCCESS,
            payload: comment,
            postId: postId,
            parent: parent
        })

    }
}

export const likeImageComment = (comment, icon, imageName, parent) => {
    return dispatch => {
        dispatch({
            type: LIKE_IMAGE_COMMENT_SUCCESS,
            payload: comment,
            icon: icon,
            imageName: imageName,
            parent: parent
        })

    }
}

export const dislikeImageComment = (comment, imageName, parent) => {
    return dispatch => {
        dispatch({
            type: DISLIKE_IMAGE_COMMENT_SUCCESS,
            payload: comment,
            imageName: imageName,
            parent: parent
        })

    }
}









// export const commentImageSuccess = (comments, detailimageid, postId)


