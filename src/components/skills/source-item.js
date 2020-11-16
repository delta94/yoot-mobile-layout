import React from "react";
import './style.scss'
import {
  addHeaderContent,
  addFooterContent,
  toggleHeader,
  toggleFooter,
  toggleMediaViewerDrawer,
  setMediaToViewer,
} from '../../actions/app'
import { connect } from 'react-redux'
import { PDFReader } from 'reactjs-pdf-reader';
import {
  IconButton,
  LinearProgress,
  CircularProgress,
  Drawer,
  Avatar
} from '@material-ui/core'
import {
  ChevronLeft as ChevronLeftIcon,
  PlayCircleFilled as PlayCircleFilledIcon,
  PlayArrow as PlayArrowIcon,
  Replay10 as Replay10Icon,
  Forward10 as Forward10Icon,
  Pause as PauseIcon,
  CheckCircleOutline as CheckCircleOutlineIcon
} from '@material-ui/icons'
import { StickyContainer, Sticky } from 'react-sticky';
import { get, post } from "../../api";
import { SCHOOL_API } from "../../constants/appSettings";
import { Player, ControlBar, BigPlayButton } from 'video-react';
import { formatCurrency } from "../../utils/common";

const practice = require('../../assets/icon/practice.png')
const evaluate = require('../../assets/icon/evaluate.png')
const Newfeed = require('../../assets/icon/Newfeed@1x.png')
const Coins_Y = require('../../assets/icon/Coins_Y.png')
const pdf_download = require('../../assets/icon/pdf-download.png')


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      srouceDetail: null,
      lessions: [],
      currentLesstion: null,
      numPages: 1,
    };
    this.player = React.createRef()
  }

  goback() {
    let path = window.localStorage.getItem("REDIRECT")
    if (path) {
      this.props.history.replace(path)
      window.localStorage.removeItem("REDIRECT")
    } else {
      this.props.history.push('/skills')
    }
  }

  getSourceDetail(sourceId) {
    get(SCHOOL_API, "Course/getonecourse?course=" + sourceId, result => {
      if (result && result.StatusCode == 1) {
        this.setState({ srouceDetail: result.Data[0] })
      }
    })
  }

  getLession(sourceId) {
    get(SCHOOL_API, "Course/getlessions?course=" + sourceId, result => {
      if (result && result.StatusCode == 1) {
        this.setState({
          lessions: result.Data,
          currentLesstion: result.Data[0]
        })
      }
    })
  }



  setStudyTime(LESSON_FK, TIME_SEEN_VIDEO, isfinish) {
    let {
      profile
    } = this.props
    if (!profile) return
    let param = {
      "LESSON_FK": LESSON_FK,
      "TIME_SEEN_VIDEO": TIME_SEEN_VIDEO,
      "STUDENT_FK": profile.id,
      "isfinish": isfinish == true ? 1 : 0
    }
    post(SCHOOL_API, "Course/timeStudyLesson", param)
  }

  handlePlayVideo() {
    let {
      lessions,
      currentLesstion
    } = this.state


    let video = this.player.current
    let lestionIndex = lessions.findIndex(lession => currentLesstion && lession.ID == currentLesstion.ID)

    if (video) {
      this.handleSetMuted(true)
      video.play()
      video.subscribeToStateChange((state, prevState) => {
        if (lestionIndex >= 0) {
          lessions[lestionIndex].timeseen = state.currentTime > lessions[lestionIndex].timeseen ? parseInt(state.currentTime) : lessions[lestionIndex].timeseen
        }

        if (state.ended == true) {
          this.setStudyTime(lessions[lestionIndex].ID, lessions[lestionIndex].VIDEO_TIME, true)
        }
        if (state.paused == true) {
          this.setStudyTime(lessions[lestionIndex].ID, parseInt(state.currentTime), false)
        }

        this.setState({
          isPlaying: !state.paused
        })
      })
      this.setState({
        isPlaying: true
      })
    }
  }

  handlePauseVideo() {
    let video = this.player.current
    if (video) {
      video.pause()
      this.setState({
        isPlaying: false
      })
    }
  }

  handleSetMuted(isMuted) {
    let video = this.player.current
    if (video) {
      video.muted = isMuted
      this.setState({
        isMuted: isMuted
      })
    }
  }

  handleFullScreen() {
    let {
      isFullScreen
    } = this.state
    let video = this.player.current
    if (video) {
      video.toggleFullscreen()
      this.setState({
        isFullScreen: !isFullScreen
      }, () => {
        this.handleSetMuted(isFullScreen)
      })
    }
  }

  handleChangeCurrentTime(seconds) {
    let video = this.player.current
    if (video) {
      const { player } = video.getState();
      video.seek(player.currentTime + seconds)
    }
  }

  componentDidMount() {
    this.props.addHeaderContent(renderHeader(this))
    this.props.addFooterContent(renderFooter(this))
    this.props.toggleHeader(true)
    this.props.toggleFooter(true)
    let { sourceId } = this.props.match.params
    if (!sourceId) return
    this.getSourceDetail(sourceId)
    this.getLession(sourceId)
  }
  render() {
    let {
      srouceDetail,
      lessions,
      currentLesstion,
      isPlaying,
    } = this.state


    return (
      <div className="source-item-page" >
        <StickyContainer className="container pb01">
          <Sticky topOffset={-60} >
            {({ style }) => (
              <div style={{ ...style, top: "60px", zIndex: 999, background: "#fff" }}>
                {
                  srouceDetail ? <div className="lesson-video">
                    <label className="source-name">{srouceDetail.NAME}</label>
                    <div className="reward">
                      <span>Đã hoàn thành: <span className="red"> {srouceDetail.numfinish}/{srouceDetail.numtotal}</span></span>
                      <span className="reward-point">1 VIDEO thưởng {srouceDetail.totalpoint / srouceDetail.numtotal}</span>
                    </div>
                    <div className="proccess">
                      <LinearProgress value={(srouceDetail.numfinish * 100) / srouceDetail.numtotal} className="proccess-bar" variant="determinate" />
                      <span>+ {srouceDetail.totalpoint * (srouceDetail.numfinish / srouceDetail.numtotal)} <img src={Coins_Y} /></span>
                    </div>
                    {
                      currentLesstion ? <div className="video">
                        <Player
                          ref={this.player}
                          // poster={media.thumbnailname}
                          src={currentLesstion.linkvideo}
                          playsInline={true}

                        >
                          <ControlBar autoHide={true} >
                            <div className="custom-bt-control-bar">
                              <IconButton onClick={() => this.handleChangeCurrentTime(-10)}><Replay10Icon /></IconButton>
                              <IconButton onClick={() => isPlaying == true ? this.handlePauseVideo() : this.handlePlayVideo()}>
                                {
                                  isPlaying == true ? <PauseIcon /> : <PlayArrowIcon />
                                }
                              </IconButton>
                              <IconButton onClick={() => this.handleChangeCurrentTime(10)}><Forward10Icon /></IconButton>
                            </div>
                            <div className="fullscreen-overlay" onClick={() => {
                              this.handlePauseVideo()
                              this.props.setMediaToViewer([{ ...currentLesstion, name: currentLesstion.linkvideo }])
                              this.props.toggleMediaViewerDrawer(true, {
                                showInfo: false,
                                activeIndex: 0,
                                isvideo: true,
                                videoCurrentTime: this.player.current.getState().player.currentTime,
                                onCloseVideo: (time) => setTimeout(() => {
                                  this.handleChangeCurrentTime(time - this.player.current.getState().player.currentTime)
                                }, 300)
                              })
                            }}></div>
                          </ControlBar>
                        </Player>
                      </div> : ""
                    }

                    {
                      currentLesstion ? <div className="lesson-name">
                        <PlayCircleFilledIcon />
                        <span>{currentLesstion.NAME}</span>
                      </div> : ""
                    }
                  </div> : ""
                }
              </div>
            )}
          </Sticky>
          <div className="lesson-list">
            <label>Tài liệu</label>
            {
              srouceDetail && srouceDetail.DOCUMNETs.length > 0 ? <ul className="document">
                {
                  srouceDetail.DOCUMNETs.map((document, index) => <li key={index}
                    onClick={() => this.setState({ showDocumentReviewDrawer: true, currentDucument: document })}
                  >
                    <div>
                      {
                        document.LINK.split('.').slice(-1).pop().toLowerCase() == "pdf" ? <img src={pdf_download} /> : ""
                      }
                      <span>{document.NAME}</span>
                    </div>
                  </li>)
                }
              </ul> : ""
            }
            <label>Bài học</label>
            {
              lessions && lessions.length > 0 ? <ul className="lesson">
                {
                  lessions.map((lession, index) => <li
                    className={currentLesstion && lession.ID == currentLesstion.ID ? "active" : ""}
                    key={index}
                    onClick={() => this.setState({
                      currentLesstion: null
                    }, () => {
                      this.setStudyTime(currentLesstion.ID, currentLesstion.timeseen, false)
                      this.setState({
                        currentLesstion: lession
                      }, () => {
                        this.handleChangeCurrentTime(-1000000)
                        setTimeout(() => {
                          this.handleChangeCurrentTime(lession.timeseen)
                          this.handlePlayVideo()
                        }, 500);
                      })
                    })}
                  >
                    <div className="name">
                      <PlayCircleFilledIcon />
                      <span>{lession.NAME}</span>
                    </div>
                    {
                      lession.isfinish == 1 ?
                        <CheckCircleOutlineIcon style={{ color: "#2980b9" }} />
                        : <CircularProgress className="process" variant="static" value={lession.timeseen * 100 / lession.VIDEO_TIME} size={22} thickness={6} />
                    }
                  </li>)
                }
              </ul> : ""
            }
          </div>
        </StickyContainer>
        {
          renderDocumentDrawer(this)
        }
      </div >
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
  addHeaderContent: (headerContent) => dispatch(addHeaderContent(headerContent)),
  addFooterContent: (footerContent) => dispatch(addFooterContent(footerContent)),
  toggleHeader: (isShow) => dispatch(toggleHeader(isShow)),
  toggleFooter: (isShow) => dispatch(toggleFooter(isShow)),
  setMediaToViewer: (media) => dispatch(setMediaToViewer(media)),
  toggleMediaViewerDrawer: (isShow, feature) => dispatch(toggleMediaViewerDrawer(isShow, feature)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);

const renderHeader = (component) => {
  return (
    <div className="app-header">
      <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => component.goback()}>
        <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
      </IconButton>
      <label>Khoá học</label>
    </div>
  )
}
const renderFooter = (component) => {
  let { sourceId } = component.props.match.params
  return (
    <div className="app-footer">
      <ul>
        <li>
          <img src={Newfeed}></img>
          <span style={{ color: "#f54746" }}>Bài học</span>
        </li>
        <li onClick={() => component.props.history.push(`/skills/${sourceId}/exercise`)}>
          <img src={practice}></img>
          <span >Thực hành</span>
        </li>
        <li onClick={() => component.props.history.push(`/skills/${sourceId}/assess`)}>
          <img src={evaluate}></img>
          <span >Đánh giá</span>
        </li>
      </ul>
    </div>
  )
}


const renderDocumentDrawer = (component) => {
  let {
    showDocumentReviewDrawer,
    currentDucument,
    numPages
  } = component.state
  let {
    profile
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
            currentDucument ? <div>
              <PDFReader
                url={currentDucument.LINK}
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
