import React from "react";
import { Route, Switch } from "react-router";
import Home from "../home";
import YootNoti from '../yoot-noti'
import Profile from '../profile-page'
import Setting from '../setting'
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
} from '@material-ui/core'
import {
  ChevronLeft as ChevronLeftIcon,
} from '@material-ui/icons'
import {
  toggleUserDetail,
  toggleFindFriendDrawer,
  toggleFriendDrawer
} from '../../actions/app'
import SwipeableViews from 'react-swipeable-views';
import moment from 'moment'
import { StickyContainer, Sticky } from 'react-sticky';

const coin = require('../../assets/images/angry.png')
const search = require('../../assets/images/find.png')

class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userDetailFolowTabIndex: 0,
      searchKey: "",
      friendTabIndex: 0
    }
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
        <div className={"fix-header " + (showHeader ? "showed" : "hided")} >
          <div className="direction">
            {headerContent}
          </div>
          {
            profile ? <div className="user-reward">
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
            </div> : ""
          }
        </div>
        <main className="content-main" style={{ marginTop: (showHeader ? "60px" : "0px"), marginBottom: showFooter ? "70px" : "0px" }}>
          <Switch >
            <Route exact path="/" component={Home} />
            <Route exact path="/yoot-noti" component={YootNoti} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/setting" component={Setting} />
          </Switch>
        </main>
        <div className={"fix-footer " + (showFooter ? "showed" : "hided")} >
          {footerContent}
        </div>

        {
          renderUserDetailDrawer(this)
        }
        {
          renderFriendDrawer(this)
        }
        {
          renderFindFriendDrawer(this)
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
  toggleUserDetail: (isShow) => dispatch(toggleUserDetail(isShow)),
  toggleFindFriendDrawer: (isShow) => dispatch(toggleFindFriendDrawer(isShow)),
  toggleFriendDrawer: (isShow) => dispatch(toggleFriendDrawer(isShow))
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
  } = component.props
  return (
    <Drawer anchor="bottom" className="user-detail" open={showUserDetail} onClose={() => component.props.toggleUserDetail(false)}>
      {
        userDetail ? <div className="user-detail">
          <div className="detail-header">
            <div className="direction" onClick={() => component.props.toggleUserDetail(false)}>
              <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
              </IconButton>
              <label>Trang cá nhân</label>
            </div>
            <div className="user-reward">
              <div className="profile">
                <span className="user-name">{userDetail.fullName}</span>
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
                <Tab label="Người theo dõi" {...a11yProps(0)} className="tab-item" />
                <Tab label="Đang theo dõi" {...a11yProps(1)} className="tab-item" />
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
                    userDetail.folowed && userDetail.folowed.length > 0 ? <ul>
                      {
                        userDetail.folowed.map((item, index) => <li className="small-user-layout" key={index}>
                          <Avatar aria-label="recipe" className="avatar">
                            <img src={item.avatar} style={{ width: "100%" }} />
                          </Avatar>
                          <span className="user-name">{item.fullName}</span>
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
                    userDetail.folowing && userDetail.folowing.length > 0 ? <ul>
                      {
                        userDetail.folowing.map((item, index) => <li className="small-user-layout" key={index}>
                          <Avatar aria-label="recipe" className="avatar">
                            <img src={item.avatar} style={{ width: "100%" }} />
                          </Avatar>
                          <span className="user-name">{item.fullName}</span>
                          <Button style={{ background: "rgba(0,0,0,0.05)" }}>Bỏ theo dõi</Button>
                        </li>)
                      }
                    </ul> : <span className="list-empty-message">Chưa theo dõi bất kì ai</span>
                  }
                </div>
              </TabPanel>
            </SwipeableViews>
            <div className="job-reward info-box">
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
            </div>
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
      <div className="user-detail">
        <div className="detail-header">
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
      <div className="user-detail">
        <div className="detail-header">
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
