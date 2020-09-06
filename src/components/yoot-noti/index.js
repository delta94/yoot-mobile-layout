import React from "react";
import './style.scss'
import {
  addHeaderContent,
  addFooterContent,
  toggleHeader,
  toggleFooter,
  toggleUserDetail
} from '../../actions/app'
import { connect } from 'react-redux'

const noti = require('../../assets/icon/NotiBw1.png')
const profileBw = require('../../assets/icon/ProfileBW.png')
const settingBw = require('../../assets/icon/seting1@1x.png')
const home = require('../../assets/icon/home1@1x.png')

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentWillMount() {
    this.props.addHeaderContent(renderHeader())
    this.props.addFooterContent(renderFooter(this.props.history))
    this.props.toggleHeader(true)
    this.props.toggleFooter(true)
  }
  render() {
    return (
      <div className="home-page" >
        Noti
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
  toggleUserDetail: (isShow) => dispatch(toggleUserDetail(isShow))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);

const renderHeader = () => {
  return (
    <div className="app-header">
      <label>Thông báo</label>
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
        <li>
          <img src={noti}></img>
          <span style={{ color: "#f54746" }}>Thông báo</span>
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
