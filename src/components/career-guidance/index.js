import React from "react";
import './style.scss'
import {
  addHeaderContent,
  addFooterContent,
  toggleHeader,
  toggleFooter,
  toggleStyleTestDrawer,
  toggleYourJobDrawer,
  toggleDISCDrawer,
  toggleYourMajorsDrawer,
  toggleMediaViewerDrawer,
  setMediaToViewer,
} from '../../actions/app'
import {
  getCareerHistory,
  getCareerTestList,
  removeCareerHistory
} from '../../actions/career'
import {
  IconButton,
  Drawer,
  Avatar,
  Button
} from '@material-ui/core'
import {
  ChevronLeft as ChevronLeftIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Forward10 as Forward10Icon,
  Replay10 as Replay10Icon,
  ArrowBack as ArrowBackIcon
} from '@material-ui/icons'
import StyleChart from './styleChart'
import { connect } from 'react-redux'
import YourJobs from "../job-list";
import Test from './test'
import $ from 'jquery'
import { get, post } from "../../api";
import { BUILD_YS_API, CurrentDate } from "../../constants/appSettings";
import { objToQuery } from '../../utils/common'
import moment from 'moment'
import { CAREER_GUIDANCE_ACCESS_KEY, SKILL_ACCESS_KEY, TEST_HISTORY } from "../../constants/localStorageKeys";
import Iframe from 'react-iframe'
import Intro from './intro'



const DISC = require('../../assets/icon/DISC@1x.png')
const behavior = require('../../assets/icon/Hướng nghiệp/Pesonality@1x.png')
const accordantjob = require('../../assets/icon/Hướng nghiệp/Job@1x.png')
const relatedmajor = require('../../assets/icon/Hướng nghiệp/school@1x.png')
const searchBtn = require('../../assets/icon/Find@1x.png')
const scholarImg = require('../../assets/icon/HS.png')
const studentImg = require('../../assets/icon/SV.png')


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      linkview: null,
      iframeHeight: null,
      fileIntro: null,
      videoIntro: null,
      videoDISCs: [],
      suggestJobs: [],
      findedJobs: [],
      searchKey: ""
    };
    this.video = [React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef()]
  }

  handleGetWebSourse() {
    let {
      careerHistory,
      careerTestList
    } = this.props
    if (careerHistory) {
      this.setState({
        linkview: careerHistory.linkviewresult + "&token=" + window.localStorage.getItem(CAREER_GUIDANCE_ACCESS_KEY)
      })
      this.handleGetSource()
    } else {
      this.setState({
        linkview: careerTestList.linkview + "&token=" + window.localStorage.getItem(CAREER_GUIDANCE_ACCESS_KEY)
      })
    }
  }

  handleGetDISCIntro() {
    this.props.toggleDISCDrawer(true)
    get(BUILD_YS_API, "Introduce/ListFileIntro", result => {
      if (result && result.result == 1) {
        if (result.content.fileIntros.length > 0) {
          this.setState({
            fileIntro: { ...result.content.fileIntros[0], name: "DISC VÀ ỨNG DỤNG TRONG HƯỚNG NGHIỆP" }
          })
        }
      }
    })
    get(BUILD_YS_API, "Introduce/ListVideoWithSub?type=DISC", result => {
      if (result && result.result == 1) {
        this.setState({
          videoDISCs: result.content.videoIntros
        })
      }
    })
    get(BUILD_YS_API, "Introduce/ListVideoWithSub?type=Intro", result => {
      if (result && result.result == 1) {
        this.setState({
          videoIntro: result.content.videoIntros[0]
        })
      }
    })
  }

  handleMessage(message) {
    console.log("e", message)
    if (!message) return
    switch (message.action) {
      case "heightcall": {
        this.setState({
          iframeHeight: message.height
        })
        return
      }
      case "heightcallresult": {
        $("#iframe-DISC").height(message.height)
        this.props.getCareerHistory()
        return
      }
      case "backdisc": {
        this.props.removeCareerHistory()
        return
      }
      default: {
        return
      }
    }
  }

  handleGetSource() {
    let {
      careerHistory
    } = this.props
    let param = {
      ubunansid: careerHistory.id,
      token: window.localStorage.getItem(SKILL_ACCESS_KEY)
    }
    get(BUILD_YS_API, "ResultDISC/GetOptionCourses" + objToQuery(param), result => {
      if (result && result.result == 1) {
        this.setState({
          optionCourses: result.content.careers,
          currentUserType: result.content.codedisc
        })
      }
    })
  }

  handleClickSource(source) {
    window.localStorage.setItem("REDIRECT", window.location.pathname)
    setTimeout(() => {
      this.props.history.push("/skills/" + source.ID)
    }, 200);
  }

  handleOpenYourJobs() {
    this.handleGetSuggestJobs()
    this.props.toggleYourJobDrawer(true)
  }

  handleGetSuggestJobs() {
    let param = {
      findtext: "",
      isresultdisc: 1,
      isology: 0,
      ologyid: 0
    }
    post(BUILD_YS_API, "Career/GetCareers" + objToQuery(param), null, result => {
      if (result && result.result == 1)
        this.setState({
          suggestJobs: result.content.careers
        })
    })
  }

  handleSearchJob() {
    let {
      searchKey
    } = this.state
    if (searchKey == "" || !searchKey) {
      this.setState({
        findedJobs: []
      })
      return
    }
    let param = {
      findtext: searchKey,
      isresultdisc: 0,
      isology: 0,
      ologyid: 0
    }
    post(BUILD_YS_API, "Career/GetCareers" + objToQuery(param), null, result => {
      if (result && result.result == 1)
        this.setState({
          findedJobs: result.content.careers
        })
    })
  }


  componentDidMount() {
    this.props.addHeaderContent(renderHeader(this))
    this.props.toggleHeader(true)
    this.props.toggleFooter(false)
    this.props.getCareerHistory(() => {
      this.props.getCareerTestList(() => {
        this.handleGetWebSourse()
      })
    })

    if (window.addEventListener) {
      let that = this
      window.addEventListener('message', e => {
        that.handleMessage(JSON.parse(e.data))
      }, false);
    }
  }
  render() {
    return (
      <div className="career-guidance-page" >
        <div className="career-guidance-banner" onClick={() => this.setState({ showScholarDrawer: true })}>
          <img src="https://huongnghiepsongan.com/wp-content/uploads/2020/07/marci-angeles-YCF18toz3ds-unsplash.jpg" />
        </div>
        <div className="btn-action">
          <div className="item scholar-bt" onClick={() => this.setState({ showScholarDrawer: true }, () => this.handleGetWebSourse())}>
            <img src={scholarImg} />
              Học sinh
            </div>
          <div className="item student-bt">
            <img src={studentImg} />
              Sinh viên
            </div>
          {
            renderScholarDrawer(this)
          }
          {
            renderStyleTestDrawer(this)
          }
          {
            renderYourJobDrawer(this)
          }
          {
            renderDISCDrawer(this)
          }
          {
            renderYourMajorsDrawer(this)
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.app,
    ...state.user,
    ...state.career
  }
};

const mapDispatchToProps = dispatch => ({
  addHeaderContent: (headerContent) => dispatch(addHeaderContent(headerContent)),
  toggleHeader: (isShow) => dispatch(toggleHeader(isShow)),
  toggleFooter: (isShow) => dispatch(toggleFooter(isShow)),
  toggleStyleTestDrawer: (isShow) => dispatch(toggleStyleTestDrawer(isShow)),
  toggleYourJobDrawer: (isShow) => dispatch(toggleYourJobDrawer(isShow)),
  toggleDISCDrawer: (isShow) => dispatch(toggleDISCDrawer(isShow)),
  toggleYourMajorsDrawer: (isShow) => dispatch(toggleYourMajorsDrawer(isShow)),
  getCareerHistory: (successCallBack) => dispatch(getCareerHistory(successCallBack)),
  getCareerTestList: (successCallBack) => dispatch(getCareerTestList(successCallBack)),
  removeCareerHistory: () => dispatch(removeCareerHistory()),
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
      <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => component.props.history.push('/')}>
        <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
      </IconButton>
      <label>Hướng nghiệp</label>
    </div>
  )
}


const renderScholarDrawer = (component) => {
  let {
    profile
  } = component.props
  let {
    showScholarDrawer,
  } = component.state
  return (
    <Drawer anchor="bottom" className="style-test-drawer" open={showScholarDrawer} onClose={() => component.setState({ showScholarDrawer: false })}>
      {
        profile ? <div className="drawer-detail">
          <div className="drawer-header">
            <div className="direction" onClick={() => component.setState({ showScholarDrawer: false })}>
              <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
              </IconButton>
              <label>Học sinh</label>
            </div>
            <div className="user-reward">
              <div className="profile">
                <span className="user-name">{profile.fullname}</span>
                <span className="point">
                  <span>Điểm YOOT: {profile.mempoint}</span>
                </span>
              </div>
              <Avatar aria-label="recipe" className="avatar">
                <div className="img" style={{ background: `url("${profile.avatar}")` }} />
              </Avatar>
            </div>
          </div>
          <div className="filter">
          </div>
          <div style={{ overflow: "scroll" }}>
            <div className="career-guidance-banner" onClick={() => component.setState({ showScholarDrawer: true })}>
              <img src="https://huongnghiepsongan.com/wp-content/uploads/2020/07/marci-angeles-YCF18toz3ds-unsplash.jpg" />
            </div>
            <div className="listItem">
              <div className="_blank">
              </div>
              <div className="item behavior" onClick={() => component.props.toggleStyleTestDrawer(true)}>
                <img src={behavior} />
                <span>Phong cách hành vi</span>
              </div>
              <div className="_blank_">
              </div>
              <div className="item accordant-job" onClick={() => component.handleOpenYourJobs()}>
                <img src={accordantjob} />
                <span>Công việc phù hợp</span>
              </div>
              <div className="item related-major" onClick={() => component.props.toggleYourMajorsDrawer(true)}>
                <img src={relatedmajor} />
                <span>Ngành học tương ứng</span>
              </div>
            </div>
          </div>

        </div> : ""
      }
    </Drawer>
  )
}

const renderStyleTestDrawer = (component) => {
  let {
    isTestTing,
    linkview,
    optionCourses,
    currentUserType
  } = component.state
  let {
    showStyleTestPage,
    profile,
    careerHistory
  } = component.props

  return (
    <Drawer anchor="bottom" className="style-test-drawer" open={showStyleTestPage} onClose={() => component.props.toggleStyleTestDrawer(false)}>
      {
        profile ? <div className="drawer-detail">
          <div className="drawer-header">
            <div className="direction" onClick={() => component.props.toggleStyleTestDrawer(false)}>
              <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
              </IconButton>
              <label>Kết quả DISC</label>
            </div>
            <div className="user-reward">
              <div className="profile">
                <span className="user-name">{profile.fullname}</span>
                <span className="point">
                  <span>Điểm YOOT: {profile.mempoint}</span>
                </span>
              </div>
              <Avatar aria-label="recipe" className="avatar">
                <div className="img" style={{ background: `url("${profile.avatar}")` }} />
              </Avatar>
            </div>
          </div>
          <div className="filter">
          </div>
          <div style={{ overflow: "scroll" }}>
            <div className="style-reward">
              <Button onClick={() => component.handleGetDISCIntro()}><img src={DISC} /> Tìm hiểu DISC</Button>
            </div>
            {
              linkview && linkview != "" ? <Iframe url={linkview}
                width="100%"
                height={"100%"}
                id="iframe-DISC"
                className="myClassname"
                display="initial"
                position="relative"
              /> : ""
            }
            {
              // isTestTing ? "" : <div className='result'>
              //   <div className="title">
              //     <span>Kết quả:</span>
              //     <Button onClick={() => component.setState({ isTestTing: true })}>Trắc nghiệm lại</Button>
              //   </div>
              //   <div className="description">
              //     <span>- <b>Thuộc nhóm: </b> SCI</span>
              //     <span>- <b>Mô tả:</b> Cẩn thận, rụt rè, trầm lặng, tập trung, dễ bằng lòng, chú trọng chi tiết, mềm dẻo, thấu đáo, chính xác, điềm tĩnh, lô-gic, ngăn nắp và chính xác.</span>
              //     <span>- <b>Nhóm ngành nghề: </b>Chuyên gia, chăm sóc, tâm lý, tư vấn, giao tiếp 1-1, kiên nhẫn lắng nghe, trung thực và thương lượng.</span>
              //   </div>
              //   <table cellSpacing={"3px"}>
              //     <thead>
              //       <tr>
              //         <td></td>
              //         <td><b>1</b></td>
              //         <td><b>2</b></td>
              //         <td><b>3</b></td>
              //         <td><b>4</b></td>
              //         <td><b>5</b></td>
              //       </tr>
              //     </thead>
              //     <tbody>
              //       <tr>
              //         <th></th>
              //         <th className="red"><b>D</b></th>
              //         <th className="red"><b>I</b></th>
              //         <th className="red"><b>S</b></th>
              //         <th className="red"><b>C</b></th>
              //         <th></th>
              //       </tr>
              //       <tr>
              //         <td><b>MOST</b></td>
              //         <td>4</td>
              //         <td>6</td>
              //         <td>4</td>
              //         <td>7</td>
              //         <td>3</td>
              //       </tr>
              //       <tr>
              //         <td><b>LEAST</b></td>
              //         <td>6</td>
              //         <td>4</td>
              //         <td>3</td>
              //         <td>3</td>
              //         <td>8</td>
              //       </tr>
              //     </tbody>
              //   </table>
              // </div>
            }
            {/* {
              isTestTing ? "" : <div className="chart">
                <StyleChart />
              </div>
            } */}
            {/* {
              careerHistory ? <Button className="your-job-bt" onClick={() => component.props.toggleYourJobDrawer(true)}>Công việc phù hợp</Button> : ""
            } */}
            {
              careerHistory ? <div className="your-lesson">
                <label>Những bạn thuộc nhóm tính cách {currentUserType} thường học những khoá học sau đây:</label>
                <div className="skills-page" >
                  {
                    optionCourses && optionCourses.length > 0 ? <ul>
                      {
                        optionCourses.map((source, index) => <li key={index} className="source-item" onClick={() => component.handleClickSource(source)}>
                          <div style={{ background: "url(" + source.IMAGE + ")" }}>
                            <div>
                              <div className="reward">
                                <span>{source.NUM_LESSION} bài</span>
                                <span>{source.NUM_DOCUMENT} tài liệu</span>
                              </div>
                              <span className="source-name">{source.NAME}</span>
                            </div>
                          </div>
                        </li>)
                      }
                    </ul> : ""
                  }
                </div>
              </div> : ""
            }
          </div>

        </div> : ""
      }
    </Drawer>
  )
}

const renderDISCDrawer = (component) => {
  let {
    showDISCDrawer,
    profile,
  } = component.props
  let {
    fileIntro,
    videoIntro,
    videoDISCs
  } = component.state
  return (
    <Drawer anchor="bottom" className="style-test-drawer" open={showDISCDrawer} onClose={() => component.props.toggleDISCDrawer(false)}>
      {
        profile ? <div className="drawer-detail">
          <div className="drawer-header">
            <div className="direction" onClick={() => component.props.toggleDISCDrawer(false)}>
              <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
              </IconButton>
              <label>Tìm hiểu DISC</label>
            </div>
            <div className="user-reward">
              <div className="profile">
                <span className="user-name">{profile.fullname}</span>
                <span className="point">
                  <span>Điểm YOOT: {profile.mempoint}</span>
                </span>
              </div>
              <Avatar aria-label="recipe" className="avatar">
                <div className="img" style={{ background: `url("${profile.avatar}")` }} />
              </Avatar>
            </div>
          </div>
          <div className="filter"></div>
          <div className="about-DISC" style={{ overflow: "scroll", background: '#f2f3f7' }}>
            <Intro fileIntro={fileIntro} videoIntro={videoIntro} videoDISCs={videoDISCs} />
          </div>

        </div> : ""
      }
    </Drawer>
  )
}

const renderYourJobDrawer = (component) => {
  let {
    suggestJobs,
    findedJobs,
    searchKey,
    isSearching
  } = component.state
  let {
    showYourJobPage,
    profile
  } = component.props

  console.log("suggestJobs", suggestJobs)
  console.log("findedJobs", findedJobs)

  return (
    <Drawer anchor="bottom" className="job-list-drawer" open={showYourJobPage} onClose={() => component.props.toggleYourJobDrawer(false)}>
      {
        profile ? <div className="drawer-detail">
          <div className="drawer-header">
            <div className="direction" onClick={() => component.props.toggleYourJobDrawer(false)}>
              <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
              </IconButton>
              <label>Công việc</label>
            </div>
            <div className="user-reward">
              <div className="profile">
                <span className="user-name">{profile.fullname}</span>
                <span className="point">
                  <span>Điểm YOOT: {profile.mempoint}</span>
                </span>
              </div>
              <Avatar aria-label="recipe" className="avatar">
                <div className="img" style={{ background: `url("${profile.avatar}")` }} />
              </Avatar>
            </div>
          </div>
          <div className="filter">
            <div className="search-job">
              {
                isSearching ? <div className="btn-search">
                  <button type="submit" className="searchBtn red" onClick={() => component.setState({ searchKey: "", isSearching: false }, () => component.handleSearchJob())}>
                    <ArrowBackIcon style={{ width: 20 }} />
                  </button>
                </div> : ""
              }
              <input type="text" name="search" value={searchKey} onChange={(e) => component.setState({ searchKey: e.target.value, isSearching: true }, () => component.handleSearchJob())} className="searchBox" placeholder="Vui lòng chọn công việc phù hợp" />
              <div className="btn-search">
                <button type="submit" className="searchBtn">
                  <img src={searchBtn} />
                </button>
              </div>
            </div>
          </div>
          <div style={{ overflow: "scroll", background: "#f2f3f7" }} id="your-job-list">
            <div style={{ padding: "1px 0 10px 0", background: "white", marginBottom: "10px" }}>
              <div className="jobList-Noti">
                <div className="divContent">
                  <i class="fas fa-play"></i>
                  <p className="content">Trang công việc được hệ thống chọn lọc theo kết quả trắc nghiệm tính cách của bạn. Bạn hãy chọn những công việc mà bạn muốn tìm hiểu nhé.</p>
                </div>
                <p className="quote">
                  <img src={DISC} />
                  <span>Phù hợp với phong cách hành vi.</span>
                </p>
              </div>
            </div>
            <YourJobs suggestJobs={suggestJobs} findedJobs={findedJobs} />
          </div>
          <div className="footer-drawer">
            <Button onClick={() => component.props.toggleYourMajorsDrawer(true)}>Ngành học tương ứng</Button>
          </div>

        </div> : ""
      }
    </Drawer>
  )
}

const renderYourMajorsDrawer = (component) => {
  let {
    showYourMajorsPage,
    profile
  } = component.props
  return (
    <Drawer anchor="bottom" className="job-list-drawer" open={showYourMajorsPage} onClose={() => component.props.toggleYourMajorsDrawer(false)}>
      {
        profile ? <div className="drawer-detail">
          <div className="drawer-header">
            <div className="direction" onClick={() => component.props.toggleYourMajorsDrawer(false)}>
              <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
              </IconButton>
              <label>Ngành học</label>
            </div>
            <div className="user-reward">
              <div className="profile">
                <span className="user-name">{profile.fullname}</span>
                <span className="point">
                  <span>Điểm YOOT: {profile.mempoint}</span>
                </span>
              </div>
              <Avatar aria-label="recipe" className="avatar">
                <div className="img" style={{ background: `url("${profile.avatar}")` }} />
              </Avatar>
            </div>
          </div>
          <div className="filter">
            <div className="searchGroup">

              <input type="text" name="search" className="searchBox" style={{ height: "40px !important" }} placeholder="Nhập công việc phù hợp hoặc ngành/trường mong mu..." />
              <div className="btn-search" style={{ top: "10px" }}>
                <button type="submit" className="searchBtn">
                  <img src={searchBtn} />
                </button>
              </div>
            </div>
            <div className="favoriteSchool">
              <i class="fas fa-heart"></i> Trường đang quan tâm
            </div>
          </div>
          <div style={{ background: "#f2f3f7" }}>
            <div className="filter" style={{ background: "white", width: "100%", margin: "10px auto", padding: "1px" }}>
              <div className="major-noti jobList-Noti" style={{ padding: "0px 10px", width: "90%" }}>
                <div className="divContent">
                  <i class="fas fa-play"></i>
                  <p className="content">Trang ngành học được hệ thống chọn lọc theo kết quả trắc nghiệm tính cách của bạn. Bạn hãy chọn những ngành học mà bạn muốn tìm hiểu nhé.</p>
                </div>
              </div>
              <div className="panel" style={{ borderBottom: "1px solid #f2f3f7", width: "95%", margin: "0 auto 10px" }}>
                <ul style={{ padding: "10px 0", display: "inline-flex" }}>
                  <li className="active" style={{ color: "#ff5a5a", display: "inline-block", borderBottom: "2px solid #ff5a5a", paddingBottom: "10px" }}>
                    Bác sỹ
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div style={{ overflow: "scroll", background: "#f2f3f7" }}>

          </div>

        </div> : ""
      }
    </Drawer>
  )
}

const sources = [
  {
    name: "Nghệ thuật Diễn Thuyết Truyền Cảm Hứng",
    background: "https://andrews.edu.vn/wp-content/uploads/Prensention_mbaandrews.jpg",
    documentsCount: 1,
    lessonCount: 10
  },
  {
    name: "Kỹ năng giao tiếp hiệu quả",
    background: "https://www.sprc.org/sites/default/files/styles/featured_image_large/public/SPRC_EllyStout_DirCorner_Cropped_node_6.jpg?itok=aqVkwAEq",
    documentsCount: 1,
    lessonCount: 10
  }
]