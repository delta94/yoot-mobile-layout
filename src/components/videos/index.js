import React from "react";
import './style.scss'
import {
  addHeaderContent,
  addFooterContent,
  toggleHeader,
  toggleFooter,
  toggleUserDetail,
  toggleFriendDrawer,
  togglePostDrawer,
  toggleGroupDrawer
} from '../../actions/app'
import { connect } from 'react-redux'
import {
  IconButton, Button,
} from '@material-ui/core'
import {
  ChevronLeft as ChevronLeftIcon, SpaOutlined
} from '@material-ui/icons'
import { StickyContainer, Sticky } from 'react-sticky';
import Post from '../post'
import $ from 'jquery'

const Newfeed = require('../../assets/icon/Lesson.png')
const Group1 = require('../../assets/icon/Group1@1x.png')
const NotiBw = require('../../assets/icon/NotiBw@1x.png')
const ProfileBW = require('../../assets/icon/ProfileBW.png')
const Videos = require('../../assets/icon/Videos.png')






class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  postImage() {
    this.props.togglePostDrawer(true, () => {
      setTimeout(() => {
        $("#bt-select-image").click()
      }, 300);
    })
  }
  postVideo() {
    this.props.togglePostDrawer(true, () => {
      setTimeout(() => {
        $("#bt-select-video").click()
      }, 300);
    })
  }
  createAlbum() {
    this.props.togglePostDrawer(true, () => {
      setTimeout(() => {
        $("#bt-create-album").click()
      }, 300);
    })
  }
  componentWillMount() {
    this.props.addHeaderContent(renderHeader(this))
    this.props.addFooterContent(renderFooter(this.props.history))
    this.props.toggleHeader(true)
    this.props.toggleFooter(true)
  }
  render() {
    let {
      profile
    } = this.props
    return (
      <div className="community-page dask-mode" >
        <div className="page-detail" style={{ height: "2000px" }}>
          <Post daskMode={true} />
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
  addFooterContent: (footerContent) => dispatch(addFooterContent(footerContent)),
  toggleHeader: (isShow) => dispatch(toggleHeader(isShow)),
  toggleFooter: (isShow) => dispatch(toggleFooter(isShow)),
  toggleUserDetail: (isShow) => dispatch(toggleUserDetail(isShow)),
  toggleFriendDrawer: (isShow) => dispatch(toggleFriendDrawer(isShow)),
  togglePostDrawer: (isShow, successCallback) => dispatch(togglePostDrawer(isShow, successCallback)),
  toggleGroupDrawer: (isShow) => dispatch(toggleGroupDrawer(isShow))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);

const renderHeader = (component) => {
  return (
    <div className="app-header dask-mode">
      <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => component.props.history.push('/')}>
        <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
      </IconButton>
      <label>Video</label>
    </div>
  )
}
const renderFooter = (history) => {
  return (
    <div className="app-footer dask-mode">
      <ul>
        <li onClick={() => history.replace('/community')}>
          <img src={Newfeed}></img>
          <span >Bản tin</span>
        </li>
        <li onClick={() => history.replace('/videos')}>
          <img src={Videos}></img>
          <span style={{ color: "#f54746" }}>Video</span>
        </li>
        <li onClick={() => history.replace('/groups')}>
          <img src={Group1}></img>
          <span>Nhóm</span>
        </li>
        <li onClick={() => history.replace('/community-noti')}>
          <img src={NotiBw}></img>
          <span>Thông báo</span>
        </li>
        <li onClick={() => history.replace('/communiti-profile')}>
          <img src={ProfileBW}></img>
          <span>Cá nhân</span>
        </li>
      </ul>
    </div>
  )
}
