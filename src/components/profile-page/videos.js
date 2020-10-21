
import React from 'react';
import { connect } from 'react-redux'
import {
    Drawer,
    IconButton,
} from '@material-ui/core'
import {
    ChevronLeft as ChevronLeftIcon,
    PlayCircleOutline as PlayCircleOutlineIcon
} from '@material-ui/icons'
import {
    setMediaToViewer,
    toggleMediaViewerDrawer,
} from '../../actions/app'
import Loader from '../common/loader'
import { get, post, postFormData } from '../../api';
import { SOCIAL_NET_WORK_API, CurrentDate } from '../../constants/appSettings';
import { objToArray, objToQuery, showNotification, srcToFile } from '../../utils/common';
import moment from 'moment'
import $ from 'jquery'
const job = require('../../assets/icon/job@1x.png')


export class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            videos: [],
            isVideosLoading: false,
            isEndOfVideos: false,
            videosCurrentPage: 0
        };
    }

    getVideos(currentpage, userId) {
        let param = {
            currentpage: currentpage,
            currentdate: moment(new Date).format(CurrentDate),
            limit: 30,
            type: "Video",
            skin: "",
            albumid: 0,
            userid: userId
        }
        let {
            videos
        } = this.state
        this.setState({
            isVideosLoading: true
        })
        get(SOCIAL_NET_WORK_API, "Media/Index" + objToQuery(param), result => {
            if (result && result.result == 1) {
                this.setState({
                    videos: videos.concat(result.content.medias),
                    isVideosLoading: false
                })
                if (result.content.medias.length == 0) {
                    this.setState({
                        isEndOfVideos: true
                    })
                }
            }
        })
    }

    onScroll(id) {

        if (!id) return

        let element = $("#video-content-" + id)

        let {
            isVideosLoading,
            isEndOfVideos,
            videosCurrentPage
        } = this.state

        if (element)
            if (element.scrollTop() + element.innerHeight() >= element[0].scrollHeight) {
                if (isVideosLoading == false && isEndOfVideos == false) {
                    this.setState({
                        videosCurrentPage: videosCurrentPage + 1,
                        isVideosLoading: true
                    }, () => {
                        this.getVideos(videosCurrentPage + 1, id)
                    })
                }

            }
    }

    componentWillReceiveProps(nextProps) {
        let {
            userDetail
        } = nextProps
        if (userDetail && userDetail.userid) {
            userDetail.id = userDetail.userid
        }
        let {
            videos,
            videosCurrentPage,
        } = this.state
        if (nextProps.open == true) {
            if (videos.length == 0) this.getVideos(videosCurrentPage, userDetail.id)
        }
    }

    render() {
        let {
            videos,
            isVideosLoading
        } = this.state
        let {
            open,
            userDetail
        } = this.props

        return (
            <div>
                <Drawer anchor="bottom" open={open} onClose={() => this.props.onClose()}>
                    {
                        userDetail ? <div className="drawer-detail media-drawer">
                            <div className="drawer-header">
                                <div className="direction" onClick={() => this.props.onClose()}>
                                    <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                                        <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                                    </IconButton>
                                    <label>Video của {userDetail.fullname}</label>
                                </div>
                            </div>
                            <div className="filter">
                            </div>
                            <div className="content-form" style={{ overflow: "scroll", width: "100vw" }} id={"video-content-" + userDetail.id} onScroll={() => this.onScroll(userDetail.id)}>
                                <div className="image-posted image-box">
                                    <ul className="image-list">
                                        {
                                            videos.map((item, index) => <li onClick={() => {
                                                this.props.setMediaToViewer([item])
                                                this.props.toggleMediaViewerDrawer(true, {
                                                    showInfo: true,
                                                    isvideo: true
                                                })
                                            }}>
                                                <div style={{ background: "url(" + item.thumbnailname + ")" }} key={index}></div>
                                                <IconButton><PlayCircleOutlineIcon /></IconButton>
                                            </li>)
                                        }
                                    </ul>
                                </div>
                            </div>
                            {
                                isVideosLoading == true ? <div style={{ width: "100%", height: "50px" }}><Loader type="small" width={30} height={30} /></div> : ""
                            }
                        </div> : ""
                    }
                </Drawer>
            </div>

        )
    }
}
const mapDispatchToProps = dispatch => ({
    setMediaToViewer: (media) => dispatch(setMediaToViewer(media)),
    toggleMediaViewerDrawer: (isShow, feature) => dispatch(toggleMediaViewerDrawer(isShow, feature)),
});

export default connect(
    null,
    mapDispatchToProps
)(Index);



