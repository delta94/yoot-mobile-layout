import React from "react";
import './style.scss'
import {
    toggleFriendDrawer,
    toggleFindFriendDrawer,
    toggleUserPageDrawer,
    toggleSeachFriends,
    setCurrentFriendId
} from '../../actions/app'
import {
    setCurrenUserDetail,
} from '../../actions/user'
import {
    Drawer,
    IconButton,
    TextField,
    InputAdornment,
    AppBar,
    Avatar,
    Button,
    Tab,
    Tabs
} from '@material-ui/core'
import {
    ChevronLeft as ChevronLeftIcon,
    MoreHoriz as MoreHorizIcon
} from '@material-ui/icons'
import SwipeableViews from 'react-swipeable-views';
import { connect } from 'react-redux'
import moment from 'moment'
import { get } from "../../api";
import { SOCIAL_NET_WORK_API, CurrentDate } from "../../constants/appSettings";
import { objToQuery } from "../../utils/common";
import $ from 'jquery'
import Loader from '../common/loader'


const search = require('../../assets/icon/Find@1x.png')




class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            friendTabIndex: 0,
            suggestFriendCurrentPage: 0,
            isEndOfSuggestFriends: false,
            suggestFriends: [],
            searchKey: "",
            isLoadMore: false,
            allUsers: [],
            friendsWithFriends: [],
            isEndOfFriendsWithFriends: false,
            friendsWithFriendsCurrentPage: 0,
            allUsers: [],
            allUsersCurrentPage: 0,
            isEndOfAllUsers: false,
            friendsWithFriendCount: 0,
            allUserCount: 0
        };
    }

    getFriendsWithFriends(userId, currentpage) {
        let {
            friendsWithFriends
        } = this.state
        let param = {
            currentpage: currentpage,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 20,
            status: "FriendsWithFriends",
            forFriendId: userId,
            groupid: 0
        }
        this.setState({
            isLoadMore: true
        })
        get(SOCIAL_NET_WORK_API, "Friends/GetListFriends" + objToQuery(param), result => {
            if (result.result == 1) {
                this.setState({
                    friendsWithFriends: friendsWithFriends.concat(result.content.userInvites),
                    isLoadMore: false
                })
                if (result.content.userInvites.length == 0) {
                    this.setState({
                        isEndOfFriendsWithFriends: true
                    })
                }
            }
        })
        get(SOCIAL_NET_WORK_API, "Friends/GetCountListFriends" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    friendsWithFriendCount: result.content.count,
                })
            }
        })
    }

    getSuggestFriends(userId, currentpage) {
        let {
            suggestFriends
        } = this.state
        let param = {
            currentpage: currentpage,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 20,
            status: "SuggestFriendsInFriend",
            forFriendId: userId,
            groupid: 0
        }
        this.setState({
            isLoadMore: true
        })
        get(SOCIAL_NET_WORK_API, "Friends/GetListFriends" + objToQuery(param), result => {
            if (result.result == 1) {
                this.setState({
                    suggestFriends: suggestFriends.concat(result.content.userInvites),
                    isLoadMore: false
                })
                if (result.content.userInvites.length == 0) {
                    this.setState({
                        isEndOfSuggestFriends: true
                    })
                }
            }
        })
    }

    getAllUsers(userId, currentpage) {
        let {
            allUsers,
            searchKey
        } = this.state
        let param = {
            currentpage: currentpage,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 20,
            status: "Friends",
            forFriendId: userId,
            groupid: 0,
            findstring: searchKey
        }
        this.setState({
            isLoadMore: true
        })
        get(SOCIAL_NET_WORK_API, "Friends/GetListFriends" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    allUsers: allUsers.concat(result.content.userInvites),
                    isLoadMore: false
                })
                if (result.content.userInvites.length == 0) {
                    this.setState({
                        isEndOfAllUsers: true
                    })
                }
            }
        })
        get(SOCIAL_NET_WORK_API, "Friends/GetCountListFriends" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    allUserCount: result.content.count,
                })
            }
        })
    }


    handleScroll() {
        let element = $("#friend-content")
        let {
            isLoadMore,
            friendTabIndex,
            isEndOfSuggestFriends,
            suggestFriendCurrentPage,
            isEndOfAllUsers,
            allUsersCurrentPage,
            isEndOfFriendsWithFriends,
            friendsWithFriendsCurrentPage
        } = this.state
        if (element && friendTabIndex >= 0)
            if (element.scrollTop() + element.innerHeight() >= element[0].scrollHeight) {
                if (friendTabIndex == 0) {
                    if (isLoadMore == false && isEndOfSuggestFriends == false) {
                        this.setState({
                            suggestFriendCurrentPage: suggestFriendCurrentPage + 1,
                            isLoadMore: true
                        }, () => {
                            this.getSuggestFriends(this.props.userDetail.id, suggestFriendCurrentPage + 1)
                        })
                    }
                }
                if (friendTabIndex == 1) {
                    if (isLoadMore == false && isEndOfFriendsWithFriends == false) {
                        this.setState({
                            friendsWithFriendsCurrentPage: friendsWithFriendsCurrentPage + 1,
                            isLoadMore: true
                        }, () => {
                            this.getFriendsWithFriends(this.props.userDetail.id, friendsWithFriendsCurrentPage + 1)
                        })
                    }
                }
                if (friendTabIndex == 2) {
                    if (isLoadMore == false && isEndOfAllUsers == false) {
                        this.setState({
                            allUsersCurrentPage: allUsersCurrentPage + 1,
                            isLoadMore: true
                        }, () => {
                            this.getAllUsers(this.props.userDetail.id, allUsersCurrentPage + 1)
                        })
                    }
                }
            }
    }



    addFriend(friendId) {
        let {
            suggestFriends,
            allUsers
        } = this.state
        let param = {
            friendid: friendId
        }
        get(SOCIAL_NET_WORK_API, "Friends/AddOrDeleteInviateFriends" + objToQuery(param), (result) => {
            if (result && result.result == 1) {
                allUsers.map((user) => {
                    if (user.friendid == friendId) {
                        user.status = user.status == 1 ? 0 : 1
                    }
                })
                this.setState({
                    suggestFriends: suggestFriends.filter(friend => friend.friendid != friendId),
                    allUsers: allUsers
                })
            }
        })
    }
    removeSuggest(friendId) {
        let {
            suggestFriends
        } = this.state
        this.setState({
            suggestFriends: suggestFriends.filter(friend => friend.friendid != friendId)
        })
    }

    acceptFriend(friend) {
        let {
            queues,
            friends
        } = this.state
        let param = {
            friendid: friend.friendid
        }
        if (!friend) return
        get(SOCIAL_NET_WORK_API, "Friends/AcceptFriends" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    queues: queues.filter(friend => friend.friendid != friend.friendid),
                    friends: [friend].concat(friends)
                })
            }
        })
    }

    removeFriend(friendid) {
        let {
            friendsWithFriends,
            allUsers
        } = this.state
        let param = {
            friendid: friendid
        }
        if (!friendid) return
        get(SOCIAL_NET_WORK_API, "Friends/RemoveFriends" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    friendsWithFriends: friendsWithFriends.filter(friend => friend.friendid != friendid),
                    allUsers: allUsers.filter(friend => friend.friendid != friendid),
                    showFriendActionsDrawer: false
                })
            }
        })
    }

    bandFriend(friendid) {
        let {
            friendsWithFriends,
            allUsers
        } = this.state
        let param = {
            friendid: friendid
        }
        if (!friendid) return
        get(SOCIAL_NET_WORK_API, "Friends/BandFriends" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    friendsWithFriends: friendsWithFriends.filter(friend => friend.friendid != friendid),
                    allUsers: allUsers.filter(friend => friend.friendid != friendid),
                    showFriendActionsDrawer: false
                })
            }
        })
    }

    unFolowFriend(friendid) {
        let {
            friendsWithFriends,
            allUsers
        } = this.state
        let param = {
            friendid: friendid
        }
        if (!friendid) return
        get(SOCIAL_NET_WORK_API, "Friends/UnFollowFriends" + objToQuery(param), result => {
            if (result && result.result == 1) {
                friendsWithFriends.map(friend => {
                    if (friend.friendid == friendid) friend.ismefollow = 0
                })
                allUsers.map(friend => {
                    if (friend.friendid == friendid) friend.ismefollow = 0
                })
                this.setState({
                    friendsWithFriends: friendsWithFriends,
                    allUsers: allUsers,
                    showFriendActionsDrawer: false
                })
            }
        })
    }
    folowFriend(friendid) {
        let {
            friendsWithFriends,
            allUsers
        } = this.state
        let param = {
            friendid: friendid
        }
        if (!friendid) return
        get(SOCIAL_NET_WORK_API, "Friends/FollowFriends" + objToQuery(param), result => {
            if (result && result.result == 1) {
                friendsWithFriends.map(friend => {
                    if (friend.friendid == friendid) friend.ismefollow = 1
                })
                allUsers.map(friend => {
                    if (friend.friendid == friendid) friend.ismefollow = 1
                })
                this.setState({
                    friendsWithFriends: friendsWithFriends,
                    allUsers: allUsers,
                    showFriendActionsDrawer: false
                })
            }
        })
    }

    toggleSearchFriendDrawer() {
        let {
            userDetail
        } = this.props
        if (!userDetail) return
        this.onResetAll(() => {
            this.getAllUsers(userDetail.id, 0)
            this.props.toggleFindFriendDrawer(true)
        })
    }

    onResetAll(callBack) {
        this.setState({
            suggestFriends: [],
            suggestFriendCurrentPage: 0,
            isEndOfSuggestFriends: false,
        }, () => callBack())
    }

    onCloseDrawer() {
        this.onResetAll(() => {
            this.props.onClose()
        })
    }


    componentWillReceiveProps(nextProps) {
        let {
            suggestFriends,
            friendsWithFriends,
            allUsers
        } = this.state
        if (this.props.userDetail && this.props.userDetail.id != nextProps.userDetail.id) {
            this.getSuggestFriends(nextProps.userDetail.id, 0)
            this.getFriendsWithFriends(nextProps.userDetail.id, 0)
            this.getAllUsers(nextProps.userDetail.id, 0)
        } else {
            if (nextProps.userDetail) {
                if (suggestFriends.length == 0) this.getSuggestFriends(nextProps.userDetail.id, 0)
                if (friendsWithFriends.length == 0) this.getFriendsWithFriends(nextProps.userDetail.id, 0)
                if ((allUsers.length == 0)) this.getAllUsers(nextProps.userDetail.id, 0)
            }
        }
    }

    render() {
        let {
            friendTabIndex,
            suggestFriends,
            isLoadMore,
            friendsWithFriends,
            allUsers,
            friendsWithFriendCount,
            allUserCount
        } = this.state
        let {
            userDetail,
            open
        } = this.props

        return (
            userDetail ? <div className="friend-page" >
                <Drawer anchor="bottom" className="friend-drawer find-friends fit-desktop" open={open} onClose={() => this.onCloseDrawer()}>
                    <div className="drawer-detail">
                        <div className="drawer-header">
                            <div className="direction" onClick={() => this.onCloseDrawer()}>
                                <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                                    <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                                </IconButton>
                                <label>Tìm kiếm bạn bè</label>
                            </div>
                        </div>
                        <div className="filter">
                            <TextField
                                className="custom-input"
                                variant="outlined"
                                placeholder="Nhập tên bạn bè để tìm kiếm"
                                className="search-box"
                                style={{
                                    width: "calc(100% - 20px",
                                    margin: "0px 0px 10px 10px",
                                }}
                                disabled
                                value={""}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <img src={search} />
                                        </InputAdornment>
                                    ),
                                }}
                                onClick={() => {
                                    this.props.toggleSeachFriends(true)
                                    this.props.setCurrentFriendId(userDetail.id)
                                }}
                            />
                            <AppBar position="static" color="default" className={"custom-tab mb10"}>
                                <Tabs
                                    value={friendTabIndex}
                                    onChange={(e, value) => this.setState({
                                        friendTabIndex: value,
                                    })}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    variant="fullWidth"
                                    aria-label="full width tabs example"
                                    className="tab-header"
                                >
                                    <Tab label="Gợi ý" {...a11yProps(0)} className="tab-item" />
                                    <Tab label="Chung" {...a11yProps(1)} className="tab-item" />
                                    <Tab label="Tất cả" {...a11yProps(2)} className="tab-item" />
                                </Tabs>
                            </AppBar>
                        </div>
                        <div className="content-form" style={{ overflow: "auto" }} id="friend-content" onScroll={() => this.handleScroll()}>
                            <SwipeableViews
                                index={friendTabIndex}
                                onChangeIndex={(value) => this.setState({ friendTabIndex: value })}
                                className="tab-content"
                            >
                                <TabPanel value={friendTabIndex} index={0} className="content-box">
                                    <div className="friend-list" >
                                        {
                                            suggestFriends && suggestFriends.length > 0 ? <ul>
                                                {
                                                    suggestFriends.map((item, index) => <li key={index} className="friend-layout" >
                                                        <div onClick={() => {
                                                            this.props.setCurrenUserDetail(item)
                                                            this.props.toggleUserPageDrawer(true)
                                                        }}>
                                                            <Avatar aria-label="recipe" className="avatar">
                                                                <div className="img" style={{ background: `url("${item.friendavatar}")` }} />
                                                            </Avatar>
                                                        </div>
                                                        <div className="info-action">
                                                            <label onClick={() => {
                                                                this.props.setCurrenUserDetail(item)
                                                                this.props.toggleUserPageDrawer(true)
                                                            }}>{item.friendname}</label>
                                                            <div className="action">
                                                                <Button className="bt-submit" onClick={() => this.addFriend(item.friendid)}>Kết bạn</Button>
                                                                <Button className="bt-cancel" onClick={() => this.removeSuggest(item.friendid)}>Gỡ bỏ</Button>
                                                            </div>
                                                        </div>
                                                    </li>)
                                                }
                                            </ul> : ""
                                        }
                                    </div>
                                </TabPanel>
                                <TabPanel value={friendTabIndex} index={1} >
                                    <div className="friend-list" >
                                        <div className="p10 pt00 pb00s" style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                                            <span>Số lượng</span>
                                            <span className="red">{friendsWithFriendCount}</span>
                                        </div>
                                        <ul>
                                            {
                                                friendsWithFriends.map((item, index) => <li key={index} className="friend-layout">
                                                    <div className="friend-info" >
                                                        <Avatar aria-label="recipe" className="avatar">
                                                            <div className="img" style={{ background: `url("${item.friendavatar}")` }} />
                                                        </Avatar>
                                                        <label>
                                                            <span className="name">{item.friendname}</span>
                                                            {
                                                                item.numfriendwith > 0 ? <span className="with-friend">{item.numfriendwith} bạn chung</span> : ""
                                                            }
                                                        </label>
                                                    </div>
                                                    <div className="action">
                                                        {
                                                            item.status == 10 ? <IconButton onClick={() => this.setState({
                                                                showFriendActionsDrawer:
                                                                    true,
                                                                currentFriend: item
                                                            })}><MoreHorizIcon /></IconButton> : ""
                                                        }
                                                    </div>
                                                </li>)
                                            }
                                        </ul>
                                    </div>
                                </TabPanel>
                                <TabPanel value={friendTabIndex} index={2} className="content-box find-friends">
                                    <div className="friend-list" >
                                        <div className="p10 pt00 pb00" style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                                            <span>Số lượng</span>
                                            <span className="red">{allUserCount}</span>
                                        </div>
                                        <ul>
                                            {
                                                allUsers.map((item, index) => <li key={index} className="friend-layout">
                                                    <div className="friend-info" >
                                                        <Avatar aria-label="recipe" className="avatar">
                                                            <div className="img" style={{ background: `url("${item.friendavatar}")` }} />
                                                        </Avatar>
                                                        <label>
                                                            <span className="name">{item.friendname}</span>
                                                            {
                                                                item.numfriendwith > 0 ? <span className="with-friend">{item.numfriendwith} bạn chung</span> : ""
                                                            }
                                                        </label>
                                                    </div>
                                                    <div className="action">

                                                        {
                                                            item.status == 0 ? <Button className="bt-submit" onClick={() => this.addFriend(item.friendid)}>Kết bạn</Button> : ""
                                                        }
                                                        {
                                                            item.status == 1 ? <Button className="bt-cancel" onClick={() => this.setState({
                                                                okCallback: () => this.addFriend(item.friendid),
                                                                confirmTitle: "",
                                                                confirmMessage: "Bạn có chắc chắn muốn huỷ yêu cầu kết bạn này không?",
                                                                showConfim: true
                                                            })}>Huỷ</Button> : ""
                                                        }
                                                        {
                                                            item.status == 10 ? <IconButton onClick={() => this.setState({
                                                                showFriendActionsDrawer: true,
                                                                currentFriend: item
                                                            })}><MoreHorizIcon /></IconButton> : ""
                                                        }
                                                    </div>
                                                </li>)
                                            }
                                        </ul>
                                    </div>
                                </TabPanel>

                            </SwipeableViews>
                            <div style={{ height: "50px" }}>
                                {
                                    isLoadMore ? <Loader type="small" /> : ""
                                }
                            </div>
                        </div>
                    </div>
                </Drawer>
                {
                    renderConfirmDrawer(this)
                }
                {
                    renderFriendActionsDrawer(this)
                }
            </div> : ""
        );
    }
}

// const mapStateToProps = state => {
//     return {
//         ...state.app,
//         ...state.user
//     }
// };

const mapDispatchToProps = dispatch => ({
    toggleFriendDrawer: (isShow) => dispatch(toggleFriendDrawer(isShow)),
    toggleFindFriendDrawer: (isShow) => dispatch(toggleFindFriendDrawer(isShow)),
    setCurrenUserDetail: (user) => dispatch(setCurrenUserDetail(user)),
    toggleUserPageDrawer: (isShow) => dispatch(toggleUserPageDrawer(isShow)),
    toggleSeachFriends: (isShow) => dispatch(toggleSeachFriends(isShow)),
    setCurrentFriendId: (friendId) => dispatch(setCurrentFriendId(friendId))
});

export default connect(
    null,
    mapDispatchToProps
)(Index);



function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <div>{children}</div>
            )}
        </div>
    );
}

const renderConfirmDrawer = (component) => {
    let {
        showConfim,
        okCallback,
        confirmTitle,
        confirmMessage
    } = component.state
    return (
        <Drawer anchor="bottom" className="confirm-drawer" open={showConfim} onClose={() => component.setState({ showConfim: false })}>
            <div className='jon-group-confirm'>
                <label>{confirmTitle}</label>
                <p>{confirmMessage}</p>
                <div className="mt20">
                    <Button className="bt-confirm" onClick={() => component.setState({ showConfim: false }, () => okCallback ? okCallback() : null)}>Đồng ý</Button>
                    <Button className="bt-submit" onClick={() => component.setState({ showConfim: false })}>Đóng</Button>
                </div>
            </div>
        </Drawer>
    )
}


const renderFriendActionsDrawer = (component) => {
    let {
        currentFriend,
        showFriendActionsDrawer
    } = component.state
    return (
        <Drawer anchor="bottom" className="friend-actions-drawer" open={showFriendActionsDrawer} onClose={() => component.setState({ showFriendActionsDrawer: false })}>
            {
                currentFriend ? <div className="drawer-content">
                    <ul>
                        {
                            currentFriend.ismefollow == 1 ? <li onClick={() => component.setState({
                                okCallback: () => component.unFolowFriend(currentFriend.friendid),
                                confirmTitle: "",
                                confirmMessage: "Bạn có chắc muốn bỏ theo dõi người này không?",
                                showConfim: true
                            })}>
                                <label>Bỏ theo dõi ( {currentFriend.friendname} )</label>
                                <span>Không nhìn thấy các hoạt động của nhau nữa nhưng vẫn là bạn bè.</span>
                            </li> : <li onClick={() => component.folowFriend(currentFriend.friendid)}>
                                    <label>Theo dõi ( {currentFriend.friendname} )</label>
                                    <span>Nhìn thấy các hoạt động của nhau.</span>
                                </li>
                        }
                        <li onClick={() => component.setState({
                            okCallback: () => component.bandFriend(currentFriend.friendid),
                            confirmTitle: "",
                            confirmMessage: "Bạn có chắc chắn muốn chặn người này không? Bạn và người bị chặn sẽ không thể nhìn thấy nhau, đồng thời nếu đang là bạn bè, việc chặn này cũng sẽ huỷ kết bạn của nhau.",
                            showConfim: true
                        })}>
                            <label>Chặn ( {currentFriend.friendname} )</label>
                            <span>Bạn và người này sẽ không nhìn thấy nhau.</span>
                        </li>
                    </ul>
                    <Button className="bt-submit" onClick={() => component.setState({
                        okCallback: () => component.removeFriend(currentFriend.friendid),
                        confirmTitle: "",
                        confirmMessage: "Bạn có chắc chắn muốn xoá người này khỏi danh sách bạn bè không?",
                        showConfim: true
                    })}>Huỷ kết bạn</Button>
                </div> : ''
            }
        </Drawer>
    )
}



