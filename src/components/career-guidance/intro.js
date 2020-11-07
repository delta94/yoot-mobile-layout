import React from "react";
import { Player, ControlBar, BigPlayButton } from 'video-react';
import {
    Pause as PauseIcon,
    PlayArrow as PlayArrowIcon,
    Forward10 as Forward10Icon,
    Replay10 as Replay10Icon,
    ChevronLeft as ChevronLeftIcon,
} from '@material-ui/icons'
import {
    IconButton,
    Drawer,
    Avatar
} from '@material-ui/core'
import { PDFReader } from 'reactjs-pdf-reader';
import { connect } from 'react-redux'
import { formatCurrency } from "../../utils/common";

const banner2 = require('../../assets/images/banner2.png')
const pdf_download = require('../../assets/icon/pdf-download.png')

class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            playingIndex: null
        };
        this.video = [React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef()]
    }


    handlePlayVideo(videoRef, index) {

        this.video.map((item, i) => {
            if (index != i)
                this.handlePauseVideo(item)
        })

        let video = videoRef.current

        if (video) {
            video.play()
            this.setState({
                playingIndex: index
            })
            // video.subscribeToStateChange((state, prevState) => {
            //   if (state.isActive == true)
            //     this.setState({
            //       playingIndex: index
            //     })
            //   else {
            //     this.setState({
            //       playingIndex: null
            //     })
            //   }
            // })
        }
    }

    handlePauseVideo(videoRef) {
        let video = videoRef.current
        if (video) {
            video.pause()
            this.setState({
                playingIndex: null
            })
        }
    }

    handleChangeCurrentTime(seconds, videoRef) {
        let video = videoRef.current
        if (video) {
            const { player } = video.getState();
            video.seek(player.currentTime + seconds)
        }
    }

    render() {
        let {
            playingIndex
        } = this.state
        let {
            fileIntro,
            videoIntro,
            videoDISCs
        } = this.props

        return (
            <div className="intro-page">
                <div className="banner" style={{ paddingBottom: "10px", background: '#fff', marginBottom: '10px' }}>
                    <img src={banner2} style={{ width: "100%" }}></img>
                </div>
                {
                    fileIntro ? <div className="document">
                        <label>Tài liệu</label>
                        <div onClick={() => this.setState({ showDocumentReviewDrawer: true })}>
                            {
                                fileIntro.link.split('.').slice(-1).pop().toLowerCase() == "pdf" ? <img src={pdf_download} /> : ""
                            }
                            <span>{fileIntro.name}</span>
                        </div>
                    </div> : ""
                }
                <div className="video-item">
                    <p className="title danger">Video tổng quan về DISC - Bộ phong cách hành vi</p>
                    {
                        videoIntro ? <Player
                            ref={this.video[0]}
                            src={videoIntro.linkclip}
                            playsInline={true}
                            poster={videoIntro.thumbnaillink}
                            className={"custome-video-layout" + (playingIndex == 0 ? " active" : " inactive")}
                        >
                            <ControlBar autoHide={true} >
                                <div className={"custom-bt-control-bar"}>
                                    {
                                        playingIndex == 0 ? <IconButton onClick={() => this.handleChangeCurrentTime(-10, this.video[0])}><Replay10Icon /></IconButton> : ""
                                    }
                                    <IconButton onClick={() => playingIndex == 0 ? this.handlePauseVideo(this.video[0], 0) : this.handlePlayVideo(this.video[0], 0)}>
                                        {
                                            playingIndex == 0 ? <PauseIcon /> : <PlayArrowIcon />
                                        }
                                    </IconButton>
                                    {
                                        playingIndex == 0 ? <IconButton onClick={() => this.handleChangeCurrentTime(10, this.video[0])}><Forward10Icon /></IconButton> : ""
                                    }
                                </div>
                                <div className="fullscreen-overlay" onClick={() => {
                                    this.handlePauseVideo(this.video[0], 0)
                                    this.props.setMediaToViewer([{ name: videoIntro.linkclip }])
                                    this.props.toggleMediaViewerDrawer(true, {
                                        showInfo: false,
                                        activeIndex: 0,
                                        isvideo: true
                                    })
                                }}></div>
                            </ControlBar>
                        </Player> : ""
                    }
                    <p></p>
                </div>
                <p className="title" style={{ padding: "10px 10px 20px 10px", background: "#fff", fontFamily: "Roboto-Medium" }}>Những điểm mạnh và cần cải thiện của từng nhóm:</p>
                {
                    videoDISCs && videoDISCs.length > 0 && videoDISCs.map((video, index) => <div className="video-item">
                        <Player
                            ref={this.video[index + 1]}
                            src={video.linkclip}
                            playsInline={true}
                            poster={video.thumbnaillink}
                            className={"custome-video-layout" + (playingIndex == index + 1 ? " active" : " inactive")}
                        >
                            <ControlBar autoHide={true} >
                                <div className={"custom-bt-control-bar"}>
                                    {
                                        playingIndex == index + 1 ? <IconButton onClick={() => this.handleChangeCurrentTime(-10, this.video[index + 1])}><Replay10Icon /></IconButton> : ""
                                    }
                                    <IconButton onClick={() => playingIndex == index + 1 ? this.handlePauseVideo(this.video[index + 1], index + 1) : this.handlePlayVideo(this.video[index + 1], index + 1)}>
                                        {
                                            playingIndex == index + 1 ? <PauseIcon /> : <PlayArrowIcon />
                                        }
                                    </IconButton>
                                    {
                                        playingIndex == index + 1 ? <IconButton onClick={() => this.handleChangeCurrentTime(10, this.video[index + 1])}><Forward10Icon /></IconButton> : ""
                                    }
                                </div>
                                <div className="fullscreen-overlay" onClick={() => {
                                    this.handlePauseVideo(this.video[index + 1], index + 1)
                                    this.props.setMediaToViewer([{ name: videoIntro.linkclip }])
                                    this.props.toggleMediaViewerDrawer(true, {
                                        showInfo: false,
                                        activeIndex: index + 1,
                                        isvideo: true
                                    })
                                }}></div>
                            </ControlBar>
                        </Player>
                        <p className="title">Người chủng {video.discname}</p>
                    </div>)
                }
                {
                    renderDocumentDrawer(this)
                }
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        ...state.user
    }
};

// const mapDispatchToProps = dispatch => ({
//     addHeaderContent: (headerContent) => dispatch(addHeaderContent(headerContent)),
//     addFooterContent: (footerContent) => dispatch(addFooterContent(footerContent)),
//     toggleHeader: (isShow) => dispatch(toggleHeader(isShow)),
//     toggleFooter: (isShow) => dispatch(toggleFooter(isShow)),
//     setMediaToViewer: (media) => dispatch(setMediaToViewer(media)),
//     toggleMediaViewerDrawer: (isShow, feature) => dispatch(toggleMediaViewerDrawer(isShow, feature)),
// });

export default connect(
    mapStateToProps,
    null
)(Index);

const renderDocumentDrawer = (component) => {
    let {
        showDocumentReviewDrawer,
    } = component.state
    let {
        profile,
        fileIntro
    } = component.props

    return (
        <Drawer anchor="bottom" className="share-drawer poster-drawer" open={showDocumentReviewDrawer} >
            <div className="drawer-detail">
                < div className="drawer-header" >
                    <div className="direction" onClick={() => component.setState({ showDocumentReviewDrawer: false })}>
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                            <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                        </IconButton>
                        <label>Tài liệu</label>
                    </div>
                    {
                        profile ? <div className="user-reward">
                            <div className="profile">
                                <span className="user-name">{profile.fullname}</span>
                                <span className="point">
                                    <span>Điểm YOOT: {new Intl.NumberFormat('de-DE').format(profile.mempoint)}</span>
                                </span>
                            </div>
                            <Avatar aria-label="recipe" className="avatar">
                                <div className="img" style={{ background: `url("${profile.avatar}")` }} />
                            </Avatar>
                        </div> : ""
                    }
                </div >
                <div className="filter"></div>
                <div style={{ overflow: "scroll" }} >
                    {
                        fileIntro ? <div>
                            <PDFReader
                                url={fileIntro.link}
                                showAllPage={true}
                                style={{
                                    width: "100%"
                                }}
                            />
                        </div> : ""
                    }
                </div>
            </div >
        </Drawer>
    )
}