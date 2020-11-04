import React from "react";
import './style.scss'
import { connect } from 'react-redux'
import {
  IconButton,
  Avatar,
  Button,
  Drawer,
  TextField,
  InputAdornment,
  ClickAwayListener,
  MenuItem
} from '@material-ui/core'
import AnimateHeight from 'react-animate-height';
import {
  ChevronLeft as ChevronLeftIcon,
  MoreHoriz as MoreHorizIcon,
  FiberManualRecord as FiberManualRecordIcon
} from '@material-ui/icons'
import {
  toggleGroupDetailDrawer,
  togglePostDrawer
} from '../../actions/app'
import {
  setCurrentGroupPosted
} from '../../actions/posted'
import {
  setCurrentGroup,
  acceptGroup,
  joinGroup,
  leaveGroup
} from '../../actions/group'
import CustomMenu from '../common/custom-menu'
import { StickyContainer, Sticky } from 'react-sticky';
import Post from '../post'
import $ from 'jquery'
import { GroupPrivacies, Privacies } from "../../constants/constants";
import { get, postFormData } from "../../api";
import { CurrentDate, SOCIAL_NET_WORK_API } from "../../constants/appSettings";
import { objToQuery, objToArray, showNotification, showConfirm, srcToFile } from "../../utils/common";
import Loader from '../common/loader'
import moment from 'moment'
import ContentLoader from "react-content-loader"
import Dropzone from 'react-dropzone'
import MultiInput from '../common/multi-input'
import ShowMoreText from 'react-show-more-text';
import GroupImage from '../groups/group-image'

const createPost = require('../../assets/icon/createPost@1x.png')
const NewGr = require('../../assets/icon/NewGr@1x.png')
const Members = require('../../assets/icon/Members@1x.png')
const search = require('../../assets/icon/Find@1x.png')


let currentDate = moment(new Date).format(CurrentDate)



class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupDetail: null,
      activeMenuIndex: 0,
      contentHeight: 0,
      showMemberDrawer: false,
      userList: [],
      userCurrenntPage: 0,
      isEndOfUserList: false,
      isLoadMoreUser: false,
      isLoadMore: false,
      friends: [],
      friendsCurrentPage: 0,
      isEndOfFriends: false,
      searchKey: "",
      showMoreDescription: false
    };
  }

  handleSetDefault(group) {
    this.setState({
      description: group.description,
      policygroup: group.groupUserPolicies[0] ? group.groupUserPolicies[0].description : "",
      groupName: group.groupname,
      groupType: GroupPrivacies[group.typegroupname],
      backgroundPosted: group.backgroundimage,
    })
  }

  handleUpdateGroup() {
    let {
      groupName,
      groupCoverImage,
      policygroup,
      description,
      groupType,
      groupDetail
    } = this.state

    let formData = new FormData

    formData.append("id", groupDetail.groupid.toString())

    if (groupName && groupName != "") {
      formData.append("name", groupName.toString())
    }
    else {
      showNotification("", "Vui lòng nhập tên nhóm!")
      return
    }
    if (groupType) {
      formData.append("typegroup", groupType.code.toString())
    } else {
      showNotification("", "Vui lòng chọn quyền riêng tư!")
      return
    }

    if (description && description != "") {
      formData.append("description", description.toString())
    }

    if (policygroup && policygroup != "") {
      formData.append("policygroup", JSON.stringify([
        {
          title: "",
          description: policygroup,
          id: 0
        }
      ]))
    }

    if (groupCoverImage) {
      formData.append("background", groupCoverImage)
    }

    postFormData(SOCIAL_NET_WORK_API, "GroupUser/EditGroupUser", formData, result => {
      if (result && result.result == 1) {
        setTimeout(() => {
          this.handleGetGroupDetail(groupDetail)
          this.setState({
            showUpdateGroup: false
          })
        }, 1000);
      }
    })
  }

  handleGetPost(currentpage, currentGroup) {
    let param = {
      currentpage: currentpage,
      currentdate: currentDate,
      limit: 20,
      groupid: currentGroup.groupid,
      isVideo: 0,
      suggestGroup: 0,
      forFriendId: 0,
      albumid: 0,
    }
    this.setState({
      isLoadMore: true,
    })

    get(SOCIAL_NET_WORK_API, "PostNewsFeed/GetAllNewsFeed" + objToQuery(param), result => {
      if (result && result.result == 1) {

        result.content.newsFeeds.map(item => {
          if (item.iconlike < 0) item.iconlike = 0
        })
        this.setState({
          isLoadMore: false
        })
        this.props.setCurrentGroupPosted(result.content.newsFeeds)

        if (result.content.newsFeeds.length == 0) {
          this.setState({
            isEndOfPosteds: true,
            isLoadMore: false
          })
        }
      }
    })
  }

  handleGetGroupDetail(currentGroup) {
    if (!currentGroup) return
    get(SOCIAL_NET_WORK_API, "GroupUser/GetOneGroupUser?groupid=" + currentGroup.groupid, result => {
      if (result && result.result == 1) {
        this.setState({
          groupDetail: result.content.groupUser
        })
        this.handleSetDefault(result.content.groupUser)
      }
    })
  }

  handleLeaveGroup() {
    let {
      groupDetail
    } = this.state
    if (groupDetail) {
      get(SOCIAL_NET_WORK_API, "GroupUser/LeaveGroupUser?groupid=" + groupDetail.groupid, result => {
        if (result && result.result == 1) {
          this.setState({
            showNoti: true,
            confirmTitle: "",
            confirmMessage: "Rời nhóm thành công",
            okCallback: () => {
              setTimeout(() => {
                this.props.leaveGroup(groupDetail)
                this.props.toggleGroupDetailDrawer(false)
                this.props.setCurrentGroup(null)
              }, 500);
            }
          })
        }
      })
    }
  }

  onClickMenu(index) {
    this.setState({
      activeMenuIndex: index
    }, () => {
      setTimeout(() => {
        this.setState({
          contentHeight: $(`#info-content-${index}`).height() ? $(`#info-content-${index}`).height() : 1
        })
      }, 10);
    })
  }

  getManagerList(currentpage, groupDetail) {
    let param = {
      currentpage: currentpage,
      currentdate: moment(new Date).format(CurrentDate),
      limit: 20,
      groupid: groupDetail.groupid,
      status: "Manager"
    }
    get(SOCIAL_NET_WORK_API, "GroupUser/GetListUserInGroup" + objToQuery(param), result => {
      if (result && result.result == 1) {
        this.setState({
          managerList: result.content.memberInGroups
        })
      }
    })
    get(SOCIAL_NET_WORK_API, "GroupUser/GetCountListUserInGroup" + objToQuery(param), result => {
      if (result && result.result == 1) {
        this.setState({
          managerCount: result.content.countmemberingroup
        })
      }
    })
  }

  getUserInGroup(currentpage, groupDetail) {
    let {
      userList
    } = this.state
    let param = {
      currentpage: currentpage,
      currentdate: moment(new Date).format(CurrentDate),
      limit: 20,
      groupid: groupDetail.groupid,
      status: "Join"
    }
    get(SOCIAL_NET_WORK_API, "GroupUser/GetListUserInGroup" + objToQuery(param), result => {
      if (result && result.result == 1) {
        this.setState({
          userList: userList.concat(result.content.memberInGroups),
          isLoadMoreUser: false
        })
      }
    })
    get(SOCIAL_NET_WORK_API, "GroupUser/GetCountListUserInGroup" + objToQuery(param), result => {
      if (result && result.result == 1) {
        this.setState({
          userCount: result.content.countmemberingroup
        })
      }
    })
  }

  onScroll() {
    let element = $("#all-user-in-group")
    let {
      isLoadMoreUser,
      isEndOfUserList,
      userCurrenntPage,
      groupDetail
    } = this.state
    if (element)
      if (element.scrollTop() + element.innerHeight() >= element[0].scrollHeight) {
        if (isLoadMoreUser == false && isEndOfUserList == false) {
          this.setState({
            userCurrenntPage: userCurrenntPage + 1,
            isLoadMoreUser: true
          }, () => {
            this.getUserInGroup(userCurrenntPage + 1, groupDetail)
          })
        }

      }
  }

  addFriend(friendId) {
    let {
      userList,
      managerList,
    } = this.state
    let param = {
      friendid: friendId
    }
    get(SOCIAL_NET_WORK_API, "Friends/AddOrDeleteInviateFriends" + objToQuery(param), (result) => {
      if (result && result.result == 1) {
        let userIndex = userList.findIndex(item => item.memberid == friendId)
        if (userIndex >= 0) {
          userList[userIndex].friendstatus = userList[userIndex].friendstatus == 1 ? 0 : 1
        }
        let managerIndex = managerList.findIndex(item => item.memberid == friendId)
        if (managerIndex >= 0) {
          managerList[managerIndex].friendstatus = managerList[managerIndex].friendstatus == 1 ? 0 : 1
        }
        this.setState({
          userList: userList,
          managerList: managerList
        })
      }
    })
  }

  onAllFriendScrool() {
    let element = $("#all-friend-for-block")
    let {
      friendsCurrentPage,
      isEndOfFriends,
      isLoadMore
    } = this.state
    if (element.scrollTop() + element.innerHeight() >= element[0].scrollHeight) {
      if (isLoadMore == false && isEndOfFriends == false) {
        this.setState({
          friendsCurrentPage: friendsCurrentPage + 1,
          isLoadMoreGroup: true
        }, () => {
          this.getFriends(friendsCurrentPage + 1)
        })
      }
    }
  }

  getFriends(currentpage) {
    let {
      friends,
      searchKey,
      groupDetail
    } = this.state
    let param = {
      currentpage: currentpage,
      currentdate: moment(new Date).format(CurrentDate),
      limit: 20,
      status: "FriendsNoJoinGroup",
      forFriendId: 0,
      groupid: groupDetail.groupid,
      findstring: searchKey
    }
    this.setState({
      isLoadMore: true
    })
    get(SOCIAL_NET_WORK_API, "Friends/GetListFriends" + objToQuery(param), result => {
      if (result.result == 1) {
        this.setState({
          friends: friends.concat(result.content.userInvites),
          isLoadMore: false
        })
        if (result.content.userInvites.length == 0) {
          this.setState({
            isEndOfFriends: true
          })
        }
      }
    })
  }

  onSearchKeyChange(e) {
    this.setState({
      searchKey: e.target.value,
      friends: [],
      friendsCurrentPage: 0,
      isEndOfFriends: false
    }, () => this.getFriends(0))
  }

  handleBlockGroup(group) {
    get(SOCIAL_NET_WORK_API, "GroupUser/BlockGroupUser?groupid=" + group.groupid, result => {
      if (result && result.result == 1) {
        this.handleGetGroupDetail(group)
      }
    })
  }

  handleUnBlockGroup(group) {
    get(SOCIAL_NET_WORK_API, "GroupUser/UnBlockGroupUser?groupid=" + group.groupid, result => {
      if (result && result.result == 1) {
        this.handleGetGroupDetail(group)
      }
    })
  }

  handleDeleteGroup(group) {
    get(SOCIAL_NET_WORK_API, "GroupUser/DeleteGroupUser?groupid=" + group.groupid, result => {
      if (result && result.result == 1) {
        this.setState({
          showNoti: true,
          confirmTitle: "",
          confirmMessage: "Xoá nhóm thành công",
          okCallback: () => {
            setTimeout(() => {
              this.props.leaveGroup(group)
              this.props.toggleGroupDetailDrawer(false)
              this.props.setCurrentGroup(null)
            }, 500);
          }
        })
      }
    })
  }

  handleInviteUser(user) {
    let {
      groupDetail,
      friends
    } = this.state
    let param = {
      groupid: groupDetail.groupid,
      userid: user.friendid
    }
    get(SOCIAL_NET_WORK_API, "GroupUser/InviteGroupUser" + objToQuery(param), result => {
      if (result && result.result == 1) {
        friends = friends.filter(item => item.friendid != user.friendid)
        this.setState({
          friends: friends
        })
      }
    })
  }

  handleRemoveUser(user) {
    let {
      groupDetail,
      userList,
      managerList
    } = this.state
    let param = {
      userid: user.memberid,
      groupid: groupDetail.groupid
    }

    this.setState({
      showConfim: true,
      confirmTitle: "",
      confirmMessage: "Bạn có muốn mời người này ra khỏi nhóm hay không?",
      okCallback: () => {
        get(SOCIAL_NET_WORK_API, "GroupUser/BandMemberGroupUser" + objToQuery(param), result => {
          if (result && result.result == 1) {
            this.setState({
              userList: userList.filter(item => item.memberid != user.memberid),
              managerList: userList.filter(item => item.memberid != user.memberid)
            })
          }
          else {
            this.setState({
              showNoti: true,
              okCallback: () => this.setState({ showNoti: false }),
              confirmTitle: "",
              confirmMessage: result.message
            })
          }
        })
      }
    })
  }

  handleAddOtherAdmin(user) {
    let {
      groupDetail,
      userList,
      managerList
    } = this.state
    let param = {
      userid: user.memberid,
      groupid: groupDetail.groupid
    }

    this.setState({
      showConfim: true,
      confirmTitle: "",
      confirmMessage: "Bạn muốn chỉ định người này làm quản trị viên không?",
      okCallback: () => {
        get(SOCIAL_NET_WORK_API, "GroupUser/AddAdminGroupUser" + objToQuery(param), result => {
          if (result && result.result == 1) {
            let userIndex = userList.findIndex(item => item.memberid == user.memberid)
            if (userIndex >= 0) {
              userList[userIndex].inviteadmin = 1
            }
            this.setState({
              userList: userList,
              showNoti: true,
              okCallback: () => this.setState({ showNoti: false }),
              confirmTitle: "",
              confirmMessage: "Gửi lời mời làm quản trị viên thành công."
            })
          } else {
            this.setState({
              showNoti: true,
              confirmTitle: "",
              confirmMessage: result.message,
            })
          }
        })
      }
    })
  }

  handleRemoveOtherAdmin(user) {
    let {
      groupDetail,
      userList,
      managerList
    } = this.state
    let param = {
      userid: user.memberid,
      groupid: groupDetail.groupid
    }

    get(SOCIAL_NET_WORK_API, "GroupUser/RemoveAdminGroupUser" + objToQuery(param), result => {
      if (result && result.result == 1) {

        let newManagerList = managerList.filter(item => item.memberid != user.memberid)
        userList.push({ ...user, inviteadmin: 0, isadmin: 0 })
        this.setState({
          userList: userList,
          managerList: newManagerList
        })
      } else {
        this.setState({
          showNoti: true,
          confirmTitle: "",
          confirmMessage: result.message
        })
      }
    })
  }

  componentDidMount() {
    let {
      currentGroup
    } = this.props
    if (currentGroup) {
      this.handleGetGroupDetail(this.props.currentGroup)
      this.handleGetPost(0, this.props.currentGroup)
      this.getManagerList(0, this.props.currentGroup)
      this.getUserInGroup(0, this.props.currentGroup)
    }
  }

  render() {
    let {
      groupDetail,
      activeMenuIndex,
      contentHeight,
      showMoreDescription
    } = this.state
    let {
      profile,
      currentGroupPosteds
    } = this.props


    let groupPrivacyOptions = objToArray(GroupPrivacies)


    return (
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => {
            this.props.toggleGroupDetailDrawer(false)
            this.props.setCurrentGroup(null)
          }}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Hội nhóm</label>
          </div>
          {
            profile ? <div className="user-reward">
              <div className="profile">
                <span className="user-name">{profile.fullname}</span>
                <span className="point">
                  <span>Điểm YOOT: {profile.mempoint}</span>
                </span>

              </div>
              <Avatar aria-label="recipe" className="avatar">
                <div className="img" style={{ background: `url("${profile.avatar}")` }} />
              </Avatar>
            </div> : <ContentLoader
              speed={2}
              width={200}
              height={42}
              viewBox="0 0 200 42"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
              style={{ height: "100%" }}
            >
                <rect x="7" y="6" rx="4" ry="4" width="140" height="8" />
                <rect x="47" y="21" rx="8" ry="8" width="100" height="16" />
                <rect x="160" y="0" rx="100" ry="100" width="40" height="40" />
              </ContentLoader>
          }
        </div>
        <div className="filter">
        </div>
        <div className="drawer-content" id="group-page-scrolling" style={{ overflow: "scroll", width: "100vw" }} >
          {
            groupDetail ? <div className="group-detail-content">
              <div className="group-background" style={{ background: `url("${groupDetail.backgroundimage}")` }}>
                <IconButton onClick={() => this.setState({ showGroupMenu: true })}><MoreHorizIcon /></IconButton>
                <div className="actions">
                  {
                    groupDetail.status == 0 ? <Button className="bt-submit" onClick={() => this.props.joinGroup(groupDetail.groupid, () => {
                      this.handleGetGroupDetail(groupDetail)
                    })}>Tham gia</Button> : ""
                  }
                  {
                    groupDetail.status == 2 ? <Button className="bt-submit" onClick={() => this.props.acceptGroup(groupDetail.groupid, () => {
                      this.handleGetGroupDetail(groupDetail)
                    }, null, groupDetail)}>Chấp nhận</Button> : ""
                  }
                  {
                    groupDetail.status == 2 ? <Button className="bt-cancel" onClick={() => this.props.joinGroup(groupDetail.groupid, () => {
                      this.props.toggleGroupDetailDrawer(false)
                      this.props.setCurrentGroup(null)
                    })}>Từ chối</Button> : ""
                  }
                </div>
              </div>
              <div className="group-name">
                <span>{groupDetail.groupname.toLowerCase()}</span>
              </div>
              <div className="group-info">
                <div className="group-menu">
                  <ul>
                    <li><Button className={activeMenuIndex == 0 ? "bt-submit" : ""} onClick={() => this.onClickMenu(0)}>Mô tả</Button></li>
                    <li><Button className={activeMenuIndex == 1 ? "bt-submit" : ""} onClick={() => this.onClickMenu(1)}>Nội quy</Button></li>
                    <li><Button className={activeMenuIndex == 2 ? "bt-submit" : ""} onClick={() => this.onClickMenu(2)}>Ban quản trị</Button></li>
                  </ul>
                </div>
                <AnimateHeight
                  duration={300}
                  height={contentHeight > 0 ? contentHeight : $(`#info-content-${0}`).height()}
                  className={"animation-height"}
                >
                  {
                    activeMenuIndex === 0 ? <div id="info-content-0">
                      <ShowMoreText
                        lines={5}
                        more={<span><span>&#8811;</span> Rút gọn</span>}
                        less={<span><span>&#8811;</span> Xem thêm</span>}
                        className='content-css'
                        anchorClass='toggle-button blued'
                        expanded={showMoreDescription}
                        onClick={() => {
                          this.onClickMenu(0)
                        }}
                      >
                        <pre >
                          {
                            groupDetail.description
                          }
                        </pre>
                      </ShowMoreText>
                      <div className="group-reward">
                        <ul>
                          <li><FiberManualRecordIcon /> {groupPrivacyOptions.find(item => item.code == groupDetail.typegroup).label}</li>
                          <li><FiberManualRecordIcon /> {groupDetail.nummember} thành viên</li>
                          <li><FiberManualRecordIcon /> {groupDetail.numpost} bài đăng</li>
                          <li><FiberManualRecordIcon /> Đã tạo ngày {moment(groupDetail.createdate).format("DD/MM/YYYY")}</li>
                        </ul>
                      </div>
                    </div> : ""
                  }
                  {
                    activeMenuIndex === 1 ? <div id="info-content-1" style={{ minHeight: "10px" }}>
                      {
                        groupDetail.groupUserPolicies[0] ? <pre>
                          {
                            groupDetail.groupUserPolicies[0].description
                          }
                        </pre> : ""
                      }
                    </div> : ""
                  }
                  {
                    activeMenuIndex === 2 ? <div id="info-content-2">
                      <div className="manager-list">
                        {
                          groupDetail.managers.length > 0 ? <ul>
                            {
                              groupDetail.managers.map((item, index) => <li key={index}>
                                <Avatar className="avatar">
                                  <div className="img" style={{ background: `url("${item.avatar}")` }} />
                                </Avatar>
                                <div className="name">
                                  <span>{item.nameuser}</span>
                                  {
                                    item.isadmin == 2 ? <p className="blued">Người sáng lập</p> : <p>Quản trị viên</p>
                                  }
                                </div>
                              </li>)
                            }
                          </ul> : ""
                        }
                      </div>
                    </div> : ""
                  }
                </AnimateHeight>
              </div>
              {
                groupDetail.status != 0 && groupDetail.status != 2 ? <div className="actions">
                  <ul>
                    <li>
                      <Button onClick={() => {
                        this.props.setCurrentGroup(groupDetail)
                        this.props.togglePostDrawer(true, true)
                      }}>
                        <img src={createPost} />
                        <span>Tạo bài đăng</span>
                      </Button>
                    </li>
                    <li>
                      <Button onClick={() => this.setState({ showAllFriendsDrawer: true }, () => this.getFriends(0))}>
                        <img src={NewGr} />
                        <span>Mời bạn bè</span>
                      </Button>
                    </li>
                    <li>
                      <Button onClick={() => this.setState({ showMemberDrawer: true })}>
                        <img src={Members} />
                        <span>DS thành viên</span>
                      </Button>
                    </li>
                  </ul>
                </div> : ""
              }
              <div className="posted">
                {
                  currentGroupPosteds && currentGroupPosteds.length > 0 ? <ul>
                    {
                      currentGroupPosteds.map((post, index) => <li key={index} >
                        <Post data={post} history={this.props.history} userId={post.iduserpost} containerRef={document.getElementById("group-page-scrolling")} />
                      </li>)
                    }
                  </ul> : ""
                }
              </div>
            </div> : ""
          }
          {/* <div style={{ height: "50px", background: "#fff", zIndex: 0 }}>
            {
              <Loader type="small" style={{ background: "#fff" }} width={30} height={30} />
            }
          </div> */}

        </div>
        {
          renderSearchGroupDrawer(this)
        }
        {
          renderAllUserDrawer(this)
        }
        {
          renderAllFriendToInvite(this)
        }
        {
          renderGroupMenu(this)
        }
        {
          renderConfirmDrawer(this)
        }
        {
          renderNotiDrawer(this)
        }
        {
          renderUpdateGroupDrawer(this)
        }
      </div>
    );
  }
}


const mapStateToProps = state => {
  return {
    ...state.user,
    ...state.group,
    ...state.posted
  }
};

const mapDispatchToProps = dispatch => ({
  toggleGroupDetailDrawer: (isShow) => dispatch(toggleGroupDetailDrawer(isShow)),
  setCurrentGroup: (group) => dispatch(setCurrentGroup(group)),
  setCurrentGroupPosted: (posts) => dispatch(setCurrentGroupPosted(posts)),
  acceptGroup: (groupId, successCallback, errorCallback, currentGroup) => dispatch(acceptGroup(groupId, successCallback, errorCallback, currentGroup)),
  joinGroup: (groupId, successCallback, errorCallback) => dispatch(joinGroup(groupId, successCallback, errorCallback)),
  togglePostDrawer: (isShow, isPostToGroup) => dispatch(togglePostDrawer(isShow, isPostToGroup)),
  leaveGroup: (group) => dispatch(leaveGroup(group))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);

const renderSearchGroupDrawer = (component) => {
  let {
    showMemberDrawer,
    groupDetail,
    userList,
    userCount,
    managerCount,
    managerList
  } = component.state


  return (
    <Drawer anchor="bottom" className="group-members" open={showMemberDrawer} >
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.setState({ showMemberDrawer: false })}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Thành viên</label>
          </div>
        </div>
        <div className="filter">

        </div>
        <StickyContainer className="drawer-content" style={{ overflow: "scroll", width: "100vw" }} relative={true}>
          <Sticky relative={true}>
            {({ style }) => (
              <div style={{ ...style, zIndex: 999 }}>
                <label className="list-header">Quản trị viên và người kiêm duyệt</label>
              </div>
            )}
          </Sticky>
          {
            managerList && managerList.length > 0 ? <div className="user-list">
              {
                managerCount ? <label><span>Số lượng</span><span className="red">{managerCount}</span></label> : ""
              }
              <ul>
                {
                  managerList.map((item, index) => <li key={index}>
                    <div>
                      <Avatar className="avatar">
                        <div className="img" style={{ background: `url("${item.avatar}")` }} />
                      </Avatar>
                      <div className="name">
                        <span>{item.nameuser}</span>
                        {
                          item.isadmin == 2 ? <p className="blued">Người sáng lập</p> : <p>Quản trị viên</p>
                        }
                      </div>
                    </div>
                    {
                      item.friendstatus == 0 && groupDetail && groupDetail.isadmin == 0 ? <Button className="bt-submit" onClick={() => component.addFriend(item.memberid)}>Kết bạn</Button> : ""
                    }
                    {
                      item.friendstatus == 1 && groupDetail && groupDetail.isadmin == 0 ? <Button className="bt-cancel" onClick={() => component.addFriend(item.memberid)}>Huỷ</Button> : ""
                    }
                    {
                      groupDetail && groupDetail.isadmin != 0 ? <CustomMenu>
                        <MenuItem onClick={() => component.handleRemoveOtherAdmin(item)}>Bỏ chỉ định admin</MenuItem> : ""
                        <MenuItem onClick={() => component.handleRemoveUser(item)}>Huỷ người này</MenuItem>
                      </CustomMenu> : ""
                    }
                  </li>)
                }
              </ul>
            </div> : ""
          }
          <Sticky relative={true} >
            {({ style, isSticky }) => (
              <div style={{ ...style, zIndex: 1000, position: isSticky ? "fixed" : "relative" }}>
                <label className="list-header">Thành viên</label>
              </div>
            )}
          </Sticky>
          {
            userList && userList.length > 0 ? <div className="user-list">
              {
                userCount ? <label><span>Số lượng</span><span className="red">{userCount}</span></label> : ""
              }
              <ul>
                {
                  userList.map((item, index) => <li key={index}>
                    <div>
                      <Avatar className="avatar">
                        <div className="img" style={{ background: `url("${item.avatar}")` }} />
                      </Avatar>
                      <div className="name">
                        <span>{item.nameuser}</span>
                        {
                          item.isadmin == 2 ? <p className="blued">Người sáng lập</p> : ""
                        }
                        {
                          item.isadmin == 1 ? <p>Quản trị viên</p> : ""
                        }
                        {
                          item.isadmin == 0 ? <p>Thành viên</p> : ""
                        }
                      </div>
                    </div>
                    {
                      item.friendstatus == 0 && groupDetail && groupDetail.isadmin == 0 ? <Button className="bt-submit" onClick={() => component.addFriend(item.memberid)}>Kết bạn</Button> : ""
                    }
                    {
                      item.friendstatus == 1 && groupDetail && groupDetail.isadmin == 0 ? <Button className="bt-cancel" onClick={() => component.addFriend(item.memberid)}>Huỷ</Button> : ""
                    }
                    {
                      groupDetail && groupDetail.isadmin != 0 ? <CustomMenu>
                        {
                          item.isadmin == 0 && item.inviteadmin != 1 ? <MenuItem onClick={() => component.handleAddOtherAdmin(item)}>Chỉ định làm admin</MenuItem> : ""
                        }
                        <MenuItem onClick={() => component.handleRemoveUser(item)}>Huỷ người này</MenuItem>
                      </CustomMenu> : ""
                    }
                  </li>)
                }
              </ul>
              {
                userCount > 30 ? <span onClick={() => component.setState({ showAllMemberDrawer: true })}>Xem tất cả</span> : ""
              }
            </div> : ""
          }
        </StickyContainer>
      </div>
    </Drawer>
  )
}

const renderAllUserDrawer = (component) => {
  let {
    showAllMemberDrawer,
    groupDetail,
    userList,
    userCount,
  } = component.state


  return (
    <Drawer anchor="bottom" className="group-members" open={showAllMemberDrawer} >
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.setState({ showAllMemberDrawer: false, userList: [] }, () => component.getUserInGroup(0, groupDetail))}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Thành viên</label>
          </div>
        </div>
        <div className="filter">

        </div>
        <div className="drawer-content" id="all-user-in-group" style={{ overflow: "scroll", width: "100vw" }} onScroll={() => component.onScroll()}>
          {
            userList && userList.length > 0 ? <div className="user-list">
              <ul>
                {
                  userList.map((item, index) => <li key={index}>
                    <div>
                      <Avatar className="avatar">
                        <div className="img" style={{ background: `url("${item.avatar}")` }} />
                      </Avatar>
                      <div className="name">
                        <span>{item.nameuser}</span>
                        {
                          item.isadmin == 2 ? <p className="blued">Người sáng lập</p> : ""
                        }
                        {
                          item.isadmin == 1 ? <p>Quản trị viên</p> : ""
                        }
                        {
                          item.isadmin == 0 ? <p>Thành viên</p> : ""
                        }
                      </div>
                    </div>
                    {
                      item.friendstatus == 0 ? <Button className="bt-submit" onClick={() => component.addFriend(item.memberid)}>Kết bạn</Button> : ""
                    }
                    {
                      item.friendstatus == 1 ? <Button className="bt-cancel" onClick={() => component.addFriend(item.memberid)}>Huỷ</Button> : ""
                    }
                  </li>)
                }
              </ul>
            </div> : ""
          }
        </div>
      </div>
    </Drawer>
  )
}

const renderAllFriendToInvite = (component) => {
  let {
    friends,
    showAllFriendsDrawer
  } = component.state
  let {
    profile
  } = component.props

  return (
    <Drawer anchor="bottom" className="find-friends invite-to-group" open={showAllFriendsDrawer} >
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction"
            onClick={() =>
              component.setState({ showAllFriendsDrawer: false, friends: [], friendsCurrentPage: 0, isEndOfFriends: false })
            }>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Mời bạn bè</label>
          </div>
        </div>
        <div className="filter">
          <TextField
            className="custom-input"
            variant="outlined"
            placeholder="Nhập tên bạn bè để tìm kiếm"
            className="search-box"
            style={{
              width: "calc(100% - 20px",
              margin: "0px 0px 10px 10px",
            }}
            onChange={e => component.onSearchKeyChange(e)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={search} />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div style={{ overflow: "scroll", width: "100vw" }} id="all-user-list" onScroll={() => component.onAllUserScroll()}>
          <div className="friend-list" >
            <ul>
              {
                friends.map((item, index) => <li key={index} className="friend-layout">
                  <div className="friend-info" >
                    <Avatar aria-label="recipe" className="avatar">
                      <div className="img" style={{ background: `url("${item.friendavatar}")` }} />
                    </Avatar>
                    <label>
                      <span className="name">{item.friendname}</span>
                      {/* <span className="with-friend">{item.numfriendwith} bạn chung</span> */}
                      <span className="with-friend">Bạn bè</span>
                    </label>
                  </div>
                  <div className="action">
                    <Button className="bt-submit" onClick={() => component.handleInviteUser(item)}>Mời</Button>
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

const renderGroupMenu = (component) => {
  let {
    showGroupMenu,
    groupDetail
  } = component.state

  return (
    <Drawer anchor="bottom" className="group-menu" open={showGroupMenu} onClose={() => component.setState({ showGroupMenu: false })}>
      <div className="menu-content">
        <div className="menu-header">
          <div className="direction" onClick={() => component.setState({ showGroupMenu: false })}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Tuỳ chọn nhóm</label>
          </div>
        </div>
        {
          groupDetail ? <div className="menu-list">
            <ul>
              {
                groupDetail.isadmin != 2 ? <li><Button className="outline" onClick={() => component.setState({
                  showConfim: true,
                  showGroupMenu: false,
                  confirmTitle: "",
                  confirmMessage: "Sau khi rời nhóm, bạn không nhìn thấy thông tin nhóm, bạn có chắc muốn rời nhóm hay không?",
                  okCallback: () => component.handleLeaveGroup()
                })}>Rời nhóm</Button></li> : ""
              }
              {
                groupDetail.isadmin == 2 ? <li>
                  <Button className="outline" onClick={() => component.setState({ showUpdateGroup: true, showGroupMenu: false })}>Chỉnh sửa</Button>
                </li> : ""
              }
              {
                groupDetail.isadmin == 2 && groupDetail.statusgroup == 1 ? <li onClick={() => component.setState({
                  showConfim: true,
                  showGroupMenu: false,
                  confirmTitle: "",
                  confirmMessage: "Sau khi đóng nhóm, mọi người sẽ không tìm thấy thông tin nhóm ngoại trừ bạn, bạn có chắc chắn muốn đóng nhóm hay không?",
                  okCallback: () => component.handleBlockGroup(groupDetail)
                })}>
                  <Button className="outline">Đóng nhóm tạm thời</Button>
                </li> : ""
              }
              {
                groupDetail.isadmin == 2 && groupDetail.statusgroup == 2 ? <li onClick={() => component.setState({
                  showConfim: true,
                  showGroupMenu: false,
                  confirmTitle: "",
                  confirmMessage: "Sau khi mở nhóm, mọi người sẽ tìm thấy thông tin nhóm, bạn có chắc chắn muốn mở nhóm hay không?",
                  okCallback: () => component.handleUnBlockGroup(groupDetail)
                })}>
                  <Button className="outline">Mở nhóm</Button>
                </li> : ""
              }
              {
                groupDetail.isadmin == 2 ? <li onClick={() => component.setState({
                  showConfim: true,
                  showGroupMenu: false,
                  confirmTitle: "",
                  confirmMessage: "Sau khi xoá nhóm, bạn và mọi người sẽ không tìm thấy thông tin, bạn có chắc chắn muốn xoá nhóm hay không?",
                  okCallback: () => component.handleDeleteGroup(groupDetail)
                })}>
                  <Button className="outline">Đóng nhóm vĩnh viễn</Button>
                </li> : ""
              }
            </ul>
          </div> : ""
        }
      </div>
    </Drawer>
  )
}

const renderConfirmDrawer = (component) => {
  let {
    showConfim,
    okCallback,
    confirmTitle,
    confirmMessage
  } = component.state
  return (
    <Drawer anchor="bottom" className="confirm-drawer" open={showConfim} onClose={() => component.setState({ showConfim: false })}>
      <div className='jon-group-confirm'>
        <label>{confirmTitle}</label>
        <p style={{ textAlign: "center" }}>{confirmMessage}</p>
        <div className="mt20">
          <Button className="bt-confirm" onClick={() => component.setState({ showConfim: false }, () => okCallback ? okCallback() : null)}>Đồng ý</Button>
          <Button className="bt-submit" onClick={() => component.setState({ showConfim: false })}>Huỷ</Button>
        </div>
      </div>
    </Drawer>
  )
}

const renderNotiDrawer = (component) => {
  let {
    showNoti,
    okCallback,
    confirmTitle,
    confirmMessage
  } = component.state
  return (
    <Drawer anchor="bottom" className="confirm-drawer" open={showNoti} onClose={() => component.setState({ showNoti: false })}>
      <div className='jon-group-confirm'>
        {
          confirmTitle && confirmTitle != "" ? <label>{confirmTitle}</label> : ""
        }
        <p style={{ textAlign: "center" }}>{confirmMessage}</p>
        {
          okCallback ? <div className="mt20">
            <Button className="bt-confirm" onClick={() => component.setState({ showNoti: false }, () => okCallback ? okCallback() : null)}>Đồng ý</Button>
          </div> : ""
        }
      </div>
    </Drawer>
  )
}

const renderUpdateGroupDrawer = (component) => {


  let {
    groupCoverImage,
    description,
    policygroup,
    groupName,
    groupType,
    showGroupPrivacySelectOption,
    showUpdateGroup,
    groupDetail,
    backgroundPosted,
  } = component.state



  return (
    <Drawer anchor="bottom" className="create-group-drawer" open={showUpdateGroup} >
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.setState({ showUpdateGroup: false })}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Tạo nhóm</label>
          </div>
          <Button className="bt-submit" onClick={() => component.handleUpdateGroup()}>Hoàn tất</Button>
        </div>
        <div className="filter">
        </div>
        <div className="content-form" style={{ overflow: "scroll", width: "100vw", paddingBottom: "100px" }} >
          <div>
            <label>Tên nhóm</label>
            <TextField
              className="custom-input"
              className="order-reason"
              variant="outlined"
              placeholder="Đặt tên nhóm"
              value={groupName}
              onChange={e => component.setState({ groupName: e.target.value })}
              style={{
                width: "100%",
                marginBottom: "10px",
              }}
            />
            {
              showUpdateGroup ? <MultiInput
                style={{
                  minHeight: "100px",
                  border: "1px solid rgba(0, 0, 0, 0.15)",
                  marginBottom: "10px"
                }}
                onChange={value => component.setState({
                  description: value.text,
                })}
                topDown={true}
                placeholder={"Mô tả nhóm"}
                enableHashtag={false}
                enableMention={false}
                centerMode={false}
                value={description}
                suggestionClass="custom-suggestion"
              /> : ""
            }
            <label>Tải lên ảnh bìa</label>
            <div className="cover-image">
              {
                groupCoverImage || backgroundPosted ? <GroupImage groupCoverImage={groupCoverImage} backgroundPosted={backgroundPosted} /> : ""
              }
              <Dropzone onDrop={acceptedFiles => component.setState({ groupCoverImage: acceptedFiles[0] })}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()} >
                    <input {...getInputProps()} accept="image/*" />
                    <Button className={groupCoverImage || backgroundPosted ? "light" : "dask"}>Tải lại ảnh khác</Button>
                  </div>
                )}
              </Dropzone>

            </div>
            <label>Quy định nhóm</label>
            {

              showUpdateGroup ? <MultiInput
                style={{
                  minHeight: "100px",
                  border: "1px solid rgba(0, 0, 0, 0.15)",
                  marginBottom: "10px"
                }}
                onChange={value => component.setState({
                  policygroup: value.text,
                })}
                topDown={true}
                placeholder={"Quy định nhóm"}
                enableHashtag={false}
                enableMention={false}
                centerMode={false}
                value={policygroup}
                suggestionClass="custom-suggestion"
              /> : ""
            }
            <label>Quyền riêng tư</label>
            <ClickAwayListener onClickAway={() => component.setState({ showGroupPrivacySelectOption: false })}>
              <div className="group-type-select custom" onClick={() => component.setState({ showGroupPrivacySelectOption: !showGroupPrivacySelectOption })}>
                <span className="title" >{groupType ? groupType.label : "Chọn quyền riêng tư"}</span>
                {
                  showGroupPrivacySelectOption ? <div className="options">
                    <span onClick={() => component.setState({ groupType: GroupPrivacies.Public })}>{GroupPrivacies.Public.label}</span>
                    <span onClick={() => component.setState({ groupType: GroupPrivacies.Private })}>{GroupPrivacies.Private.label}</span>
                  </div> : ""
                }
              </div>
            </ClickAwayListener>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

