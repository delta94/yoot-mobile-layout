import React from "react";
import './style.scss'
import {
  addHeaderContent,
  addFooterContent,
  toggleHeader,
  toggleFooter
} from '../../actions/app'
import {
  NavigateNext as NavigateNextIcon,
  ChevronLeft as ChevronLeftIcon,
  Check as CheckIcon
} from '@material-ui/icons'
import { connect } from 'react-redux'
import Switch from 'react-ios-switch';
import {
  Button,
  Drawer,
  IconButton
} from "@material-ui/core";

const noti = require('../../assets/icon/NotiBw@1x.png')
const profileBw = require('../../assets/icon/ProfileBW.png')
const settingBw = require('../../assets/icon/seting@1x.png')
const home = require('../../assets/icon/home1@1x.png')

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGraduted: false,
      showAutoPlaySetting: false,
      autoPlayOptionSelected: 3
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
      isGraduted
    } = this.state
    return (
      <div className="setting-page" >
        <div>
          <span>Tắt tiếng video trên bản tin</span>
          <Switch
            checked={isGraduted}
            handleColor="#fff"
            offColor="#666"
            onChange={() => this.setState({ isGraduted: !isGraduted })}
            onColor="#ff5a5a"
            className="custom-switch"
          />
        </div>
        <div>
          <span>Tự động phát video</span>
          <span onClick={() => this.setState({ showAutoPlaySetting: true })}>
            <span>Chỉ Wifi</span>
            <NavigateNextIcon />
          </span>
        </div>
        <Button className="bt-submit">Lưu thay đổi</Button>
        {
          renderAutoPlaySettingDrawer(this)
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
  toggleFooter: (isShow) => dispatch(toggleFooter(isShow))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);

const renderHeader = () => {
  return (
    <div className="app-header">
      <label>Cài đặt chung</label>
    </div>
  )
}
const renderFooter = (history) => {
  return (
    <div className="app-footer">
      <ul>
        <li onClick={() => history.replace('/')}>
          <img src={home}></img>
          <span >Trang chủ</span>
        </li>
        <li onClick={() => history.replace('/yoot-noti')}>
          <img src={noti}></img>
          <span >Thông báo</span>
        </li>
        <li onClick={() => history.replace('/profile')}>
          <img src={profileBw}></img>
          <span>Cá nhân</span>
        </li>
        <li>
          <img src={settingBw}></img>
          <span style={{ color: "#f54746" }}>Cài đặt</span>
        </li>
      </ul>
    </div>
  )
}

const renderAutoPlaySettingDrawer = (component) => {
  let {
    showAutoPlaySetting,
    autoPlayOptionSelected
  } = component.state
  return (
    <Drawer anchor="bottom" className="auto-play-setting" open={showAutoPlaySetting} onClose={() => component.setState({ showAutoPlaySetting: false })}>
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.setState({ showAutoPlaySetting: false })}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Tự động phát</label>
          </div>
        </div>
        <div className="filter">
        </div>
        <div className="detail-content" style={{ overflow: "scroll", width: "100vw" }}>
          <ul className="auto-option">
            <li onClick={() => component.setState({ autoPlayOptionSelected: 1 })}>
              <span>Khi dùng Wifi và dữ liệu di động</span>
              {
                autoPlayOptionSelected == 1 ? <CheckIcon /> : ""
              }
            </li>
            <li onClick={() => component.setState({ autoPlayOptionSelected: 2 })}>
              <span>Chỉ khi có kết nối Wifi</span>
              {
                autoPlayOptionSelected == 2 ? <CheckIcon /> : ""
              }
            </li>
            <li onClick={() => component.setState({ autoPlayOptionSelected: 3 })}>
              <span>Không bao giờ tự động phát video</span>
              {
                autoPlayOptionSelected == 3 ? <CheckIcon /> : ""
              }
            </li>
          </ul>
          <Button className="bt-submit">Lưu thay đổi</Button>
        </div>
      </div>
    </Drawer>
  )
}

