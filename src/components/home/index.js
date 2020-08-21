import React from "react";
import './style.scss'
import {
  addHeaderContent,
  addFooterContent,
  toggleHeader,
  toggleFooter
} from '../../actions/app'
import { connect } from 'react-redux'
import { StickyContainer, Sticky } from 'react-sticky';
import Slider from "react-slick";
import {
  AppBar,
  Tabs,
  Tab
} from '@material-ui/core'

const noti = require('../../assets/images/noti.png')
const profileBw = require('../../assets/images/profile-bw.png')
const settingBw = require('../../assets/images/setting-bw.png')
const home = require('../../assets/images/home.png')
const yootLogo = require('../../assets/images/logo@3x.png')
const community = require('../../assets/images/community.png')
const skill = require('../../assets/images/skill.png')
const job1 = require('../../assets/images/job-1.png')
const job = require('../../assets/images/job.png')
const house = require('../../assets/images/house.png')
const teach = require('../../assets/images/teach.png')



const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
};

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0
    };
  }
  componentWillMount() {
    this.props.addHeaderContent(renderHeader())
    this.props.addFooterContent(renderFooter(this.props.history))
    this.props.toggleHeader(true)
    this.props.toggleFooter(true)
  }
  render() {
    let {
      tabIndex
    } = this.state
    return (
      <div className="home-page" >
        <div className="home-slider">
          <Slider {...settings}>
            <div className="slide-item">
              <img src="http://157.119.251.140:9669/Assets/Image/Banner/banner01.png?utm_source=zalo&utm_medium=zalo&utm_campaign=zalo&zarsrc=31" />
            </div>
            <div className="slide-item">
              <img src="http://157.119.251.140:9669/Assets/Image/Banner/banner01.png?utm_source=zalo&utm_medium=zalo&utm_campaign=zalo&zarsrc=31" />
            </div>
            <div className="slide-item">
              <img src="http://157.119.251.140:9669/Assets/Image/Banner/banner01.png?utm_source=zalo&utm_medium=zalo&utm_campaign=zalo&zarsrc=31" />
            </div>
          </Slider>
        </div>
        <StickyContainer className="container">
          <Sticky topOffset={-60} >
            {({ style }) => (
              <div style={{ ...style, top: "60px", zIndex: 999 }}>
                <div className="home-menu">
                  <div>
                    <ul>
                      <li>
                        <img src={community}></img>
                        <span>Cộng đồng</span>
                      </li>
                      <li>
                        <img src={skill}></img>
                        <span>Kỹ năng</span>
                      </li>
                      <li>
                        <img src={job1}></img>
                        <span>Hướng nghiệp</span>
                      </li>
                      <li>
                        <img src={job}></img>
                        <span>Việc làm</span>
                      </li>
                      <li>
                        <img src={house}></img>
                        <span>Nhà trọ</span>
                      </li>
                      <li>
                        <img src={teach}></img>
                        <span>Gia sư</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </Sticky>
          <div className="member-list">
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
                <Tab label="Đăng nhập" {...a11yProps(0)} className="tab-item" />
                <Tab label="Đăng ký mới" {...a11yProps(1)} className="tab-item" />
              </Tabs>
            </AppBar>
          </div>
        </StickyContainer>

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
  toggleFooter: (isShow) => dispatch(toggleFooter(isShow))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);

const renderHeader = () => {
  return (
    <div className="app-header">
      <img src={yootLogo} className="logo"></img>
    </div>
  )
}
const renderFooter = (history) => {
  return (
    <div className="app-footer">
      <ul>
        <li>
          <img src={home}></img>
          <span style={{ color: "#f54746" }}>Trang chủ</span>
        </li>
        <li onClick={() => history.replace('/yoot-noti')}>
          <img src={noti}></img>
          <span>Thông báo</span>
        </li>
        <li onClick={() => history.replace('/profile')}>
          <img src={profileBw}></img>
          <span>Cá nhân</span>
        </li>
        <li onClick={() => history.replace('/setting')}>
          <img src={settingBw}></img>
          <span>Cài đặt</span>
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