import React from "react";
import './style.scss'
import {
  addHeaderContent,
  addFooterContent,
  toggleHeader,
  toggleFooter,
  toggleCreateGroupDrawer,
  togglePostDrawer,
  toggleGroupDrawer,
  toggleGroupInviteDrawer
} from '../../actions/app'
import { connect } from 'react-redux'
import {
  IconButton,
  Button,
  Drawer,
  TextField,
  InputAdornment,
  Avatar
} from '@material-ui/core'
import {
  ChevronLeft as ChevronLeftIcon, SpaOutlined
} from '@material-ui/icons'
import { StickyContainer, Sticky } from 'react-sticky';
import Post from '../post'
import $ from 'jquery'
import { GroupPrivacies } from "../../constants/constants";

const Newfeed = require('../../assets/icon/Lesson.png')
const Group1 = require('../../assets/icon/Group@1x.png')
const NotiBw = require('../../assets/icon/NotiBw@1x.png')
const ProfileBW = require('../../assets/icon/ProfileBW.png')
const Videos = require('../../assets/icon/Video.png')
const Find = require('../../assets/icon/Find@1x.png')
const createPost = require('../../assets/icon/createPost@1x.png')
const NewGr = require('../../assets/icon/NewGr@1x.png')
const Members = require('../../assets/icon/Members@1x.png')
const search = require('../../assets/icon/Find@1x.png')






class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ""
    };
  }

  componentWillMount() {
    this.props.addHeaderContent(renderHeader(this))
    this.props.addFooterContent(renderFooter(this.props.history))
    this.props.toggleHeader(true)
    this.props.toggleFooter(true)
  }
  render() {
    return (
      <div className="community-page groups-page" >
        <StickyContainer className="container">
          <Sticky topOffset={-60} >
            {({ style }) => (
              <div style={{ ...style, top: "60px", zIndex: 999 }}>
                <div className="post-menu-list">
                  <div>
                    <span className={"bt "} onClick={() => this.setState({ showSearchGroupDrawer: true })}><img src={Find} /><span>Tìm nhóm</span></span>
                    <span className={"bt "} onClick={() => this.props.togglePostDrawer(true, true)}><img src={createPost} /><span>Tạo bài đăng</span></span>
                    <span className={"bt "} onClick={() => this.props.toggleCreateGroupDrawer(true)}><img src={NewGr} /><span>Tạo nhóm</span></span>
                    <span className={"bt "} onClick={() => this.props.toggleGroupDrawer(true)}><img src={Members} /><span>DS nhóm của tôi</span></span>
                    <span className={"bt "} onClick={() => this.props.toggleGroupInviteDrawer(true)}><img src={NewGr} /><span>Lời mới vào nhóm</span></span>
                  </div>
                </div>
              </div>
            )}
          </Sticky>
          <div className="page-detail" style={{ height: "2000px" }}>
            <Post />
          </div>
        </StickyContainer>
        {
          renderSearchGroupDrawer(this)
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
  addHeaderContent: (headerContent) => dispatch(addHeaderContent(headerContent)),
  addFooterContent: (footerContent) => dispatch(addFooterContent(footerContent)),
  toggleHeader: (isShow) => dispatch(toggleHeader(isShow)),
  toggleFooter: (isShow) => dispatch(toggleFooter(isShow)),
  toggleCreateGroupDrawer: (isShow) => dispatch(toggleCreateGroupDrawer(isShow)),
  togglePostDrawer: (isShow, isPostToGroup) => dispatch(togglePostDrawer(isShow, isPostToGroup)),
  toggleGroupDrawer: (isShow) => dispatch(toggleGroupDrawer(isShow)),
  toggleGroupInviteDrawer: (isShow) => dispatch(toggleGroupInviteDrawer(isShow))
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
      <label>Hội nhóm</label>
    </div>
  )
}
const renderFooter = (history) => {
  return (
    <div className="app-footer">
      <ul>
        <li onClick={() => history.replace('/community')}>
          <img src={Newfeed}></img>
          <span >Bản tin</span>
        </li>
        <li onClick={() => history.replace('/videos')}>
          <img src={Videos}></img>
          <span >Video</span>
        </li>
        <li onClick={() => history.replace('/groups')}>
          <img src={Group1}></img>
          <span style={{ color: "#f54746" }}>Nhóm</span>
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

const renderSearchGroupDrawer = (component) => {
  let {
    showSearchGroupDrawer
  } = component.state

  return (
    <Drawer anchor="bottom" className="tag-friend-drawer" open={showSearchGroupDrawer} onClose={() => component.setState({ showSearchGroupDrawer: false })}>
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.setState({ showSearchGroupDrawer: false })}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Tìm nhóm</label>
          </div>
        </div>
        <div className="filter">
          <TextField
            variant="outlined"
            placeholder="Nhập tên nhóm để tìm"
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
                    <span className={"privacy " + (group.privacy == GroupPrivacies.Private.value ? "red" : "")}>{GroupPrivacies[group.privacy].label}</span>
                    <span className="member-count">{group.members.length} thành viên</span>
                  </div>
                  <Button className="bt-submit">Tham gia</Button>
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
