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
  toggleUserInfoFormDrawer
} from '../../actions/app'
import {
  getCareerHistory,
  getCareerTestList,
  removeCareerHistory,
} from '../../actions/career'
import {
  IconButton,
  Drawer,
  Avatar,
  Button,
  AppBar,
  Tabs,
  Tab,
} from '@material-ui/core'
import {
  ChevronLeft as ChevronLeftIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  Cancel as CancelIcon,
  Favorite as FavoriteIcon
} from '@material-ui/icons'
import StyleChart from './styleChart'
import { connect } from 'react-redux'
import YourJobs from "../job-list";
import Test from './test'
import $ from 'jquery'
import { get, post } from "../../api";
import { BUILD_YS_API, CurrentDate } from "../../constants/appSettings";
import { formatCurrency, objToQuery, showConfirm } from '../../utils/common'
import moment from 'moment'
import { CAREER_GUIDANCE_ACCESS_KEY, SKILL_ACCESS_KEY, TEST_HISTORY } from "../../constants/localStorageKeys";
import Iframe from 'react-iframe'
import Intro from './intro'
import ShowMoreText from "react-show-more-text";
import SwipeableViews from 'react-swipeable-views';



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
      selectedJobs: [],
      searchKey: "",
      userName: "",
      email: "",
      phone: "",
      searchOptions: [],
      searchOptionsSeleted: [],
      careerList: [],
      tabValue: 0,
      favorateList: [],
      favorateSchools: [],
      favorateSchoolIds: [],
      favorateOlogyIds: [],
      favorateCareerIds: []
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
    // console.log("e", message)
    if (!message || !message.action) return
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
        window.localStorage.removeItem("JOB-SELECTED")
        return
      }
      case "viewcareer": {
        this.handleOpenYourJobs()
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
      if (result && result.result == 1) {
        let careers = result.content.careers
        let jobSelectedParam = window.localStorage.getItem("JOB-SELECTED")
        let jobSelected = []
        if (jobSelectedParam && jobSelectedParam.length > 0) {
          jobSelected = JSON.parse(jobSelectedParam)
        }

        careers.map(item => {
          if (jobSelected.find(e => e.id == item.id)) {
            item.selected = true
          }
          else item.selected = false
        })
        let list = careers.filter(item => item.selected == true).concat(careers.filter(item => item.selected == false))
        this.setState({
          suggestJobs: list,
          jobSelected: jobSelected
        })
      }
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
      if (result && result.result == 1) {
        let careers = result.content.careers
        let jobSelectedParam = window.localStorage.getItem("JOB-SELECTED")
        let jobSelected = []
        if (jobSelectedParam && jobSelectedParam.length > 0) {
          jobSelected = JSON.parse(jobSelectedParam)
        }
        careers.map(item => {
          if (jobSelected.find(e => e.id == item.id)) {
            item.selected = true
          }
          else item.selected = false
        })
        this.setState({
          findedJobs: careers,
          jobSelected: jobSelected
        })
      }
    })
  }

  onJobClick(job) {
    let {
      jobSelected,
      suggestJobs,
      findedJobs,
    } = this.state
    let jobIndex = jobSelected.findIndex(item => item.id == job.id)
    if (jobIndex >= 0) {
      jobSelected = jobSelected.filter(item => item.id != job.id)
    } else {
      jobSelected.push(job)
    }
    suggestJobs.map(item => {
      if (jobSelected.find(e => e.id == item.id))
        item.selected = true
      else
        item.selected = false
    })

    findedJobs.map(item => {
      if (jobSelected.find(e => e.id == item.id))
        item.selected = true
      else
        item.selected = false
    })

    this.setState({
      jobSelected: jobSelected,
      suggestJobs: suggestJobs,
      findedJobs: findedJobs
    }, () => {
      window.localStorage.setItem("JOB-SELECTED", JSON.stringify(jobSelected))
    })
  }

  hanldeGetInfo() {
    get(BUILD_YS_API, "FormReg/GetInfoForm", result => {
      if (result && result.result == 1) {
        let profile = result.content.formReg
        this.setState({
          userName: profile.name,
          email: profile.email,
          phone: profile.phone,
          noedit: profile.noedit
        })
        window.localStorage.setItem("FORM_REG", JSON.stringify(profile))
      }
    })
  }

  handleUpdateInfo() {
    let {
      userName,
      email,
      phone
    } = this.state
    if (!userName || userName == "") {
      showConfirm("Vui lòng nhập họ và tên!", "", () => {
        $("#user-name").focus()
      }, null, <span>OK</span>, "", "user-info-form-confirm")
      return
    }
    if (!email || email == "") {
      showConfirm("Vui lòng nhập email!", "", () => {
        $("#user-email").focus()
      }, null, <span>OK</span>, "", "user-info-form-confirm")
      return
    }
    if (!phone || phone == "") {
      showConfirm("Vui lòng nhập số điện thoại!", "", () => {
        $("#user-phone").focus()
      }, null, <span>OK</span>, "", "user-info-form-confirm")
      return
    }
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.match(mailformat)) {
      showConfirm("Định dạng email không hợp lệ!", "", () => {
        $("#user-email").focus()
      }, null, <span>OK</span>, "", "user-info-form-confirm")
      return
    }
    let param = {
      "name": userName,
      "email": email,
      "phone": phone,
    }
    post(BUILD_YS_API, "FormReg/UpdateForm", param, (result) => {
      this.props.toggleUserInfoFormDrawer(false)
      this.hanldeGetInfo()
    })
  }

  onSearchOptionClick(item) {
    let {
      searchOptionsSeleted
    } = this.state
    searchOptionsSeleted.push(item)
    this.setState({
      searchOptionsSeleted: searchOptionsSeleted,
      searchOptions: [],
      searchKey: ""
    })
  }

  handleRemoveSearchOptions(index) {
    let {
      searchOptionsSeleted
    } = this.state
    searchOptionsSeleted.splice(index, 1)
    this.setState({
      searchOptionsSeleted
    })
  }

  handleGetSearchOptions() {
    post(BUILD_YS_API, "Finder/GetTagView?findtext=" + this.state.searchKey, null, result => {
      if (result && result.result == 1)
        this.setState({
          searchOptions: result.content.finders
        })
    })
  }

  handleGetCareers() {
    let {
      searchOptionsSeleted
    } = this.state
    let param = {
      careerids: null,
      finderModels: searchOptionsSeleted
    }
    if (param.finderModels.length == 0) {
      let JOB_SELECTED = window.localStorage.getItem("JOB-SELECTED")
      let careerids = []
      if (JOB_SELECTED) {
        let array = JSON.parse(JOB_SELECTED)
        if (array && array.length > 0) {
          array.map(item => careerids.push(item.id))
        }
      }
      param.careerids = careerids.length > 0 ? careerids : null
    }
    if (param.careerids == null) return
    post(BUILD_YS_API, "Ology/GetListMany", param, result => {
      if (result && result.result == 1)
        this.setState({
          careerList: result.content.careers
        })
    })
  }

  handleGetFavorateList() {
    get(BUILD_YS_API, "Ology/GetListFavorite", result => {
      if (result && result.result == 1) {
        var favorateList = result.content.careers
        this.setState({
          favorateList: favorateList,
        })
        this.handleSetFavorateIds(result.content.careers)
      }
    })
  }
  handleGetFavorateSchools() {
    get(BUILD_YS_API, "Ology/GetListFavorite", result => {
      if (result && result.result == 1) {
        var favorateSchools = result.content.careers
        this.setState({
          favorateSchools: favorateSchools
        })
        this.handleSetFavorateIds(result.content.careers)
      }
    })
  }

  handleSetFavorateIds(favorateList) {
    let favorateSchoolIds = []
    let favorateOlogyIds = []
    let favorateCareerIds = []
    favorateList.map(career => {
      if (career.ologies.length > 0) {
        career.ologies.map(ology => {
          if (ology.schools.length > 0) {
            ology.schools.map(school => {
              favorateSchoolIds.push(school.id)
              favorateOlogyIds.push(ology.id)
              favorateCareerIds.push(career.id)
            })
          }
        })
      }
    })
    this.setState({
      favorateSchoolIds: favorateSchoolIds,
      favorateOlogyIds: favorateOlogyIds,
      favorateCareerIds: favorateCareerIds
    })
  }

  submitReg(school) {
    let {
      noedit
    } = this.state
    if (noedit == 0) {
      this.setState({
        showSubmitRegNotiDrawer: true,
        currentSchool: school
      })
    }
    else {
      this.props.showUserInfoForm()
    }
  }

  handleFavoriteSchool(career, ology, school) {
    let param = {
      schoolid: school.id,
      careerid: career.id,
      ologyid: ology.id
    }
    post(BUILD_YS_API, "School/FavoriteSchool", param, result => {
      if (result && result.result == 1) {
        let {
          favorateList
        } = this.state
        favorateList.push({
          id: career.id,
          ologies: [{
            id: ology.id,
            schools: [{
              id: school.id
            }]
          }]
        })
        this.handleSetFavorateIds(favorateList)
        this.setState({
          favorateList: favorateList
        })
      }
    })
  }

  handleUnFavoriteSchool(career, ology, school) {
    let param = {
      schoolid: school.id,
      careerid: career.id,
      ologyid: ology.id
    }
    post(BUILD_YS_API, "School/UnFavoriteSchool", param, result => {
      if (result && result.result == 1) {
        let {
          favorateList
        } = this.state
        for (var i = 0; i < favorateList.length; i++) {
          if (favorateList[i].id == career.id) {
            let ologies = favorateList[i].ologies

            for (var j = 0; j < ologies.length; j++) {
              if (ologies[j].id == ology.id) {
                ologies[j].schools = ologies[j].schools.filter(item => item.id != school.id)
              }
            }
          }
        }
        this.handleSetFavorateIds(favorateList)
        this.setState({
          favorateList: favorateList
        })
      }
    })
  }

  showSchoolWebsite(school) {
    this.setState({
      currentSchool: school,
      showSchoolWebsiteDrawer: true
    })
  }

  componentDidMount() {
    this.props.addHeaderContent(renderHeader(this))
    this.props.toggleHeader(true)
    this.props.toggleFooter(false)
    this.handleGetFavorateList()
    this.props.getCareerHistory(() => {
      this.props.getCareerTestList(() => {
        this.handleGetWebSourse()
      })
    })
    this.hanldeGetInfo()

    if (window.addEventListener) {
      let that = this
      window.addEventListener('message', e => {
        if (typeof e.data == "string")
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
          {
            renderUserInfoFormDrawer(this)
          }
          {
            renderSubmitRegNotiDrawer(this)
          }
          {
            renderSchoolNewFeedDrawer(this)
          }
          {
            renderSchoolWebsiteDrawer(this)
          }
          {
            renderFavorateSchoolDrawer(this)
          }
        </div>
        <Button className="bt-submit" onClick={() => this.props.toggleUserInfoFormDrawer(true)}>Cập nhật thông tin</Button>
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
  toggleUserInfoFormDrawer: (isShow) => dispatch(toggleUserInfoFormDrawer(isShow))
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
            <div className="user-reward" onClick={() => component.props.history.push("/profile")}>
              <div className="profile">
                <span className="user-name">{profile.fullname}</span>
                <span className="point">
                  <span>Điểm YOOT: {new Intl.NumberFormat('de-DE').format(profile.mempoint)}</span>
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
              <div className="item related-major" onClick={() => {
                component.handleGetCareers()
                component.props.toggleYourMajorsDrawer(true)
              }
              }>
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
            <div className="user-reward" onClick={() => component.props.history.push("/profile")}>
              <div className="profile">
                <span className="user-name">{profile.fullname}</span>
                <span className="point">
                  <span>Điểm YOOT: {new Intl.NumberFormat('de-DE').format(profile.mempoint)}</span>
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
            <div className="user-reward" onClick={() => component.props.history.push("/profile")}>
              <div className="profile">
                <span className="user-name">{profile.fullname}</span>
                <span className="point">
                  <span>Điểm YOOT: {new Intl.NumberFormat('de-DE').format(profile.mempoint)}</span>
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
    isSearching,
    jobSelected
  } = component.state
  let {
    showYourJobPage,
    profile
  } = component.props

  return (
    <Drawer anchor="bottom" className="job-list-drawer" open={showYourJobPage} >
      {
        profile ? <div className="drawer-detail">
          <div className="drawer-header">
            <div className="direction" onClick={() => {
              component.setState({
                suggestJobs: [],
                findedJobs: [],
                jobSelected: [],
                searchKey: "",
                isSearching: false
              })
              component.props.toggleYourJobDrawer(false)
            }
            }>
              <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
              </IconButton>
              <label>Công việc</label>
            </div>
            <div className="user-reward" onClick={() => component.props.history.push("/profile")}>
              <div className="profile">
                <span className="user-name">{profile.fullname}</span>
                <span className="point">
                  <span>Điểm YOOT: {new Intl.NumberFormat('de-DE').format(profile.mempoint)}</span>
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
              <input
                type="text"
                id="search-job-input-ref"
                name="search"
                value={searchKey}
                onChange={(e) => component.setState({ searchKey: e.target.value, isSearching: true }, () => component.handleSearchJob())}
                className="searchBox" placeholder="Vui lòng chọn công việc phù hợp"
                onKeyUp={e => e.key == "Enter" ? $("#search-job-input-ref").blur() : null}
              />
              <div className="btn-search">
                <button type="submit" className="searchBtn">
                  <img src={searchBtn} />
                </button>
              </div>
            </div>
          </div>
          <div style={{ overflow: "scroll", background: "#f2f3f7" }} id="your-job-list" onScroll={() => $("#search-job-input-ref").blur()}>
            <div style={{ padding: "1px 0 10px 0", background: "white", marginBottom: "10px" }}>
              <div className="jobList-Noti">
                <div className="divContent">
                  <i class="fas fa-play"></i>
                  <p className="content">Bạn muốn tìm hiểu công việc theo nhu cầu thì nhập vào thanh tìm kiếm.</p>
                </div>
                <div className="divContent">
                  <i class="fas fa-play"></i>
                  <p className="content">Bạn muốn tìm hiểu công việc theo nhóm tính cách vui lòng thực hiện chức năng "Phong cách hành vi".</p>
                </div>
                <div className="divContent" style={{ textAlign: "center", width: "100%" }}>
                  <Button className="bt-submit width60pc" style={{ margin: "0px auto" }} onClick={() => component.props.toggleStyleTestDrawer(true)}>Phong cách hành vi</Button>
                </div>
              </div>
            </div>
            <YourJobs
              searchKey={searchKey}
              suggestJobs={suggestJobs}
              findedJobs={findedJobs}
              jobSelected={jobSelected}
              onJobClick={(job) => component.onJobClick(job)}
            />
            {/* {
              jobList.map((item, index) => item.videolinks.length > 0
                ? item.videolinks.map((video, j) => <Video videoURL={video} videoThumb={item.thumbnaillinks[j]} />)
                : <span>image</span>)
            } */}

          </div>
          <div className="footer-drawer">
            <Button onClick={() => {
              component.props.toggleYourMajorsDrawer(true)
              component.handleGetCareers()
            }}>Ngành học tương ứng</Button>
          </div>
        </div> : ""
      }
    </Drawer>
  )
}

const renderYourMajorsDrawer = (component) => {
  let {
    showYourMajorsPage,
    profile,
    careerHistory
  } = component.props
  let {
    isSearching,
    searchKey,
    searchOptions,
    searchOptionsSeleted,
    careerList,
    tabValue,
    favorateSchoolIds,
    favorateOlogyIds,
    favorateCareerIds,
    jobSelected
  } = component.state
  // console.log("favorateSchoolIds", favorateSchoolIds.includes(157))
  return (
    <Drawer anchor="bottom" className="job-list-drawer" open={showYourMajorsPage} onClose={() => component.props.toggleYourMajorsDrawer(false)}>
      {
        profile ? <div className="drawer-detail">
          <div className="drawer-header">
            <div className="direction" onClick={() => {
              component.setState({
                searchKey: "",
                isSearching: false,
                searchOptions: [],
                careerList: []
              })
              component.props.toggleYourMajorsDrawer(false)
            }}>
              <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
              </IconButton>
              <label>Ngành học</label>
            </div>
            <div className="user-reward" onClick={() => component.props.history.push("/profile")}>
              <div className="profile">
                <span className="user-name">{profile.fullname}</span>
                <span className="point">
                  <span>Điểm YOOT: {new Intl.NumberFormat('de-DE').format(profile.mempoint)}</span>
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
                  <button type="submit" className="searchBtn red" onClick={() => component.setState({ searchKey: "", isSearching: false, searchOptionsSeleted: [] }, () => component.handleSearchJob())}>
                    <ArrowBackIcon style={{ width: 20 }} />
                  </button>
                </div> : ""
              }
              <div className="search-param" style={{ display: searchOptionsSeleted.length < 2 ? "flex" : "block" }}>
                {
                  searchOptionsSeleted && searchOptionsSeleted.length > 0 && searchOptionsSeleted.map((item, index) => <div key={index} className="options-item">
                    <ShowMoreText
                      lines={1}
                      width={70}
                      more=""
                      less=""
                    >
                      <span>{item.title}</span>
                    </ShowMoreText>
                    <CancelIcon onClick={() => component.handleRemoveSearchOptions(index)} />
                  </div>)
                }
                <input type="text" className="search-job" name="search" value={searchKey} onChange={(e) => component.setState({ searchKey: e.target.value, isSearching: true }, () => component.handleGetSearchOptions())} className="searchBox" placeholder="Nhập công việc phù hợp hoặc ngành/trường học..." />
              </div>
              <div className="btn-search">
                <button type="submit" className="searchBtn" onClick={() => component.handleGetCareers()}>
                  <img src={searchBtn} />
                </button>
              </div>
              {
                searchKey && searchKey.length > 0 && searchOptions && searchOptions.length > 0 ? <div className="search-result">
                  <ul>
                    {
                      searchOptions.map((item, index) => <li key={index} onClick={() => component.onSearchOptionClick(item)}>
                        <span>{item.title}</span>
                        {
                          item.type == 1 ? <p>Công việc</p> : ""
                        }
                        {
                          item.type == 2 ? <p>Ngành học</p> : ""
                        }
                        {
                          item.type == 3 ? <p>Trường</p> : ""
                        }
                      </li>)
                    }
                    <li></li>
                  </ul>
                </div> : ""
              }
            </div>
            <div className="favoriteSchool" onClick={() => component.setState({ showFavorateSchoolDrawer: true }, () => component.handleGetFavorateSchools())}>
              <i class="fas fa-heart"></i> Trường đang quan tâm
            </div>
            {
              careerHistory ? <div className="major-noti jobList-Noti" style={{ padding: "0px 10px", width: "90%" }}>
                {
                  jobSelected && jobSelected.length > 0 ? <div className="divContent">
                    <i class="fas fa-play"></i>
                    <p className="content">Trang ngành học được hệ thống chọn lọc theo kết quả trắc nghiệm tính cách của bạn. Bạn hãy chọn những ngành học mà bạn muốn tìm hiểu nhé.</p>
                  </div> : <div className="divContent">
                      <i class="fas fa-play"></i>
                      <p className="content">Bạn vui lòng "CHỌN" vị trí công việc nào mà bạn muốn tìm hiểu, YOOT sẽ đề xuất ngành học hoặc trường học tương ứng.</p>
                    </div>
                }
              </div> : <div className="major-noti jobList-Noti" style={{ padding: "0px 10px", width: "90%" }}>
                  <div className="divContent">
                    <i class="fas fa-play"></i>
                    <p className="content">Bạn đang muốn tìm hiểu ngàn học và trường học theo nhu cầu thì nhập vào thanh tìm kiếm.</p>
                  </div>
                  <div className="divContent">
                    <i class="fas fa-play"></i>
                    <p className="content">Bạn muốn tìm hiểu ngành học và trường học theo nhóm tính cách vui lòng thực hiện chức năng "Phong cách hành vi".</p>
                  </div>
                  <div className="divContent" style={{ textAlign: "center", width: "100%" }}>
                    <Button className="bt-submit width60pc" style={{ margin: "0px auto" }} onClick={() => component.props.toggleStyleTestDrawer(true)}>Phong cách hành vi</Button>
                  </div>
                </div>
            }
            <div style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}>
              <Tabs
                value={tabValue}
                onChange={(e, value) => component.setState({ tabValue: value })}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="full width tabs example"
                className="tab-header"
              >
                {
                  careerList.map((item, index) => <Tab key={index} label={item.text} {...a11yProps(index)} className="tab-item" />)
                }
              </Tabs>
            </div>
          </div>
          <div style={{ overflow: "scroll", background: "#fff", borderTop: "1px solid rgba(0,0,0,0,1)" }}>
            {
              careerList && careerList.length > 0 ? <div className="panel" style={{ borderBottom: "1px solid #f2f3f7", width: "95%", margin: "0 auto 10px" }}>

                <SwipeableViews
                  index={tabValue}
                  onChangeIndex={(value) => component.setState({ tabValue: value })}
                  className="tab-content"
                >
                  {
                    careerList.map((item, index) => <TabPanel key={index} value={tabValue} index={index} className="content-box">
                      <div>
                        {
                          item.ologies.map((ology, i) => ology.schools.map((school, j) => <div key={j} className="shool-item">
                            <div className="school-logo" onClick={() => component.showSchoolWebsite(school)}>
                              <img src={school.logolink}></img>
                            </div>
                            <div className="shool-info">
                              <div className="info-mation">
                                <div onClick={() => component.showSchoolWebsite(school)}>
                                  <label>Ngành học: {ology.text}</label>
                                  <label>Trường: {school.name}</label>
                                  <span>Địa chỉ: {school.address}</span>
                                  <p>{school.website}</p>
                                </div>
                                {
                                  favorateSchoolIds.includes(school.id) && favorateOlogyIds.includes(ology.id) && favorateCareerIds.includes(item.id)
                                    ? <IconButton onClick={() => component.handleUnFavoriteSchool(item, ology, school)}><FavoriteIcon style={{ color: "#ff5a5a" }} /></IconButton>
                                    : <IconButton onClick={() => component.handleFavoriteSchool(item, ology, school)}><FavoriteIcon style={{ color: "#b1b2b8" }} /></IconButton>
                                }
                              </div>
                              <div className="actions">
                                <Button className="bt-submit" onClick={() => component.submitReg(school)}>Cần tư vấn</Button>
                                <Button className="bt-cancel" onClick={() => component.setState({
                                  currentSchool: school,
                                  showSchoolNewFeedDrawer: true
                                })}>Bảng tin</Button>
                              </div>
                            </div>
                          </div>))
                        }
                      </div>
                    </TabPanel>)
                  }
                </SwipeableViews>
              </div> : ""
            }
          </div>

        </div> : ""
      }
    </Drawer>
  )
}

const renderUserInfoFormDrawer = (component) => {
  let {
    showUserInfoForm,
  } = component.props
  let {
    userName,
    email,
    phone
  } = component.state
  return (
    <Drawer anchor="bottom" className="user-info-form" open={showUserInfoForm} onClose={() => component.props.toggleUserInfoFormDrawer(false)}>
      {
        <div className="user-form-content">
          <IconButton className="bt-close-modal" onClick={() => component.props.toggleUserInfoFormDrawer(false)}><CloseIcon /></IconButton>
          <p className="blued">Vui lòng cập nhật thông tin cá nhân chính xác, để nhân viên tư vấn của trường sẽ liên lạc với bạn !</p>
          <div className="form-detail">
            <div className="field">
              <label>Họ và tên:</label>
              <input placeholder="Họ và tên" id="user-name" value={userName} onChange={(e) => component.setState({ userName: e.target.value })}></input>
            </div>
            <div className="field">
              <label>Email:</label>
              <input placeholder="Email" id="user-email" value={email} onChange={(e) => component.setState({ email: e.target.value })}></input>
            </div>
            <div className="field">
              <label>Số điện thoại:</label>
              <input placeholder="Số điện thoại" id="user-phone" value={phone} onChange={(e) => component.setState({ phone: e.target.value })}></input>
            </div>
          </div>
          <Button className="bt-submit mt20 mb10" onClick={() => component.handleUpdateInfo()}>Cập nhật</Button>
        </div>
      }
    </Drawer>
  )
}

const renderSubmitRegNotiDrawer = (component) => {
  let {
    phone,
    showSubmitRegNotiDrawer,
    currentSchool
  } = component.state
  return (
    <Drawer anchor="bottom" className="user-info-form" open={showSubmitRegNotiDrawer} onClose={() => component.setState({ showSubmitRegNotiDrawer: false })}>
      {
        <div className="user-form-content">
          <IconButton className="bt-close-modal" onClick={() => component.setState({ showSubmitRegNotiDrawer: false })}><CloseIcon /></IconButton>
          <p>Đăng ký thành công</p>
          <div className="form-detail">
            <div className="field break-spaces mb15" >
              <label>Yêu cầu tư vấn của Bạn đã được chuyểnn đến bộ phận tuyển sinh của trường {currentSchool ? currentSchool.name : ""}.</label>
            </div>
            <div className="field break-spaces mb15" >
              <label>Chuyên viên tư vấn sẽ liên hệ cho Bạn trong thời gian sớm nhất qua số điện thoại <span className="blued">{phone}</span></label>
            </div>
            <div className="field break-spaces mb15" >
              <label>Vui lòng kiểm tra số điện thoại và cập nhật lại cho đúng ở mục Thông tin liên lạc nhé.</label>
            </div>
          </div>
        </div>
      }
    </Drawer>
  )
}

const renderSchoolNewFeedDrawer = (component) => {
  let {
    currentSchool,
    showSchoolNewFeedDrawer
  } = component.state
  return (
    <Drawer anchor="bottom" className="job-list-drawer" open={showSchoolNewFeedDrawer} onClose={() => component.setState({ showSchoolNewFeedDrawer: false })}>
      {
        currentSchool ? <div className="drawer-detail">
          <div className="drawer-header border-none">
            <div className="direction" onClick={() => {
              component.setState({
                currentSchool: null,
                showSchoolNewFeedDrawer: false
              })
            }}>
              <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
              </IconButton>
              <label>{currentSchool.name}</label>
            </div>
          </div>
          <div className="filter p00">

          </div>
          <div style={{ overflow: "scroll", background: "#fff", borderTop: "1px solid rgba(0,0,0,0,1)" }}>
            <img src={currentSchool.demoviewlink} style={{ width: '100%' }} />
          </div>

        </div> : ""
      }
    </Drawer>
  )
}

const renderSchoolWebsiteDrawer = (component) => {
  let {
    currentSchool,
    showSchoolWebsiteDrawer
  } = component.state
  return (
    <Drawer anchor="bottom" className="job-list-drawer" open={showSchoolWebsiteDrawer} onClose={() => component.setState({ showSchoolWebsiteDrawer: false })}>
      {
        currentSchool ? <div className="drawer-detail">
          <div className="drawer-header border-none">
            <div className="direction" onClick={() => {
              component.setState({
                currentSchool: null,
                showSchoolWebsiteDrawer: false
              })
            }}>
              <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
              </IconButton>
              <label>{currentSchool.website}</label>
            </div>
          </div>
          <div className="filter p00">
          </div>
          <div style={{ overflow: "scroll", background: "#fff", borderTop: "1px solid rgba(0,0,0,0,1)" }}>
            <Iframe url={currentSchool.website}
              width="100%"
              height={"100%"}
              display="initial"
              position="relative"
              id="school-website-iframe"
            />
          </div>

        </div> : ""
      }
    </Drawer>
  )
}

const renderFavorateSchoolDrawer = (component) => {
  let {
    profile
  } = component.props
  let {
    showFavorateSchoolDrawer,
    favorateSchools,
    favorateSchoolIds,
    favorateOlogyIds,
    favorateCareerIds
  } = component.state
  return (
    <Drawer anchor="bottom" className="job-list-drawer" open={showFavorateSchoolDrawer} onClose={() => component.setState({ showFavorateSchoolDrawer: false })}>
      {
        profile ? <div className="drawer-detail">
          <div className="drawer-header border-none">
            <div className="direction" onClick={() => {
              component.setState({
                showFavorateSchoolDrawer: false
              })
            }}>
              <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
              </IconButton>
              <label>Trường quan tâm</label>
            </div>
            <div className="user-reward" onClick={() => component.props.history.push("/profile")}>
              <div className="profile">
                <span className="user-name">{profile.fullname}</span>
                <span className="point">
                  <span>Điểm YOOT: {new Intl.NumberFormat('de-DE').format(profile.mempoint)}</span>
                </span>
              </div>
              <Avatar aria-label="recipe" className="avatar">
                <div className="img" style={{ background: `url("${profile.avatar}")` }} />
              </Avatar>
            </div>
          </div>
          <div className="filter p00">
          </div>
          <div style={{ overflow: "scroll", background: "#fff", borderTop: "1px solid rgba(0,0,0,0,1)" }}>
            {
              favorateSchools.map((item, index) => item.ologies.map((ology, i) => ology.schools.map((school, j) => <div key={j} className="shool-item">
                <div className="school-logo" onClick={() => component.showSchoolWebsite(school)}>
                  <img src={school.logolink}></img>
                </div>
                <div className="shool-info">
                  <div className="info-mation">
                    <div onClick={() => component.showSchoolWebsite(school)}>
                      <label>Ngành học: {ology.text}</label>
                      <label>Trường: {school.name}</label>
                      <span>Địa chỉ: {school.address}</span>
                      <p>{school.website}</p>
                    </div>
                    {
                      favorateSchoolIds.includes(school.id) && favorateOlogyIds.includes(ology.id) && favorateCareerIds.includes(item.id)
                        ? <IconButton onClick={() => component.handleUnFavoriteSchool(item, ology, school)}><FavoriteIcon style={{ color: "#ff5a5a" }} /></IconButton>
                        : <IconButton onClick={() => component.handleFavoriteSchool(item, ology, school)}><FavoriteIcon style={{ color: "#b1b2b8" }} /></IconButton>
                    }
                  </div>
                  <div className="actions">
                    <Button className="bt-submit" onClick={() => component.submitReg(school)}>Cần tư vấn</Button>
                    <Button className="bt-cancel" onClick={() => component.setState({
                      currentSchool: school,
                      showSchoolNewFeedDrawer: true
                    })}>Bảng tin</Button>
                  </div>
                </div>
              </div>)))
            }
          </div>

        </div> : ""
      }
    </Drawer>
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