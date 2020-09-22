import React from "react";
import './style.scss'
import {
    toggleFriendDrawer,
    toggleFindFriendDrawer
} from '../../actions/app'
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
    ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons'
import SwipeableViews from 'react-swipeable-views';
import { connect } from 'react-redux'
import moment from 'moment'
import { get } from "../../api";
import { SOCIAL_NET_WORK_API } from "../../constants/appSettings";
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
            isEndOfSuggestFriends: false,
            isEndOfWaitings: false,
            isEndOfQueues: false,
            suggestFriends: [],
            queues: [],
            waitings: []
        };
    }

    getFriends(userId) {
        let {
            profile
        } = this.props
        let param = {
            currentpage: 0,
            currentdate: moment(new Date).format("YYYY-MM-DD hh:mm:ss"),
            limit: 20,
            status: "Friends",
            forFriendId: userId == profile.id ? 0 : userId,
            groupid: 0
        }
        get(SOCIAL_NET_WORK_API, "Friends/GetListFriends" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    friends: result.content.userInvites
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
            currentdate: moment(new Date).format("YYYY-MM-DD hh:mm:ss"),
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
            currentdate: moment(new Date).format("YYYY-MM-DD hh:mm:ss"),
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
            currentdate: moment(new Date).format("YYYY-MM-DD hh:mm:ss"),
            limit: 20,
            status: "Waiting",
            forFriendId: userId == profile.id ? 0 : userId,
            groupid: 0
        }
        this.setState({
            isLoadMore: true
        })
        get(SOCIAL_NET_WORK_API, "Friends/GetListFriends" + objToQuery(param), result => {
            console.log("result", result)
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
            waitingCurrentPage
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
            }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.userDetail && this.props.userDetail.id != nextProps.userDetail.id) {
            this.getFriends(nextProps.userDetail.id)
            this.getSuggestFriends(nextProps.userDetail.id, 0)
            this.getQueue(nextProps.userDetail.id, 0)
            this.getWaiting(nextProps.userDetail.id, 0)
        } else {
            if (nextProps.userDetail) {
                this.getFriends(nextProps.userDetail.id)
                this.getSuggestFriends(nextProps.userDetail.id, 0)
                this.getQueue(nextProps.userDetail.id, 0)
                this.getWaiting(nextProps.userDetail.id, 0)
            }
        }
    }

    addFriend(friendId) {
        let {
            suggestFriends,
            waitings
        } = this.state
        let param = {
            friendid: friendId
        }
        get(SOCIAL_NET_WORK_API, "Friends/AddOrDeleteInviateFriends" + objToQuery(param), (result) => {
            console.log("result", suggestFriends)
            if (result && result.result == 1) {
                this.setState({
                    suggestFriends: suggestFriends.filter(friend => friend.friendid != friendId),
                    waitings: waitings.filter(friend => friend.friendid != friendId)
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
            friends
        } = this.state
        let param = {
            friendid: friendid
        }
        if (!friendid) return
        get(SOCIAL_NET_WORK_API, "Friends/RemoveFriends" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    friends: friends.filter(friend => friend.friendid != friendid),
                })
            }
        })
    }

    unFolowFriend(friendid) {
        let {
            friends
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
                this.setState({
                    friends: friends
                })
            }
        })
    }
    folowFriend(friendid) {
        let {
            friends
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
                this.setState({
                    friends: friends
                })
            }
        })
    }

    render() {
        let {
            friendTabIndex,
            friends,
            suggestFriends,
            queues,
            waitings,
            isLoadMore,
        } = this.state
        let {
            userDetail,
            showFriendDrawer
        } = this.props

        console.log("friends", friends)

        return (
            userDetail ? <div className="friend-page" >
                <Drawer anchor="bottom" className="friend-drawer" open={showFriendDrawer} onClose={() => this.props.toggleFriendDrawer(false)}>
                    <div className="drawer-detail">
                        <div className="drawer-header">
                            <div className="direction" onClick={() => this.setState({
                                suggestFriends: [],
                                suggestFriendCurrentPage: 0,
                                isEndOfSuggestFriends: false
                            }, () => this.props.toggleFriendDrawer(false))}>
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
                                onClick={() => this.props.toggleFindFriendDrawer(true)}
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
                                    <Tab label="Lời mời" {...a11yProps(1)} className="tab-item" />
                                    <Tab label="Đã gửi" {...a11yProps(2)} className="tab-item" />
                                    <Tab label="bạn bè" {...a11yProps(3)} className="tab-item" />
                                </Tabs>
                            </AppBar>
                        </div>
                        <div className="content-form" style={{ overflow: "scroll", width: "100vw" }} id="friend-content" onScroll={() => this.handleScroll()}>
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
                                                    suggestFriends.map((item, index) => <li key={index} className="friend-layout">
                                                        <div>
                                                            <Avatar aria-label="recipe" className="avatar">
                                                                <img src={item.friendavatar} style={{ width: "100%" }} />
                                                            </Avatar>
                                                        </div>
                                                        <div className="info-action">
                                                            <label>{item.friendname}</label>
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
                                        {
                                            queues && queues.length > 0 ? <ul>
                                                {
                                                    queues.map((item, index) => <li key={index} className="friend-layout">
                                                        <div>
                                                            <Avatar aria-label="recipe" className="avatar">
                                                                <img src={item.friendavatar} style={{ width: "100%" }} />
                                                            </Avatar>
                                                        </div>
                                                        <div className="info-action">
                                                            <label>{item.friendname}</label>
                                                            <div className="action">
                                                                <Button className="bt-submit" onClick={() => this.acceptFriend(item)}>Đồng ý</Button>
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
                                    <div className="friend-list" >
                                        {
                                            waitings && waitings.length > 0 ? <ul>
                                                {
                                                    waitings.map((item, index) => <li key={index} className="friend-layout">
                                                        <div>
                                                            <Avatar aria-label="recipe" className="avatar">
                                                                <img src={item.friendavatar} style={{ width: "100%" }} />
                                                            </Avatar>
                                                        </div>
                                                        <div className="info-action">
                                                            <label>{item.friendname}</label>
                                                            <div className="action">
                                                                <Button className="bt-submit" onClick={() => this.setState({
                                                                    okCallback: () => this.addFriend(item.friendid),
                                                                    confirmTitle: "",
                                                                    confirmMessage: "Bạn có chắc chắn muốn huỷ yêu cầu kết bạn này không?",
                                                                    showConfim: true
                                                                })} >Huỷ yêu cầu</Button>
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
                                            <ul>
                                                {
                                                    friends.map((item, index) => <li key={index} className="friend-layout">
                                                        <div>
                                                            <Avatar aria-label="recipe" className="avatar">
                                                                <img src={item.friendavatar} style={{ width: "100%" }} />
                                                            </Avatar>
                                                        </div>
                                                        <div className="info-action">
                                                            <label>{item.friendname}</label>
                                                            <div className="action">
                                                                <Button className="bt-submit" onClick={() => this.setState({
                                                                    okCallback: () => this.removeFriend(item.friendid),
                                                                    confirmTitle: "",
                                                                    confirmMessage: "Bạn có chắc chắn muốn xoá người này khỏi danh sách bạn bè không?",
                                                                    showConfim: true
                                                                })}>Xoá bạn</Button>
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
                    renderCloseForm(this)
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

const renderCloseForm = (component) => {
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


