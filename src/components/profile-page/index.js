import React from "react";
import './style.scss'
import {
  addHeaderContent,
  addFooterContent,
  toggleHeader,
  toggleUserDetail,
  toggleUserHistory,
  toggleChangePasswordForm,
  toggleBlockFriendForm,
  toggleFriendsForBlockForm,
  toggleFriendDrawer
} from '../../actions/app'
import {
  setCurrenUserDetail
} from '../../actions/user'
import {
  PhotoCamera as PhotoCameraIcon,
  ChevronLeft as ChevronLeftIcon,
  MoreHoriz as MoreHorizIcon,
  PlayArrow as PlayArrowIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AddCircleOutline as AddCircleOutlineIcon
} from '@material-ui/icons'
import { connect } from 'react-redux'
import {
  IconButton,
  Drawer,
  Button,
  Avatar,
  TextField,
  InputAdornment
} from "@material-ui/core";
import moment from 'moment'
import { signOut } from "../../auth";
import { renderVNDays } from '../../utils/app'
import UserInfo from './user-info'
import Experiendces from './experiences'
import Educaction from './education'
import Hoppies from './hoppies'

const noti = require('../../assets/images/noti.png')
const profileBw = require('../../assets/images/personal@2x.png')
const settingBw = require('../../assets/images/setting-bw.png')
const home = require('../../assets/images/home.png')
const coin = require('../../assets/images/angry.png')
const like = require('../../assets/images/like.png')
const follower = require('../../assets/images/follower.png')
const donePractice = require('../../assets/images/done-practice.png')
const search = require('../../assets/images/find.png')
const uploadImage = require('../../assets/images/upload-image.png')
const uploadVideo = require('../../assets/images/upload-video.png')



const data = {
  coverImage: "https://ak.picdn.net/shutterstock/videos/33673936/thumb/1.jpg",
  avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQF5qxHcyf8b5jCFVBLHZhiEEuelb2rcal-mA&usqp=CAU",
  fullName: "hoang hai long",
  point: 20,
  liked: 1231,
  folow: 221,
  posted: 2533,
  birthday: new Date(),
  gender: "Nam",
  friends: [
    {
      avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
      fullName: "Apple Ánh"
    },
    {
      avatar: "https://wp-en.oberlo.com/wp-content/uploads/2019/01/Copy-of-Blog-Header-Image-880x450-5-min.jpg",
      fullName: "Võ Gia Huy"
    },
    {
      avatar: "https://girlbehindthereddoor.com/wp-content/uploads/2016/11/girl-behind-the-red-door-lomo-instant-wide-instax-fujifilm-sky-550x360.jpg",
      fullName: "Quynh"
    }

  ],
  folowing: [
    {
      avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
      fullName: "Apple Ánh"
    },
    {
      avatar: "https://wp-en.oberlo.com/wp-content/uploads/2019/01/Copy-of-Blog-Header-Image-880x450-5-min.jpg",
      fullName: "Võ Gia Huy"
    },
    {
      avatar: "https://girlbehindthereddoor.com/wp-content/uploads/2016/11/girl-behind-the-red-door-lomo-instant-wide-instax-fujifilm-sky-550x360.jpg",
      fullName: "Quynh"
    }
  ],
  folowed: [
    {
      avatar: "https://wp-en.oberlo.com/wp-content/uploads/2019/01/Copy-of-Blog-Header-Image-880x450-5-min.jpg",
      fullName: "Võ Gia Huy"
    },
    {
      avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
      fullName: "Apple Ánh"
    },
    {
      avatar: "https://girlbehindthereddoor.com/wp-content/uploads/2016/11/girl-behind-the-red-door-lomo-instant-wide-instax-fujifilm-sky-550x360.jpg",
      fullName: "Quynh"
    }
  ],
  jobs: [
    {
      position: "Nhân viên Thiết kế",
      company: "Công ty Cổ phần Công nghệ & Đào tạo YOOT",
      description: "Không có mô tả",
      start: "10/20/2019",
      end: "10/20/2020"
    }
  ],
  studies: [
    {
      majors: "Nhân viên Thiết kế",
      school: "Công ty Cổ phần Công nghệ & Đào tạo YOOT",
      className: "D15_MT3DH",
      graduate: "Khá",
      masv: "DH12283",
      start: "1999",
      end: "2004",
      isFinish: true
    }
  ],
  address: "33 Kinh Dương Vương, Bình Chánh, HCM",
  email: "btcvn07@gmail.com",
  skills: ["Quản lý thời gian", "Lãnh đạo"],
  hopies: "Ca hát, thể thao",
  orderSkills: "Ca hát"
}

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showImageSelectOption: false,
      showUserMenu: false,
      showUpdateProfile: false,
      isShowOldPass: false,
      isShowNewPass: false,
      isShowConfirmPass: false
    };
  }
  componentWillMount() {
    this.props.addFooterContent(renderFooter(this.props.history))
    this.props.toggleHeader(false)
  }
  render() {
    let {
      showUserMenu,
    } = this.state
    return (
      <div className="profile-page" >
        <div className="cover-img" style={{ background: "url(" + data.coverImage + ")" }}>
          <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => this.setState({ showImageSelectOption: true })}>
            <PhotoCameraIcon style={{ color: "#ff5a59", width: "20px", height: "20px" }} />
          </IconButton>
        </div>

        <div className="user-avatar" style={{ background: "url(" + data.avatar + ")" }}>
          <IconButton style={{ background: "rgba(240,240,240,0.9)", padding: "8px" }} onClick={() => this.setState({ showImageSelectOption: true })}>
            <PhotoCameraIcon style={{ color: "#ff5a59", width: "20px", height: "20px" }} />
          </IconButton>
        </div>

        <div className="user-info">
          <span className="user-name">{data.fullName}</span>
          <span className="point">
            <span>Điểm YOOT: {data.point}</span>
            <img src={coin} />
          </span>
          <IconButton style={{ background: "rgba(0,0,0,0.07)" }} onClick={() => this.setState({ showUserMenu: true })}>
            <MoreHorizIcon />
          </IconButton>
        </div>

        <div className="react-reward">
          <ul>
            <li>
              <span><img src={like}></img></span>
              <span>{data.liked}</span>
            </li>
            <li>
              <span><img src={follower}></img></span>
              <span>{data.folow}</span>
            </li>
            <li>
              <span><img src={donePractice}></img></span>
              <span>{data.posted}</span>
            </li>
          </ul>
        </div>

        <div className="user-profile">
          <ul>
            <li>
              <img src={follower} />
              <span className="title" >Ngày sinh</span>
              <span className="value">{moment(data.birthday).format("DD/MM/YYYY")}</span>
            </li>
            <li>
              <img src={follower} />
              <span className="title">Giới tính</span>
              <span className="value">{data.gender}</span>
            </li>
          </ul>
          <span className="view-detail-link" onClick={() => {
            this.props.setCurrenUserDetail(data)
            this.props.toggleUserDetail(true)
          }}>{">>> Xem thêm thông tin của"} {data.fullName}</span>
        </div>

        <Button className="update-button" style={{ background: "#f44645" }} onClick={() => this.setState({ showUpdateProfile: true })}>Cập nhật thông tin cá nhân</Button>

        <div className="friend-reward">
          <label>Bạn bè</label>
          <span>{data.friends.length} người bạn</span>
          <div className="friend-list">
            {
              data.friends.map((item, index) => <div key={index} className="friend-item">
                <div className="avatar" style={{ background: "url(" + item.avatar + ")" }}></div>
                <span className="name">{item.fullName}</span>
              </div>)
            }
          </div>
          <div className="search-friend" onClick={() => this.props.toggleFriendDrawer(true)}>
            <img src={search}></img>
            <span>Tìm bạn bè</span>
          </div>
        </div>

        <div className="post-bt">
          <Avatar aria-label="recipe" className="avatar">
            <img src={data.avatar} style={{ width: "100%" }} />
          </Avatar>
          <span>Bạn viết gì đi...</span>
        </div>

        <div className="quit-post-bt">
          <ul>
            <li>
              <img src={uploadImage}></img>
              <span>Ảnh</span>
            </li>
            <li>
              <img src={uploadVideo}></img>
              <span>Video</span>
            </li>
          </ul>
        </div>


        {
          renderUserMenuDrawer(this)
        }
        {
          renderImageMenuDrawer(this)
        }
        {
          renderUpdateProfileDrawer(this)
        }
        {
          renderUserHistoryDrawer(this)
        }
        {
          renderChangePasswordDrawer(this)
        }
        {
          renderBlockFriendDrawer(this)
        }
        {
          renderFriendsForBlockDrawer(this)
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
  setCurrenUserDetail: (user) => dispatch(setCurrenUserDetail(user)),
  toggleUserDetail: (isShow) => dispatch(toggleUserDetail(isShow)),
  toggleUserHistory: (isShow) => dispatch(toggleUserHistory(isShow)),
  toggleChangePasswordForm: (isShow) => dispatch(toggleChangePasswordForm(isShow)),
  toggleBlockFriendForm: (isShow) => dispatch(toggleBlockFriendForm(isShow)),
  toggleFriendsForBlockForm: (isShow) => dispatch(toggleFriendsForBlockForm(isShow)),
  toggleFriendDrawer: (isShow) => dispatch(toggleFriendDrawer(isShow))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);










































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
        <li>
          <img src={profileBw}></img>
          <span style={{ color: "#f54746" }}>Cá nhân</span>
        </li>
        <li onClick={() => history.replace('/setting')}>
          <img src={settingBw}></img>
          <span>Cài đặt</span>
        </li>
      </ul>
    </div>
  )
}

const renderUserMenuDrawer = (component) => {
  let {
    showUserMenu
  } = component.state
  return (
    <Drawer anchor="right" className="user-menu" open={showUserMenu} onClose={() => component.setState({ showUserMenu: false })}>
      <div className="menu-header">
        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => component.setState({ showUserMenu: false })}>
          <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
        </IconButton>
        <label>Quản lý tài khoản</label>
      </div>
      <ul className="menu-list">
        <li>
          <Button onClick={() => component.setState({ showUpdateProfile: true })}>Cập nhật thông tin cá nhân</Button>
        </li>
        <li>
          <Button onClick={() => {
            component.props.setCurrenUserDetail(data)
            component.props.toggleUserHistory(true)
          }}>Lịch sử tích điểm</Button>
        </li>
        <li>
          <Button onClick={() => {
            component.props.toggleChangePasswordForm(true)
          }}>Đổi mật khẩu</Button>
        </li>
        <li>
          <Button onClick={() => component.props.toggleBlockFriendForm(true)}>Danh sách chặn</Button>
        </li>
        <li className="sign-out">
          <Button style={{ background: "#ff5a59" }} onClick={() => signOut()}>Đăng xuất tài khoản</Button>
        </li>
      </ul>
    </Drawer>
  )
}

const renderImageMenuDrawer = (component) => {
  let {
    showImageSelectOption
  } = component.state
  return (
    <Drawer anchor="bottom" className="img-select-option" open={showImageSelectOption} onClose={() => component.setState({ showImageSelectOption: false })}>
      <div className="option-header">
        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => component.setState({ showImageSelectOption: false })}>
          <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
        </IconButton>
        <label>Tác vụ</label>
      </div>
      <ul className="option-list">
        <li>
          <Button>Chọn ảnh bìa</Button>
        </li>
        <li>
          <Button>Chọn ảnh bìa</Button>
        </li>
      </ul>
    </Drawer>
  )
}

const renderUpdateProfileDrawer = (component) => {
  let {
    showUpdateProfile
  } = component.state
  return (
    <Drawer anchor="bottom" className="update-profile-form" open={showUpdateProfile} onClose={() => component.setState({ showUpdateProfile: false })}>
      <div className="form-header">
        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => component.setState({ showUpdateProfile: false })}>
          <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
        </IconButton>
        <label>Cập nhật thông tin</label>
      </div>
      <div className="content-form">
        <UserInfo data={data} />
        <Experiendces data={data} />
        <Educaction data={data} />
        <Hoppies data={data} />
      </div>
    </Drawer>
  )
}


const renderUserHistoryDrawer = (component) => {
  let {
    showUserHistory,
    userDetail
  } = component.props
  return (
    <Drawer anchor="right" open={showUserHistory} onClose={() => component.props.toggleUserHistory(false)}>
      {
        userDetail ? <div className="user-detail">
          <div className="detail-header">
            <div className="direction" onClick={() => component.props.toggleUserHistory(false)}>
              <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
              </IconButton>
              <label>Lịch sử tích điểm</label>
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
          <div style={{ overflow: "scroll", width: "100vw" }}>
            <ul className="user-history">
              <li>
                <div className="date"><span>{renderVNDays(new Date)}, {moment(new Date).format("DD-MM-YYYY")}</span></div>
                <div className="list">
                  <label><PlayArrowIcon /> Cộng đồng</label>
                  <ul>
                    <li>
                      <span>Đăng bài viết</span>
                      <span>+300 <img src={coin} /></span>
                    </li>
                    <li>
                      <span>Đăng bài viết</span>
                      <span>+300 <img src={coin} /></span>
                    </li>
                  </ul>
                </div>
                <div className="list">
                  <label><PlayArrowIcon /> Kỹ năng</label>
                </div>
                <div className="total">
                  <span>Tổng điểm / ngày</span>
                  <span>600 <img src={coin} /></span>
                </div>
              </li>
              <li>
                <div className="date"><span>{renderVNDays(new Date)}, {moment(new Date).format("DD-MM-YYYY")}</span></div>
                <div className="list">
                  <label><PlayArrowIcon /> Cộng đồng</label>
                  <ul>
                    <li>
                      <span>Đăng bài viết</span>
                      <span>+300 <img src={coin} /></span>
                    </li>
                    <li>
                      <span>Đăng bài viết</span>
                      <span>+300 <img src={coin} /></span>
                    </li>
                  </ul>
                </div>
                <div className="list">
                  <label><PlayArrowIcon /> Kỹ năng</label>
                </div>
                <div className="total">
                  <span>Tổng điểm / ngày</span>
                  <span>600 <img src={coin} /></span>
                </div>
              </li>
            </ul>
          </div>
        </div> : ""
      }
    </Drawer>
  )
}

const renderChangePasswordDrawer = (component) => {
  let {
    showChangePasswordForm
  } = component.props
  let {
    isShowOldPass,
    isShowNewPass,
    isShowConfirmPass
  } = component.state
  return (
    <Drawer anchor="right" open={showChangePasswordForm} onClose={() => component.props.toggleChangePasswordForm(false)}>
      <div className="user-detail change-pass-form">
        <div className="detail-header">
          <div className="direction" onClick={() => component.props.toggleChangePasswordForm(false)}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Đổi mật khẩu</label>
          </div>
        </div>
        <div className="filter"></div>
        <div className="content-form" style={{ overflow: "scroll", width: "100vw" }}>
          <div>
            <TextField
              variant="outlined"
              placeholder="Mật khẩu hiện tại"
              style={{
                width: "100%",
                marginBottom: "10px"
              }}
              type={isShowOldPass ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => component.setState({ isShowOldPass: !isShowOldPass })}>
                      {
                        isShowOldPass ? <VisibilityIcon style={{ color: "#ff5a5a" }} /> : <VisibilityOffIcon />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              variant="outlined"
              placeholder="Mật khẩu mới"
              style={{
                width: "100%",
                marginBottom: "10px"
              }}
              type={isShowNewPass ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => component.setState({ isShowNewPass: !isShowNewPass })}>
                      {
                        isShowNewPass ? <VisibilityIcon style={{ color: "#ff5a5a" }} /> : <VisibilityOffIcon />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              variant="outlined"
              placeholder="Nhập lại mật khẩu mới"
              style={{
                width: "100%",
                marginBottom: "50px"
              }}
              type={isShowConfirmPass ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => component.setState({ isShowConfirmPass: !isShowConfirmPass })}>
                      {
                        isShowConfirmPass ? <VisibilityIcon style={{ color: "#ff5a5a" }} /> : <VisibilityOffIcon />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" className={"bt-submit"}>Lưu thông tin</Button>
            <Button variant="contained" className={"bt-cancel"}>Huỷ</Button>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

const renderBlockFriendDrawer = (component) => {
  let {
    showBlockFriendForm
  } = component.props
  return (
    <Drawer anchor="right" open={showBlockFriendForm} onClose={() => component.props.toggleBlockFriendForm(false)}>
      <div className="user-detail block-friend-form">
        <div className="detail-header">
          <div className="direction" onClick={() => component.props.toggleBlockFriendForm(false)}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Danh sách chặn</label>
          </div>
        </div>
        <div className="filter"></div>
        <div className="content-form" style={{ overflow: "scroll", width: "100vw" }}>
          <p>Bạn và người bị chặn sẽ không thể nhìn thấy nhau. Nếu bạn bỏ chặn người này có thể xem dòng thời gian của bạn hoặc liên hệ với bạn.</p>
          <div className="add-bt" onClick={() => component.props.toggleFriendsForBlockForm(true)}>
            <AddCircleOutlineIcon />
            <span>Thêm vào danh sách chặn</span>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

const renderFriendsForBlockDrawer = (component) => {
  let {
    searchKey
  } = component.state
  let {
    showFriendsForBlockForm
  } = component.props
  return (
    <Drawer anchor="right" open={showFriendsForBlockForm} onClose={() => component.props.toggleFriendsForBlockForm(false)}>
      <div className="user-detail friends-for-block-form">
        <div className="detail-header">
          <div className="direction" onClick={() => component.props.toggleFriendsForBlockForm(false)}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Tìm kiếm bạn bè</label>
          </div>
        </div>
        <div className="filter"></div>
        <div className="content-form" style={{ overflow: "scroll", width: "100vw" }}>
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm"
            className="search-box"
            style={{
              width: "100%",
              margin: "10px 0px",
            }}
            value={searchKey}
            onChange={e => component.setState({ searchKey: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={search} />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
    </Drawer>
  )
}
