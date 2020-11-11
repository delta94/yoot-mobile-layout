import { de } from 'date-fns/locale';
import { debuglog } from 'util';
import {
    SET_ME_POSTEDS,
    UPDATE_POSTED,
    LIKE_POSTED,
    DISLIKE_POSTED,
    LIKE_IMAGE,
    DISLIKE_IMAGE,
    SET_CURRENT_POST,
    DELETE_POST_SUCCESS,
    CREATE_POST_SUCCESS,
    SET_USER_POSTEDS,
    CHANGE_COMMENT_COUNT,
    CHANGE_COMMENT_COUNT_FOR_IMAGE,
    ENABLE_POST,
    SET_ALL_POSTED,
    SET_VIDEO_POSTED,
    SET_GROUP_POSTED,
    SET_CURRENT_GROUP_POSTED,
    UPDATE_PRIVACY_POSTED
} from '../actions/posted'

const initialState = {
    currentPost: null,
    userPosteds: {},
    allPosteds: [],
    videoPosteds: [],
    allGroupPosteds: [],
    currentGroupPosteds: []
};

export default (state = initialState, action) => {
    let {
        userPosteds,
        allPosteds,
        videoPosteds,
        allGroupPosteds,
        currentGroupPosteds
    } = state
    switch (action.type) {
        case SET_CURRENT_POST: {
            return Object.assign({}, state, {
                currentPost: action.payload
            });
        }
        case UPDATE_POSTED: {

            let userPostedsList = userPosteds[action.userId]
            if (userPostedsList) {
                let postIndex = userPostedsList.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {
                    userPostedsList[postIndex] = { ...action.payload, comments: userPostedsList[postIndex].comments }
                }
            }


            if (allPosteds) {
                let postIndex = allPosteds.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {
                    allPosteds[postIndex] = { ...action.payload, comments: userPostedsList[postIndex].comments }
                }
            }

            if (videoPosteds) {
                let postIndex = videoPosteds.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {
                    videoPosteds[postIndex] = { ...action.payload, comments: userPostedsList[postIndex].comments }
                }
            }

            if (allGroupPosteds) {
                let postIndex = allGroupPosteds.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {
                    allGroupPosteds[postIndex] = { ...action.payload, comments: userPostedsList[postIndex].comments }
                }
            }

            if (currentGroupPosteds) {
                let postIndex = currentGroupPosteds.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {
                    currentGroupPosteds[postIndex] = { ...action.payload, comments: userPostedsList[postIndex].comments }
                }
            }


            return Object.assign({}, state, {
                ...state,
                userPosteds: {
                    ...userPosteds,
                    [action.payload.nfid]: userPostedsList
                },
                allPosteds: allPosteds,
                videoPosteds: videoPosteds,
                allGroupPosteds: allGroupPosteds,
                currentGroupPosteds: currentGroupPosteds
            })
        }
        case UPDATE_PRIVACY_POSTED: {
            let userPostedsList = userPosteds[action.userId]
            if (userPostedsList) {
                let postIndex = userPostedsList.findIndex(item => item.nfid == action.payload)

                if (postIndex >= 0) {
                    userPostedsList[postIndex].postforid = action.privacy
                }
            }

            if (allPosteds) {
                let postIndex = allPosteds.findIndex(item => item.nfid == action.payload)

                if (postIndex >= 0) {
                    allPosteds[postIndex].postforid = action.privacy
                }
            }

            if (allGroupPosteds) {
                let postIndex = allGroupPosteds.findIndex(item => item.nfid == action.payload)

                if (postIndex >= 0) {
                    allGroupPosteds[postIndex].postforid = action.privacy
                }
            }


            return Object.assign({}, state, {
                ...state,
                userPosteds: {
                    ...userPosteds,
                    [action.payload]: userPostedsList
                },
                allPosteds: allPosteds,
                allGroupPosteds: allGroupPosteds,
            })
        }
        case LIKE_POSTED: {

            let userPostedsList = userPosteds[action.userId.toString()]

            if (userPostedsList) {
                let postIndex = userPostedsList.findIndex(item => item.nfid == action.payload.nfid)
                if (postIndex >= 0) {

                    let newIconNumbers = userPostedsList[postIndex].iconNumbers

                    let likedIconIndex = newIconNumbers.findIndex(item => item.icon == userPostedsList[postIndex].iconlike)
                    if (likedIconIndex >= 0)
                        newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                    if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                    let iconIndex = newIconNumbers.findIndex(item => item.icon == action.iconCode)
                    if (iconIndex >= 0) {
                        newIconNumbers[iconIndex].num = newIconNumbers[iconIndex].num + 1
                    } else {
                        newIconNumbers.push({ icon: action.iconCode, num: 1 })
                    }
                    userPostedsList[postIndex].iconNumbers = newIconNumbers
                    userPostedsList[postIndex].iconlike = action.iconCode
                    if (userPostedsList[postIndex].islike == 0) {
                        userPostedsList[postIndex].numlike = userPostedsList[postIndex].numlike + 1
                        userPostedsList[postIndex].islike = 1
                    }

                }

                let sharedPostIndex = userPostedsList.findIndex(item => item.newsFeedShare && item.newsFeedShare.nfid == action.payload.nfid)

                if (sharedPostIndex > 0) {
                    let newIconNumbers = userPostedsList[sharedPostIndex].newsFeedShare.iconNumbers

                    let likedIconIndex = newIconNumbers.findIndex(item => item.icon == userPostedsList[sharedPostIndex].newsFeedShare.iconlike)
                    if (likedIconIndex >= 0)
                        newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                    if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                    let iconIndex = newIconNumbers.findIndex(item => item.icon == action.iconCode)
                    if (iconIndex >= 0) {
                        newIconNumbers[iconIndex].num = newIconNumbers[iconIndex].num + 1
                    } else {
                        newIconNumbers.push({ icon: action.iconCode, num: 1 })
                    }
                    userPostedsList[sharedPostIndex].newsFeedShare.iconNumbers = newIconNumbers
                    userPostedsList[sharedPostIndex].newsFeedShare.iconlike = action.iconCode
                    if (userPostedsList[sharedPostIndex].newsFeedShare.islike == 0) {
                        userPostedsList[sharedPostIndex].newsFeedShare.numlike = userPostedsList[sharedPostIndex].newsFeedShare.numlike + 1
                        userPostedsList[sharedPostIndex].newsFeedShare.islike = 1
                    }
                }
            }


            if (allPosteds) {
                let postIndex = allPosteds.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {


                    let newIconNumbers = allPosteds[postIndex].iconNumbers

                    let likedIconIndex = newIconNumbers.findIndex(item => item.icon == allPosteds[postIndex].iconlike)
                    if (likedIconIndex >= 0)
                        newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                    if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                    let iconIndex = newIconNumbers.findIndex(item => item.icon == action.iconCode)
                    if (iconIndex >= 0) {
                        newIconNumbers[iconIndex].num = newIconNumbers[iconIndex].num + 1
                    } else {
                        newIconNumbers.push({ icon: action.iconCode, num: 1 })
                    }
                    allPosteds[postIndex].iconNumbers = newIconNumbers
                    allPosteds[postIndex].iconlike = action.iconCode
                    if (allPosteds[postIndex].islike == 0) {
                        allPosteds[postIndex].numlike = allPosteds[postIndex].numlike + 1
                        allPosteds[postIndex].islike = 1
                    }

                }


                let sharedPostIndex = allPosteds.findIndex(item => item.newsFeedShare && item.newsFeedShare.nfid == action.payload.nfid)

                if (sharedPostIndex > 0) {
                    let newIconNumbers = allPosteds[sharedPostIndex].newsFeedShare.iconNumbers

                    let likedIconIndex = newIconNumbers.findIndex(item => item.icon == allPosteds[sharedPostIndex].newsFeedShare.iconlike)
                    if (likedIconIndex >= 0)
                        newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                    if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                    let iconIndex = newIconNumbers.findIndex(item => item.icon == action.iconCode)
                    if (iconIndex >= 0) {
                        newIconNumbers[iconIndex].num = newIconNumbers[iconIndex].num + 1
                    } else {
                        newIconNumbers.push({ icon: action.iconCode, num: 1 })
                    }
                    allPosteds[sharedPostIndex].newsFeedShare.iconNumbers = newIconNumbers
                    allPosteds[sharedPostIndex].newsFeedShare.iconlike = action.iconCode
                    if (allPosteds[sharedPostIndex].newsFeedShare.islike == 0) {
                        allPosteds[sharedPostIndex].newsFeedShare.numlike = allPosteds[sharedPostIndex].newsFeedShare.numlike + 1
                        allPosteds[sharedPostIndex].newsFeedShare.islike = 1
                    }
                }
            }

            if (videoPosteds) {
                let postIndex = videoPosteds.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {


                    let newIconNumbers = videoPosteds[postIndex].iconNumbers

                    let likedIconIndex = newIconNumbers.findIndex(item => item.icon == videoPosteds[postIndex].iconlike)
                    if (likedIconIndex >= 0)
                        newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                    if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                    let iconIndex = newIconNumbers.findIndex(item => item.icon == action.iconCode)
                    if (iconIndex >= 0) {
                        newIconNumbers[iconIndex].num = newIconNumbers[iconIndex].num + 1
                    } else {
                        newIconNumbers.push({ icon: action.iconCode, num: 1 })
                    }
                    videoPosteds[postIndex].iconNumbers = newIconNumbers
                    videoPosteds[postIndex].iconlike = action.iconCode
                    if (videoPosteds[postIndex].islike == 0) {
                        videoPosteds[postIndex].numlike = videoPosteds[postIndex].numlike + 1
                        videoPosteds[postIndex].islike = 1
                    }

                }
            }

            if (allGroupPosteds) {
                let postIndex = allGroupPosteds.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {


                    let newIconNumbers = allGroupPosteds[postIndex].iconNumbers

                    let likedIconIndex = newIconNumbers.findIndex(item => item.icon == allGroupPosteds[postIndex].iconlike)
                    if (likedIconIndex >= 0)
                        newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                    if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                    let iconIndex = newIconNumbers.findIndex(item => item.icon == action.iconCode)
                    if (iconIndex >= 0) {
                        newIconNumbers[iconIndex].num = newIconNumbers[iconIndex].num + 1
                    } else {
                        newIconNumbers.push({ icon: action.iconCode, num: 1 })
                    }
                    allGroupPosteds[postIndex].iconNumbers = newIconNumbers
                    allGroupPosteds[postIndex].iconlike = action.iconCode
                    if (allGroupPosteds[postIndex].islike == 0) {
                        allGroupPosteds[postIndex].numlike = allGroupPosteds[postIndex].numlike + 1
                        allGroupPosteds[postIndex].islike = 1
                    }

                }
            }

            if (currentGroupPosteds) {
                let postIndex = currentGroupPosteds.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {


                    let newIconNumbers = currentGroupPosteds[postIndex].iconNumbers

                    let likedIconIndex = newIconNumbers.findIndex(item => item.icon == currentGroupPosteds[postIndex].iconlike)
                    if (likedIconIndex >= 0)
                        newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                    if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                    let iconIndex = newIconNumbers.findIndex(item => item.icon == action.iconCode)
                    if (iconIndex >= 0) {
                        newIconNumbers[iconIndex].num = newIconNumbers[iconIndex].num + 1
                    } else {
                        newIconNumbers.push({ icon: action.iconCode, num: 1 })
                    }
                    currentGroupPosteds[postIndex].iconNumbers = newIconNumbers
                    currentGroupPosteds[postIndex].iconlike = action.iconCode
                    if (currentGroupPosteds[postIndex].islike == 0) {
                        currentGroupPosteds[postIndex].numlike = currentGroupPosteds[postIndex].numlike + 1
                        currentGroupPosteds[postIndex].islike = 1
                    }

                }
            }

            return Object.assign({}, state, {
                ...state,
                userPosteds: {
                    ...userPosteds,
                    [action.payload.nfid]: userPostedsList
                },
                allPosteds: allPosteds,
                videoPosteds: videoPosteds,
                allGroupPosteds: allGroupPosteds,
                currentGroupPosteds: currentGroupPosteds
            })
        }
        case DISLIKE_POSTED: {

            let userPostedsList = userPosteds[action.userId]

            if (userPostedsList) {
                let postIndex = userPostedsList.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {

                    let newIconNumbers = userPostedsList[postIndex].iconNumbers

                    let likedIconIndex = newIconNumbers.findIndex(item => item.icon == userPostedsList[postIndex].iconlike)

                    if (likedIconIndex >= 0) {
                        newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0
                    }

                    userPostedsList[postIndex].iconNumbers = newIconNumbers
                    userPostedsList[postIndex].iconlike = 0
                    if (userPostedsList[postIndex].islike == 1) {
                        userPostedsList[postIndex].numlike = userPostedsList[postIndex].numlike - 1
                        userPostedsList[postIndex].islike = 0
                    }

                }

                let sharedPostIndex = userPostedsList.findIndex(item => item.newsFeedShare && item.newsFeedShare.nfid == action.payload.nfid)
                if (sharedPostIndex >= 0) {

                    let newIconNumbers = userPostedsList[sharedPostIndex].newsFeedShare.iconNumbers

                    let likedIconIndex = newIconNumbers.findIndex(item => item.icon == userPostedsList[sharedPostIndex].newsFeedShare.iconlike)

                    if (likedIconIndex >= 0) {
                        newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0
                    }

                    userPostedsList[sharedPostIndex].newsFeedShare.iconNumbers = newIconNumbers
                    userPostedsList[sharedPostIndex].newsFeedShare.iconlike = 0
                    if (userPostedsList[sharedPostIndex].newsFeedShare.islike == 1) {
                        userPostedsList[sharedPostIndex].newsFeedShare.numlike = userPostedsList[sharedPostIndex].newsFeedShare.numlike - 1
                        userPostedsList[sharedPostIndex].newsFeedShare.islike = 0
                    }

                }
            }

            if (allPosteds) {
                let postIndex = allPosteds.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {

                    let newIconNumbers = allPosteds[postIndex].iconNumbers

                    let likedIconIndex = newIconNumbers.findIndex(item => item.icon == allPosteds[postIndex].iconlike)

                    if (likedIconIndex >= 0) {
                        newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0
                    }

                    allPosteds[postIndex].iconNumbers = newIconNumbers
                    allPosteds[postIndex].iconlike = 0
                    if (allPosteds[postIndex].islike == 1) {
                        allPosteds[postIndex].numlike = allPosteds[postIndex].numlike - 1
                        allPosteds[postIndex].islike = 0
                    }

                }

                let sharedPostIndex = allPosteds.findIndex(item => item.newsFeedShare && item.newsFeedShare.nfid == action.payload.nfid)

                if (sharedPostIndex >= 0) {

                    let newIconNumbers = allPosteds[sharedPostIndex].newsFeedShare.iconNumbers

                    let likedIconIndex = newIconNumbers.findIndex(item => item.icon == allPosteds[sharedPostIndex].newsFeedShare.iconlike)

                    if (likedIconIndex >= 0) {
                        newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0
                    }

                    allPosteds[sharedPostIndex].newsFeedShare.iconNumbers = newIconNumbers
                    allPosteds[sharedPostIndex].newsFeedShare.iconlike = 0
                    if (allPosteds[sharedPostIndex].newsFeedShare.islike == 1) {
                        allPosteds[sharedPostIndex].newsFeedShare.numlike = allPosteds[sharedPostIndex].newsFeedShare.numlike - 1
                        allPosteds[sharedPostIndex].newsFeedShare.islike = 0
                    }

                }
            }

            if (videoPosteds) {
                let postIndex = videoPosteds.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {

                    let newIconNumbers = videoPosteds[postIndex].iconNumbers

                    let likedIconIndex = newIconNumbers.findIndex(item => item.icon == videoPosteds[postIndex].iconlike)

                    if (likedIconIndex >= 0) {
                        newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0
                    }

                    videoPosteds[postIndex].iconNumbers = newIconNumbers
                    videoPosteds[postIndex].iconlike = 0
                    if (videoPosteds[postIndex].islike == 1) {
                        videoPosteds[postIndex].numlike = videoPosteds[postIndex].numlike - 1
                        videoPosteds[postIndex].islike = 0
                    }

                }
            }

            if (allGroupPosteds) {
                let postIndex = allGroupPosteds.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {

                    let newIconNumbers = allGroupPosteds[postIndex].iconNumbers

                    let likedIconIndex = newIconNumbers.findIndex(item => item.icon == allGroupPosteds[postIndex].iconlike)

                    if (likedIconIndex >= 0) {
                        newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0
                    }

                    allGroupPosteds[postIndex].iconNumbers = newIconNumbers
                    allGroupPosteds[postIndex].iconlike = 0
                    if (allGroupPosteds[postIndex].islike == 1) {
                        allGroupPosteds[postIndex].numlike = allGroupPosteds[postIndex].numlike - 1
                        allGroupPosteds[postIndex].islike = 0
                    }

                }
            }

            if (currentGroupPosteds) {
                let postIndex = currentGroupPosteds.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {

                    let newIconNumbers = currentGroupPosteds[postIndex].iconNumbers

                    let likedIconIndex = newIconNumbers.findIndex(item => item.icon == currentGroupPosteds[postIndex].iconlike)

                    if (likedIconIndex >= 0) {
                        newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0
                    }

                    currentGroupPosteds[postIndex].iconNumbers = newIconNumbers
                    currentGroupPosteds[postIndex].iconlike = 0
                    if (currentGroupPosteds[postIndex].islike == 1) {
                        currentGroupPosteds[postIndex].numlike = currentGroupPosteds[postIndex].numlike - 1
                        currentGroupPosteds[postIndex].islike = 0
                    }

                }
            }

            return Object.assign({}, state, {
                ...state,
                userPosteds: {
                    ...userPosteds,
                    [action.payload.nfid]: userPostedsList
                },
                allPosteds: allPosteds,
                videoPosteds: videoPosteds,
                allGroupPosteds: allGroupPosteds,
                currentGroupPosteds: currentGroupPosteds
            })
        }
        case LIKE_IMAGE: {

            let userPostedsList = userPosteds[action.userId]

            if (userPostedsList) {
                let postIndex = userPostedsList.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {

                    let mediaList = userPostedsList[postIndex].mediaPlays

                    let mediaIndex = mediaList.findIndex(item => item.detailimageid == action.imageId)

                    if (mediaIndex >= 0) {
                        let newIconNumbers = mediaList[mediaIndex].iconNumbers
                        let likedIconIndex = newIconNumbers.findIndex(item => item.icon == mediaList[mediaIndex].iconlike)
                        if (likedIconIndex >= 0)
                            newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                        let iconIndex = newIconNumbers.findIndex(item => item.icon == action.iconCode)

                        if (iconIndex >= 0) {
                            newIconNumbers[iconIndex].num = newIconNumbers[iconIndex].num + 1
                        } else {
                            newIconNumbers.push({ icon: action.iconCode, num: 1 })
                        }

                        mediaList[mediaIndex].iconNumbers = newIconNumbers
                        mediaList[mediaIndex].iconlike = action.iconCode
                    }

                    if (mediaList[mediaIndex].islike == 0) {
                        mediaList[mediaIndex].numlike = mediaList[mediaIndex].numlike + 1
                        mediaList[mediaIndex].islike = 1
                    }
                    userPostedsList[postIndex].mediaPlays = mediaList
                }

                let sharedPostIndex = userPostedsList.findIndex(item => item.newsFeedShare && item.newsFeedShare.nfid == action.payload.nfid)

                if (sharedPostIndex >= 0) {

                    let mediaList = userPostedsList[sharedPostIndex].newsFeedShare.mediaPlays

                    let mediaIndex = mediaList.findIndex(item => item.detailimageid == action.imageId)

                    if (mediaIndex >= 0) {
                        let newIconNumbers = mediaList[mediaIndex].iconNumbers
                        let likedIconIndex = newIconNumbers.findIndex(item => item.icon == mediaList[mediaIndex].iconlike)
                        if (likedIconIndex >= 0)
                            newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                        let iconIndex = newIconNumbers.findIndex(item => item.icon == action.iconCode)

                        if (iconIndex >= 0) {
                            newIconNumbers[iconIndex].num = newIconNumbers[iconIndex].num + 1
                        } else {
                            newIconNumbers.push({ icon: action.iconCode, num: 1 })
                        }

                        mediaList[mediaIndex].iconNumbers = newIconNumbers
                        mediaList[mediaIndex].iconlike = action.iconCode
                    }

                    if (mediaList[mediaIndex].islike == 0) {
                        mediaList[mediaIndex].numlike = mediaList[mediaIndex].numlike + 1
                        mediaList[mediaIndex].islike = 1
                    }
                    userPostedsList[sharedPostIndex].newsFeedShare.mediaPlays = mediaList
                }
            }

            if (allPosteds) {
                let postIndex = allPosteds.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {

                    let mediaList = allPosteds[postIndex].mediaPlays

                    let mediaIndex = mediaList.findIndex(item => item.detailimageid == action.imageId)

                    if (mediaIndex >= 0) {
                        let newIconNumbers = mediaList[mediaIndex].iconNumbers
                        let likedIconIndex = newIconNumbers.findIndex(item => item.icon == mediaList[mediaIndex].iconlike)
                        if (likedIconIndex >= 0)
                            newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                        let iconIndex = newIconNumbers.findIndex(item => item.icon == action.iconCode)

                        if (iconIndex >= 0) {
                            newIconNumbers[iconIndex].num = newIconNumbers[iconIndex].num + 1
                        } else {
                            newIconNumbers.push({ icon: action.iconCode, num: 1 })
                        }

                        mediaList[mediaIndex].iconNumbers = newIconNumbers
                        mediaList[mediaIndex].iconlike = action.iconCode
                    }

                    if (mediaList[mediaIndex].islike == 0) {
                        mediaList[mediaIndex].numlike = mediaList[mediaIndex].numlike + 1
                        mediaList[mediaIndex].islike = 1
                    }
                    allPosteds[postIndex].mediaPlays = mediaList
                }

                let sharedPostIndex = allPosteds.findIndex(item => item.newsFeedShare && item.newsFeedShare.nfid == action.payload.nfid)

                if (sharedPostIndex >= 0) {

                    let mediaList = allPosteds[sharedPostIndex].newsFeedShare.mediaPlays

                    let mediaIndex = mediaList.findIndex(item => item.detailimageid == action.imageId)

                    if (mediaIndex >= 0) {
                        let newIconNumbers = mediaList[mediaIndex].iconNumbers
                        let likedIconIndex = newIconNumbers.findIndex(item => item.icon == mediaList[mediaIndex].iconlike)
                        if (likedIconIndex >= 0)
                            newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                        let iconIndex = newIconNumbers.findIndex(item => item.icon == action.iconCode)

                        if (iconIndex >= 0) {
                            newIconNumbers[iconIndex].num = newIconNumbers[iconIndex].num + 1
                        } else {
                            newIconNumbers.push({ icon: action.iconCode, num: 1 })
                        }

                        mediaList[mediaIndex].iconNumbers = newIconNumbers
                        mediaList[mediaIndex].iconlike = action.iconCode
                    }

                    if (mediaList[mediaIndex].islike == 0) {
                        mediaList[mediaIndex].numlike = mediaList[mediaIndex].numlike + 1
                        mediaList[mediaIndex].islike = 1
                    }
                    allPosteds[sharedPostIndex].newsFeedShare.mediaPlays = mediaList
                }
            }


            if (videoPosteds) {
                let postIndex = videoPosteds.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {

                    let mediaList = videoPosteds[postIndex].mediaPlays

                    let mediaIndex = mediaList.findIndex(item => item.detailimageid == action.imageId)

                    if (mediaIndex >= 0) {
                        let newIconNumbers = mediaList[mediaIndex].iconNumbers
                        let likedIconIndex = newIconNumbers.findIndex(item => item.icon == mediaList[mediaIndex].iconlike)
                        if (likedIconIndex >= 0)
                            newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                        let iconIndex = newIconNumbers.findIndex(item => item.icon == action.iconCode)

                        if (iconIndex >= 0) {
                            newIconNumbers[iconIndex].num = newIconNumbers[iconIndex].num + 1
                        } else {
                            newIconNumbers.push({ icon: action.iconCode, num: 1 })
                        }

                        mediaList[mediaIndex].iconNumbers = newIconNumbers
                        mediaList[mediaIndex].iconlike = action.iconCode
                    }

                    if (mediaList[mediaIndex].islike == 0) {
                        mediaList[mediaIndex].numlike = mediaList[mediaIndex].numlike + 1
                        mediaList[mediaIndex].islike = 1
                    }
                    videoPosteds[postIndex].mediaPlays = mediaList
                }
            }

            if (allGroupPosteds) {
                let postIndex = allGroupPosteds.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {

                    let mediaList = allGroupPosteds[postIndex].mediaPlays

                    let mediaIndex = mediaList.findIndex(item => item.detailimageid == action.imageId)

                    if (mediaIndex >= 0) {
                        let newIconNumbers = mediaList[mediaIndex].iconNumbers
                        let likedIconIndex = newIconNumbers.findIndex(item => item.icon == mediaList[mediaIndex].iconlike)
                        if (likedIconIndex >= 0)
                            newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                        let iconIndex = newIconNumbers.findIndex(item => item.icon == action.iconCode)

                        if (iconIndex >= 0) {
                            newIconNumbers[iconIndex].num = newIconNumbers[iconIndex].num + 1
                        } else {
                            newIconNumbers.push({ icon: action.iconCode, num: 1 })
                        }

                        mediaList[mediaIndex].iconNumbers = newIconNumbers
                        mediaList[mediaIndex].iconlike = action.iconCode
                    }

                    if (mediaList[mediaIndex].islike == 0) {
                        mediaList[mediaIndex].numlike = mediaList[mediaIndex].numlike + 1
                        mediaList[mediaIndex].islike = 1
                    }
                    allGroupPosteds[postIndex].mediaPlays = mediaList
                }
            }

            if (currentGroupPosteds) {
                let postIndex = currentGroupPosteds.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {

                    let mediaList = currentGroupPosteds[postIndex].mediaPlays

                    let mediaIndex = mediaList.findIndex(item => item.detailimageid == action.imageId)

                    if (mediaIndex >= 0) {
                        let newIconNumbers = mediaList[mediaIndex].iconNumbers
                        let likedIconIndex = newIconNumbers.findIndex(item => item.icon == mediaList[mediaIndex].iconlike)
                        if (likedIconIndex >= 0)
                            newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                        let iconIndex = newIconNumbers.findIndex(item => item.icon == action.iconCode)

                        if (iconIndex >= 0) {
                            newIconNumbers[iconIndex].num = newIconNumbers[iconIndex].num + 1
                        } else {
                            newIconNumbers.push({ icon: action.iconCode, num: 1 })
                        }

                        mediaList[mediaIndex].iconNumbers = newIconNumbers
                        mediaList[mediaIndex].iconlike = action.iconCode
                    }

                    if (mediaList[mediaIndex].islike == 0) {
                        mediaList[mediaIndex].numlike = mediaList[mediaIndex].numlike + 1
                        mediaList[mediaIndex].islike = 1
                    }
                    currentGroupPosteds[postIndex].mediaPlays = mediaList
                }
            }

            return Object.assign({}, state, {
                ...state,
                userPosteds: {
                    ...userPosteds,
                    [action.payload.nfid]: userPostedsList
                },
                allPosteds: allPosteds,
                videoPosteds: videoPosteds,
                allGroupPosteds: allGroupPosteds,
                currentGroupPosteds: currentGroupPosteds
            })
        }
        case DISLIKE_IMAGE: {

            let userPostedsList = userPosteds[action.userId]

            if (userPostedsList) {
                let postIndex = userPostedsList.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {

                    let mediaList = userPostedsList[postIndex].mediaPlays

                    let mediaIndex = mediaList.findIndex(item => item.detailimageid == action.imageId)

                    if (mediaIndex >= 0) {
                        let newIconNumbers = mediaList[mediaIndex].iconNumbers
                        let likedIconIndex = newIconNumbers.findIndex(item => item.icon == userPostedsList[postIndex].iconlike)
                        if (likedIconIndex >= 0)
                            newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                        mediaList[mediaIndex].iconNumbers = newIconNumbers
                        mediaList[mediaIndex].iconlike = 0
                    }

                    if (mediaList[mediaIndex].islike == 1) {
                        mediaList[mediaIndex].numlike = mediaList[mediaIndex].numlike - 1
                        mediaList[mediaIndex].islike = 0
                    }
                    userPostedsList[postIndex].mediaPlays = mediaList
                }

                let sharedPostIndex = userPostedsList.findIndex(item => item.newsFeedShare && item.newsFeedShare.nfid == action.payload.nfid)

                if (sharedPostIndex >= 0) {

                    let mediaList = userPostedsList[sharedPostIndex].newsFeedShare.mediaPlays

                    let mediaIndex = mediaList.findIndex(item => item.detailimageid == action.imageId)

                    if (mediaIndex >= 0) {
                        let newIconNumbers = mediaList[mediaIndex].iconNumbers
                        let likedIconIndex = newIconNumbers.findIndex(item => item.icon == userPostedsList[sharedPostIndex].newsFeedShare.iconlike)
                        if (likedIconIndex >= 0)
                            newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                        mediaList[mediaIndex].iconNumbers = newIconNumbers
                        mediaList[mediaIndex].iconlike = 0
                    }

                    if (mediaList[mediaIndex].islike == 1) {
                        mediaList[mediaIndex].numlike = mediaList[mediaIndex].numlike - 1
                        mediaList[mediaIndex].islike = 0
                    }
                    userPostedsList[sharedPostIndex].newsFeedShare.mediaPlays = mediaList
                }
            }

            if (allPosteds) {
                let postIndex = allPosteds.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {

                    let mediaList = allPosteds[postIndex].mediaPlays

                    let mediaIndex = mediaList.findIndex(item => item.detailimageid == action.imageId)

                    if (mediaIndex >= 0) {
                        let newIconNumbers = mediaList[mediaIndex].iconNumbers
                        let likedIconIndex = newIconNumbers.findIndex(item => item.icon == allPosteds[postIndex].iconlike)
                        if (likedIconIndex >= 0)
                            newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                        mediaList[mediaIndex].iconNumbers = newIconNumbers
                        mediaList[mediaIndex].iconlike = 0
                    }

                    if (mediaList[mediaIndex] && mediaList[mediaIndex].islike == 1) {
                        mediaList[mediaIndex].numlike = mediaList[mediaIndex].numlike - 1
                        mediaList[mediaIndex].islike = 0
                    }
                    allPosteds[postIndex].mediaPlays = mediaList
                }

                let sharedPostIndex = allPosteds.findIndex(item => item.newsFeedShare && item.newsFeedShare.nfid == action.payload.nfid)

                if (sharedPostIndex >= 0) {

                    let mediaList = allPosteds[sharedPostIndex].newsFeedShare.mediaPlays

                    let mediaIndex = mediaList.findIndex(item => item.detailimageid == action.imageId)

                    if (mediaIndex >= 0) {
                        let newIconNumbers = mediaList[mediaIndex].iconNumbers
                        let likedIconIndex = newIconNumbers.findIndex(item => item.icon == allPosteds[sharedPostIndex].newsFeedShare.iconlike)
                        if (likedIconIndex >= 0)
                            newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                        mediaList[mediaIndex].iconNumbers = newIconNumbers
                        mediaList[mediaIndex].iconlike = 0
                    }

                    if (mediaList[mediaIndex].islike == 1) {
                        mediaList[mediaIndex].numlike = mediaList[mediaIndex].numlike - 1
                        mediaList[mediaIndex].islike = 0
                    }
                    allPosteds[sharedPostIndex].newsFeedShare.mediaPlays = mediaList
                }
            }

            if (videoPosteds) {
                let postIndex = videoPosteds.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {

                    let mediaList = videoPosteds[postIndex].mediaPlays

                    let mediaIndex = mediaList.findIndex(item => item.detailimageid == action.imageId)

                    if (mediaIndex >= 0) {
                        let newIconNumbers = mediaList[mediaIndex].iconNumbers
                        let likedIconIndex = newIconNumbers.findIndex(item => item.icon == videoPosteds[postIndex].iconlike)
                        if (likedIconIndex >= 0)
                            newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                        mediaList[mediaIndex].iconNumbers = newIconNumbers
                        mediaList[mediaIndex].iconlike = 0
                    }

                    if (mediaList[mediaIndex].islike == 1) {
                        mediaList[mediaIndex].numlike = mediaList[mediaIndex].numlike - 1
                        mediaList[mediaIndex].islike = 0
                    }
                    videoPosteds[postIndex].mediaPlays = mediaList
                }
            }

            if (allGroupPosteds) {
                let postIndex = allGroupPosteds.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {

                    let mediaList = allGroupPosteds[postIndex].mediaPlays

                    let mediaIndex = mediaList.findIndex(item => item.detailimageid == action.imageId)

                    if (mediaIndex >= 0) {
                        let newIconNumbers = mediaList[mediaIndex].iconNumbers
                        let likedIconIndex = newIconNumbers.findIndex(item => item.icon == allGroupPosteds[postIndex].iconlike)
                        if (likedIconIndex >= 0)
                            newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                        mediaList[mediaIndex].iconNumbers = newIconNumbers
                        mediaList[mediaIndex].iconlike = 0
                    }

                    if (mediaList[mediaIndex].islike == 1) {
                        mediaList[mediaIndex].numlike = mediaList[mediaIndex].numlike - 1
                        mediaList[mediaIndex].islike = 0
                    }
                    allGroupPosteds[postIndex].mediaPlays = mediaList
                }
            }

            if (currentGroupPosteds) {
                let postIndex = currentGroupPosteds.findIndex(item => item.nfid == action.payload.nfid)

                if (postIndex >= 0) {

                    let mediaList = currentGroupPosteds[postIndex].mediaPlays

                    let mediaIndex = mediaList.findIndex(item => item.detailimageid == action.imageId)

                    if (mediaIndex >= 0) {
                        let newIconNumbers = mediaList[mediaIndex].iconNumbers
                        let likedIconIndex = newIconNumbers.findIndex(item => item.icon == currentGroupPosteds[postIndex].iconlike)
                        if (likedIconIndex >= 0)
                            newIconNumbers[likedIconIndex].num = newIconNumbers[likedIconIndex].num - 1
                        if (newIconNumbers[likedIconIndex].num < 0) newIconNumbers[likedIconIndex].num = 0

                        mediaList[mediaIndex].iconNumbers = newIconNumbers
                        mediaList[mediaIndex].iconlike = 0
                    }

                    if (mediaList[mediaIndex].islike == 1) {
                        mediaList[mediaIndex].numlike = mediaList[mediaIndex].numlike - 1
                        mediaList[mediaIndex].islike = 0
                    }
                    currentGroupPosteds[postIndex].mediaPlays = mediaList
                }
            }

            return Object.assign({}, state, {
                ...state,
                userPosteds: {
                    ...userPosteds,
                    [action.payload.nfid]: userPostedsList
                },
                allPosteds: allPosteds,
                videoPosteds: videoPosteds,
                allGroupPosteds: allGroupPosteds,
                currentGroupPosteds: currentGroupPosteds
            })
        }
        case CREATE_POST_SUCCESS: {

            let postedList = userPosteds[action.userId]

            if (postedList && postedList.length > 0) {
                postedList = [action.payload].concat(postedList)
            } else {
                postedList = [action.payload]
            }


            if (allPosteds && allPosteds.length > 0) {
                allPosteds = [action.payload].concat(allPosteds)
            } else {
                allPosteds = [action.payload]
            }

            if (allGroupPosteds && allGroupPosteds.length > 0) {
                allGroupPosteds = [action.payload].concat(allGroupPosteds)
            } else {
                allGroupPosteds = [action.payload]
            }

            if (currentGroupPosteds && currentGroupPosteds.length > 0) {
                currentGroupPosteds = [action.payload].concat(currentGroupPosteds)
            } else {
                currentGroupPosteds = [action.payload]
            }


            return Object.assign({}, state, {
                userPosteds: {
                    ...userPosteds,
                    [action.userId]: postedList
                },
                allPosteds: allPosteds,
                allGroupPosteds: allGroupPosteds,
                currentGroupPosteds: currentGroupPosteds
            })
        }
        case DELETE_POST_SUCCESS: {

            let postedList = userPosteds[action.userId]

            if (postedList && postedList.length > 0) {
                postedList = postedList.filter(post => post.nfid != action.payload)
            }


            if (allPosteds && allPosteds.length > 0) {
                allPosteds = allPosteds.filter(post => post.nfid != action.payload)
            }


            if (videoPosteds && videoPosteds.length > 0) {
                videoPosteds = videoPosteds.filter(post => post.nfid != action.payload)
            }

            if (allGroupPosteds && allGroupPosteds.length > 0) {
                allGroupPosteds = allGroupPosteds.filter(post => post.nfid != action.payload)
            }

            if (currentGroupPosteds && currentGroupPosteds.length > 0) {
                currentGroupPosteds = currentGroupPosteds.filter(post => post.nfid != action.payload)
            }

            return Object.assign({}, state, {
                userPosteds: {
                    ...userPosteds,
                    [action.userId]: postedList
                },
                allPosteds: allPosteds,
                videoPosteds: videoPosteds,
                allGroupPosteds: allGroupPosteds,
                currentGroupPosteds: currentGroupPosteds
            })
        }
        case SET_USER_POSTEDS: {
            let { userPosteds } = state
            let postedList = userPosteds[action.userId]
            postedList = action.payload
            return Object.assign({}, state, {
                userPosteds: {
                    ...userPosteds,
                    [action.userId]: postedList
                }
            })
        }
        case CHANGE_COMMENT_COUNT: {

            let userPostedsList = userPosteds[action.userId]

            if (userPostedsList) {
                let postIndex = userPostedsList.findIndex(item => item.nfid == action.postId)

                if (postIndex >= 0) {
                    userPostedsList[postIndex].numcomment = userPostedsList[postIndex].numcomment + action.payload
                }
            }

            if (allPosteds) {
                let postIndex = allPosteds.findIndex(item => item.nfid == action.postId)

                if (postIndex >= 0) {
                    allPosteds[postIndex].numcomment = allPosteds[postIndex].numcomment + action.payload
                }
            }

            if (videoPosteds) {
                let postIndex = videoPosteds.findIndex(item => item.nfid == action.postId)

                if (postIndex >= 0) {
                    videoPosteds[postIndex].numcomment = videoPosteds[postIndex].numcomment + action.payload
                }
            }

            if (allGroupPosteds) {
                let postIndex = allGroupPosteds.findIndex(item => item.nfid == action.postId)

                if (postIndex >= 0) {
                    allGroupPosteds[postIndex].numcomment = allGroupPosteds[postIndex].numcomment + action.payload
                }
            }

            if (currentGroupPosteds) {
                let postIndex = currentGroupPosteds.findIndex(item => item.nfid == action.postId)

                if (postIndex >= 0) {
                    currentGroupPosteds[postIndex].numcomment = currentGroupPosteds[postIndex].numcomment + action.payload
                }
            }

            return Object.assign({}, state, {
                ...state,
                userPosteds: {
                    ...userPosteds,
                    [action.payload.nfid]: userPostedsList
                },
                allPosteds: allPosteds,
                videoPosteds: videoPosteds,
                allGroupPosteds: allGroupPosteds,
                currentGroupPosteds: currentGroupPosteds
            })
        }
        case CHANGE_COMMENT_COUNT_FOR_IMAGE: {
            let userPostedsList = userPosteds[action.userId]

            if (userPostedsList) {
                let postIndex = userPostedsList.findIndex(item => item.nfid == action.postId)

                if (postIndex >= 0) {
                    let imageList = userPostedsList[postIndex].mediaPlays
                    let imageIndex = imageList.findIndex(item => item.detailimageid == action.detailimageid)
                    if (imageIndex >= 0) {
                        imageList[imageIndex].numcomment = imageList[imageIndex].numcomment + action.payload
                    }
                    userPostedsList[postIndex].mediaPlays = imageList
                }
            }

            if (allPosteds) {
                let postIndex = allPosteds.findIndex(item => item.nfid == action.postId)

                if (postIndex >= 0) {
                    let imageList = allPosteds[postIndex].mediaPlays
                    let imageIndex = imageList.findIndex(item => item.detailimageid == action.detailimageid)
                    if (imageIndex >= 0) {
                        imageList[imageIndex].numcomment = imageList[imageIndex].numcomment + action.payload
                    }
                    allPosteds[postIndex].mediaPlays = imageList
                }
            }

            if (videoPosteds) {
                let postIndex = videoPosteds.findIndex(item => item.nfid == action.postId)

                if (postIndex >= 0) {
                    let imageList = videoPosteds[postIndex].mediaPlays
                    let imageIndex = imageList.findIndex(item => item.detailimageid == action.detailimageid)
                    if (imageIndex >= 0) {
                        imageList[imageIndex].numcomment = imageList[imageIndex].numcomment + action.payload
                    }
                    videoPosteds[postIndex].mediaPlays = imageList
                }
            }

            // if (videoPosteds) {
            //     let postIndex = videoPosteds.findIndex(item => item.nfid == action.postId)

            //     if (postIndex >= 0) {
            //         videoPosteds[postIndex].numcomment = videoPosteds[postIndex].numcomment + action.payload
            //     }
            // }

            // if (userPostedsList) {
            //     let postIndex = userPostedsList.findIndex(item => item.nfid == action.postId)

            //     if (postIndex >= 0) {
            //         let imageList = userPostedsList[postIndex].mediaPlays
            //         let imageIndex = imageList.findIndex(item => item.detailimageid == action.detailimageid)
            //         if (imageIndex >= 0) {
            //             imageList[imageIndex].numcomment = imageList[imageIndex].numcomment + action.payload
            //         }
            //         userPostedsList[postIndex].mediaPlays = imageList
            //     }
            // }

            return Object.assign({}, state, {
                ...state,
                userPosteds: {
                    ...userPosteds,
                    [action.payload.nfid]: userPostedsList
                },
                allPosteds: allPosteds,
                videoPosteds: videoPosteds
            })
        }
        case ENABLE_POST: {
            let postedList = userPosteds[action.payload.iduserpost]
            if (postedList) {
                let postInex = postedList.findIndex(item => item.nfid == action.payload.nfid)
                if (postInex >= 0) {
                    delete postedList[postInex].isPendding
                }
            }
            if (allPosteds) {
                let postInex = allPosteds.findIndex(item => item.nfid == action.payload.nfid)
                if (postInex >= 0) {
                    delete allPosteds[postInex].isPendding
                }
            }

            if (videoPosteds) {
                let postInex = videoPosteds.findIndex(item => item.nfid == action.payload.nfid)
                if (postInex >= 0) {
                    delete videoPosteds[postInex].isPendding
                }
            }

            return Object.assign({}, state, {
                userPosteds: {
                    ...userPosteds,
                    [action.payload.iduserpost]: postedList,
                },
                allPosteds: allPosteds,
                videoPosteds: videoPosteds
            })
        }
        case SET_ALL_POSTED: {

            let newList = allPosteds
            if (newList && newList.length > 0) {
                newList = newList.concat(action.payload)
            } else {
                newList = action.payload
            }
            return Object.assign({}, state, {
                allPosteds: newList
            })
        }
        case SET_VIDEO_POSTED: {
            let newList = videoPosteds
            if (newList && newList.length > 0) {
                newList = newList.concat(action.payload)
            } else {
                newList = action.payload
            }
            return Object.assign({}, state, {
                videoPosteds: newList
            })
        }
        case SET_GROUP_POSTED: {
            let newList = allGroupPosteds
            if (newList && newList.length > 0) {
                newList = newList.concat(action.payload)
            } else {
                newList = action.payload
            }
            return Object.assign({}, state, {
                allGroupPosteds: newList
            })
        }
        case SET_CURRENT_GROUP_POSTED: {
            let newList = currentGroupPosteds
            if (action.payload == null) {
                newList = []
            } else {
                if (newList && newList.length > 0) {
                    newList = newList.concat(action.payload)
                } else {
                    newList = action.payload
                }
            }

            return Object.assign({}, state, {
                currentGroupPosteds: newList
            })
        }
        default:
            return state;
    }
};