import React from "react";
import $ from 'jquery'
import { connect } from 'react-redux'
import {
    toggleSeachPosts
} from '../../actions/app'
import {
    Drawer,
    IconButton,
    TextField,
    InputAdornment,
} from '@material-ui/core'
import {
    ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons'
import moment from 'moment'
import { CurrentDate, SOCIAL_NET_WORK_API } from "../../constants/appSettings";
import { get } from "../../api";
import { objToQuery } from "../../utils/common";
import Post from './index'
import './style.scss'

const search = require('../../assets/icon/Find@1x.png')

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowMore: false,
            showSearchPostDrawer: false,
            isProcessing: false
        };
    }

    handleSearchPost(currentHashtag) {
        let {
            isProcessing
        } = this.state
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
        if (isProcessing == true) return
        this.setState({
            isProcessing: true
        })
        get(SOCIAL_NET_WORK_API, "PostNewsFeed/GetAllNewsFeed" + objToQuery(param), result => {
            if (result && result.result == 1) {
                console.log("result", result)
                this.setState({
                    allPost: result.content.newsFeeds,
                })

            }
            this.setState({
                isProcessing: false
            })
        })
    }

    componentWillUnmount() {
        let {
            content,
        } = this.props
        if (!content) return
        let hashtagSelected = content.nfcontent.match(/#(\S+)/g)
        if (hashtagSelected && hashtagSelected.length > 0) {
            hashtagSelected.map(item => {
                $(`[id="hashtag${item.replace('#', '')}-${content.nfid}"]`).off("click", null)
            })
        }
    }

    render() {
        let {
            isShowMore
        } = this.state
        let {
            content,
        } = this.props
        let nfcontent = content.nfcontent
        if (!nfcontent || !content) return null
        let isOver = nfcontent.length > 200
        if (isOver == true) {
            if (isShowMore == true)
                nfcontent = nfcontent
            else nfcontent = nfcontent.slice(0, 200) + "... "
        }
        setTimeout(() => {
            let hashtagSelected = content.nfcontent.match(/#(\S+)/g)

            if (hashtagSelected && hashtagSelected.length > 0) {
                hashtagSelected.map(item => {
                    $(`[id="hashtag${item.replace('#', '')}-${content.nfid}"]`).off("click", null)
                    $(`[id="hashtag${item.replace('#', '')}-${content.nfid}"]`).on("click", (e) => {
                        this.handleSearchPost(e.target.attributes["data-code"].value)
                        this.setState({
                            showSearchPostDrawer: true,
                            currentHashtag: e.target.attributes["data-code"].value
                        })
                    })
                })
            }
        }, 300);

        return (
            <div className="post-content-mes">
                <div
                    dangerouslySetInnerHTML={{
                        __html: nfcontent
                            .replace(/\n/g, ` <br />`)
                            .replace(
                                /@(\S+)/g,
                                `<span class="draftJsMentionPlugin__mention__29BEd no-bg">@$1</span>`
                            )
                            .replace(
                                /#(\S+)/g,
                                `<span class="draftJsHashtagPlugin__hashtag__1wMVC" id="hashtag$1-${content.nfid}" data-code="#$1">#$1</span>`
                            )
                    }}
                    style={{ display: "inline" }}
                >
                </div>
                {
                    isShowMore == true && isOver ? <span onClick={() => this.setState({ isShowMore: false })}>Rút gọn</span> : ""
                }
                {
                    isShowMore == false && isOver ? <span onClick={() => this.setState({ isShowMore: true })}>Xem thêm</span> : ""
                }
                {
                    renderSearchPostDrawer(this)
                }
            </div>
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

const renderSearchPostDrawer = (component) => {
    let {
        showSearchPostDrawer,
        currentHashtag,
        allPost
    } = component.state

    let srollContent = document.getElementById("search-post-scrolling")
    return (
        <Drawer anchor="bottom" className="find-friends find-post" open={showSearchPostDrawer}>
            <div className="drawer-detail">
                <div className="drawer-header">
                    <div className="direction width100pc" onClick={() => component.setState({ showSearchPostDrawer: false })}>
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                            <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                        </IconButton>
                        <TextField
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
                </div>
                <div className="filter">
                </div>
                <div style={{ overflow: "scroll" }} id="search-post-scrolling">
                    {
                        allPost && srollContent && allPost.length > 0 ? <ul className="post-list search-post">
                            {
                                allPost.map((post, index) => <li key={index} >
                                    <Post data={post} history={component.props.history} userId={post.iduserpost} containerRef={srollContent} />
                                </li>)
                            }
                        </ul> : ""
                    }
                </div>

            </div>
        </Drawer>
    )
}