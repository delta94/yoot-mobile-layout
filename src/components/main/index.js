import React from "react";
import { Route, Switch } from "react-router";
import Home from "../home";
import YootNoti from '../yoot-noti'
import Profile from '../profile-page'
import Setting from '../setting'
import Poster from '../poster'
import UserPage from '../user-page'
import Community from '../community'
import Videos from '../videos'
import Groups from '../groups'
import CommunityNoti from '../community-noti'
import Skills from '../skills'
import SourceItem from '../skills/source-item'
import SourceNoti from '../skill-noti'
import Exercise from '../skills/exercise'
import Assess from '../skills/assess'
import CareerGuidance from '../career-guidance'
import "./style.scss";
import { connect } from 'react-redux'
import {
  Avatar,
  Drawer,
  IconButton,
  AppBar,
  Tabs,
  Tab,
  Button,
  TextField,
  InputAdornment,
  Radio
} from '@material-ui/core'
import {
  ChevronLeft as ChevronLeftIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon
} from '@material-ui/icons'
import {
  toggleUserDetail,
  toggleFindFriendDrawer,
  toggleFriendDrawer,
  togglePostDrawer,
  toggleMediaViewerDrawer,
  toggleUserPageDrawer,
  toggleReportDrawer,
  toggleGroupDrawer,
  toggleCreateGroupDrawer,
  toggleGroupInviteDrawer
} from '../../actions/app'
import {
  setCurrenUserDetail,
  setUserProfile,
  getFolowedMe,
  getMeFolowing
} from '../../actions/user'
import {
  GroupPrivacies
} from '../../constants/constants'
import SwipeableViews from 'react-swipeable-views';
import moment from 'moment'
import Slider from "react-slick";
import Dropzone from 'react-dropzone'
import { objToArray, showNotification } from "../../utils/common";
import { get } from "../../api";
import { SOCIAL_NET_WORK_API } from "../../constants/appSettings";

const coin = require('../../assets/icon/Coins_Y.png')
const search = require('../../assets/icon/Find@1x.png')
const like1 = require('../../assets/icon/like1@1x.png')
const likeActive = require('../../assets/icon/like@1x.png')
const comment = require('../../assets/icon/comment1@1x.png')
const share = require('../../assets/icon/share1@1x.png')
const report = require('../../assets/icon/report@1x.png')
const block = require('../../assets/icon/block@1x.png')
const unfollow = require('../../assets/icon/unfollow@1x.png')
const unfriend = require('../../assets/icon/unfriend@1x.png')
const NewGr = require('../../assets/icon/NewGr@1x.png')


class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userDetailFolowTabIndex: 0,
      searchKey: "",
      friendTabIndex: 0,
      groupTabIndex: 0,
      groupPrivacy: GroupPrivacies.Public
    }
  }

  getProfile() {
    get(SOCIAL_NET_WORK_API, "User/Index?forFriendId=0", result => {
      if (result.result == 1) {
        this.props.setUserProfile(result.content.user)
        this.props.getFolowedMe(0)
        this.props.getMeFolowing(0)
      } else {
        showNotification("", <span className="app-noti-message">{result.message}</span>, null)
      }

    })
  }

  componentWillMount() {
    this.getProfile()
  }
  render() {
    let {
      userDetailFolowTabIndex
    } = this.state
    let {
      showHeader,
      showFooter,
      profile,
      headerContent,
      footerContent,
    } = this.props

    return (
      <div className="wrapper">
        <div className={"fix-header " + (showHeader ? "showed" : "hided") + (window.location.pathname == '/videos' ? " dask-mode" : "")} >
          <div className="direction">
            {headerContent}
          </div>
          {
            profile ? <div className="user-reward">
              <div className="profile">
                <span className="user-name">{profile.fullname}</span>
                <span className="point">
                  <span>Điển YOOT: {profile.mempoint}</span>
                  <img src={coin} />
                </span>
              </div>
              <Avatar aria-label="recipe" className="avatar">
                <img src={profile.avatar} style={{ width: "100%" }} />
              </Avatar>
            </div> : ""
          }
        </div>
        <main className="content-main" style={{ marginTop: (showHeader ? "60px" : "0px"), marginBottom: showFooter ? "70px" : "0px" }}>
          <Switch >
            <Route exact path="/" component={Home} />
            <Route exact path="/yoot-noti" component={YootNoti} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/setting" component={Setting} />
            <Route exact path="/community" component={Community} />
            <Route exact path="/videos" component={Videos} />
            <Route exact path="/groups" component={Groups} />
            <Route exact path="/communiti-profile" component={Profile} />
            <Route exact path="/community-noti" component={CommunityNoti} />
            <Route exact path="/skills" component={Skills} />
            <Route exact path="/skills/:sourceId" component={SourceItem} />
            <Route exact path="/skills/1219/exercise" component={Exercise} />
            <Route exact path="/skills/1219/assess" component={Assess} />
            <Route exact path="/skills-noti" component={SourceNoti} />
            <Route exact path="/career-guidance" component={CareerGuidance} />

          </Switch>
        </main>
        <div className={"fix-footer " + (showFooter ? "showed" : "hided")} >
          {footerContent}
        </div>



        <Poster history={this.props.history} />
        {
          renderUserPageDrawer(this)
        }
        {
          renderUserDetailDrawer(this)
        }
        {
          renderFriendDrawer(this)
        }
        {
          renderFindFriendDrawer(this)
        }
        {
          renderMediaViewer(this)
        }
        {
          renderMediaViewerMenu(this)
        }
        {
          renderReportDrawer(this)
        }
        {
          renderGroupDrawer(this)
        }
        {
          renderCreateGroupDrawer(this)
        }
        {
          renderGroupPrivacyMenuDrawer(this)
        }
        {
          renderGroupInviteDrawer(this)
        }
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
  toggleUserPageDrawer: (isShow) => dispatch(toggleUserPageDrawer(isShow)),
  toggleUserDetail: (isShow) => dispatch(toggleUserDetail(isShow)),
  toggleFindFriendDrawer: (isShow) => dispatch(toggleFindFriendDrawer(isShow)),
  toggleFriendDrawer: (isShow) => dispatch(toggleFriendDrawer(isShow)),
  togglePostDrawer: (isShow) => dispatch(togglePostDrawer(isShow)),
  toggleMediaViewerDrawer: (isShow, feature) => dispatch(toggleMediaViewerDrawer(isShow, feature)),
  toggleReportDrawer: (isShow) => dispatch(toggleReportDrawer(isShow)),
  toggleGroupDrawer: (isShow) => dispatch(toggleGroupDrawer(isShow)),
  toggleCreateGroupDrawer: (isShow) => dispatch(toggleCreateGroupDrawer(isShow)),
  toggleGroupInviteDrawer: (isShow) => dispatch(toggleGroupInviteDrawer(isShow)),
  setUserProfile: (user) => dispatch(setUserProfile(user)),
  getFolowedMe: (currentpage) => dispatch(getFolowedMe(currentpage)),
  getMeFolowing: (currentpage) => dispatch(getMeFolowing(currentpage))

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);


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

const renderUserDetailDrawer = (component) => {
  let {
    userDetailFolowTabIndex
  } = component.state
  let {
    showUserDetail,
    userDetail,
    profile
  } = component.props
  console.log("profile", profile)
  return (
    <Drawer anchor="bottom" className="drawer-detail" open={showUserDetail} onClose={() => component.props.toggleUserDetail(false)}>
      {
        profile ? <div className="drawer-detail">
          <div className="drawer-header">
            <div className="direction" onClick={() => component.props.toggleUserDetail(false)}>
              <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
              </IconButton>
              <label>Trang cá nhân</label>
            </div>
            <div className="user-reward">
              <div className="profile">
                <span className="user-name">{profile.fullname}</span>
                <span className="point">
                  <span>Điển YOOT: {profile.mempoint}</span>
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
            <AppBar position="static" color="default" className={"custom-tab"}>
              <Tabs
                value={userDetailFolowTabIndex}
                onChange={(e, value) => component.setState({ userDetailFolowTabIndex: value })}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="full width tabs example"
                className="tab-header"
              >
                <Tab label={"Người theo dõi " + (profile.foloweds ? ("(" + profile.foloweds.length + ")") : "")} {...a11yProps(0)} className="tab-item" />
                <Tab label={"Đang theo dõi " + (profile.folowings ? ("(" + profile.folowings.length + ")") : "")} {...a11yProps(1)} className="tab-item" />
              </Tabs>
            </AppBar>
            <SwipeableViews
              index={userDetailFolowTabIndex}
              onChangeIndex={(value) => component.setState({ userDetailFolowTabIndex: value })}
              className="tab-content"
            >
              <TabPanel value={userDetailFolowTabIndex} index={0} className="content-box">
                <div className="folowed-list">
                  {
                    profile.foloweds && profile.foloweds.length > 0 ? <ul>
                      {
                        profile.foloweds.map((item, index) => <li className="small-user-layout" key={index}>
                          <Avatar aria-label="recipe" className="avatar">
                            <img src={item.friendavatar} style={{ width: "100%" }} />
                          </Avatar>
                          <span className="user-name">{item.friendname}</span>
                          <Button style={{ background: "#f44645", color: "#fff" }}>Theo dõi</Button>
                        </li>)
                      }
                    </ul> : <span className="list-empty-message">Chưa có ai theo dõi</span>
                  }
                </div>
              </TabPanel>
              <TabPanel value={userDetailFolowTabIndex} index={1} >
                <div className="folowing-list">
                  {
                    profile.folowings && profile.folowings.length > 0 ? <ul>
                      {
                        profile.folowings.map((item, index) => <li className="small-user-layout" key={index}>
                          <Avatar aria-label="recipe" className="avatar">
                            <img src={item.friendavatar} style={{ width: "100%" }} />
                          </Avatar>
                          <span className="user-name">{item.friendname}</span>
                          <Button style={{ background: "rgba(0,0,0,0.05)" }}>Bỏ theo dõi</Button>
                        </li>)
                      }
                    </ul> : <span className="list-empty-message">Chưa theo dõi bất kì ai</span>
                  }
                </div>
              </TabPanel>
            </SwipeableViews>
            {/* <div className="job-reward info-box">
              <label>Công việc</label>
              {
                userDetail.jobs[0] ? <span>Từng làm tại <b>{userDetail.jobs[0].position}</b> tại <b>{userDetail.jobs[0].company}</b></span> : "-/-"
              }
              {
                userDetail.jobs[0] ? <p>{userDetail.jobs[0].description}</p> : "-/-"
              }
            </div>
            {
              userDetail.studies[0] ? <div className="job-reward info-box">
                <label>Học vấn</label>
                <span>Từng học <b>{userDetail.studies[0].majors}</b> tại <b>{userDetail.studies[0].school}</b></span>
                <span><b>Mã hớp: </b>{userDetail.studies[0].className}</span>
                <span><b>Loại tốt nghiệp: </b>{userDetail.studies[0].graduate}</span>
              </div> : ""
            }
            <div className="job-reward info-box">
              <label>Sống tại</label>
              <span>{userDetail.address}</span>
            </div>
            <div className="job-reward info-box">
              <label>Thông tin liên hệ</label>
              <span className="email">{userDetail.email}</span>
            </div>
            <div className="job-reward info-box">
              <label>Thông tin cơ bản</label>
              <ul>
                <li>
                  <label>{userDetail.gender}</label>
                  <span>Giới tính</span>
                </li>
                <li>
                  <label>{moment(userDetail.birthday).format("D [tháng] M, YYYY")}</label>
                  <span>Ngày sinh</span>
                </li>
              </ul>
            </div>
            <div className="job-reward info-box">
              <label>Kỹ năng & sở trường</label>
              <ul>
                <li>
                  <label>Kỹ năng</label>
                  <span>-/-</span>
                </li>
                <li>
                  <label>Sở trường</label>
                  <span>-/-</span>
                </li>
              </ul>
            </div>
            <div className="job-reward info-box">
              <label>Đang theo dõi <span>Xem tất cả</span></label>
            </div> */}
          </div>

        </div> : ""
      }
    </Drawer>
  )
}

const renderUserPageDrawer = (component) => {
  let {
    showUserPage,
    userDetail,
  } = component.props

  console.log("userDetail", userDetail)

  return (
    <Drawer anchor="bottom" className="user-page-drawer" open={showUserPage} onClose={() => component.props.toggleUserPageDrawer(false)}>
      {
        userDetail ? <div className="drawer-detail">
          <div className="drawer-header">
            <div className="direction" onClick={() => component.props.toggleUserPageDrawer(false)}>
              <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
              </IconButton>
              <label>Trang cá nhân</label>
            </div>
            <div className="user-reward">
              <div className="profile">
                <span className="user-name">{userDetail.fullname}</span>
                <span className="point">
                  <span>Điển YOOT: {userDetail.point}</span>
                  <img src={coin} />
                </span>
              </div>
              <Avatar aria-label="recipe" className="avatar">
                <img src={userDetail.avatar} style={{ width: "100%" }} />
              </Avatar>
            </div>
          </div>
          <div className="filter"></div>
          <div style={{ overflow: "scroll" }}>
            {/* <UserPage userDetail={userDetail} /> */}
          </div>

        </div> : ""
      }
    </Drawer>
  )
}

const renderFriendDrawer = (component) => {
  let {
    searchKey,
    friendTabIndex
  } = component.state
  let {
    showFriendDrawer,
  } = component.props
  const friends = [
    {
      fullName: "Bảo Ngọc",
      avatar: "https://pajulahti.com/wp-content/uploads/2017/04/500x500.jpeg"
    },
    {
      fullName: "Nguyễn Thị Lê Dân",
      avatar: "https://gigamall.vn/data/2019/05/06/10385426_logo-bobapop-500x500.jpg"
    },
    {
      fullName: "Đặng Lê Trúc Linh",
      avatar: "https://gigamall.vn/data/2019/09/03/16244113_LOGO-ADOI-500x500.jpg"
    },
    {
      fullName: "Bảo Ngọc",
      avatar: "https://pajulahti.com/wp-content/uploads/2017/04/500x500.jpeg"
    },
    {
      fullName: "Nguyễn Thị Lê Dân",
      avatar: "https://gigamall.vn/data/2019/05/06/10385426_logo-bobapop-500x500.jpg"
    },
    {
      fullName: "Đặng Lê Trúc Linh",
      avatar: "https://gigamall.vn/data/2019/09/03/16244113_LOGO-ADOI-500x500.jpg"
    },
    {
      fullName: "Bảo Ngọc",
      avatar: "https://pajulahti.com/wp-content/uploads/2017/04/500x500.jpeg"
    },
    {
      fullName: "Nguyễn Thị Lê Dân",
      avatar: "https://gigamall.vn/data/2019/05/06/10385426_logo-bobapop-500x500.jpg"
    },
    {
      fullName: "Đặng Lê Trúc Linh",
      avatar: "https://gigamall.vn/data/2019/09/03/16244113_LOGO-ADOI-500x500.jpg"
    }
  ]
  return (
    <Drawer anchor="bottom" className="friend-drawer" open={showFriendDrawer} onClose={() => component.props.toggleFriendDrawer(false)}>
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.props.toggleFriendDrawer(false)}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Tìm kiếm bạn bè</label>
          </div>
        </div>
        <div className="filter">
          <TextField
            variant="outlined"
            placeholder="Nhập tên bạn bè để tìm kiếm"
            className="search-box"
            style={{
              width: "calc(100% - 20px",
              margin: "0px 0px 10px 10px",
            }}
            disabled
            value={""}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={search} />
                </InputAdornment>
              ),
            }}
            onClick={() => component.props.toggleFindFriendDrawer(true)}
          />
          <AppBar position="static" color="default" className={"custom-tab mb10"}>
            <Tabs
              value={friendTabIndex}
              onChange={(e, value) => component.setState({ friendTabIndex: value })}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="full width tabs example"
              className="tab-header"
            >
              <Tab label="Gợi ý" {...a11yProps(0)} className="tab-item" />
              <Tab label="Lời mời" {...a11yProps(1)} className="tab-item" />
              <Tab label="Đã gửi" {...a11yProps(2)} className="tab-item" />
              <Tab label="bạn bè" {...a11yProps(3)} className="tab-item" />
            </Tabs>
          </AppBar>
        </div>
        <div className="content-form" style={{ overflow: "scroll", width: "100vw" }} >
          <SwipeableViews
            index={friendTabIndex}
            onChangeIndex={(value) => this.setState({ friendTabIndex: value })}
            className="tab-content"
          >
            <TabPanel value={friendTabIndex} index={0} className="content-box">
              <div className="friend-list" style={{ height: "2000px" }}>
                <ul>
                  {
                    friends.map((item, index) => <li key={index} className="friend-layout">
                      <div>
                        <Avatar aria-label="recipe" className="avatar">
                          <img src={item.avatar} style={{ width: "100%" }} />
                        </Avatar>
                      </div>
                      <div className="info-action">
                        <label>{item.fullName}</label>
                        <div className="action">
                          <Button className="bt-submit">Kết bạn</Button>
                          <Button className="bt-cancel">Gỡ bỏ</Button>
                        </div>
                      </div>
                    </li>)
                  }
                </ul>
              </div>
            </TabPanel>
            <TabPanel value={friendTabIndex} index={1} style={{ height: "2000px" }}>
              <div className="friend-list" style={{ height: "2000px" }}>
                <ul>
                  {
                    friends.map((item, index) => <li key={index} className="friend-layout">
                      <div>
                        <Avatar aria-label="recipe" className="avatar">
                          <img src={item.avatar} style={{ width: "100%" }} />
                        </Avatar>
                      </div>
                      <div className="info-action">
                        <label>{item.fullName}</label>
                        <div className="action">
                          <Button className="bt-submit">Đồng ý</Button>
                          <Button className="bt-cancel">Từ chối</Button>
                        </div>
                      </div>
                    </li>)
                  }
                </ul>
              </div>
            </TabPanel>
            <TabPanel value={friendTabIndex} index={2} className="content-box">
              <div className="friend-list" style={{ height: "2000px" }}>
                <ul>
                  {
                    friends.map((item, index) => <li key={index} className="friend-layout">
                      <div>
                        <Avatar aria-label="recipe" className="avatar">
                          <img src={item.avatar} style={{ width: "100%" }} />
                        </Avatar>
                      </div>
                      <div className="info-action">
                        <label>{item.fullName}</label>
                        <div className="action">
                          <Button className="bt-submit">Huỷ yêu cầu</Button>
                        </div>
                      </div>
                    </li>)
                  }
                </ul>
              </div>
            </TabPanel>
            <TabPanel value={friendTabIndex} index={3} style={{ height: "2000px" }}>
              <div className="friend-list" style={{ height: "2000px" }}>
                <ul>
                  {
                    friends.map((item, index) => <li key={index} className="friend-layout">
                      <div>
                        <Avatar aria-label="recipe" className="avatar">
                          <img src={item.avatar} style={{ width: "100%" }} />
                        </Avatar>
                      </div>
                      <div className="info-action">
                        <label>{item.fullName}</label>
                        <div className="action">
                          <Button className="bt-submit">Xoá bạn</Button>
                        </div>
                      </div>
                    </li>)
                  }
                </ul>
              </div>
            </TabPanel>
          </SwipeableViews>
        </div>
      </div>
    </Drawer>
  )
}

const renderFindFriendDrawer = (component) => {
  let {
    showFindFriendDrawer,
  } = component.props
  const friends = [
    {
      fullName: "Bảo Ngọc",
      avatar: "https://pajulahti.com/wp-content/uploads/2017/04/500x500.jpeg"
    },
    {
      fullName: "Nguyễn Thị Lê Dân",
      avatar: "https://gigamall.vn/data/2019/05/06/10385426_logo-bobapop-500x500.jpg"
    },
    {
      fullName: "Đặng Lê Trúc Linh",
      avatar: "https://gigamall.vn/data/2019/09/03/16244113_LOGO-ADOI-500x500.jpg"
    },
    {
      fullName: "Bảo Ngọc",
      avatar: "https://pajulahti.com/wp-content/uploads/2017/04/500x500.jpeg"
    },
    {
      fullName: "Nguyễn Thị Lê Dân",
      avatar: "https://gigamall.vn/data/2019/05/06/10385426_logo-bobapop-500x500.jpg"
    },
    {
      fullName: "Đặng Lê Trúc Linh",
      avatar: "https://gigamall.vn/data/2019/09/03/16244113_LOGO-ADOI-500x500.jpg"
    },
    {
      fullName: "Bảo Ngọc",
      avatar: "https://pajulahti.com/wp-content/uploads/2017/04/500x500.jpeg"
    },
    {
      fullName: "Nguyễn Thị Lê Dân",
      avatar: "https://gigamall.vn/data/2019/05/06/10385426_logo-bobapop-500x500.jpg"
    },
    {
      fullName: "Đặng Lê Trúc Linh",
      avatar: "https://gigamall.vn/data/2019/09/03/16244113_LOGO-ADOI-500x500.jpg"
    }
  ]
  return (
    <Drawer anchor="bottom" className="find-friends" open={showFindFriendDrawer} onClose={() => component.props.toggleFindFriendDrawer(false)}>
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.props.toggleFindFriendDrawer(false)}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Tìm bạn bè</label>
          </div>
        </div>
        <div className="filter">
          <TextField
            variant="outlined"
            placeholder="Nhập tên bạn bè để tìm kiếm"
            className="search-box"
            style={{
              width: "calc(100% - 20px",
              margin: "0px 0px 10px 10px",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={search} />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div style={{ overflow: "scroll", width: "100vw" }}>
          <div className="friend-list" style={{ height: "2000px" }}>
            <ul>
              {
                friends.map((item, index) => <li key={index} className="friend-layout">
                  <div className="friend-info">
                    <Avatar aria-label="recipe" className="avatar">
                      <img src={item.avatar} style={{ width: "100%" }} />
                    </Avatar>
                    <label>{item.fullName}</label>
                  </div>
                  <div className="action">
                    <Button className="bt-submit">Kết bạn</Button>
                  </div>
                </li>)
              }
            </ul>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

const renderMediaViewer = (component) => {
  let {
    showMediaViewerDrawer,
    mediaViewerFeature,
    mediaToView
  } = component.props
  let {
    isHideMediaHeadFoot
  } = component.state

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <Drawer anchor="bottom" className="media-viewer" open={showMediaViewerDrawer} onClose={() => component.props.toggleMediaViewerDrawer(false)}>
      <div className="viewer-content" >
        <div className={"viewer-header " + (isHideMediaHeadFoot ? "hide" : "")}>
          <IconButton onClick={() => {
            setTimeout(() => {
              component.setState({
                isHideMediaHeadFoot: false
              })
            }, 1000);
            component.props.toggleMediaViewerDrawer(false)
          }}><CloseIcon /></IconButton>
          {
            mediaViewerFeature ? <IconButton onClick={(e) => component.setState({ showMediaViewerMenu: true })}>
              <MoreVertIcon />
            </IconButton> : ""
          }
        </div>
        <div className="viewer-detail" onClick={() => component.setState({ isHideMediaHeadFoot: !isHideMediaHeadFoot })}>
          {
            mediaToView && mediaToView.medias && mediaToView.medias.length > 0 ? <Slider {...settings}>
              {
                mediaToView.medias.map((item, index) => <div key={index}>
                  {
                    item.type == "video" ? <video controls={true} autoPlay={true}>
                      <source src={item.url} type="video/mp4"></source>
                    </video> : <img src={item.url} />
                  }
                </div>)
              }
            </Slider> : ""
          }
        </div>
        {
          mediaViewerFeature && mediaViewerFeature.showInfo ? <div className={"viewer-footer " + (isHideMediaHeadFoot ? "hide" : "")}>
            <div className="footer-infor">
              <div className="user-info">
                {
                  mediaToView ? <span>{mediaToView.userName}</span> : ""
                }
              </div>
              <div className="post-content">
                {
                  mediaToView ? <pre>{mediaToView.content}</pre> : ""
                }
              </div>
              <div className="post-time">
                {
                  mediaToView ? <span>{moment(mediaToView.time).format("DD/MM/YYYY hh:mm")}</span> : ""
                }
              </div>
            </div>
            <div className="footer-reward">
              <ul>
                <li>
                  <img src={likeActive} />
                  <span>{mediaToView ? mediaToView.likeCount : 0}</span>
                </li>
                <li>
                  <span>{mediaToView ? mediaToView.commentCount : 0} bình luận</span>
                </li>
              </ul>
            </div>
            <div className="footer-action">
              <ul>
                <li>
                  <Button>
                    <img src={like1} />
                    <span>Thích</span>
                  </Button>
                </li>
                <li>
                  <Button>
                    <img src={comment} />
                    <span>Bình luận</span>
                  </Button>
                </li>
                <li>
                  <Button>
                    <img src={share} />
                    <span>Chia sẻ</span>
                  </Button>
                </li>
              </ul>
            </div>
          </div> : ""
        }
      </div>
    </Drawer>
  )
}

const renderMediaViewerMenu = (component) => {
  let {
    showMediaViewerMenu
  } = component.state
  let {
    mediaViewerFeature,
  } = component.props

  return (
    <Drawer anchor="bottom" className="media-viewer-menu" open={showMediaViewerMenu} onClose={() => component.setState({ showMediaViewerMenu: false })}>
      <div className="menu-content">
        <div className="menu-header">
          <div className="direction" onClick={() => component.setState({ showMediaViewerMenu: false })}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Tác vụ</label>
          </div>
        </div>
        {
          mediaViewerFeature ? <div className="menu-list">
            <ul>
              {
                mediaViewerFeature.canDownload ? <li>
                  <Button><span>Lưu vào điện thoại</span></Button>
                </li> : ""
              }
            </ul>
          </div> : ""
        }
      </div>
    </Drawer>
  )
}

const renderReportDrawer = (component) => {

  let {
    showReportDrawer
  } = component.props
  let {
    reActionSelected
  } = component.state

  return (
    <Drawer anchor="bottom" className="report-drawer" open={showReportDrawer} onClose={() => component.props.toggleReportDrawer(false)}>
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.props.toggleReportDrawer(false)}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Báo cáo bài đăng</label>
          </div>
        </div>
        <div className="filter">
        </div>
        <div className="content-form" style={{ overflow: "scroll", width: "100vw" }} >
          <div>
            <img src={report} />
            <label>Bạn thấy bài đăng này có dấu hiệu nào dưới đây?</label>
            <div className="reason-box">
              <ul>
                <li><Button>Hoạt động tình dục</Button></li>
                <li><Button>Quảng bá và bán hàng trái phép</Button></li>
                <li><Button>Tự tử, tự gây thương tích</Button></li>
                <li><Button>Dấu hiệu bạo động</Button></li>
                <li><Button>Ngược đãi động vật</Button></li>
                <li><Button>Lạm dụng trẻ em</Button></li>
                <li><Button>Lừa đảo</Button></li>
                <li><Button>Chửi rủa</Button></li>
                <li><Button>Spam</Button></li>
                <li><Button>Khủng bố</Button></li>
              </ul>
              <div>
                <TextField
                  className="order-reason"
                  variant="outlined"
                  placeholder="Khác (Ghi tối đa 20 chữ)"
                  style={{
                    width: "100%",
                    marginBottom: "10px",
                  }}
                  multiline
                />
              </div>
            </div>
          </div>
          <div className="re-action">
            <label>Bạn có muốn?</label>
            <ul>
              <li>
                <img src={block} />
                <div>
                  <label>Chặn hoàng hải long</label>
                  <span>Bạn và người này sẽ không nhìn thấy bài đăng và liên hệ với nhau.</span>
                </div>
                <Radio
                  checked={reActionSelected == "block"}
                  onChange={(e) => component.setState({ reActionSelected: e.target.value })}
                  value="block"
                />
              </li>
              <li>
                <img src={unfollow} />
                <div>
                  <label>Bỏ theo dõi hoàng hải long</label>
                  <span>Bạn sẽ không nhìn thấy những bài đăng từ người này nhưng vẫn là bạn bè của nhau.</span>
                </div>
                <Radio
                  checked={reActionSelected == "unfollow"}
                  onChange={(e) => component.setState({ reActionSelected: e.target.value })}
                  value="unfollow"
                />
              </li>
              <li>
                <img src={unfriend} />
                <div>
                  <label>Huỷ kết bạn hoàng hải long</label>
                  <span>Hai bạn không còn trong danh sách bạn bè của nhau trên YOOT.</span>
                </div>
                <Radio
                  checked={reActionSelected == "unfriend"}
                  onChange={(e) => component.setState({ reActionSelected: e.target.value })}
                  value="unfriend"
                />
              </li>
            </ul>
            <Button className="bt-submit">Báo cáo</Button>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

const renderGroupDrawer = (component) => {

  let {
    showGroupDrawer
  } = component.props
  let {
    groupTabIndex
  } = component.state

  return (
    <Drawer anchor="bottom" className="group-drawer" open={showGroupDrawer} onClose={() => component.props.toggleGroupDrawer(false)}>
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.props.toggleGroupDrawer(false)}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Nhóm đã tham gia</label>
          </div>
          <div className="submit-bt" onClick={() => component.props.toggleCreateGroupDrawer(true)}>
            <img src={NewGr} />
            <span>Tạo nhóm</span>
          </div>
        </div>
        <div className="filter">
          <AppBar position="static" color="default" className={"custom-tab"}>
            <Tabs
              value={groupTabIndex}
              onChange={(e, value) => component.setState({ groupTabIndex: value })}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="full width tabs example"
              className="tab-header"
            >
              <Tab label="Nhóm đã tham gia" {...a11yProps(0)} className="tab-item" />
              <Tab label="Nhóm đang quản lí" {...a11yProps(1)} className="tab-item" />
            </Tabs>
          </AppBar>
        </div>
        <div className="content-form" style={{ overflow: "scroll", width: "100vw" }} >
          <SwipeableViews
            index={groupTabIndex}
            onChangeIndex={(value) => this.setState({ groupTabIndex: value })}
            className="tab-content"
          >
            <TabPanel value={groupTabIndex} index={0} className="content-box">
              <div className="top-groups">
                {
                  groups.map((item, key) => <div className="group-item" key={key} style={{ background: "url(" + item.coverImage + ")" }}>
                    <div className="group-info">
                      <Avatar aria-label="recipe" className="avatar">
                        <img src={item.groupAvatar} style={{ width: "100%" }} />
                      </Avatar>
                      <span className="group-name">{item.groupName}</span>
                    </div>
                    <span className="posted">{item.posted} bài đăng</span>
                    <div className="members-list">
                      <span className="total">Thành viên: {item.members.length}</span>
                      <div className="member-avatar">
                        {
                          item.members.map((item, index) => index < 2 && <Avatar aria-label="recipe" className="avatar">
                            <img src={item.avatar} style={{ width: "100%" }} />
                          </Avatar>
                          )
                        }
                        {
                          item.members.length > 2 ? < Avatar aria-label="recipe" className="avatar">
                            +{item.members.length - 2}
                          </Avatar> : ""
                        }
                      </div>
                    </div>
                  </div>)
                }
              </div>
            </TabPanel>
            <TabPanel value={groupTabIndex} index={1} >
              <div className="top-groups">
                {
                  groups.map((item, key) => <div className="group-item" key={key} style={{ background: "url(" + item.coverImage + ")" }}>
                    <div className="group-info">
                      <Avatar aria-label="recipe" className="avatar">
                        <img src={item.groupAvatar} style={{ width: "100%" }} />
                      </Avatar>
                      <span className="group-name">{item.groupName}</span>
                    </div>
                    <span className="posted">{item.posted} bài đăng</span>
                    <div className="members-list">
                      <span className="total">Thành viên: {item.members.length}</span>
                      <div className="member-avatar">
                        {
                          item.members.map((item, index) => index < 2 && <Avatar aria-label="recipe" className="avatar">
                            <img src={item.avatar} style={{ width: "100%" }} />
                          </Avatar>
                          )
                        }
                        {
                          item.members.length > 2 ? < Avatar aria-label="recipe" className="avatar">
                            +{item.members.length - 2}
                          </Avatar> : ""
                        }
                      </div>
                    </div>
                  </div>)
                }
              </div>
            </TabPanel>
          </SwipeableViews>
        </div>
      </div>
    </Drawer>
  )
}

const renderCreateGroupDrawer = (component) => {

  let {
    showCreateGroupDrawer,

  } = component.props
  let {
    groupCoverImage,
    groupPrivacy
  } = component.state

  return (
    <Drawer anchor="bottom" className="create-group-drawer" open={showCreateGroupDrawer} onClose={() => component.props.toggleCreateGroupDrawer(false)}>
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.props.toggleCreateGroupDrawer(false)}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Tạo nhóm</label>
          </div>
          <Button className="bt-submit">Hoàn tất</Button>
        </div>
        <div className="filter">
        </div>
        <div className="content-form" style={{ overflow: "scroll", width: "100vw" }} >
          <div>
            <label>Tên nhóm</label>
            <TextField
              className="order-reason"
              variant="outlined"
              placeholder="Đặt tên nhóm"
              style={{
                width: "100%",
                marginBottom: "10px",
              }}
            />
            <TextField
              className="input-multiline"
              variant="outlined"
              placeholder="Mô tả nhóm"
              style={{
                width: "100%",
                marginBottom: "10px",
              }}
              multiline
            />
            <label>Tải lên ảnh bìa</label>
            <div className="cover-image">
              {
                groupCoverImage ? <div className="image" style={{ background: 'url(' + URL.createObjectURL(groupCoverImage) + ')' }}></div> : ""
              }
              <Dropzone onDrop={acceptedFiles => component.setState({ groupCoverImage: acceptedFiles[0] })}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()} >
                    <input {...getInputProps()} accept="image/*" />
                    <Button className={groupCoverImage ? "light" : "dask"}>Tải ảnh khác</Button>
                  </div>
                )}
              </Dropzone>

            </div>
            <label>Quy định nhóm</label>
            <TextField
              className="input-multiline"
              variant="outlined"
              placeholder="Quy định nhóm"
              style={{
                width: "100%",
                marginBottom: "10px",
              }}
              multiline
            />
            <label>Quyền riêng tư</label>
            <div className="group-privacy" onClick={() => component.setState({ showGroupPrivacySelectOption: true })}>
              <span>{groupPrivacy.label}</span>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

const renderGroupPrivacyMenuDrawer = (component) => {
  let {
    showGroupPrivacySelectOption
  } = component.state
  let groupPrivacyOptions = objToArray(GroupPrivacies)
  return (
    <Drawer anchor="bottom" className="img-select-option" open={showGroupPrivacySelectOption} onClose={() => component.setState({ showGroupPrivacySelectOption: false })}>
      <div className="option-header">
        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => component.setState({ showGroupPrivacySelectOption: false })}>
          <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
        </IconButton>
        <label>Quyền riêng tư</label>
      </div>
      <ul className="option-list">
        {
          groupPrivacyOptions.map((item, index) => <li key={index}>
            <Button onClick={() => component.setState({ groupPrivacy: item, showGroupPrivacySelectOption: false })}>{item.label}</Button>
          </li>)
        }
      </ul>
    </Drawer>
  )
}

const renderGroupInviteDrawer = (component) => {
  let {
    showGroupInviteDrawer,
  } = component.props

  return (
    <Drawer anchor="bottom" className="group-invite" open={showGroupInviteDrawer} onClose={() => component.props.toggleGroupInviteDrawer(false)}>
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.props.toggleGroupInviteDrawer(false)}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Lời mời vào nhóm</label>
          </div>
        </div>
        <div className="filter"></div>
        <div className="drawer-content" style={{ overflow: "scroll", width: "100vw" }}>
          <div className="my-group-list">
            <ul>
              {
                groups.map((group, index) => <li key={index} onClick={() => component.setState({ groupSelected: group, showGroupForPostDrawer: false })}>
                  <Avatar className="avatar">
                    <img src={group.groupAvatar} />
                  </Avatar>
                  <div className="group-info">
                    <label>{group.groupName}</label>
                    <span className="member-count">{group.members.length} thành viên</span>
                    <Button className="bt-submit">Chấp nhận</Button>
                    <Button className="bt-cancel">Từ chối</Button>
                  </div>
                </li>)
              }
            </ul>
          </div>
        </div>
      </div>
    </Drawer>
  )
}






const groups = [
  {
    groupName: "MÓN NGON DỄ LÀM NGON BỔ RẺ",
    groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage: "https://c.tadst.com/gfx/600x337/moon-photography-camera.jpg?1",
    privacy: "Public",
    posted: 373,
    members: [
      {
        avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
      },
      {
        avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
      }
    ]
  },
  {
    groupName: "Mẹo vặt sinh viên",
    groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage: "https://media.macphun.com/img/uploads/customer/how-to/579/15349456005b7d69405aabf4.32904503.jpg?q=85&w=1340",
    posted: 373,
    privacy: "Public",
    members: [
      {
        avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
      },
      {
        avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
      },
      {
        avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
      },
    ]
  },
  {
    groupName: "CHINH PHỤC NHÀ TUYỂN DỤNG",
    groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage: "https://c.tadst.com/gfx/600x337/moon-photography-camera.jpg?1",
    posted: 373,
    privacy: "Private",
    members: [
      {
        avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
      },
      {
        avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
      }
    ],
    owner: true
  },
  {
    groupName: "CƯỜI BỂ BỤNG",
    groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage: "https://media.macphun.com/img/uploads/customer/how-to/579/15349456005b7d69405aabf4.32904503.jpg?q=85&w=1340",
    posted: 373,
    privacy: "Public",
    members: [
      {
        avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
      },
      {
        avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
      }
    ]
  },
  {
    groupName: "1001 câu hỏi",
    groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage: "https://c.tadst.com/gfx/600x337/moon-photography-camera.jpg?1",
    posted: 373,
    privacy: "Public",
    members: [
      {
        avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
      },
      {
        avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
      }
    ]
  },
  {
    groupName: "NHỮNG ĐIỀU KÌ THÚ",
    groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage: "https://media.macphun.com/img/uploads/customer/how-to/579/15349456005b7d69405aabf4.32904503.jpg?q=85&w=1340",
    posted: 373,
    privacy: "Public",
    members: [
      {
        avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
      },
      {
        avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
      }
    ]
  },
  {
    groupName: "Ờ, phượt đi",
    groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage: "https://c.tadst.com/gfx/600x337/moon-photography-camera.jpg?1",
    posted: 373,
    privacy: "Public",
    members: [
      {
        avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
      },
      {
        avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
      },
      {
        avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
      },
    ],
    owner: true
  }
]