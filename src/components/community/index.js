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

const Newfeed = require('../../assets/icon/Newfeed@1x.png')
const Group1 = require('../../assets/icon/Group1@1x.png')
const NotiBw = require('../../assets/icon/NotiBw@1x.png')
const ProfileBW = require('../../assets/icon/ProfileBW.png')
const Videos = require('../../assets/icon/Video.png')
const Find = require('../../assets/icon/Find@1x.png')
const uploadImage = require('../../assets/icon/upload_image.png')
const uploadVideo = require('../../assets/icon/upload_video.png')
const album = require('../../assets/icon/album@1x.png')
const createPost = require('../../assets/icon/createPost@1x.png')
const Group = require('../../assets/icon/Group@1x.png')
const postBg = require('../../assets/icon/post-bg.png')






class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  postImage() {
    this.props.togglePostDrawer(true, false, () => {
      setTimeout(() => {
        $("#bt-select-image").click()
      }, 300);
    })
  }
  postVideo() {
    this.props.togglePostDrawer(true, false, () => {
      setTimeout(() => {
        $("#bt-select-video").click()
      }, 300);
    })
  }
  createAlbum() {
    this.props.togglePostDrawer(true, false, () => {
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
      <div className="community-page" >
        {
          profile ? <div className="banner" style={{
            height: "120px", background: "url(" + postBg + ")"
          }}>
            <label>Chào {profile.fullname},</label>
            <span>Ngày hôm nay của bạn thế nào?</span>
            <Button onClick={() => this.props.togglePostDrawer(true)}>Tạo bài đăng mới</Button>
          </div> : ""
        }
        < StickyContainer className="container">
          <Sticky topOffset={-60} >
            {({ style, wasSticky }) => (
              <div style={{ ...style, top: "60px", zIndex: 999 }}>
                <div className="post-menu-list">
                  <div className={wasSticky ? "was-stiky" : ""}>
                    <span className={"bt "} onClick={() => this.props.toggleFriendDrawer(true)}><img src={Find} /><span>Tìm kiếm</span></span>
                    <span className={"bt " + (wasSticky ? "was-stiky" : "")} onClick={() => wasSticky ? this.props.togglePostDrawer(true) : this.postImage()}>
                      {
                        <img src={wasSticky ? createPost : uploadImage} />
                      }
                      {
                        <span>{wasSticky ? "Tạo bài đăng" : "Tải ảnh"}</span>
                      }
                    </span>
                    <span className={"bt " + (wasSticky ? "was-stiky" : "")} onClick={() => wasSticky ? this.props.toggleGroupDrawer(true) : this.postVideo()}>
                      {
                        <img src={wasSticky ? Group : uploadVideo} />
                      }
                      {
                        <span>{wasSticky ? "Nhóm của tôi" : "Tải video"}</span>
                      }
                    </span>
                    {
                      wasSticky ? "" : <span className={"bt "} onClick={() => this.createAlbum()}><img src={album} /><span>Tạo album</span></span>
                    }
                  </div>
                </div>
              </div>
            )}
          </Sticky>
          <div className="page-detail" style={{ height: "2000px" }}>
            {/* <Post /> */}
          </div>
        </StickyContainer>
      </div >
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
  togglePostDrawer: (isShow, isPostToGroup, successCallback) => dispatch(togglePostDrawer(isShow, isPostToGroup, successCallback)),
  toggleGroupDrawer: (isShow) => dispatch(toggleGroupDrawer(isShow))
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
      <label>Cộng đồng</label>
    </div>
  )
}
const renderFooter = (history) => {
  return (
    <div className="app-footer">
      <ul>
        <li onClick={() => history.replace('/community')}>
          <img src={Newfeed}></img>
          <span style={{ color: "#f54746" }}>Bản tin</span>
        </li>
        <li onClick={() => history.replace('/videos')}>
          <img src={Videos}></img>
          <span >Video</span>
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
