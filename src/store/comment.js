import {
    SET_COMMENTS,
    COMMENT_SUCCESS,
    REPLY_SUCCESS,
    DELETE_SUCCESS,
    SET_COMMENTS_IMAGE,
    COMMENT_IMAGE_SUCCESS,
    REPLY_IMAGE_COMMENT_SUCCESS,
    DELETE_IMAGE_COMMENT_SUCCESS,
    LIKE_POST_COMMENT_SUCCESS,
    DISLIKE_POST_COMMENT_SUCCESS,
    LIKE_IMAGE_COMMENT_SUCCESS,
    DISLIKE_IMAGE_COMMENT_SUCCESS
} from '../actions/comment'

const initialState = {
    postComments: {},
    imageComments: {}
};

export default (state = initialState, action) => {
    let {
        postComments,
        imageComments
    } = state
    switch (action.type) {
        case SET_COMMENTS: {

            return Object.assign({}, state, {
                ...state,
                postComments: {
                    ...postComments,
                    [action.postId]: action.payload
                }
            })
        }
        case SET_COMMENTS_IMAGE: {
            return Object.assign({}, state, {
                ...state,
                imageComments: {
                    ...imageComments,
                    [action.nameImage]: action.payload
                }
            })
        }
        case COMMENT_SUCCESS: {

            let commentList = postComments[action.postId]

            if (commentList) {
                commentList = [action.payload].concat(commentList)
            } else {
                commentList = [action.payload]
            }

            return Object.assign({}, state, {
                ...state,
                postComments: {
                    ...postComments,
                    [action.postId]: commentList
                }
            })
        }
        case REPLY_SUCCESS: {
            let commentList = postComments[action.postId]
            if (commentList) {
                let commentIndex = commentList.findIndex(comment => comment.commentid == action.replyId)
                if (commentIndex >= 0) {
                    let replyList = commentList[commentIndex].commentRelies
                    replyList = [action.payload].concat(replyList)
                    commentList[commentIndex].commentRelies = replyList
                }
            }
            return Object.assign({}, state, {
                ...state,
                postComments: {
                    ...postComments,
                    [action.postId]: commentList
                }
            })
        }
        case DELETE_SUCCESS: {
            let commentList = postComments[action.postId]
            if (commentList) {
                commentList = commentList.filter(comment => comment.commentid != action.payload)
                if (action.parent && action.parent.commentid) {
                    let commentIndex = commentList.findIndex(comment => comment.commentid == action.parent.commentid)
                    if (commentIndex >= 0) {
                        commentList[commentIndex].commentRelies = commentList[commentIndex].commentRelies.filter(comment => comment.commentid != action.payload)
                    }
                }
            }
            return Object.assign({}, state, {
                ...state,
                postComments: {
                    ...postComments,
                    [action.postId]: commentList
                }
            })
        }
        case DELETE_IMAGE_COMMENT_SUCCESS: {

            let commentList = imageComments[action.nameImage]

            if (commentList) {
                commentList = commentList.filter(comment => comment.commentid != action.payload)

                if (action.parent && action.parent.commentid) {
                    let commentIndex = commentList.findIndex(comment => comment.commentid == action.parent.commentid)
                    if (commentIndex >= 0) {
                        commentList[commentIndex].commentRelies = commentList[commentIndex].commentRelies.filter(comment => comment.commentid != action.payload)
                    }
                }
            }

            return Object.assign({}, state, {
                ...state,
                imageComments: {
                    ...imageComments,
                    [action.nameImage]: commentList
                }
            })
        }
        case COMMENT_IMAGE_SUCCESS: {
            let commentList = imageComments[action.nameImage]

            if (commentList) {
                commentList = [action.payload].concat(commentList)
            } else {
                commentList = [action.payload]
            }

            return Object.assign({}, state, {
                ...state,
                imageComments: {
                    ...imageComments,
                    [action.nameImage]: commentList
                }
            })
        }
        case REPLY_IMAGE_COMMENT_SUCCESS: {
            let commentList = imageComments[action.nameImage]

            if (commentList) {
                let commentIndex = commentList.findIndex(comment => comment.commentid == action.replyId)
                if (commentIndex >= 0) {
                    let replyList = commentList[commentIndex].commentRelies
                    replyList = [action.payload].concat(replyList)
                    commentList[commentIndex].commentRelies = replyList
                }
            }
            return Object.assign({}, state, {
                ...state,
                imageComments: {
                    ...imageComments,
                    [action.nameImage]: commentList
                }
            })
        }
        case LIKE_POST_COMMENT_SUCCESS: {

            let commentList = postComments[action.postId]

            if (commentList) {

                let commentIndex = commentList.findIndex(item => item.commentid == action.payload.commentid)

                if (commentIndex >= 0) {

                    let newIconNumbers = commentList[commentIndex].iconNumbers

                    let likedIconIndex = newIconNumbers.findIndex(item => item.icon == commentList[commentIndex].iconlike)
                    if (likedIconIndex >= 0)
                        newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1

                    if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                    let iconIndex = newIconNumbers.findIndex(item => item.icon == action.icon)

                    if (iconIndex >= 0) {
                        newIconNumbers[iconIndex].num = newIconNumbers[iconIndex].num + 1
                    } else {
                        newIconNumbers.push({ icon: action.icon, num: 1 })
                    }

                    commentList[commentIndex].iconNumbers = newIconNumbers
                    commentList[commentIndex].iconlike = action.icon
                    if (commentList[commentIndex].islike == 0) {
                        commentList[commentIndex].numlike = commentList[commentIndex].numlike + 1
                        commentList[commentIndex].islike = 1
                    }
                }

                if (action.parent) {
                    let parentIndex = commentList.findIndex(item => item.commentid == action.parent.commentid)
                    if (parentIndex >= 0) {
                        let childComment = commentList[parentIndex].commentRelies
                        let index = childComment.findIndex(item => item.commentid == action.payload.commentid)
                        if (index >= 0) {
                            let newIconNumbers = childComment[index].iconNumbers

                            let likedIconIndex = newIconNumbers.findIndex(item => item.icon == childComment[index].iconlike)
                            if (likedIconIndex >= 0)
                                newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1

                            if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                            let iconIndex = newIconNumbers.findIndex(item => item.icon == action.icon)

                            if (iconIndex >= 0) {
                                newIconNumbers[iconIndex].num = newIconNumbers[iconIndex].num + 1
                            } else {
                                newIconNumbers.push({ icon: action.icon, num: 1 })
                            }

                            childComment[index].iconNumbers = newIconNumbers
                            childComment[index].iconlike = action.icon
                            if (childComment[index].islike == 0) {
                                childComment[index].numlike = childComment[index].numlike + 1
                                childComment[index].islike = 1
                            }

                        }
                        commentList[parentIndex].commentRelies = childComment
                    }
                }
            }
            return Object.assign({}, state, {
                ...state,
                postComments: {
                    ...postComments,
                    [action.postId]: commentList
                }
            })
        }
        case DISLIKE_POST_COMMENT_SUCCESS: {
            let commentList = postComments[action.postId]


            if (commentList) {

                let commentIndex = commentList.findIndex(item => item.commentid == action.payload.commentid)
                if (commentIndex >= 0) {
                    let newIconNumbers = commentList[commentIndex].iconNumbers

                    let likedIconIndex = newIconNumbers.findIndex(item => item.icon == commentList[commentIndex].iconlike)

                    if (likedIconIndex >= 0) {
                        newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0
                    }

                    commentList[commentIndex].iconNumbers = newIconNumbers
                    commentList[commentIndex].iconlike = 0
                    if (commentList[commentIndex].islike == 1) {
                        commentList[commentIndex].numlike = commentList[commentIndex].numlike - 1
                        commentList[commentIndex].islike = 0
                    }
                }
                if (action.parent) {
                    let parentIndex = commentList.findIndex(item => item.commentid == action.parent.commentid)
                    if (parentIndex >= 0) {
                        let childComment = commentList[parentIndex].commentRelies
                        let index = childComment.findIndex(item => item.commentid == action.payload.commentid)
                        if (index >= 0) {
                            let newIconNumbers = childComment[index].iconNumbers

                            let likedIconIndex = newIconNumbers.findIndex(item => item.icon == childComment[index].iconlike)

                            if (likedIconIndex >= 0) {
                                newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                                if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0
                            }

                            childComment[index].iconNumbers = newIconNumbers
                            childComment[index].iconlike = 0
                            if (childComment[index].islike == 1) {
                                childComment[index].numlike = childComment[index].numlike - 1
                                childComment[index].islike = 0
                            }
                        }
                        commentList[parentIndex].commentRelies = childComment
                    }
                }

            }
            return Object.assign({}, state, {
                ...state,
                postComments: {
                    ...postComments,
                    [action.postId]: commentList
                }
            })
        }
        case LIKE_IMAGE_COMMENT_SUCCESS: {

            let commentList = imageComments[action.imageName]

            if (commentList) {
                let commentIndex = commentList.findIndex(item => item.commentid == action.payload.commentid)

                if (commentIndex >= 0) {

                    let newIconNumbers = commentList[commentIndex].iconNumbers

                    let likedIconIndex = newIconNumbers.findIndex(item => item.icon == commentList[commentIndex].iconlike)
                    if (likedIconIndex >= 0)
                        newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1

                    if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                    let iconIndex = newIconNumbers.findIndex(item => item.icon == action.icon)

                    if (iconIndex >= 0) {
                        newIconNumbers[iconIndex].num = newIconNumbers[iconIndex].num + 1
                    } else {
                        newIconNumbers.push({ icon: action.icon, num: 1 })
                    }

                    commentList[commentIndex].iconNumbers = newIconNumbers
                    commentList[commentIndex].iconlike = action.icon
                    if (commentList[commentIndex].islike == 0) {
                        commentList[commentIndex].numlike = commentList[commentIndex].numlike + 1
                        commentList[commentIndex].islike = 1
                    }
                }

                if (action.parent) {
                    let parentIndex = commentList.findIndex(item => item.commentid == action.parent.commentid)
                    if (parentIndex >= 0) {
                        let childComment = commentList[parentIndex].commentRelies
                        let index = childComment.findIndex(item => item.commentid == action.payload.commentid)
                        if (index >= 0) {
                            let newIconNumbers = childComment[index].iconNumbers

                            let likedIconIndex = newIconNumbers.findIndex(item => item.icon == childComment[index].iconlike)
                            if (likedIconIndex >= 0)
                                newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1

                            if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                            let iconIndex = newIconNumbers.findIndex(item => item.icon == action.icon)

                            if (iconIndex >= 0) {
                                newIconNumbers[iconIndex].num = newIconNumbers[iconIndex].num + 1
                            } else {
                                newIconNumbers.push({ icon: action.icon, num: 1 })
                            }

                            childComment[index].iconNumbers = newIconNumbers
                            childComment[index].iconlike = action.icon
                            if (childComment[index].islike == 0) {
                                childComment[index].numlike = childComment[index].numlike + 1
                                childComment[index].islike = 1
                            }

                        }
                        commentList[parentIndex].commentRelies = childComment
                    }
                }
            }

            return Object.assign({}, state, {
                ...state,
                imageComments: {
                    ...imageComments,
                    [action.nameImage]: commentList
                }
            })
        }
        case DISLIKE_IMAGE_COMMENT_SUCCESS: {
            let commentList = imageComments[action.imageName]

            if (commentList) {

                let commentIndex = commentList.findIndex(item => item.commentid == action.payload.commentid)
                if (commentIndex >= 0) {
                    let newIconNumbers = commentList[commentIndex].iconNumbers

                    let likedIconIndex = newIconNumbers.findIndex(item => item.icon == commentList[commentIndex].iconlike)

                    if (likedIconIndex >= 0) {
                        newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0
                    }

                    commentList[commentIndex].iconNumbers = newIconNumbers
                    commentList[commentIndex].iconlike = 0
                    if (commentList[commentIndex].islike == 1) {
                        commentList[commentIndex].numlike = commentList[commentIndex].numlike - 1
                        commentList[commentIndex].islike = 0
                    }
                }
                if (action.parent) {
                    let parentIndex = commentList.findIndex(item => item.commentid == action.parent.commentid)
                    if (parentIndex >= 0) {
                        let childComment = commentList[parentIndex].commentRelies
                        let index = childComment.findIndex(item => item.commentid == action.payload.commentid)
                        if (index >= 0) {
                            let newIconNumbers = childComment[index].iconNumbers

                            let likedIconIndex = newIconNumbers.findIndex(item => item.icon == childComment[index].iconlike)

                            if (likedIconIndex >= 0) {
                                newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                                if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0
                            }

                            childComment[index].iconNumbers = newIconNumbers
                            childComment[index].iconlike = 0
                            if (childComment[index].islike == 1) {
                                childComment[index].numlike = childComment[index].numlike - 1
                                childComment[index].islike = 0
                            }
                        }
                        commentList[parentIndex].commentRelies = childComment
                    }
                }

            }
            return Object.assign({}, state, {
                ...state,
                imageComments: {
                    ...imageComments,
                    [action.nameImage]: commentList
                }
            })
        }
        default:
            return state;
    }
};