import React from "react";
import './style.scss'
import {
    toggleSeachFriends,
    toggleUserPageDrawer
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
            allUsersCurrentPage: 0,
            isEndOfSuggestFriends: false,
            isEndOfWaitings: false,
            isEndOfQueues: false,
            isEndOfFriends: false,
            isEndOfAllUsers: false,
            suggestFriends: [],
            queues: [],
            waitings: [],
            friends: [],
            allUsers: [],
            searchKey: "",
            isLoadMore: false
        };
        this.searchInput = React.createRef()
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
            status: "All",
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
    }

    onAllUserScroll() {
        let element = $("#search-fiend-list")
        let {
            allUsersCurrentPage,
            isEndOfAllUsers,
            isLoadMore
        } = this.state
        if (element.scrollTop() + element.innerHeight() >= element[0].scrollHeight) {
            if (isLoadMore == false && isEndOfAllUsers == false) {
                this.setState({
                    allUsersCurrentPage: allUsersCurrentPage + 1,
                    isLoadMore: true
                }, () => {
                    this.getAllUsers(this.props.currentFriendId, allUsersCurrentPage + 1)
                })
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

    handleChangeSearchKey(e) {
        this.setState({
            searchKey: e.target.value,
            allUsersCurrentPage: 0,
            allUsers: [],
            isEndOfAllUsers: false
        }, () => {
            let {
                isLoadMore
            } = this.state
            let {
                currentFriendId
            } = this.props
            if (isLoadMore == false) {
                this.getAllUsers(currentFriendId, 0)
            }
        })

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.currentFriendId != nextProps.currentFriendId) {
            this.getAllUsers(nextProps.currentFriendId, 0)
        }
        if (nextProps.showSearchFriendDrawer != this.props.showSearchFriendDrawer && nextProps.showSearchFriendDrawer != false) {
            console.log("this.searchInput", this.searchInput.current)
        }
    }


    render() {
        let {
            allUsers,
        } = this.state
        let {
            currentFriendId,
            showSearchFriendDrawer
        } = this.props

        return (
            <Drawer anchor="bottom" className="find-friends" open={showSearchFriendDrawer} onClose={() => this.props.toggleSeachFriends(false)}>
                <div className="drawer-detail">
                    <div className="drawer-header">
                        <div className="direction"
                            onClick={() =>
                                this.props.toggleSeachFriends(false)
                            }>
                            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                            </IconButton>
                            <label>Tìm bạn bè</label>
                        </div>
                    </div>
                    <div className="filter">
                        <TextField
                            inputRef={this.searchInput}
                            autoFocus={true}
                            className="custom-input"
                            variant="outlined"
                            placeholder="Nhập tên bạn bè để tìm kiếm"
                            className="search-box"
                            style={{
                                width: "calc(100% - 20px",
                                margin: "0px 0px 10px 10px",
                            }}
                            onChange={e => this.handleChangeSearchKey(e)}
                            onKeyUp={e => e.key == 'Enter' ? $(e.target).blur() : ""}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <img src={search} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <div style={{ overflow: "scroll", width: "100vw" }} id="search-fiend-list" onScroll={() => this.onAllUserScroll()}>
                        <div className="friend-list" >
                            <ul>
                                {
                                    allUsers.map((item, index) => <li key={index} className="friend-layout">
                                        <div className="friend-info" onClick={() => {
                                            this.props.setCurrenUserDetail(item)
                                            this.props.toggleUserPageDrawer(true)
                                        }}>
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
                    </div>
                </div>
                {
                    renderConfirmDrawer(this)
                }
                {
                    renderFriendActionsDrawer(this)
                }
            </Drawer>
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
    toggleSeachFriends: (isShow) => dispatch(toggleSeachFriends(isShow)),
    toggleUserPageDrawer: (isShow) => dispatch(toggleUserPageDrawer(isShow)),
    setCurrenUserDetail: (user) => dispatch(setCurrenUserDetail(user)),
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


