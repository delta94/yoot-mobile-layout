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
import {
  IconButton,
  AppBar,
  Tabs,
  Tab,
  Button,
  Avatar,
  Drawer
} from '@material-ui/core'
import {
  ChevronLeft as ChevronLeftIcon,
  Cancel as CancelIcon,
  PlayArrow as PlayArrowIcon,
  Replay10 as Replay10Icon,
  Forward10 as Forward10Icon,
  Pause as PauseIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  PlayCircleFilled as PlayCircleFilledIcon,
  NotificationsActive as NotificationsActiveIcon
} from '@material-ui/icons'
import { StickyContainer, Sticky } from 'react-sticky';
import SwipeableViews from 'react-swipeable-views';
import Dropzone from 'react-dropzone'
import { get, post, postFormData } from "../../api";
import { SCHOOL_API } from "../../constants/appSettings";
import { RatingList } from '../../constants/constants'
import { Player, ControlBar, BigPlayButton } from 'video-react';
import { objToQuery, getFileSize, showNotification, jsonFromUrlParams, fromNow } from '../../utils/common'
import Loader from '../common/loader'
import $ from 'jquery'
import moment from 'moment'

const practice1 = require('../../assets/icon/practice1.png')
const evaluate = require('../../assets/icon/evaluate.png')
const Newfeed = require('../../assets/icon/Lesson.png')
const Coins_Y = require('../../assets/icon/Coins_Y.png')
const IMG_1038 = require('../../assets/images/IMG_1038.jpg')
const Logo_y = require('../../assets/icon/Logo_y@1x.png')
const upload_video = require('../../assets/icon/upload_video.png')
const VIDEO1 = require('../../assets/icon/VIDEO1.png')




class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      exercises: [],
      srouceDetail: null,
      playingIndex: null,
      inProccessing: false,
      homeworks: [],
      reviewers: []

    };
    this.video = [React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef()]
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

  handleInit() {
    let { sourceId } = this.props.match.params
    if (!sourceId) return
    this.getSourceDetail(sourceId)
    this.getExercises(sourceId)
    this.getHomework(sourceId)
  }

  getSourceDetail(sourceId) {
    get(SCHOOL_API, "Course/getonecourse?course=" + sourceId, result => {
      if (result && result.StatusCode == 1) {
        this.setState({ srouceDetail: result.Data[0] })
      }
    })
  }

  getExercises(sourceId) {
    let param = {
      type: 2,
      courseid: sourceId
    }
    get(SCHOOL_API, "Course/exercises" + objToQuery(param), result => {
      if (result && result.StatusCode == 1) {
        this.setState({
          exercises: result.Data
        })
      }
    })
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

  selectFile(acceptedFiles) {
    if (acceptedFiles && acceptedFiles[0])
      this.setState({
        fileSelected: acceptedFiles[0]
      })
  }

  getHomework(sourceId) {
    get(SCHOOL_API, "Course/HomeworkVideoWithCourse?courseId=" + sourceId, result => {
      if (result && result.StatusCode == 1) {
        this.setState({
          homeworks: result.Data
        })
      }
    })
  }

  handleGetReviewer(homeworkVideoId) {
    get(SCHOOL_API, "User/getFriendsWithMe?homeworkvideoid=" + homeworkVideoId, result => {
      if (result && result.StatusCode == 1) {
        this.setState({
          reviewers: result.Data
        })
      }
    })
  }

  handleSubmitHomework() {
    let {
      fileSelected,
      exercises
    } = this.state
    let { sourceId } = this.props.match.params
    if (fileSelected) {
      let formData = new FormData
      formData.append("video", fileSelected)
      formData.append("ID", exercises[0].ID)
      formData.append("REVIEWNOW", 1)
      this.setState({
        inProccessing: true
      })
      postFormData(SCHOOL_API, "Course/UploadVideoFolderFileIIS", formData, (result) => {
        if (result && result.StatusCode == 1) {
          showNotification(
            <span style={{ display: "block", width: "60%", fontSize: "1rem", margin: "0px auto 20px", fontFamily: "Roboto-Medium", color: "#444" }}>Chúc mừng bạn đã nộp bài thực hành thành công.</span>,
            <span style={{ display: "block", width: "100%", fontSize: "1rem", margin: "0px auto 20px", fontFamily: "Roboto-Medium", color: "#444" }}>{`Bài của bạn được gửi cho ${result.Data.memberRandom.NAME} chấm.`}<br />Vui lòng vào lịch sử làm bài để theo dõi nhé.</span>
          )
          this.getHomework(sourceId)
          this.setState({
            inProccessing: false,
            fileSelected: null
          })
        } else {
          this.setState({
            inProccessing: false,
          })
        }
      })
    } else {
      this.setState({
        okCallback: () => this.setState({ showConfim: false }, () => {
          $("#upload-homework-bt").click()
        }),
        confirmTitle: "",
        confirmMessage: exercises.EXERCISE_TYPE_FK == 1 ? "Vui lòng chọn file để nộp" : "Vui lòng chọn video để nộp",
        showConfim: true
      })
    }

  }

  handleChangeReviewer(videoId, friend) {
    let param = {
      idvideo: videoId,
      idfriend: friend.ID
    }
    get(SCHOOL_API, "Course/changeReviewer" + objToQuery(param), result => {
      if (result && result.StatusCode == 1)
        this.setState({
          showAddAssessDrawer: false,
          currentHomeWorkVideo: null
        }, () => {
          this.handleInit()
          showNotification("", `Bạn đã mời ${result.Data.memberRandom.NAME} đánh giá lại thành công.`)
        })

    })
  }

  handleRemindReviewer(reviewer) {
    this.setState({
      okCallback: () => this.setState({ showConfim: false }, () => {
        post(SCHOOL_API, "Course/remindreview?reviewid=" + reviewer.REVIEWID, null, result => {
          if (result && result.StatusCode == 1) {
            showNotification("", `Bạn đã nhắc ${reviewer.NAMEMEM} chấm bài thành công.`)
          }
        })
      }),
      confirmTitle: "",
      confirmMessage: `Bạn muốn rung chuông nhắc ${reviewer.NAMEMEM} chấm bài?`,
      showConfim: true,
      okLabel: "Đồng ý",
      cancelLabel: "Huỷ"
    })

  }

  handleDeleteHomework(videoId) {
    this.setState({
      okCallback: () => this.setState({ showConfim: false }, () => {
        get(SCHOOL_API, "Course/deleteVideo?id=" + videoId, (result) => {
          if (result && result.StatusCode == 1) {
            this.handleInit()
          }
        })
      }),
      confirmTitle: "",
      confirmMessage: `Bạn muốn xoá bài đã nộp?`,
      showConfim: true,
      okLabel: "Có",
      cancelLabel: "Không"
    })
  }

  componentDidMount() {
    this.props.addHeaderContent(renderHeader(this))
    this.props.addFooterContent(renderFooter(this))
    this.props.toggleHeader(true)
    this.props.toggleFooter(true)
    this.handleInit()
    let searchParam = jsonFromUrlParams(window.location.search)
    if (searchParam.tabIndex) {
      this.setState({
        tabIndex: parseInt(searchParam.tabIndex)
      })
    }
  }
  render() {
    let {
      tabIndex,
      exercises,
      srouceDetail,
      playingIndex,
      fileSelected,
      inProccessing,
      homeworks,
      reviewers
    } = this.state


    return (
      <div className="exercise-item-page" >
        <StickyContainer className="container">
          <Sticky topOffset={-60} >
            {({ style }) => (
              <div style={{ ...style, top: "60px", zIndex: 999 }}>
                <div className="exercise-header">
                  {
                    srouceDetail ? <div className="lesson-info">
                      <label>{srouceDetail.NAME}</label>
                      <div className="bg" style={{ background: "url(" + srouceDetail.IMAGE + ")" }}></div>
                    </div> : ""
                  }
                  <div className="menu">
                    <AppBar position="static" color="default" className={"custom-tab"}>
                      <Tabs
                        value={tabIndex}
                        onChange={(e, value) => this.setState({ tabIndex: value })}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                        className="tab-header"
                      >
                        <Tab label="Thực hành" {...a11yProps(0)} className="tab-item" />
                        <Tab label="Lịch sử thực hành" {...a11yProps(1)} className="tab-item" />
                      </Tabs>
                    </AppBar>
                  </div>
                </div>
              </div>
            )}
          </Sticky>
          <div className="lesson-list">
            <SwipeableViews
              index={tabIndex}
              onChangeIndex={(value) => this.setState({ tabIndex: value })}
              className="tab-content"
            >
              <TabPanel value={tabIndex} index={0} className="content-box">
                <div className="exercise-list">
                  {
                    exercises && exercises.length > 0 && exercises.map((item, index) => <div key={index} className="exercise-item">
                      <div className="list-header">
                        <label>Đề bài</label>
                        <span className="reward">
                          <span>Thưởng hoàn thành: <span>{exercises[0].point > 0 ? exercises[0].point : 2000}</span></span>
                        </span>
                      </div>
                      {
                        <div>
                          {
                            item.linkvideo.length > 0 && item.linkvideo.map((media, index) => <div className="video">
                              <Player
                                ref={this.video[0]}
                                poster={item.IMAGE_THUMBNAIL}
                                src={media}
                                playsInline={true}
                                key={index}
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
                                    this.props.setMediaToViewer([{ name: media }])
                                    this.props.toggleMediaViewerDrawer(true, {
                                      showInfo: false,
                                      activeIndex: 0,
                                      isvideo: true
                                    })
                                  }}></div>
                                </ControlBar>
                              </Player>
                            </div>)
                          }
                          {
                            item.exerciseMedias.length > 0 && item.exerciseMedias.map((image, index) => <img key={index} src={image.link} />)
                          }
                        </div>
                      }
                      {
                        homeworks && !homeworks.some(item => item.STATUS === 1) && <Dropzone onDrop={acceptedFiles => this.selectFile(acceptedFiles)} disabled={fileSelected != null && fileSelected != undefined}>
                          {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()} className="box-upload-file" id="upload-homework-bt">
                              <input {...getInputProps()} accept={item.EXERCISE_TYPE_FK == 3 ? "file/*" : "video/*"} />
                              {
                                fileSelected
                                  ? <div className="file-selected">
                                    <img src={VIDEO1} />
                                    <div className="file-info">
                                      <span className="name">{fileSelected.name.length > 14 ? `${fileSelected.name.slice(0, 7)}...${fileSelected.name.slice(fileSelected.name.length - 7, fileSelected.name.length)}` : fileSelected.name}</span>
                                      <span className="size">Dung lượng: {getFileSize(fileSelected.size)}</span>
                                    </div>
                                    <Button className="bt-submit no-bg" onClick={() => this.setState({ fileSelected: null })}>Xoá</Button>
                                    <PlayCircleFilledIcon />
                                  </div>
                                  : <div className="bt-upload-file">
                                    <img src={VIDEO1} />
                                    <span>{item.EXERCISE_TYPE_FK == 3 ? "Tải file" : "Tải lên video"}</span>
                                  </div>
                              }
                            </div>
                          )}
                        </Dropzone>
                      }
                      {
                        homeworks && !homeworks.some(item => item.STATUS === 1) ? <Button className="bt-submit aply-exercise" onClick={() => this.handleSubmitHomework()}>
                          Nộp bài
                         {
                            inProccessing == true ? <Loader type="small" /> : ""
                          }
                        </Button> : <Button className="bt-submit no-bg" disable>Bài tập của bạn đang chờ đánh giá</Button>
                      }
                    </div>)
                  }
                </div>
              </TabPanel>
              <TabPanel value={tabIndex} index={1} >
                <div className="history">
                  <div className="notification">
                    <span>Đây là danh sách bài thực hành đã được đánh giá. Nếu chưa hài lòng với kết quả này, bạn có thể yêu cầu đánh giá lại, điểm chấm nào cao nhất sẽ được chọn tính vào điểm YOOT.</span>
                  </div>
                  {
                    homeworks && homeworks.length > 0 && homeworks.map((item, index) => <div className="reports" key={index}>
                      <label>{item.NAME}</label>
                      <ul className="tasks">
                        <li>
                          <div className='task-header'>
                            {/* <span className="task-name">Bài số 1</span> */}
                            <div className="task-actions">
                              <Button className="bt-submit outline" onClick={() => this.setState({ showAddAssessDrawer: true, currentHomeWorkVideo: item }, () => this.handleGetReviewer(item.ID))}>Đánh giá lại</Button>
                              <Button className="bt-cancel" onClick={() => this.handleDeleteHomework(item.ID)}>Xoá</Button>
                            </div>
                          </div>
                          <div className="task-content">
                            {
                              item.EXERCISE_TYPE_FK == 3 ? <div className="homework-text">
                                <a href={item.LINK_VIDEO} target="blank">
                                  <img src={VIDEO1} />
                                  <span>{item.LINK_VIDEO.split("/").slice(0).pop()}</span>
                                </a>
                              </div>
                                : <Player
                                  ref={this.video[index + 1]}
                                  src={item.LINK_VIDEO}
                                  playsInline={true}
                                  key={index}
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
                                      this.props.setMediaToViewer([{ name: item.LINK_VIDEO }])
                                      this.props.toggleMediaViewerDrawer(true, {
                                        showInfo: false,
                                        activeIndex: 0,
                                        isvideo: true
                                      })
                                    }}></div>
                                  </ControlBar>
                                </Player>
                            }
                          </div>
                          <div className="assess">
                            <span>Được đánh giá bởi</span>
                            {
                              item.COMMENTS && item.COMMENTS.length > 0 && item.COMMENTS.map((comment, index) => <div>
                                <div key={index}>
                                  <div className="assessor">
                                    <Avatar className="avatar">
                                      <div className="img" style={{ background: `url("${comment.AVATAR}")` }} />
                                    </Avatar>
                                    <div>
                                      <span className="name">{comment.NAMEMEM}</span>
                                      {
                                        comment.STATUS == 1 ? <span className="date">{fromNow(moment(comment.Review_time), moment(new Date))}</span> : ""
                                      }
                                    </div>
                                  </div>
                                  {
                                    comment.STATUS == 1 ? <div className="point" style={{ background: RatingList[comment.STARROW - 1].color }}>
                                      <span>{`${comment.STARROW}/10 Điểm`}</span>
                                    </div> : <div className="status">Chờ đánh giá</div>
                                  }
                                </div>
                                {/* BINH: add "không có bình luận" */}
                                {
                                  comment.STATUS == 1 ? <pre className="comment">
                                    {
                                      comment.COMMENT ? comment.COMMENT : "Không có bình luận"
                                    }
                                  </pre> : <IconButton className='noti-ring' onClick={() => this.handleRemindReviewer(comment)}><NotificationsActiveIcon /></IconButton>
                                }

                              </div>
                              )
                            }

                          </div>
                          <Button onClick={() => this.setState({ tabIndex: 0 })}>Thực hành lại</Button>
                        </li>
                      </ul>
                    </div>)
                  }

                </div>
              </TabPanel>
            </SwipeableViews>
          </div>
        </StickyContainer>
        {
          renderApplyDrawer(this)
        }
        {
          renderAddAssessDrawer(this)
        }
        {
          renderConfirmDrawer(this)
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.app,
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
      <label>Thực hành</label>
    </div>
  )
}
const renderFooter = (component) => {
  let { sourceId } = component.props.match.params
  return (
    <div className="app-footer">
      <ul>
        <li onClick={() => component.props.history.push(`/skills/${sourceId}`)}>
          <img src={Newfeed}></img>
          <span >Bài học</span>
        </li>
        <li>
          <img src={practice1}></img>
          <span style={{ color: "#f54746" }}>Thực hành</span>
        </li>
        <li onClick={() => component.props.history.push(`/skills/${sourceId}/assess`)}>
          <img src={evaluate}></img>
          <span >Đánh giá</span>
        </li>
      </ul>
    </div>
  )
}

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

const renderAddAssessDrawer = (component) => {
  let {
    showAddAssessDrawer,
    reviewers,
    currentHomeWorkVideo
  } = component.state

  return (
    <Drawer anchor="bottom" className="add-assess-drawer" open={showAddAssessDrawer} onClose={() => component.setState({ showAddAssessDrawer: false, currentHomeWorkVideo: null })}>
      <div className="drawer-detail" style={{ height: '70vh', overflowX: "hidden" }}>
        <div className="drawer-header">
          <div className="direction" onClick={() => component.setState({ showAddAssessDrawer: false, currentHomeWorkVideo: null })}>
            <label>Chọn người chấm bài</label>
            <IconButton style={{ padding: "8px" }} >
              <CancelIcon style={{ width: "25px", height: "25px" }} />
            </IconButton>
          </div>
        </div>
        <div className="drawer-content" style={{ overflow: "scroll", overflowX: "hidden" }}>
          {
            reviewers && reviewers.length > 0 ? <ul className="assess-list">
              {
                reviewers.map((reviewer, index) => <li key={index}>
                  <div>
                    <Avatar className="avatar"><img src={reviewer.AVATAR} /></Avatar>
                    <span>{reviewer.NAME}</span>
                  </div>
                  <Button className="bt-submit" onClick={() => component.handleChangeReviewer(currentHomeWorkVideo.ID, reviewer)}>Chọn</Button>
                </li>)
              }
            </ul> : <div style={{ width: "100%", height: "50px" }}><Loader type="small" width={30} height={30} /></div>
          }
        </div>
        <div className="actions">
          <Button className="bt-submit" onClick={() => component.handleChangeReviewer(currentHomeWorkVideo.ID, { ID: 0 })}>Chọn ngẫu nhiên</Button>
          <Button className="bt-cancel" onClick={() => component.setState({ showAddAssessDrawer: false, currentHomeWorkVideo: null })}>Đóng</Button>
        </div>
      </div>
    </Drawer>
  )
}

const renderApplyDrawer = (component) => {
  let {
    showApplyDrawer,
  } = component.state

  return (
    <Drawer anchor="bottom" className="apply-drawer" open={showApplyDrawer} onClose={() => component.setState({ showApplyDrawer: false })}>
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.setState({ showApplyDrawer: false })}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Nộp bài tập</label>
          </div>
        </div>
        <div className="filter"></div>
        <div className="drawer-content" style={{ overflow: "scroll", width: "100vw" }}>
          <div className="apply-form">
            <label>{lesson.name}</label>
            <span>Bài tập: </span>
            <img src={IMG_1038} />
            <span>Bài làm của bạn:</span>
            <Dropzone onDrop={acceptedFiles => component.setState({ videoSelected: acceptedFiles })}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} id="bt-select-video">
                  <input {...getInputProps()} accept="video/*" />
                  <div className="bt-upload">
                    <img src={upload_video} />
                    <span>Tải lên video</span>
                  </div>
                </div>
              )}
            </Dropzone>

            <Button className="bt-submit">Nộp bài</Button>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

const renderConfirmDrawer = (component) => {
  let {
    showConfim,
    okCallback,
    confirmTitle,
    confirmMessage,
    okLabel,
    cancelLabel
  } = component.state
  return (
    <Drawer anchor="bottom" className="confirm-drawer" open={showConfim} onClose={() => component.setState({ showConfim: false })}>
      <div className='jon-group-confirm'>
        <label>{confirmTitle}</label>
        <p style={{ textAlign: "center" }}>{confirmMessage}</p>
        <div className="mt20">
          <Button className="bt-confirm" onClick={() => component.setState({ showConfim: false }, () => okCallback ? okCallback() : null)}>{okLabel ? okLabel : "Chọn"}</Button>
          <Button className="bt-submit" onClick={() => component.setState({ showConfim: false })}>{cancelLabel ? cancelLabel : "Huỷ"}</Button>
        </div>
      </div>
    </Drawer>
  )
}


const lesson = {
  name: "Nghệ thuật Diễn Thuyết Truyền Cảm Hứng",
  lessonCount: 10,
  lessonFinish: 5,
  reward: 500,
  background: "https://andrews.edu.vn/wp-content/uploads/Prensention_mbaandrews.jpg",
  documents: [
    {
      fileName: "Nghệ thuật Diễn Thuyết Truyền Cảm Hứng",
      type: "pdf"
    }
  ],
  lessons: [
    {
      fileName: "1 - Giới thiệu bản thân",
    },
    {
      fileName: "1 - Giới thiệu bản thân",
    },
    {
      fileName: "1 - Giới thiệu bản thân",
    },
    {
      fileName: "1 - Giới thiệu bản thân",
    },
    {
      fileName: "1 - Giới thiệu bản thân",
    },
    {
      fileName: "1 - Giới thiệu bản thân",
    },
    {
      fileName: "1 - Giới thiệu bản thân",
    }
  ]
}

const assessors = [
  {
    fullName: "Hậu",
    avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
  },
  {
    fullName: "Hậu",
    avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
  },
  {
    fullName: "Hậu",
    avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
  }
]

