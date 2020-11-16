
import React from 'react';
import {
    IconButton,
    AppBar,
    Tabs,
    Tab,
    Avatar,
    Button,

} from '@material-ui/core'
import SwipeableViews from "react-swipeable-views";
import {
    ChevronLeft as ChevronLeftIcon,
} from '@material-ui/icons'
import { CurrentDate, SOCIAL_NET_WORK_API } from '../../constants/appSettings';
import moment from 'moment'
import { get } from '../../api';
import { objToQuery } from '../../utils/common';
import { setCurrenUserDetail } from "../../actions/user";
import { toggleUserPageDrawer } from "../../actions/app"
import { connect } from 'react-redux'
import $ from 'jquery'


export class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userDetailFolowTabIndex: 0,
            folowed: [],
            folowing: [],
            folowingCount: 0,
            folowedCount: 0,
            isLoadMoreFolowed: false,
            folowedCurrentPage: 0,
            isEndOfFolowed: false,
            isLoadMoreFolowing: false,
            isEndOfFolowing: false,
            folowingCurrentPage: 0
        };
    }

    handleGetFolowed(userId, currentpage) {
        let {
            folowed
        } = this.state
        let param = {
            currentpage: currentpage,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 20,
            status: "Followed",
            forFriendId: userId,
            groupid: 0
        }
        let queryParam = objToQuery(param)
        get(SOCIAL_NET_WORK_API, "Friends/GetListFriends" + queryParam, result => {
            if (result.result == 1) {
                this.setState({
                    folowed: folowed.concat(result.content.userInvites),
                    isLoadMoreFolowed: false
                })
                if (result.content.userInvites.length == 0) {
                    this.setState({
                        isEndOfFolowed: true
                    })
                }
            }
            get(SOCIAL_NET_WORK_API, "Friends/GetCountListFriends" + queryParam, result => {
                if (result.result == 1) {
                    this.setState({
                        folowedCount: result.content.count
                    })
                }
            })
        })

    }

    handleGetFolowing(userId, currentpage) {
        let {
            folowing
        } = this.state
        let param = {
            currentpage: currentpage,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 20,
            status: "Following",
            forFriendId: userId,
            groupid: 0
        }
        let queryParam = objToQuery(param)
        get(SOCIAL_NET_WORK_API, "Friends/GetListFriends" + queryParam, result => {
            if (result.result == 1) {
                this.setState({
                    folowing: folowing.concat(result.content.userInvites),
                    isLoadMoreFolowing: false
                })
                if (result.content.userInvites.length == 0) {
                    this.setState({
                        isEndOfFolowing: true
                    })
                }
            }
            get(SOCIAL_NET_WORK_API, "Friends/GetCountListFriends" + queryParam, result => {
                if (result.result == 1) {
                    this.setState({
                        folowingCount: result.content.count
                    })
                }
            })
        })
    }

    unFolowFriend(friendid) {
        let {
            folowed,
            folowing
        } = this.state
        let param = {
            friendid: friendid,
        };
        if (!friendid) return;
        get(
            SOCIAL_NET_WORK_API,
            "Friends/UnFollowFriends" + objToQuery(param),
            (result) => {
                if (result && result.result === 1) {
                    let folowedIndex = folowed.findIndex(item => item.friendid == friendid)
                    if (folowedIndex >= 0) {
                        folowed[folowedIndex].ismefollow = 0
                    }
                    let folowingIndex = folowing.findIndex(item => item.friendid == friendid)
                    if (folowingIndex >= 0) {
                        folowing[folowingIndex].ismefollow = 0
                    }
                    this.setState({
                        folowed,
                        folowing
                    })
                }
            }
        );
    }

    folowFriend(friendid) {
        let {
            folowed,
            folowing
        } = this.state
        let param = {
            friendid: friendid,
        };
        if (!friendid) return;
        get(
            SOCIAL_NET_WORK_API,
            "Friends/FollowFriends" + objToQuery(param),
            (result) => {
                if (result && result.result === 1) {
                    let folowedIndex = folowed.findIndex(item => item.friendid == friendid)
                    if (folowedIndex >= 0) {
                        folowed[folowedIndex].ismefollow = 1
                    }
                    let folowingIndex = folowing.findIndex(item => item.friendid == friendid)
                    if (folowingIndex >= 0) {
                        folowing[folowingIndex].ismefollow = 1
                    }
                    this.setState({
                        folowed,
                        folowing
                    })
                }
            }
        );
    }
    onScroll() {
        let {
            userDetailFolowTabIndex
        } = this.state
        let element = $("#folow-reward-list")
        let {
            userId
        } = this.props
        let {
            isLoadMoreFolowed,
            folowedCurrentPage,
            isEndOfFolowed,
            isLoadMoreFolowing,
            isEndOfFolowing,
            folowingCurrentPage
        } = this.state
        if (element)
            if (element.scrollTop() + element.innerHeight() >= element[0].scrollHeight) {
                if (userDetailFolowTabIndex == 0) {
                    if (isLoadMoreFolowed == false && isEndOfFolowed == false) {
                        this.setState({
                            folowedCurrentPage: folowedCurrentPage + 1,
                            isLoadMoreFolowed: true
                        }, () => {
                            this.handleGetFolowed(userId, folowedCurrentPage + 1)
                        })
                    }
                } else {
                    if (isLoadMoreFolowing == false && isEndOfFolowing == false) {
                        this.setState({
                            folowingCurrentPage: folowingCurrentPage + 1,
                            isLoadMoreFolowing: true
                        }, () => {
                            this.handleGetFolowing(userId, folowingCurrentPage + 1)
                        })
                    }
                }
            }
    }

    componentDidMount() {
        let {
            userId
        } = this.props
        if (userId) {
            this.handleGetFolowed(userId, 0)
            this.handleGetFolowing(userId, 0)
        }
    }



    render() {
        let {
            userDetailFolowTabIndex,
            folowed,
            folowing,
            folowingCount,
            folowedCount
        } = this.state
        let {
            onClose
        } = this.props
        return (
            <div className="drawer-detail">
                <div className="drawer-header">
                    <div
                        className="direction"
                        onClick={() => onClose()}
                    >
                        <IconButton
                            style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
                        >
                            <ChevronLeftIcon
                                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
                            />
                        </IconButton>
                        <label>Theo dõi</label>
                    </div>
                </div>
                <div className="filter">
                    <AppBar position="static" color="default" className={"custom-tab"}>
                        <Tabs
                            value={userDetailFolowTabIndex}
                            onChange={(e, value) =>
                                this.setState({ userDetailFolowTabIndex: value })
                            }
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                            aria-label="full width tabs example"
                            className="tab-header"
                        >
                            <Tab
                                label={
                                    "Người theo dõi"
                                }
                                {...a11yProps(0)}
                                className="tab-item"
                                onClick={() => userDetailFolowTabIndex == 0 ? this.setState({ showFolowRewardDrawer: true }) : ""}
                            />
                            <Tab
                                label={
                                    "Đang theo dõi"
                                }
                                {...a11yProps(1)}
                                className="tab-item"
                                onClick={() => userDetailFolowTabIndex == 1 ? this.setState({ showFolowRewardDrawer: true }) : ""}
                            />
                        </Tabs>
                    </AppBar>
                </div>
                <div style={{ overflow: "scroll", height: "100%" }} id="folow-reward-list" onScroll={() => this.onScroll()}>

                    <SwipeableViews
                        index={userDetailFolowTabIndex}
                        onChangeIndex={(value) =>
                            this.setState({ userDetailFolowTabIndex: value })
                        }
                        className="tab-content"
                    >
                        <TabPanel
                            value={userDetailFolowTabIndex}
                            index={0}
                            className="content-box"
                        >
                            <div className="folowed-list" style={{ maxHeight: "100%" }}>
                                <div className="p10 pt00 pb00" style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                                    <span>Số lượng</span>
                                    <span className="red">{folowedCount}</span>
                                </div>
                                {folowed && folowed.length > 0 ? (
                                    <ul>
                                        {folowed.map((item, index) => (
                                            <li className="small-user-layout" key={index}>
                                                <Avatar
                                                    aria-label="recipe"
                                                    className="avatar"
                                                    onClick={() => {
                                                        this.props.setCurrenUserDetail(item);
                                                        this.props.toggleUserPageDrawer(true);
                                                    }}
                                                >
                                                    <img
                                                        src={item.friendavatar}
                                                        style={{ width: "100%" }}
                                                    />
                                                </Avatar>
                                                <div className="friend-title">
                                                    <b
                                                        className="user-name"
                                                        onClick={() => {
                                                            this.props.setCurrenUserDetail(item);
                                                            this.props.toggleUserPageDrawer(true);
                                                        }}
                                                    >
                                                        {item.friendname}
                                                    </b>
                                                    <p>{item.numfriendwith} bạn chung</p>
                                                </div>

                                                {item.ismefollow === 0 ? (
                                                    <Button
                                                        onClick={() =>
                                                            this.folowFriend(item.friendid)
                                                        }
                                                        style={{ background: "#f44645", color: "#fff" }}
                                                    >
                                                        Theo dõi
                                                    </Button>
                                                ) : (
                                                        <Button
                                                            onClick={() =>
                                                                this.unFolowFriend(item.friendid)
                                                            }
                                                            style={{ background: "rgba(0,0,0,0.05)" }}
                                                        >
                                                            Đang Theo dõi
                                                        </Button>
                                                    )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                        <span className="list-empty-message">
                                            Chưa có ai theo dõi
                                        </span>
                                    )}
                            </div>
                        </TabPanel>
                        <TabPanel value={userDetailFolowTabIndex} index={1}>
                            <div className="folowing-list" style={{ maxHeight: "100%" }}>
                                <div className="p10 pt00 pb00" style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                                    <span>Số lượng</span>
                                    <span className="red">{folowingCount}</span>
                                </div>
                                {folowing && folowing.length > 0 ? (
                                    <ul>
                                        {folowing.map((item, index) => (
                                            <li className="small-user-layout" key={index}>
                                                <Avatar
                                                    aria-label="recipe"
                                                    className="avatar"
                                                    onClick={() => {
                                                        this.props.setCurrenUserDetail(item);
                                                        this.props.toggleUserPageDrawer(true);
                                                    }}
                                                >
                                                    <img
                                                        src={item.friendavatar}
                                                        style={{ width: "100%" }}
                                                    />
                                                </Avatar>
                                                <div className="friend-title">
                                                    <b
                                                        className="user-name"
                                                        onClick={() => {
                                                            this.props.setCurrenUserDetail(item);
                                                            this.props.toggleUserPageDrawer(true);
                                                        }}
                                                    >
                                                        {item.friendname}
                                                    </b>
                                                    <p>{item.numfriendwith} bạn chung</p>
                                                </div>

                                                {item.ismefollow === 0 ? (
                                                    <Button
                                                        onClick={() =>
                                                            this.folowFriend(item.friendid)
                                                        }
                                                        style={{ background: "#f44645", color: "#fff" }}
                                                    >
                                                        Theo dõi
                                                    </Button>
                                                ) : (
                                                        <Button
                                                            onClick={() =>
                                                                this.unFolowFriend(item.friendid)
                                                            }
                                                            style={{ background: "rgba(0,0,0,0.05)" }}
                                                        >
                                                            Đang Theo dõi
                                                        </Button>
                                                    )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                        <span className="list-empty-message">
                                            Chưa theo dõi bất kì ai
                                        </span>
                                    )}
                            </div>
                        </TabPanel>
                    </SwipeableViews>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        ...state.app,
        ...state.user,
    };
};

const mapDispatchToProps = (dispatch) => ({
    setCurrenUserDetail: (user) => dispatch(setCurrenUserDetail(user)),
    toggleUserPageDrawer: (isShow) => dispatch(toggleUserPageDrawer(isShow)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Index);


function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        "aria-controls": `full-width-tabpanel-${index}`,
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
            {value === index && <div>{children}</div>}
        </div>
    );
}
