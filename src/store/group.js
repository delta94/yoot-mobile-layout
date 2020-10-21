

import {
    SET_JOINED_GROUP,
    SET_MY_GROUP,
    SET_INVITED_GROUP,
    ACCEPT_GROUP_SUCCESS,
    JOIN_GROUP_SUCCESS,
    SET_CURRENT_GROUP,
    LEAVE_GROUP,
    CREATE_GROUP_SUCCESS
} from '../actions/group'

const initialState = {
    joinedGroups: [],
    myGroups: [],
    invitedGroups: [],
    currentGroup: null
};

export default (state = initialState, action) => {
    let {
        joinedGroups,
        myGroups,
        invitedGroups,
        currentGroup
    } = state

    switch (action.type) {
        case SET_JOINED_GROUP: {
            if (action.payload == null) {
                joinedGroups = []
            } else {
                if (joinedGroups && joinedGroups.length > 0) {
                    joinedGroups = action.payload.concat(joinedGroups)
                } else {
                    joinedGroups = action.payload
                }
            }

            return Object.assign({}, state, {
                joinedGroups: joinedGroups
            })
        }
        case SET_MY_GROUP: {
            if (action.payload == null) {
                myGroups = []
            } else {
                if (myGroups && myGroups.length > 0) {
                    myGroups = action.payload.concat(myGroups)
                } else {
                    myGroups = action.payload
                }
            }

            return Object.assign({}, state, {
                myGroups: myGroups
            })
        }
        case SET_INVITED_GROUP: {
            if (action.payload == null) {
                invitedGroups = []
            } else {
                if (invitedGroups && invitedGroups.length > 0) {
                    invitedGroups = action.payload.concat(invitedGroups)
                } else {
                    invitedGroups = action.payload
                }
            }

            return Object.assign({}, state, {
                invitedGroups: invitedGroups
            })
        }
        case ACCEPT_GROUP_SUCCESS: {
            joinedGroups = [action.currentGroup].concat(joinedGroups)
            invitedGroups = invitedGroups.filter(group => group.groupid != action.currentGroup.groupid)
            return Object.assign({}, state, {
                joinedGroups: joinedGroups,
                invitedGroups: invitedGroups
            })
        }
        case JOIN_GROUP_SUCCESS: {
            invitedGroups = invitedGroups.filter(group => group.groupid != action.payload)
            return Object.assign({}, state, {
                invitedGroups: invitedGroups
            })
        }
        case SET_CURRENT_GROUP: {
            currentGroup = action.payload
            return Object.assign({}, state, {
                currentGroup: currentGroup
            })
        }
        case LEAVE_GROUP: {
            if (joinedGroups && joinedGroups.length > 0)
                joinedGroups = joinedGroups.filter(group => group.groupid != action.payload.groupid)
            if (myGroups && myGroups.length > 0)
                myGroups = myGroups.filter(group => group.groupid != action.payload.groupid)
            return Object.assign({}, state, {
                joinedGroups: joinedGroups,
                myGroups: myGroups
            })
        }
        case CREATE_GROUP_SUCCESS: {
            if (joinedGroups && joinedGroups.length > 0) {
                joinedGroups = joinedGroups.concat([action.payload])
            } else {
                joinedGroups = [action.payload]
            }

            if (myGroups && myGroups.length > 0) {
                myGroups = myGroups.concat([action.payload])
            } else {
                myGroups = [action.payload]
            }
            return Object.assign({}, state, {
                joinedGroups: joinedGroups,
                myGroups: myGroups
            })
        }
        default:
            return state;
    }
};