import {
    SET_ME_POSTEDS,
    UPDATE_POSTED,
    LIKE_POSTED,
    DISLIKE_POSTED,
    LIKE_IMAGE,
    DISLIKE_IMAGE
} from '../actions/posted'

const initialState = {
    myPosteds: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_ME_POSTEDS: {
            return Object.assign({}, state, {
                myPosteds: action.payload
            });
        }
        case UPDATE_POSTED: {

            const list = state.myPosteds

            list.find((item, index) => {
                if (item.nfid == action.payload.nfid) {
                    list[index] = action.payload
                }
            })
            return Object.assign({}, state.myPosteds, {
                myPosteds: list
            })
        }
        case LIKE_POSTED: {
            let myPosteds = state[action.targetKey]
            if (myPosteds)
                myPosteds.map(item => {
                    if (item.nfid == action.postId) {
                        item.iconNumbers = item.iconNumbers.filter(icon => icon.icon != item.iconlike)
                        item.iconNumbers = item.iconNumbers.filter(icon => icon.icon != action.iconCode)
                        item.iconNumbers.push({ icon: action.iconCode, num: 1 })
                        if (item.islike != 1) {
                            item.islike = 1
                            item.numlike = item.numlike + 1
                        }
                        item.iconlike = action.iconCode
                    }
                })

            return Object.assign({}, state, {
                ...state,
                myPosteds: [...myPosteds]
            })
        }
        case DISLIKE_POSTED: {
            let myPosteds = state[action.targetKey]
            if (myPosteds)
                myPosteds.map(item => {
                    if (item.nfid == action.postId) {
                        item.iconNumbers = item.iconNumbers.filter(icon => icon.icon != item.iconlike)
                        if (item.islike == 1) {
                            item.islike = 0
                            item.numlike = item.numlike - 1
                        }
                        item.iconlike = 0
                    }
                })
            return Object.assign({}, state, {
                ...state,
                myPosteds: myPosteds
            })
        }
        case LIKE_IMAGE: {
            let myPosteds = state[action.targetKey]
            if (myPosteds)
                myPosteds.map(item => {
                    if (item.nfid == action.postId) {
                        item.mediaPlays.map(media => {
                            if (media.detailimageid == action.imageId) {
                                media.iconNumbers = media.iconNumbers.filter(icon => icon.icon != media.iconlike)
                                media.iconNumbers = media.iconNumbers.filter(icon => icon.icon != action.iconCode)
                                media.iconNumbers.push({ icon: action.iconCode, num: 1 })
                                if (media.islike != 1) {
                                    media.islike = 1
                                    media.numlike = media.numlike + 1
                                }
                                media.iconlike = action.iconCode
                            }
                        })
                    }
                })

            return Object.assign({}, state, {
                ...state,
                myPosteds: [...myPosteds]
            })
        }
        case DISLIKE_IMAGE: {
            let myPosteds = state[action.targetKey]
            if (myPosteds)
                myPosteds.map(item => {
                    if (item.nfid == action.postId) {
                        item.mediaPlays.map(media => {
                            if (media.detailimageid == action.imageId) {
                                media.iconNumbers = media.iconNumbers.filter(icon => icon.icon != media.iconlike)
                                if (media.islike == 1) {
                                    media.islike = 0
                                    media.numlike = media.numlike - 1
                                }
                                media.iconlike = 0
                            }
                        })
                    }
                })
            return Object.assign({}, state, {
                ...state,
                myPosteds: myPosteds
            })
        }
        default:
            return state;
    }
};