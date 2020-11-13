import React from "react";
import $ from 'jquery'
import { connect } from 'react-redux'
import {
    toggleSeachPosts,
    toggleUserPageDrawer
} from '../../actions/app'
import {
    IconButton,
    AppBar,
    Tabs,
    Tab,
    Avatar,
    Button,
} from '@material-ui/core'
import { setCurrenUserDetail } from "../../actions/user";
import {
    ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons'
import SwipeableViews from "react-swipeable-views";
import { CurrentDate, SOCIAL_NET_WORK_API } from "../../constants/appSettings";
import { get } from "../../api";
import { ReactSelectorIcon } from "../../constants/constants";
import { objToQuery } from '../../utils/common'
import moment from 'moment'

const search = require('../../assets/icon/Find@1x.png')

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            likeRewardIndex: 0,
            iconList: [],
            numLikes: []
        };
    }

    handleGetIconList(newsfeedid, image) {
        let param = {
            newsfeedid: newsfeedid,
            nameimage: ""
        }
        if (image && image.nameimage) {
            param.nameimage = image.nameimage
        }
        get(SOCIAL_NET_WORK_API, "PostNewsFeed/GetUserNumAllLikeNewsFeed" + objToQuery(param), result => {
            console.log("result", result)
            if (result && result.result == 1) {
                if (result.content.numLikes.length > 0) {
                    result.content.numLikes.map(item => {
                        if (item.icon == -1) item.icon = 1
                    })
                    this.setState({
                        numLikes: result.content.numLikes
                    })
                    result.content.numLikes.map(icon => {
                        this.handleGetUserLikeNewsFeed(newsfeedid, icon.icon, 0, image)
                    })
                }
            }
        })
    }

    handleGetUserLikeNewsFeed(newsfeedid, icon, currentpage, image) {
        let param = {
            currentpage: currentpage,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 100,
            newsfeedid: newsfeedid,
            nameimage: "",
            icon: icon
        }
        if (image && image.nameimage) {
            param.nameimage = image.nameimage
        }

        get(SOCIAL_NET_WORK_API, "PostNewsFeed/GetUserLikeNewsFeed" + objToQuery(param), result => {

            if (result && result.result == 1) {
                result.content.userLikes.map(item => {
                    if (item.icon == -1) item.icon = 1
                })

                let {
                    numLikes
                } = this.state
                let index = numLikes.findIndex(item => item.icon == icon)
                if (index >= 0) {
                    numLikes[index].userLikes = result.content.userLikes
                }
                this.setState({
                    numLikes: numLikes
                })
            }
        })
    }

    handlUserClick(user) {
        let {
            profile,
            data
        } = this.props
        if (user.id == profile.id) {
            this.props.history.push('/profile')
            this.props.onClose()
        } else {
            this.props.setCurrenUserDetail({
                ...data,
                friendid: user.id,
            });
            this.props.toggleUserPageDrawer(true);
        }
    }

    componentDidMount() {
        let {
            data,
            image
        } = this.props
        this.handleGetIconList(data.nfid, image)
        // if (data && data.iconNumbers && data.iconNumbers.length > 0) {
        //     data.iconNumbers.map(icon => {
        //         this.handleGetUserLikeNewsFeed(data.nfid, icon.icon, 0)
        //     })
        // }
    }


    render() {
        let {
            likeRewardIndex,
            iconList,
            numLikes
        } = this.state
        let {
            data,
            onClose
        } = this.props
        console.log("iconList", numLikes)

        return (
            data && <div className="drawer-detail like-reward">
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
                        <label>Người thích bài đăng</label>
                    </div>
                </div>
                <div className="filter">
                    <AppBar position="static" color="default" className={"custom-tab"}>
                        <Tabs
                            value={likeRewardIndex}
                            onChange={(e, value) =>
                                this.setState({ likeRewardIndex: value })
                            }
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                            aria-label="full width tabs example"
                            className="tab-header"
                        >
                            {
                                numLikes.length > 0 && numLikes.map((icon, index) => icon.num > 0 && <Tab
                                    label={icon.icon == 0 ? `Tất cả ${icon.num}` : <span style={{ display: "flex", alignItems: "center", fontFamily: "Roboto-Medium", justifyContent: "center" }}>
                                        <img
                                            src={ReactSelectorIcon[icon.icon].icon}
                                            style={{ width: "20px", marginRight: "5px" }}
                                        />
                                        {
                                            icon.num
                                        }
                                    </span>}
                                    {...a11yProps(index)}
                                    className="tab-item"
                                    key={index}
                                />)
                            }
                        </Tabs>
                    </AppBar>
                </div>
                <div style={{ overflow: "scroll", height: "100%" }} id="folow-reward-list" onScroll={() => this.onScroll()}>

                    <SwipeableViews
                        index={likeRewardIndex}
                        onChangeIndex={(value) =>
                            this.setState({ likeRewardIndex: value })
                        }
                        className="tab-content"
                    >
                        {
                            numLikes.map((icon, index) => <TabPanel
                                value={likeRewardIndex}
                                index={index}
                                className="content-box"
                                key={index}
                            >
                                <div className="user-likes" style={{ maxHeight: "100%" }}>
                                    <ul>
                                        {
                                            icon.userLikes && icon.userLikes.map((user, j) => <li key={j} onClick={() => this.handlUserClick(user)}>
                                                <Avatar aria-label="recipe" className="avatar">
                                                    <div
                                                        className="img"
                                                        style={{
                                                            background: `url("${user.thumbnail_avatar}")`,
                                                        }}
                                                    />
                                                </Avatar>
                                                <img
                                                    src={ReactSelectorIcon[user.icon].icon}
                                                    style={{ width: "20px", marginRight: "5px" }}
                                                />
                                                <span>{user.fullname}</span>
                                            </li>)
                                        }
                                    </ul>
                                </div>
                            </TabPanel>)
                        }
                    </SwipeableViews>
                </div>
            </div>
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
    toggleSeachPosts: (isShow, hashtag) => dispatch(toggleSeachPosts(isShow, hashtag)),
    setCurrenUserDetail: (user) => dispatch(setCurrenUserDetail(user)),
    toggleUserPageDrawer: (isShow) => dispatch(toggleUserPageDrawer(isShow)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Index);


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
