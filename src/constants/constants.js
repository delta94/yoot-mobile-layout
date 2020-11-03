import moment from 'moment'
import _ from 'lodash'
export const DefaultUserAvatar =
    "data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUzIDUzIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MyA1MzsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxwYXRoIHN0eWxlPSJmaWxsOiNFN0VDRUQ7IiBkPSJNMTguNjEzLDQxLjU1MmwtNy45MDcsNC4zMTNjLTAuNDY0LDAuMjUzLTAuODgxLDAuNTY0LTEuMjY5LDAuOTAzQzE0LjA0Nyw1MC42NTUsMTkuOTk4LDUzLDI2LjUsNTMgIGM2LjQ1NCwwLDEyLjM2Ny0yLjMxLDE2Ljk2NC02LjE0NGMtMC40MjQtMC4zNTgtMC44ODQtMC42OC0xLjM5NC0wLjkzNGwtOC40NjctNC4yMzNjLTEuMDk0LTAuNTQ3LTEuNzg1LTEuNjY1LTEuNzg1LTIuODg4di0zLjMyMiAgYzAuMjM4LTAuMjcxLDAuNTEtMC42MTksMC44MDEtMS4wM2MxLjE1NC0xLjYzLDIuMDI3LTMuNDIzLDIuNjMyLTUuMzA0YzEuMDg2LTAuMzM1LDEuODg2LTEuMzM4LDEuODg2LTIuNTN2LTMuNTQ2ICBjMC0wLjc4LTAuMzQ3LTEuNDc3LTAuODg2LTEuOTY1di01LjEyNmMwLDAsMS4wNTMtNy45NzctOS43NS03Ljk3N3MtOS43NSw3Ljk3Ny05Ljc1LDcuOTc3djUuMTI2ICBjLTAuNTQsMC40ODgtMC44ODYsMS4xODUtMC44ODYsMS45NjV2My41NDZjMCwwLjkzNCwwLjQ5MSwxLjc1NiwxLjIyNiwyLjIzMWMwLjg4NiwzLjg1NywzLjIwNiw2LjYzMywzLjIwNiw2LjYzM3YzLjI0ICBDMjAuMjk2LDM5Ljg5OSwxOS42NSw0MC45ODYsMTguNjEzLDQxLjU1MnoiLz4KPGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojNTU2MDgwOyIgZD0iTTI2Ljk1MywwLjAwNEMxMi4zMi0wLjI0NiwwLjI1NCwxMS40MTQsMC4wMDQsMjYuMDQ3Qy0wLjEzOCwzNC4zNDQsMy41Niw0MS44MDEsOS40NDgsNDYuNzYgICBjMC4zODUtMC4zMzYsMC43OTgtMC42NDQsMS4yNTctMC44OTRsNy45MDctNC4zMTNjMS4wMzctMC41NjYsMS42ODMtMS42NTMsMS42ODMtMi44MzV2LTMuMjRjMCwwLTIuMzIxLTIuNzc2LTMuMjA2LTYuNjMzICAgYy0wLjczNC0wLjQ3NS0xLjIyNi0xLjI5Ni0xLjIyNi0yLjIzMXYtMy41NDZjMC0wLjc4LDAuMzQ3LTEuNDc3LDAuODg2LTEuOTY1di01LjEyNmMwLDAtMS4wNTMtNy45NzcsOS43NS03Ljk3NyAgIHM5Ljc1LDcuOTc3LDkuNzUsNy45Nzd2NS4xMjZjMC41NCwwLjQ4OCwwLjg4NiwxLjE4NSwwLjg4NiwxLjk2NXYzLjU0NmMwLDEuMTkyLTAuOCwyLjE5NS0xLjg4NiwyLjUzICAgYy0wLjYwNSwxLjg4MS0xLjQ3OCwzLjY3NC0yLjYzMiw1LjMwNGMtMC4yOTEsMC40MTEtMC41NjMsMC43NTktMC44MDEsMS4wM1YzOC44YzAsMS4yMjMsMC42OTEsMi4zNDIsMS43ODUsMi44ODhsOC40NjcsNC4yMzMgICBjMC41MDgsMC4yNTQsMC45NjcsMC41NzUsMS4zOSwwLjkzMmM1LjcxLTQuNzYyLDkuMzk5LTExLjg4Miw5LjUzNi0xOS45QzUzLjI0NiwxMi4zMiw0MS41ODcsMC4yNTQsMjYuOTUzLDAuMDA0eiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=";

const like = require('../assets/icon/Feeling/like.png')
const love = require('../assets/icon/Feeling/love.png')
const haha = require('../assets/icon/Feeling/haha.png')
const wow = require('../assets/icon/Feeling/wow.png')
const sad = require('../assets/icon/Feeling/sad.png')
const huhu = require('../assets/icon/Feeling/huhu.png')
const angry = require('../assets/icon/Feeling/Angry.png')

const bg01 = require('../assets/background/bg01.png')
const bg02 = require('../assets/background/bg02.png')
const bg03 = require('../assets/background/bg03.png')
const bg04 = require('../assets/background/bg04.png')
const bg05 = require('../assets/background/bg05.png')
const bg06 = require('../assets/background/bg06.png')
const bg07 = require('../assets/background/bg07.png')
const bg08 = require('../assets/background/bg08.png')
const bg09 = require('../assets/background/bg09.png')
const bg10 = require('../assets/background/bg10.png')
const bg11 = require('../assets/background/bg11.png')

export const backgroundList = [
    {
        id: 0,
        background: null
    },
    {
        id: 1,
        background: bg01
    },
    {
        id: 2,
        background: bg02
    },
    {
        id: 3,
        background: bg03
    },
    {
        id: 4,
        background: bg04
    },
    {
        id: 5,
        background: bg05
    },
    {
        id: 6,
        background: bg06
    },
    {
        id: 7,
        background: bg07
    },
    {
        id: 8,
        background: bg08
    },
    {
        id: 9,
        background: bg09
    },
    {
        id: 10,
        background: bg10
    },
    {
        id: 11,
        background: bg11
    }
]

export const Privacies = {
    Public: {
        value: "Public",
        label: "Công khai",
        icon: require('../assets/icon/group.png'),
        icon1: require('../assets/icon/group1.png'),
        description: "Tất cả mọi người",
        code: 2,
        active: true
    },
    Friend: {
        value: "Friend",
        label: "Bạn bè",
        icon: require('../assets/icon/Friend_celected.png'),
        icon1: require('../assets/icon/Friend.png'),
        description: "Bạn bè của bạn",
        code: 3
    },
    Private: {
        value: "private",
        label: "Chỉ mình tôi",
        icon: require('../assets/icon/Private_Selected.png'),
        icon1: require('../assets/icon/Private.png'),
        description: "Chỉ mình tôi",
        code: 4
    }
}

export const GroupPrivacies = {
    Public: {
        value: "Public",
        label: "Nhóm công khai",
        icon: require('../assets/icon/group.png'),
        icon1: require('../assets/icon/group1.png'),
        description: "Mọi người đều xem được",
        code: 1
    },
    Private: {
        value: "Private",
        label: "Nhóm riêng tư",
        icon: require('../assets/icon/private_group__color@2x.png'),
        description: "Chỉ tôi mới xem được",
        code: 2
    }
}

export const RatingList = [
    {
        label: 1,
        color: '#d83b34',
        code: 1
    },
    {
        label: 2,
        color: '#d83b34',
        code: 2
    },
    {
        label: 3,
        color: '#d83b34',
        code: 3
    },
    {
        label: 4,
        color: '#d83b34',
        code: 4
    },
    {
        label: 5,
        color: '#4caae8',
        code: 5
    },
    {
        label: 6,
        color: '#4caae8',
        code: 6
    },
    {
        label: 7,
        color: '#4caae8',
        code: 7
    },
    {
        label: 8,
        color: '#75e75e',
        code: 8
    },
    {
        label: 9,
        color: '#75e75e',
        code: 9
    },
    {
        label: 10,
        color: '#75e75e',
        code: 10
    }
]

export const ReactSelectorIcon = [
    null,
    {
        code: 1,
        label: "Like",
        disciption: "Thích",
        icon: like,
        color: "#dd5c55"
    },
    {
        code: 2,
        label: "Love",
        disciption: "Yêu thích",
        icon: love,
        color: "#dd5c55"
    },
    {
        code: 3,
        label: "Haha",
        disciption: "Haha",
        icon: haha,
        color: "#e4b428"
    },
    {
        code: 4,
        label: "Wow",
        disciption: "Wow",
        icon: wow,
        color: "#f5c846"
    },
    {
        code: 5,
        label: "Sad",
        disciption: "Buồn",
        icon: sad,
        color: "#c3981b"
    },
    {
        code: 6,
        label: "huhu",
        disciption: "Khóc",
        icon: huhu,
        color: "#6c9ec3"
    },
    {
        code: 7,
        label: "Angry",
        disciption: "Giận dữ",
        icon: angry,
        color: "#d8453e"
    }
]

export const Dates = ["Ngày 1", "Ngày 2", "Ngày 3", "Ngày 4", "Ngày 5", "Ngày 6", "Ngày 7", "Ngày 8", "Ngày 9", "Ngày 10", "Ngày 11", "Ngày 12", "Ngày 13", "Ngày 14", "Ngày 15", "Ngày 16", "Ngày 17", "Ngày 18", "Ngày 19", "Ngày 20", "Ngày 21", "Ngày 22", "Ngày 23", "Ngày 24", "Ngày 25", "Ngày 26", "Ngày 27", "Ngày 28", "Ngày 29", "Ngày 30", "Ngày 31"]
export const Months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"]
export const Years = _.range(moment(new Date).year() - 20, moment(new Date).year() + 11)




