

import {
    SET_WORLD_NOTI,
    DELETE_NOTI,
    READ_NOTI,
    SET_UNREAD_NOTI_COUNT,
    GET_WORLD_NOTI_SUCCESS,
    GET_SKILL_NOTI_SUCCESS,
    SET_SKILL_NOTI,
    SET_SKILL_UNREAD_NOTI_COUNT
} from '../actions/noti'

const initialState = {
    worldNoties: [],
    skillNoties: [],
    woldNotiUnreadCount: 0,
    skillNotiUnreadCount: 0
};

export default (state = initialState, action) => {
    let {
        worldNoties,
        skillNoties,
        woldNotiUnreadCount,
        skillNotiUnreadCount
    } = state

    switch (action.type) {
        case GET_WORLD_NOTI_SUCCESS: {
            let newList = action.payload
            return Object.assign({}, state, {
                worldNoties: newList
            })
        }
        case GET_SKILL_NOTI_SUCCESS: {
            let newList = action.payload
            return Object.assign({}, state, {
                skillNoties: newList
            })
        }
        case SET_WORLD_NOTI: {
            let newList = worldNoties
            if (newList && newList.length > 0) {
                newList = newList.concat(action.payload)
            } else {
                newList = action.payload
            }
            return Object.assign({}, state, {
                worldNoties: newList
            })
        }
        case SET_SKILL_NOTI: {
            let newList = skillNoties
            if (newList && newList.length > 0) {
                newList = newList.concat(action.payload)
            } else {
                newList = action.payload
            }

            return Object.assign({}, state, {
                skillNoties: newList
            })
        }
        case DELETE_NOTI: {
            let woldList = worldNoties.filter(noti => noti.notificationid != action.payload)
            let skillList = skillNoties.filter(noti => noti.notificationid != action.payload)
            woldNotiUnreadCount = woldNotiUnreadCount - 1
            skillNotiUnreadCount = skillNotiUnreadCount - 1
            return Object.assign({}, state, {
                worldNoties: woldList,
                skillNoties: skillList,
                woldNotiUnreadCount: woldNotiUnreadCount,
                skillNotiUnreadCount: skillNotiUnreadCount
            })
        }
        case READ_NOTI: {
            let woldNotiIndex = worldNoties.findIndex(noti => noti.notificationid == action.payload)
            let skillNotiIndex = skillNoties.findIndex(noti => noti.notificationid == action.payload)

            if (woldNotiIndex >= 0) {
                worldNoties[woldNotiIndex].userstatus = 1
                woldNotiUnreadCount = woldNotiUnreadCount - 1
            }

            if (skillNotiIndex >= 0) {
                skillNoties[skillNotiIndex].userstatus = 1
                skillNotiUnreadCount = skillNotiUnreadCount - 1
            }

            return Object.assign({}, state, {
                worldNoties: worldNoties,
                woldNotiUnreadCount: woldNotiUnreadCount,
                skillNoties: skillNoties,
                skillNotiUnreadCount: skillNotiUnreadCount
            })
        }
        case SET_UNREAD_NOTI_COUNT: {
            woldNotiUnreadCount = action.payload
            return Object.assign({}, state, {
                woldNotiUnreadCount: woldNotiUnreadCount
            })
        }
        case SET_SKILL_UNREAD_NOTI_COUNT: {
            skillNotiUnreadCount = action.payload
            return Object.assign({}, state, {
                skillNotiUnreadCount: skillNotiUnreadCount
            })
        }
        default:
            return state;
    }
};