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
  toggleYourMajorsDrawer
} from '../../actions/app'
import {
  IconButton,
  Drawer,
  Avatar,
  Button
} from '@material-ui/core'
import {
  ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons'
import StyleChart from './styleChart'
import { connect } from 'react-redux'
import YourJobs from "../job-list";
import Test from './test'
import $ from 'jquery'

const coin = require('../../assets/icon/Coins_Y.png')
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
    };
  }
  componentWillMount() {
    this.props.addHeaderContent(renderHeader(this))
    this.props.toggleHeader(true)
    this.props.toggleFooter(false)
  }
  componentDidMount() {
    let value = [5, 4, 3, 3]
    let point1 = $("#style-table")
    console.log("point1", point1)
  }
  render() {
    return (
      <div className="career-guidance-page" >
        <div className="career-guidance-banner" onClick={() => this.setState({ showScholarDrawer: true })}>
          <img src="https://huongnghiepsongan.com/wp-content/uploads/2020/07/marci-angeles-YCF18toz3ds-unsplash.jpg" />
        </div>
        <div className="btn-action">
          <div className="item scholar-bt" onClick={() => this.setState({ showScholarDrawer: true })}>
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
    ...state.user
  }
};

const mapDispatchToProps = dispatch => ({
  addHeaderContent: (headerContent) => dispatch(addHeaderContent(headerContent)),
  toggleHeader: (isShow) => dispatch(toggleHeader(isShow)),
  toggleFooter: (isShow) => dispatch(toggleFooter(isShow)),
  toggleStyleTestDrawer: (isShow) => dispatch(toggleStyleTestDrawer(isShow)),
  toggleYourJobDrawer: (isShow) => dispatch(toggleYourJobDrawer(isShow)),
  toggleDISCDrawer: (isShow) => dispatch(toggleDISCDrawer(isShow)),
  toggleYourMajorsDrawer: (isShow) => dispatch(toggleYourMajorsDrawer(isShow))
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
                <span className="user-name">{profile.fullName}</span>
                <span className="point">
                  <span>Điển YOOT: {profile.point}</span>
                  <img src={coin} />
                </span>
              </div>
              <Avatar aria-label="recipe" className="avatar">
                <img src={profile.avatar} style={{ width: "100%" }} />
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
              <div className="item accordant-job" onClick={() => component.props.toggleYourJobDrawer(true)}>
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
    isTestTing
  } = component.state
  let {
    showStyleTestPage,
    profile
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
                <span className="user-name">{profile.fullName}</span>
                <span className="point">
                  <span>Điển YOOT: {profile.point}</span>
                  <img src={coin} />
                </span>
              </div>
              <Avatar aria-label="recipe" className="avatar">
                <img src={profile.avatar} style={{ width: "100%" }} />
              </Avatar>
            </div>
          </div>
          <div className="filter">
          </div>
          <div style={{ overflow: "scroll" }}>
            <div className="style-reward">
              <Button onClick={() => component.props.toggleDISCDrawer(true)}><img src={DISC} /> Tìm hiểu DISC</Button>
            </div>
            {
              isTestTing ? "" : <div className='result'>
                <div className="title">
                  <span>Kết quả:</span>
                  <Button onClick={() => component.setState({ isTestTing: true })}>Trắc nghiệm lại</Button>
                </div>
                <div className="description">
                  <span>- <b>Thuộc nhóm: </b> SCI</span>
                  <span>- <b>Mô tả:</b> Cẩn thận, rụt rè, trầm lặng, tập trung, dễ bằng lòng, chú trọng chi tiết, mềm dẻo, thấu đáo, chính xác, điềm tĩnh, lô-gic, ngăn nắp và chính xác.</span>
                  <span>- <b>Nhóm ngành nghề: </b>Chuyên gia, chăm sóc, tâm lý, tư vấn, giao tiếp 1-1, kiên nhẫn lắng nghe, trung thực và thương lượng.</span>
                </div>
                <table cellSpacing={"3px"}>
                  <thead>
                    <tr>
                      <td></td>
                      <td><b>1</b></td>
                      <td><b>2</b></td>
                      <td><b>3</b></td>
                      <td><b>4</b></td>
                      <td><b>5</b></td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th></th>
                      <th className="red"><b>D</b></th>
                      <th className="red"><b>I</b></th>
                      <th className="red"><b>S</b></th>
                      <th className="red"><b>C</b></th>
                      <th></th>
                    </tr>
                    <tr>
                      <td><b>MOST</b></td>
                      <td>4</td>
                      <td>6</td>
                      <td>4</td>
                      <td>7</td>
                      <td>3</td>
                    </tr>
                    <tr>
                      <td><b>LEAST</b></td>
                      <td>6</td>
                      <td>4</td>
                      <td>3</td>
                      <td>3</td>
                      <td>8</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            }
            {
              isTestTing ? "" : <div className="chart">
                <StyleChart />

              </div>
            }
            {
              isTestTing ? "" : <Button className="your-job-bt" onClick={() => component.props.toggleYourJobDrawer(true)}>Công việc phù hợp</Button>
            }
            {
              isTestTing ? <Test /> : ""
            }
            <div className="your-lesson">
              <label>Những bạn thuộc nhóm tính cách SCI thường học những khoá học sau đây:</label>
              <div className="skills-page" >
                {
                  <ul>
                    {
                      sources.map((source, index) => <li className="source-item" onClick={() => component.props.history.push("/skills/1219")}>
                        <div style={{ background: "url(" + source.background + ")" }}>
                          <div>
                            <div className="reward">
                              <span>{source.lessonCount} bài</span>
                              <span>{source.documentsCount} tài liệu</span>
                            </div>
                            <span className="source-name">{source.name}</span>
                          </div>
                        </div>
                      </li>)
                    }
                  </ul>
                }
              </div>
            </div>
          </div>

        </div> : ""
      }
    </Drawer>
  )
}

const renderDISCDrawer = (component) => {
  let {
    showDISCDrawer,
    profile
  } = component.props
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
                <span className="user-name">{profile.fullName}</span>
                <span className="point">
                  <span>Điển YOOT: {profile.point}</span>
                  <img src={coin} />
                </span>
              </div>
              <Avatar aria-label="recipe" className="avatar">
                <img src={profile.avatar} style={{ width: "100%" }} />
              </Avatar>
            </div>
          </div>
          <div className="filter"></div>
          <div className="about-DISC" style={{ overflow: "scroll", background: '#f2f3f7' }}>
            <div className="banner" style={{ paddingBottom: "10px", background: '#fff', marginBottom: '10px' }}>
              <img src="https://material-ui.com/static/images/cards/paella.jpg" style={{ width: "100%" }}></img>
            </div>
            <div className="video-item">
              <p className="title danger">Video tổng quan về DISC - Bộ phong cách hành vi</p>
              <video controls>
                <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
              </video>
              <p></p>
            </div>
            <div className="video-item">
              <p className="title">Những điểm mạnh và cần cải thiện của từng nhóm:</p>
              <video controls>
                <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
              </video>
              <p className="title">Người chủng D</p>
            </div>
            <div className="video-item">
              <p className="title"></p>
              <video controls>
                <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
              </video>
              <p className="title">Người chủng I</p>
            </div>
            <div className="video-item">
              <p className="title"></p>
              <video controls>
                <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
              </video>
              <p className="title">Người chủng S</p>
            </div>
            <div className="video-item">
              <p className="title"></p>
              <video controls>
                <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
              </video>
              <p className="title">Người chủng C</p>
            </div>
          </div>

        </div> : ""
      }
    </Drawer>
  )
}

const renderYourJobDrawer = (component) => {
  let {
    showYourJobPage,
    profile
  } = component.props
  return (
    <Drawer anchor="bottom" className="job-list-drawer" open={showYourJobPage} onClose={() => component.props.toggleYourJobDrawer(false)}>
      {
        profile ? <div className="drawer-detail">
          <div className="drawer-header">
            <div className="direction" onClick={() => component.props.toggleYourJobDrawer(false)}>
              <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
              </IconButton>
              <label>Công việc phù hợp</label>
            </div>
            <div className="user-reward">
              <div className="profile">
                <span className="user-name">{profile.fullName}</span>
                <span className="point">
                  <span>Điển YOOT: {profile.point}</span>
                  <img src={coin} />
                </span>
              </div>
              <Avatar aria-label="recipe" className="avatar">
                <img src={profile.avatar} style={{ width: "100%" }} />
              </Avatar>
            </div>
          </div>
          <div className="filter">
            <input type="text" name="search" className="searchBox" placeholder="Vui lòng chọn công việc phù hợp" />
            <div className="btn-search">
              <button type="submit" className="searchBtn">
                <img src={searchBtn} />
              </button>
            </div>
          </div>
          <div style={{ overflow: "scroll", background: "#f2f3f7" }}>
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
            <YourJobs />
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
                <span className="user-name">{profile.fullName}</span>
                <span className="point">
                  <span>Điển YOOT: {profile.point}</span>
                  <img src={coin} />
                </span>
              </div>
              <Avatar aria-label="recipe" className="avatar">
                <img src={profile.avatar} style={{ width: "100%" }} />
              </Avatar>
            </div>
          </div>
          <div className="filter">

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