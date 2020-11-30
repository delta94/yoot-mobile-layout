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
            waitingCurrentPage: 0,
            queuesCurrentPage: 0,
            friendsCurrentPage: 0,
            isEndOfSuggestFriends: false,
            isEndOfWaitings: false,
            isEndOfQueues: false,
            isEndOfFriends: false,
            suggestFriends: [],
            queues: [],
            waitings: [],
            friends: [],
            searchKey: "",
            isLoadMore: false,
            allUsers: [],
            queueCount: 0,
            friendCount: 0,
            waitingCount: 0
        };
    }


    getFriends(userId, currentpage) {
        let {
            profile
        } = this.props
        let {
            friends
        } = this.state
        let param = {
            currentpage: currentpage,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 20,
            status: "Friends",
            forFriendId: userId == profile.id ? 0 : userId,
            groupid: 0
        }
        this.setState({
            isLoadMore: true
        })
        get(SOCIAL_NET_WORK_API, "Friends/GetListFriends" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    friends: friends.concat(result.content.userInvites),
                    isLoadMore: false
                })
                if (result.content.userInvites.length == 0) {
                    this.setState({
                        isEndOfFriends: true
                    })
                }
            }
        })
        get(SOCIAL_NET_WORK_API, "Friends/GetCountListFriends" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    friendCount: result.content.count,
                })
            }
        })
    }
    getSuggestFriends(userId, currentpage) {
        let {
            profile
        } = this.props
        let {
            suggestFriends
        } = this.state
        let param = {
            currentpage: currentpage,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 20,
            status: "SuggestFriendsMe",
            forFriendId: userId == profile.id ? 0 : userId,
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

    getQueue(userId, currentpage) {
        let {
            profile
        } = this.props
        let {
            queues
        } = this.state
        let param = {
            currentpage: currentpage,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 20,
            status: "Queue",
            forFriendId: userId == profile.id ? 0 : userId,
            groupid: 0
        }
        this.setState({
            isLoadMore: true
        })
        get(SOCIAL_NET_WORK_API, "Friends/GetListFriends" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    queues: queues.concat(result.content.userInvites),
                    isLoadMore: false
                })
                if (result.content.userInvites.length == 0) {
                    this.setState({
                        isEndOfQueues: true
                    })
                }
            }
        })
        get(SOCIAL_NET_WORK_API, "Friends/GetCountListFriends" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    queueCount: result.content.count,
                })
            }
        })
    }

    getWaiting(userId, currentpage) {
        let {
            profile
        } = this.props
        let {
            waitings
        } = this.state
        let param = {
            currentpage: currentpage,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 20,
            status: "Waiting",
            forFriendId: userId == profile.id ? 0 : userId,
            groupid: 0
        }
        this.setState({
            isLoadMore: true
        })
        get(SOCIAL_NET_WORK_API, "Friends/GetListFriends" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    waitings: waitings.concat(result.content.userInvites),
                    isLoadMore: false
                })
                if (result.content.userInvites.length == 0) {
                    this.setState({
                        isEndOfWaitings: true
                    })
                }
            }
        })

        get(SOCIAL_NET_WORK_API, "Friends/GetCountListFriends" + objToQuery(param), result => {
            if (result.result == 1) {
                this.setState({
                    waitingCount: result.content.count,
                })
            }
        })
    }

    handleScroll() {
        let element = $("#friend-content")
        let {
            isLoadMore,
            isEndOfSuggestFriends,
            friendTabIndex,
            suggestFriendCurrentPage,
            isEndOfQueues,
            queuesCurrentPage,
            isEndOfWaitings,
            waitingCurrentPage,
            friendsCurrentPage,
            isEndOfFriends
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
                    if (isLoadMore == false && isEndOfQueues == false) {
                        this.setState({
                            queuesCurrentPage: queuesCurrentPage + 1,
                            isLoadMore: true
                        }, () => {
                            this.getQueue(this.props.userDetail.id, queuesCurrentPage + 1)
                        })
                    }
                }
                if (friendTabIndex == 2) {
                    if (isLoadMore == false && isEndOfWaitings == false) {
                        this.setState({
                            waitingCurrentPage: waitingCurrentPage + 1,
                            isLoadMore: true
                        }, () => {
                            this.getWaiting(this.props.userDetail.id, waitingCurrentPage + 1)
                        })
                    }
                }
                if (friendTabIndex == 3) {
                    if (isLoadMore == false && isEndOfFriends == false) {
                        this.setState({
                            friendsCurrentPage: friendsCurrentPage + 1,
                            isLoadMore: true
                        }, () => {
                            this.getFriends(this.props.userDetail.id, friendsCurrentPage + 1)
                        })
                    }
                }
            }
    }

    addFriend(friendId) {
        let {
            suggestFriends,
            waitings,
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
                    waitings: waitings.filter(friend => friend.friendid != friendId),
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
            friends,
            allUsers
        } = this.state
        let param = {
            friendid: friendid
        }
        if (!friendid) return
        get(SOCIAL_NET_WORK_API, "Friends/RemoveFriends" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    friends: friends.filter(friend => friend.friendid != friendid),
                    allUsers: allUsers.filter(friend => friend.friendid != friendid),
                    showFriendActionsDrawer: false
                })
            }
        })
    }

    bandFriend(friendid) {
        let {
            friends,
            allUsers
        } = this.state
        let param = {
            friendid: friendid
        }
        if (!friendid) return
        get(SOCIAL_NET_WORK_API, "Friends/BandFriends" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    friends: friends.filter(friend => friend.friendid != friendid),
                    allUsers: allUsers.filter(friend => friend.friendid != friendid),
                    showFriendActionsDrawer: false
                })
            }
        })
    }

    unFolowFriend(friendid) {
        let {
            friends,
            allUsers
        } = this.state
        let param = {
            friendid: friendid
        }
        if (!friendid) return
        get(SOCIAL_NET_WORK_API, "Friends/UnFollowFriends" + objToQuery(param), result => {
            if (result && result.result == 1) {
                friends.map(friend => {
                    if (friend.friendid == friendid) friend.ismefollow = 0
                })
                allUsers.map(friend => {
                    if (friend.friendid == friendid) friend.ismefollow = 0
                })
                this.setState({
                    friends: friends,
                    allUsers: allUsers,
                    showFriendActionsDrawer: false
                })
            }
        })
    }
    folowFriend(friendid) {
        let {
            friends,
            allUsers
        } = this.state
        let param = {
            friendid: friendid
        }
        if (!friendid) return
        get(SOCIAL_NET_WORK_API, "Friends/FollowFriends" + objToQuery(param), result => {
            if (result && result.result == 1) {
                friends.map(friend => {
                    if (friend.friendid == friendid) friend.ismefollow = 1
                })
                allUsers.map(friend => {
                    if (friend.friendid == friendid) friend.ismefollow = 1
                })
                this.setState({
                    friends: friends,
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
            friends: [],
            friendsCurrentPage: 0,
            isEndOfFriends: false,
            queues: [],
            queuesCurrentPage: 0,
            isEndOfQueues: false,
            waitings: [],
            waitingCurrentPage: 0,
            isEndOfWaitings: false
        }, () => callBack())
    }

    onCloseDrawer() {
        this.onResetAll(() => {
            this.props.toggleFriendDrawer(false)
        })
    }


    componentWillReceiveProps(nextProps) {
        let {
            friends,
            suggestFriends,
            queues,
            waitings
        } = this.state
        if (this.props.userDetail && this.props.userDetail.id != nextProps.userDetail.id) {
            this.getFriends(nextProps.userDetail.id, 0)
            this.getSuggestFriends(nextProps.userDetail.id, 0)
            this.getQueue(nextProps.userDetail.id, 0)
            this.getWaiting(nextProps.userDetail.id, 0)
        } else {
            if (nextProps.userDetail) {
                if (friends.length == 0) this.getFriends(nextProps.userDetail.id, 0)
                if (suggestFriends.length == 0) this.getSuggestFriends(nextProps.userDetail.id, 0)
                if (queues.length == 0) this.getQueue(nextProps.userDetail.id, 0)
                if (waitings.length == 0) this.getWaiting(nextProps.userDetail.id, 0)
            }
        }
    }

    render() {
        let {
            friendTabIndex,
            friends,
            suggestFriends,
            queues,
            waitings,
            isLoadMore,
            queueCount,
            friendCount,
            waitingCount
        } = this.state
        let {
            userDetail,
            showFriendDrawer
        } = this.props

        return (
            userDetail ? <div className="friend-page" >
                <Drawer anchor="bottom" className="friend-drawer" open={showFriendDrawer} onClose={() => this.onCloseDrawer()}>
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
                                    display:"flex",
                                    maxWidth: "600px",
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
                            <AppBar maxWidth="600px" position="static" color="default" className={"custom-tab mb10"}>
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
                                    <Tab label="Lời mời" {...a11yProps(1)} className="tab-item" />
                                    <Tab label="Đã gửi" {...a11yProps(2)} className="tab-item" />
                                    <Tab label="bạn bè" {...a11yProps(3)} className="tab-item" />
                                </Tabs>
                            </AppBar>
                        </div>
                        <div className="content-form" style={{ overflow: "auto"}} id="friend-content" onScroll={() => this.handleScroll()}>
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
                                        <div className="p10 pt00 pb00" style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                                            <span>Số lượng</span>
                                            <span className="red">{queueCount}</span>
                                        </div>
                                        {
                                            queues && queues.length > 0 ? <ul>
                                                {
                                                    queues.map((item, index) => <li key={index} className="friend-layout">
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
                                                                <Button className="bt-submit" onClick={() => this.acceptFriend(item)}>Chấp nhận</Button>
                                                                <Button className="bt-cancel">Từ chối</Button>
                                                            </div>
                                                        </div>
                                                    </li>)
                                                }
                                            </ul> : ""
                                        }
                                    </div>
                                </TabPanel>
                                <TabPanel value={friendTabIndex} index={2} className="content-box">
                                    <div className="p10  pt00 pb00" style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                                        <span>Số lượng</span>
                                        <span className="red">{waitingCount}</span>
                                    </div>
                                    <div className="friend-list" >
                                        {
                                            waitings && waitings.length > 0 ? <ul>
                                                {
                                                    waitings.map((item, index) => <li key={index} className="friend-layout">
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
                                                                <Button className="bt-submit" onClick={() => this.setState({
                                                                    okCallback: () => this.addFriend(item.friendid),
                                                                    confirmTitle: "",
                                                                    confirmMessage: "Bạn có chắc chắn muốn huỷ yêu cầu kết bạn này không?",
                                                                    showConfim: true
                                                                })} >Huỷ</Button>
                                                            </div>
                                                        </div>
                                                    </li>)
                                                }
                                            </ul> : ""
                                        }
                                    </div>
                                </TabPanel>
                                <TabPanel value={friendTabIndex} index={3} >
                                    {
                                        friends && friends.length > 0 ? <div className="friend-list" >
                                            <div className="p10 pt00 pb00" style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                                                <span>Số lượng</span>
                                                <span className="red">{friendCount}</span>
                                            </div>
                                            <ul>
                                                {
                                                    friends.map((item, index) => <li key={index} className="friend-layout">
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
                                                                <Button className="bt-submit" onClick={() => this.setState({
                                                                    okCallback: () => this.removeFriend(item.friendid),
                                                                    confirmTitle: "",
                                                                    confirmMessage: "Bạn có chắc chắn muốn xoá người này khỏi danh sách bạn bè không?",
                                                                    showConfim: true
                                                                })}>Huỷ bạn</Button>
                                                                {
                                                                    item.ismefollow == 1 ? <Button className="bt-cancel" onClick={() => this.setState({
                                                                        okCallback: () => this.unFolowFriend(item.friendid),
                                                                        confirmTitle: "",
                                                                        confirmMessage: "Bạn có chắc chắn muốn bỏ theo dõi người này không?",
                                                                        showConfim: true
                                                                    })} >Bỏ theo dõi</Button> : <Button className="bt-cancel" onClick={() => this.folowFriend(item.friendid)}>Theo dõi</Button>
                                                                }
                                                            </div>
                                                        </div>
                                                    </li>)
                                                }
                                            </ul>
                                        </div> : ""
                                    }
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

            </div> : ""
        );
    }
}

const mapStateToProps = state => {
    return {
        ...state.app,
        ...state.user
    }
};

const mapDispatchToProps = dispatch => ({
    toggleFriendDrawer: (isShow) => dispatch(toggleFriendDrawer(isShow)),
    toggleFindFriendDrawer: (isShow) => dispatch(toggleFindFriendDrawer(isShow)),
    setCurrenUserDetail: (user) => dispatch(setCurrenUserDetail(user)),
    toggleUserPageDrawer: (isShow) => dispatch(toggleUserPageDrawer(isShow)),
    toggleSeachFriends: (isShow) => dispatch(toggleSeachFriends(isShow)),
    setCurrentFriendId: (friendId) => dispatch(setCurrentFriendId(friendId))
});

export default connect(
    mapStateToProps,
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




