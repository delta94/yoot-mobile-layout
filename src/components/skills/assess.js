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
  Button,
  Avatar,
  Drawer
} from '@material-ui/core'
import {
  ChevronLeft as ChevronLeftIcon,
  Cancel as CancelIcon,
  Replay10 as Replay10Icon,
  Forward10 as Forward10Icon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  FiberManualRecord as FiberManualRecordIcon
} from '@material-ui/icons'
import { Player, ControlBar, BigPlayButton } from 'video-react';
import Dropzone from 'react-dropzone'
import { SCHOOL_API } from "../../constants/appSettings";
import { get, post, postFormData } from "../../api";
import { objToQuery, getFileSize, showNotification, fromNow } from '../../utils/common'
import moment from 'moment'
import { RatingList } from "../../constants/constants";
import MultiInput from '../common/multi-input'
import Loader from '../common/loader'

const practice = require('../../assets/icon/practice.png')
const evaluate1 = require('../../assets/icon/evaluate1.png')
const Newfeed = require('../../assets/icon/Lesson.png')
const Coins_Y = require('../../assets/icon/Coins_Y.png')
const IMG_1038 = require('../../assets/images/IMG_1038.jpg')
const Logo_y = require('../../assets/icon/Logo_y@1x.png')
const upload_video = require('../../assets/icon/upload_video.png')




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
      reviewers: [],
      reviews: null
    };
    this.video = []
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
    this.getReviews(sourceId)
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

  getReviews(sourceId) {
    let param = {
      courseId: sourceId,
      status: 0
    }
    get(SCHOOL_API, "Course/reviews" + objToQuery(param), result => {
      if (result && result.StatusCode == 1) {
        result.Data.map((review, reviewIndex) => {
          this.video[reviewIndex] = Array.from({ length: review.exerciseLinkVideos.length + 10 }, (_, i) => React.createRef())
        })
        this.setState({
          reviews: result.Data
        })
      }
    })
  }

  handlePlayVideo(videoRef, index) {

    if (!videoRef) return

    this.video.map((item) => {
      item.map(i => {
        this.handlePauseVideo(i)
      })
    })

    let video = videoRef.current

    if (video) {
      video.play()
    }
    this.setState({
      playingIndex: index
    })
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

  handleSelectRate(review, rate) {
    let {
      reviews
    } = this.state
    let reviewIndex = reviews.findIndex(item => item.ID == review.ID)
    if (reviewIndex >= 0) {
      reviews[reviewIndex].yourRate = rate.code
    }
    this.setState({
      reviews
    })
  }

  handleChangeReviewText(review, value) {
    let {
      reviews
    } = this.state
    let reviewIndex = reviews.findIndex(item => item.ID == review.ID)
    if (reviewIndex >= 0) {
      reviews[reviewIndex].reviewText = value.text
    }
    this.setState({
      reviews
    })
  }
  handleSubmitReview(review) {
    if (!review.yourRate) {
      showNotification("", "Vui lòng chấm điểm trước khi gửi")
      return
    }
    let param = {
      "reviewId": review.ID,
      "COMMENT": review.reviewText,
      "criterias": [
        {
          "criteria": 0,
          "star": review.yourRate
        }
      ]
    }
    post(SCHOOL_API, "Course/reviews", param, (result) => {
      if (result && result.StatusCode == 1) {
        this.handleInit()
      }
    })
  }

  componentWillMount() {
    this.props.addHeaderContent(renderHeader(this))
    this.props.addFooterContent(renderFooter(this))
    this.props.toggleHeader(true)
    this.props.toggleFooter(true)
    this.handleInit()
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
      reviewers,
      reviews
    } = this.state


    return (
      <div className="assess-page" >
        {
          srouceDetail ? <div className="exercise-scource">
            <label className="red">{srouceDetail.NAME}</label>
            {
              reviews && reviews.length == 0 ? <div className="empty-record">
                <span>Chưa có bài tập nào chờ bạn đánh giá</span>
              </div> : ""
            }
            {
              !reviews ? <div style={{ height: "50px", background: "#fff", zIndex: 0 }}>
                {
                  <Loader type="small" style={{ background: "#fff" }} width={30} height={30} />
                }
              </div> : ""
            }
          </div> : ""
        }

        <div className="exercise-list">
          {
            reviews && reviews.length > 0 && reviews.map((item, reviewIndex) => <div key={reviewIndex} className="exercise-item">
              <div className="list-header">
                <label>Đề bài</label>
              </div>
              {
                item.exerciseLinkVideos.length > 0 && item.exerciseLinkVideos.map((media, index) => <div className="exercise-content">
                  <div className="video">
                    <Player
                      ref={this.video[reviewIndex][0]}
                      poster={item.EX_IMAGE_PATH}
                      src={media}
                      playsInline={true}
                      key={index}
                      className={"custome-video-layout" + (playingIndex == `${reviewIndex}-${0}` ? " active" : " inactive")}
                    >
                      <ControlBar autoHide={true} >
                        <div className={"custom-bt-control-bar"}>
                          {
                            playingIndex == `${reviewIndex}-${0}` ? <IconButton onClick={() => this.handleChangeCurrentTime(-10, this.video[reviewIndex][0])}><Replay10Icon /></IconButton> : ""
                          }
                          <IconButton onClick={() => playingIndex == `${reviewIndex}-${0}` ? this.handlePauseVideo(this.video[reviewIndex][0]) : this.handlePlayVideo(this.video[reviewIndex][0], `${reviewIndex}-${0}`)}>
                            {
                              playingIndex == `${reviewIndex}-${0}` ? <PauseIcon /> : <PlayArrowIcon />
                            }
                          </IconButton>
                          {
                            playingIndex == `${reviewIndex}-${0}` ? <IconButton onClick={() => this.handleChangeCurrentTime(10, this.video[reviewIndex][0])}><Forward10Icon /></IconButton> : ""
                          }
                        </div>
                        <div className="fullscreen-overlay" onClick={() => {
                          this.handlePauseVideo(this.video[reviewIndex][0])
                          this.props.setMediaToViewer([{ name: media }])
                          this.props.toggleMediaViewerDrawer(true, {
                            showInfo: false,
                            activeIndex: 0,
                            isvideo: true
                          })
                        }}></div>
                      </ControlBar>
                    </Player>
                  </div>
                  {
                    item.exerciseMedias.length > 0 && item.exerciseMedias.map((image, index) => <img key={index} src={image.link} />)
                  }
                </div>)
              }
              <div className="homework-list">
                <label>Người gửi chấm:</label>
                <div className="user">
                  <Avatar aria-label="recipe" className="avatar">
                    <div className="img" style={{ background: `url("${item.STUDENT_AVATAR}")` }} />
                  </Avatar>
                  <div className="info">
                    <span className="name">{item.STUDENT}</span>
                    <span className="date">
                      <span>{fromNow(moment(item.CREATE_DATE), moment(new Date))}</span>
                    </span>
                  </div>
                </div>
                <div className="homework-name">
                  <span>{item.NAME}</span>
                </div>
                <div className="video">
                  <Player
                    ref={this.video[reviewIndex][1]}
                    poster={item.IMAGE}
                    src={item.LINK_VIDEO}
                    playsInline={true}
                    className={"custome-video-layout" + (playingIndex == `${reviewIndex}-${1}` ? " active" : " inactive")}
                  >
                    <ControlBar autoHide={true} >
                      <div className={"custom-bt-control-bar"}>
                        {
                          playingIndex == `${reviewIndex}-${1}` ? <IconButton onClick={() => this.handleChangeCurrentTime(-10, this.video[reviewIndex][1])}><Replay10Icon /></IconButton> : ""
                        }
                        <IconButton onClick={() => playingIndex == `${reviewIndex}-${1}` ? this.handlePauseVideo(this.video[reviewIndex][1]) : this.handlePlayVideo(this.video[reviewIndex][1], `${reviewIndex}-${1}`)}>
                          {
                            playingIndex == `${reviewIndex}-${1}` ? <PauseIcon /> : <PlayArrowIcon />
                          }
                        </IconButton>
                        {
                          playingIndex == `${reviewIndex}-${1}` ? <IconButton onClick={() => this.handleChangeCurrentTime(10, this.video[reviewIndex][1])}><Forward10Icon /></IconButton> : ""
                        }
                      </div>
                      <div className="fullscreen-overlay" onClick={() => {
                        this.handlePauseVideo(this.video[reviewIndex][1])
                        this.props.setMediaToViewer([{ name: item.LINK_VIDEO }])
                        this.props.toggleMediaViewerDrawer(true, {
                          showInfo: false,
                          activeIndex: 0,
                          isvideo: true
                        })
                      }}></div>
                    </ControlBar>
                  </Player>
                </div>
                <div className="rating">
                  <label>Đánh giá của bạn: <span style={{ color: item.yourRate ? RatingList[item.yourRate - 1].color : "" }}>{item.yourRate ? item.yourRate : 0}/10</span></label>
                  <ul className="rating-list">
                    {
                      RatingList.map((rate, index) => <li key={index} onClick={() => this.handleSelectRate(item, rate)}>
                        <IconButton style={{ color: rate.color }}><FiberManualRecordIcon /></IconButton>
                        <span>{rate.label}</span>
                      </li>)
                    }
                  </ul>
                </div>
                <div className='review-text'>
                  <MultiInput
                    ref={this.commentInput}
                    style={{
                      minHeight: "120px",
                      border: "1px solid rgba(0,0,0,0.15)",
                    }}
                    onChange={value => this.handleChangeReviewText(item, value)}
                    topDown={false}
                    placeholder={"Ý kiến của bạn"}
                    enableHashtag={false}
                    enableMention={false}
                    centerMode={false}
                    value={item.reviewText}
                  />
                </div>
                <div className="submit">
                  <Button className="bt-submit" onClick={() => this.handleSubmitReview(item)}>Gửi đánh giá</Button>
                </div>
              </div>
            </div>)
          }
        </div>
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
      <label>Đánh giá</label>
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
        <li onClick={() => component.props.history.push(`/skills/${sourceId}/exercise`)}>
          <img src={practice}></img>
          <span >Thực hành</span>
        </li>
        <li>
          <img src={evaluate1}></img>
          <span style={{ color: "#f54746" }}>Đánh giá</span>
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
  } = component.state

  return (
    <Drawer anchor="bottom" className="add-assess-drawer" open={showAddAssessDrawer} onClose={() => component.setState({ showAddAssessDrawer: false })}>
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.setState({ showAddAssessDrawer: false })}>
            <label>Chọn người chấm bài</label>
            <IconButton style={{ padding: "8px" }} >
              <CancelIcon style={{ width: "25px", height: "25px" }} />
            </IconButton>
          </div>
        </div>
        <div className="drawer-content" style={{ overflow: "scroll" }}>
          <ul className="assess-list">
            {
              assessors.map((assess, index) => <li key={index}>
                <div>
                  <Avatar className="avatar"><img src={assess.avatar} /></Avatar>
                  <span>{assess.fullName}</span>
                </div>
                <Button className="bt-submit">Chọn</Button>
              </li>)
            }
          </ul>
        </div>
        <div className="actions">
          <Button className="bt-submit">Thêm bấi kỳ</Button>
          <Button className="bt-cancel">Đóng</Button>
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

