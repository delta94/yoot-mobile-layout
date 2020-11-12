import React from "react";
import './style.scss'
import {
    toggleSeachPosts
} from '../../actions/app'
import {
    Drawer,
    TextField,
    InputAdornment,
    IconButton
} from '@material-ui/core'
import {
    ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons'
import { connect } from 'react-redux'
import $ from 'jquery'
import Loader from '../common/loader'
import { CurrentDate, SOCIAL_NET_WORK_API } from "../../constants/appSettings";
import { get } from "../../api";
import moment from 'moment'
import { objToQuery } from "../../utils/common";
import Post from "../post"


const search = require('../../assets/icon/Find@1x.png')




class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.searchInput = React.createRef()
    }

    handleSearchPost(currentHashtag) {
        let param = {
            currentpage: 0,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 200,
            groupid: 0,
            isVideo: 0,
            suggestGroup: 0,
            forFriendId: 0,
            albumid: 0,
            hashtag: currentHashtag
        }
        get(SOCIAL_NET_WORK_API, "PostNewsFeed/GetAllNewsFeed" + objToQuery(param), result => {
            if (result && result.result == 1) {
                console.log("result", result)
                this.setState({
                    allPost: result.content.newsFeeds
                })
            }
        })
    }

    componentWillReceiveProps(nextprops) {
        if (nextprops.currentHashtag != this.props.currentHashtag) {
            this.handleSearchPost(nextprops.currentHashtag)
        }
    }

    render() {
        let {
            showSearchPostDrawer,
            currentHashtag
        } = this.props
        let {
            allPost
        } = this.state

        return (
            <Drawer anchor="bottom" className="find-friends" open={showSearchPostDrawer} onClose={() => this.props.toggleSeachPosts(false, null)}>
                <div className="drawer-detail">
                    <div className="drawer-header">
                        <div className="direction"
                            onClick={() =>
                                this.props.toggleSeachPosts(false, null)
                            }>
                            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                            </IconButton>
                        </div>
                        <TextField
                            inputRef={this.searchInput}
                            autoFocus={true}
                            className="custom-input"
                            variant="outlined"
                            placeholder="Nhập tên bạn bè để tìm kiếm"
                            className="search-box"
                            style={{
                                width: "calc(100% - 20px",
                            }}
                            value={currentHashtag}
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
                    <div className="filter">
                    </div>
                    <div style={{ overflowX: "hidden", width: "100vw" }} >
                        {
                            allPost && allPost.length > 0 ? <ul className="post-list">
                                {
                                    allPost.map((post, index) => <li key={index} >
                                        <Post data={post} history={this.props.history} userId={post.iduserpost} />
                                    </li>)
                                }
                            </ul> : ""
                        }
                    </div>
                </div>
            </Drawer>
        );
    }
}

const mapStateToProps = state => {
    return {
        ...state.app
    }
};

const mapDispatchToProps = dispatch => ({
    toggleSeachPosts: (isShow, hashtag) => dispatch(toggleSeachPosts(isShow, hashtag)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Index);
