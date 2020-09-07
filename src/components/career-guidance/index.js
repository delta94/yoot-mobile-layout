import React from "react";
import './style.scss'
import {
  addHeaderContent,
  addFooterContent,
  toggleHeader,
  toggleFooter,
  toggleStyleTestDrawer,
  toggleYourJobDrawer,
  toggleDISCDrawer
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
import { connect } from 'react-redux'
import YourJobs from "../job-list";

const coin = require('../../assets/icon/Coins_Y.png')
const DISC = require('../../assets/icon/DISC@1x.png')
const behavior = require('../../assets/icon/Hướng nghiệp/Pesonality@1x.png')
const accordantjob = require('../../assets/icon/Hướng nghiệp/Job@1x.png')
const relatedmajor = require('../../assets/icon/Hướng nghiệp/school@1x.png')
const searchBtn = require('../../assets/icon/Find@1x.png')
const studentImg = require('../../assets/icon/Hướng nghiệp/Book.png')
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
  render() {
    return (
      <div className="career-guidance-page" >
        <div className="career-guidance-banner" onClick={() => this.setState({ showScholarDrawer: true })}>
          <img src="https://huongnghiepsongan.com/wp-content/uploads/2020/07/marci-angeles-YCF18toz3ds-unsplash.jpg" />
        </div>
        <div className="btn-action">
          <div className="item scholar-bt" onClick={() => this.setState({ showScholarDrawer: true })}>
            <img src={studentImg} />
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
  toggleDISCDrawer: (isShow) => dispatch(toggleDISCDrawer(isShow))
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
              <div className="item related-major">
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
              <div className="title">
                <span>Kết quả:</span>
                <Button>Trắc nghiệm lại</Button>
              </div>
            </div>
            {
              renderStyleChartDrawer(component)
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
          <div style={{ overflow: "scroll" }}>

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

const renderStyleChartDrawer = (component) => {
  let value = [5, 4, 3, 3]
  return (
    <div>
      {/* <svg height="210" width="500">
        <line x1="0" y1="0" x2="200" y2="200" style="stroke:rgb(255,0,0);stroke-width:2" />
      </svg> */}
      <table>
        <thead>
          <tr>
            <th><span>D</span></th>
            <th><span>I</span></th>
            <th><span>S</span></th>
            <th><span>C</span></th>
          </tr>
        </thead>
        <tbody>
          <tr><td><span>0</span></td><td><span>0</span></td><td><span>0</span></td><td><span>0</span></td></tr>
          <tr><td><span> </span></td><td><span> </span></td><td><span>1</span></td><td><span>1</span></td></tr>
          <tr><td><span>1</span></td><td><span> </span></td><td><span> </span></td><td><span> </span></td></tr>
          <tr><td><span> </span></td><td><span>1</span></td><td><span>2</span></td><td><span> </span></td></tr>
          <tr><td><span> </span></td><td><span> </span></td><td><span> </span></td><td><span>2</span></td></tr>
          <tr><td><span>2</span></td><td><span> </span></td><td><span> </span></td><td><span> </span></td></tr>
          <tr><td><span> </span></td><td><span>2</span></td><td><span>3</span></td><td><span>3</span></td></tr>
          <tr><td><span>3</span></td><td><span> </span></td><td><span> </span></td><td><span> </span></td></tr>
          <tr><td><span> </span></td><td><span>3</span></td><td><span>4</span></td><td><span>4</span></td></tr>
          <tr><td><span>4</span></td><td><span> </span></td><td><span> </span></td><td><span> </span></td></tr>
          <tr><td><span> </span></td><td><span> </span></td><td><span>5</span></td><td><span>5</span></td></tr>
          <tr><td><span>5</span></td><td><span>4</span></td><td><span> </span></td><td><span> </span></td></tr>
          <tr><td><span> </span></td><td><span> </span></td><td><span>6</span></td><td><span>6</span></td></tr>
          <tr><td><span>6</span></td><td><span>5</span></td><td><span> </span></td><td><span>7</span></td></tr>
          <tr><td><span> </span></td><td><span> </span></td><td><span>7</span></td><td><span> </span></td></tr>
          <tr><td><span>7</span></td><td><span>6</span></td><td><span> </span></td><td><span>8</span></td></tr>
          <tr><td><span>8</span></td><td><span> </span></td><td><span>8</span></td><td><span> </span></td></tr>
          <tr><td><span>9</span></td><td><span>7</span></td><td><span> </span></td><td><span>9</span></td></tr>
          <tr><td><span>10</span></td><td><span> </span></td><td><span>9</span></td><td><span> </span></td></tr>
          <tr><td><span>11</span></td><td><span>8</span></td><td><span> </span></td><td><span>10</span></td></tr>
          <tr><td><span>12</span></td><td><span> </span></td><td><span>10</span></td><td><span> </span></td></tr>
          <tr><td><span>13</span></td><td><span>9</span></td><td><span>11</span></td><td><span>11</span></td></tr>
          <tr><td><span>14</span></td><td><span> </span></td><td><span>12</span></td><td><span>12</span></td></tr>
          <tr><td><span>15</span></td><td><span>10</span></td><td><span> </span></td><td><span>13</span></td></tr>
          <tr><td><span>16</span></td><td><span>11</span></td><td><span>13</span></td><td><span> </span></td></tr>
          <tr><td><span>17</span></td><td><span>12</span></td><td><span>14</span></td><td><span>14</span></td></tr>
        </tbody>
      </table>
    </div>

  )
}