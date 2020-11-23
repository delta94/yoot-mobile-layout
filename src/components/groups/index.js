import React from "react";
import "./style.scss";
import {
  addHeaderContent,
  addFooterContent,
  toggleHeader,
  toggleFooter,
  toggleCreateGroupDrawer,
  togglePostDrawer,
  toggleGroupDrawer,
  toggleGroupInviteDrawer,
  toggleGroupDetailDrawer,
} from "../../actions/app";
import {
  setJoinedGroup,
  setMyGroup,
  setInvitedGroup,
  acceptGroup,
  joinGroup,
  setCurrentGroup,
  createGroupSuccess,
} from "../../actions/group";
import { setGroupPosted } from "../../actions/posted";
import { connect } from "react-redux";
import {
  IconButton,
  Button,
  Drawer,
  TextField,
  InputAdornment,
  Avatar,
  Badge,
  FormControlLabel,
  Checkbox,
  ClickAwayListener,
  AppBar,
  Tabs,
  Tab,
} from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import {
  ChevronLeft as ChevronLeftIcon,
  SpaOutlined,
} from "@material-ui/icons";
import { StickyContainer, Sticky } from "react-sticky";
import Post from "../post";
import $ from "jquery";
import { GroupPrivacies } from "../../constants/constants";
import { get, postFormData } from "../../api";
import { CurrentDate, SOCIAL_NET_WORK_API } from "../../constants/appSettings";
import { objToQuery, objToArray, showNotification } from "../../utils/common";
import EmptyPost from "../common/empty-post";
import Loader from "../common/loader";
import moment from "moment";
import Dropzone from "react-dropzone";
import MultiInput from "../common/multi-input";
import GroupImage from "./group-image";

const Newfeed = require("../../assets/icon/Lesson.png");
const Group1 = require("../../assets/icon/Group@1x.png");
const NotiBw = require("../../assets/icon/NotiBw@1x.png");
const ProfileBW = require("../../assets/icon/ProfileBW.png");
const Videos = require("../../assets/icon/Video.png");
const Find = require("../../assets/icon/Find@1x.png");
const createPost = require("../../assets/icon/createPost@1x.png");
const NewGr = require("../../assets/icon/NewGr@1x.png");
const Members = require("../../assets/icon/Members@1x.png");
const search = require("../../assets/icon/Find@1x.png");

const checkIcon = require("../../assets/images/check.png");
const checkedIcon = require("../../assets/images/checked.png");
const noImageGroup = require("../../assets/images/group_members_icon.png");

let currentDate = moment(new Date()).format(CurrentDate);

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      postedsCurrentPage: 0,
      isEndOfPosteds: false,
      isLoadMore: false,
      allGroupPosteds: [],
      searchKey: "",
      groups: [],
      groupsCurrentPage: 0,
      isLoadMoreGroup: false,
      isEndOfGroupList: false,
      description: "",
      policygroup: "",
      groupType: null,
      groupTabIndex: 0,
      isEndOfInvitedGroup: false,

      myGroupsCurrentPage: 0,
      isLoadMoreMyGroups: false,
      isEndOfMyGroup: false,

      joinedGroupsCurrentPage: 0,
      isLoadMoreJoinedGroups: false,
      isEndOfJoinedGroup: false,
    };
  }

  handleGetPost(currentpage) {
    let param = {
      currentpage: currentpage,
      currentdate: currentDate,
      limit: 20,
      groupid: 0,
      isVideo: 0,
      suggestGroup: 1,
      forFriendId: 0,
      albumid: 0,
    };
    this.setState({
      isLoadMore: true,
    });

    get(
      SOCIAL_NET_WORK_API,
      "PostNewsFeed/GetAllNewsFeed" + objToQuery(param),
      (result) => {
        if (result && result.result == 1) {
          result.content.newsFeeds.map((item) => {
            if (item.iconlike < 0) item.iconlike = 0;
          });
          this.setState({
            isLoadMore: false,
          });
          this.props.setGroupPosted(result.content.newsFeeds);

          if (result.content.newsFeeds.length == 0) {
            this.setState({
              isEndOfPosteds: true,
              isLoadMore: false,
            });
          }
        }
      }
    );
  }

  onSearchChange(e) {
    this.setState(
      {
        searchKey: e.target.value,
        groupsCurrentPage: 0,
        isEndOfGroupList: false,
        groups: [],
      })
    clearTimeout(this.inputTimer)
    this.inputTimer = setTimeout(() => {
      this.handleGetAllGroup(0);
    }, 500)
  }

  handleGetAllGroup(currentpage) {
    let { groups, searchKey } = this.state;
    let param = {
      currentpage: currentpage,
      currentdate: moment(new Date()).format(CurrentDate),
      limit: 20,
      skin: "All",
      findstring: searchKey,
    };
    this.setState({
      isLoadMoreGroup: true,
    });
    get(
      SOCIAL_NET_WORK_API,
      "GroupUser/GetListGroupUser" + objToQuery(param),
      (result) => {
        if (result && result.result == 1) {
          this.setState({
            groups: groups.concat(result.content.groupUsers),
            isLoadMoreGroup: false,
          });
          if (result.content.groupUsers.length == 0) {
            this.setState({ isEndOfGroupList: true, isLoadMoreGroup: false });
          }
        }
      }
    );
  }

  getJoinedGroup(currentpage) {
    let param = {
      currentpage: currentpage,
      currentdate: moment(new Date()).format(CurrentDate),
      limit: 20,
      skin: "Join",
    };
    this.setState({
      isLoadMoreJoinedGroups: true,
    });
    let { joinedGroups } = this.props;
    get(
      SOCIAL_NET_WORK_API,
      "GroupUser/GetListGroupUser" + objToQuery(param),
      (result) => {
        if (result && result.result == 1) {
          if (joinedGroups && joinedGroups.length > 0) {
            joinedGroups = joinedGroups.concat(result.content.groupUsers);
          } else {
            joinedGroups = result.content.groupUsers;
          }
          this.props.setJoinedGroup(joinedGroups, result.content.numGroupJoin);

          if (result.content.groupUsers.length == 0) {
            this.setState({
              isEndOfJoinedGroup: true,
              isLoadMoreJoinedGroups: false,
            });
          }
        }
        this.setState({
          isLoadMoreJoinedGroups: false,
        });
      }
    );
  }

  getMyGroup(currentpage) {
    let param = {
      currentpage: currentpage,
      currentdate: moment(new Date()).format(CurrentDate),
      limit: 20,
      skin: "Manager",
    };
    let { myGroups } = this.props;
    this.setState({
      isLoadMoreMyGroups: true,
    });
    get(
      SOCIAL_NET_WORK_API,
      "GroupUser/GetListGroupUser" + objToQuery(param),
      (result) => {
        if (result && result.result == 1) {
          if (myGroups && myGroups.length > 0) {
            myGroups = myGroups.concat(result.content.groupUsers);
          } else {
            myGroups = result.content.groupUsers;
          }
          this.props.setMyGroup(myGroups);

          if (result.content.groupUsers.length == 0) {
            this.setState({ isEndOfMyGroup: true, isLoadMoreMyGroups: false });
          }
        }
        this.setState({
          isLoadMoreMyGroups: false,
        });
      }
    );
  }

  getInviteGroup(currentpage) {
    let param = {
      currentpage: currentpage,
      currentdate: moment(new Date()).format(CurrentDate),
      limit: 20,
      skin: "IsInvite",
    };
    this.setState({
      isLoadMoreGroup: true,
    });
    get(
      SOCIAL_NET_WORK_API,
      "GroupUser/GetListGroupUser" + objToQuery(param),
      (result) => {
        if (result && result.result == 1) {
          this.props.setInvitedGroup(result.content.groupUsers);
          this.setState({
            isLoadMoreGroup: false,
          });
          if (result.content.groupUsers.length == 0) {
            this.setState({
              isEndOfInvitedGroup: true,
              isLoadMoreGroup: false,
            });
          }
        }
      }
    );
  }

  onSearchGroupScroll() {
    let element = $("#search-groups-box");
    let { groupsCurrentPage, isLoadMoreGroup, isEndOfGroupList } = this.state;
    if (element)
      if (
        element.scrollTop() + element.innerHeight() >=
        element[0].scrollHeight
      ) {
        if (isLoadMoreGroup == false && isEndOfGroupList == false) {
          this.setState(
            {
              groupsCurrentPage: groupsCurrentPage + 1,
              isLoadMoreGroup: true,
            },
            () => {
              this.handleGetAllGroup(groupsCurrentPage + 1);
            }
          );
        }
      }
  }

  joinGroup(groupid) {
    let { groups } = this.state;
    get(
      SOCIAL_NET_WORK_API,
      "GroupUser/JoinGroupUser?groupid=" + groupid,
      (result) => {
        if (result && result.result == 1) {
          this.setState({
            showJoinGroupConfirm: false,
            currentGroupId: null,
            isRead: false,
            groups: groups.map((item) =>
              item.groupid === groupid
                ? item.typegroup === 1
                  ? { ...item, status: 1 }
                  : item.typegroup === 2 && { ...item, status: 1 }
                : item
            ),
          });
        }
      }
    );
  }

  closeCreateDrawer(isForce) {
    let { isChanged } = this.state;
    if (isChanged == true && !isForce) {
      this.setState({
        showConfim: true,
        okCallback: () => {
          this.setState({
            groupName: "",
            groupCoverImage: null,
            description: "",
            policygroup: "",
            groupType: null,
            isChanged: false,
          });
          this.props.toggleCreateGroupDrawer(false);
        },
        confirmTitle: "Bạn muốn rời khỏi trang này?",
        confirmMessage: "Những thông tin vừa thay đổi vẫn chưa được lưu.",
      });
    } else {
      this.setState({
        groupName: "",
        groupCoverImage: null,
        description: "",
        policygroup: "",
        groupType: null,
        isChanged: false,
      });
      this.props.toggleCreateGroupDrawer(false);
    }
  }

  handleGetGroupDetail(groupid) {
    if (!groupid) return;
    get(
      SOCIAL_NET_WORK_API,
      "GroupUser/GetOneGroupUser?groupid=" + groupid,
      (result) => {
        if (result && result.result == 1) {
          this.props.createGroupSuccess(result.content.groupUser);
        }
      }
    );
  }

  createGroup() {
    let {
      groupName,
      groupCoverImage,
      policygroup,
      description,
      groupType,
    } = this.state;

    let formData = new FormData();

    if (groupName && groupName != "") {
      formData.append("name", groupName.toString());
    } else {
      showNotification("", "Vui lòng nhập tên nhóm!");
      return;
    }
    if (groupType) {
      formData.append("typegroup", groupType.code.toString());
    } else {
      showNotification("", "Vui lòng chọn quyền riêng tư!");
      return;
    }

    if (description && description != "") {
      formData.append("description", description.toString());
    }

    if (policygroup && policygroup != "") {
      formData.append(
        "policygroup",
        JSON.stringify([
          {
            title: "",
            description: policygroup,
            id: 0,
          },
        ])
      );
    }

    if (groupCoverImage) {
      formData.append("background", groupCoverImage);
    }

    postFormData(
      SOCIAL_NET_WORK_API,
      "GroupUser/CreateGroupUser",
      formData,
      (result) => {
        if (result && result.result == 1) {
          this.handleGetGroupDetail(result.content.groupuser.id);
          this.closeCreateDrawer(true);
          this.getJoinedGroup(0);
          this.getMyGroup(0);
        }
      }
    );
  }

  handleAcceptGroup(group) {
    if (group && group.groupid) {
      this.props.acceptGroup(group.groupid, null, null, group);
    }
  }

  handleJoinGroup(group) {
    if (group && group.groupid) {
      this.props.joinGroup(group.groupid);
    }
  }

  groupScroll(groupTabIndex) {
    let element = $("#group-list");
    let {
      isLoadMoreJoinedGroups,
      isEndOfJoinedGroup,
      joinedGroupsCurrentPage,
      isLoadMoreMyGroups,
      isEndOfMyGroup,
      myGroupsCurrentPage,
    } = this.state;
    if (element)
      if (
        element.scrollTop() + element.innerHeight() >=
        element[0].scrollHeight
      ) {
        if (groupTabIndex == 0) {
          if (isLoadMoreJoinedGroups == false && isEndOfJoinedGroup == false) {
            this.setState(
              {
                joinedGroupsCurrentPage: joinedGroupsCurrentPage + 1,
                isLoadMoreJoinedGroups: true,
              },
              () => {
                this.getJoinedGroup(joinedGroupsCurrentPage + 1);
              }
            );
          }
        } else {
          if (isLoadMoreMyGroups == false && isEndOfMyGroup == false) {
            this.setState(
              {
                myGroupsCurrentPage: myGroupsCurrentPage + 1,
                isLoadMoreMyGroups: true,
              },
              () => {
                this.getMyGroup(myGroupsCurrentPage + 1);
              }
            );
          }
        }
      }
  }

  componentWillMount() {
    this.props.addHeaderContent(renderHeader(this));
    this.props.addFooterContent(renderFooter(this));
    this.props.toggleHeader(true);
    this.props.toggleFooter(true);
    this.handleGetPost(0);
    document.addEventListener("scroll", () => {
      let element = $("html");
      let { postedsCurrentPage, isEndOfPosteds, isLoadMore } = this.state;
      let { allGroupPosteds } = this.props;

      if (!allGroupPosteds || allGroupPosteds.length == 0) return;
      if (element.scrollTop() + window.innerHeight >= element[0].scrollHeight) {
        if (isLoadMore == false && isEndOfPosteds == false) {
          this.setState(
            {
              postedsCurrentPage: postedsCurrentPage + 1,
              isLoadMore: true,
            },
            () => {
              this.handleGetPost(postedsCurrentPage + 1);
            }
          );
        }
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.woldNotiUnreadCount != this.props.woldNotiUnreadCount ||
      nextProps.skillNotiUnreadCount != this.props.skillNotiUnreadCount
    )
      this.props.addFooterContent(renderFooter(this));
  }

  render() {
    let { isLoadMore } = this.state;
    let { allGroupPosteds } = this.props;
    return (
      <div className="community-page groups-page">
        <StickyContainer className="container">
          <Sticky topOffset={-60}>
            {({ style }) => (
              <div style={{ ...style, top: "60px", zIndex: 999 }}>
                <div className="post-menu-list">
                  <div>
                    <span
                      className={"bt "}
                      onClick={() =>
                        this.setState({ showSearchGroupDrawer: true }, () =>
                          this.handleGetAllGroup(0)
                        )
                      }
                    >
                      <img src={Find} />
                      <span>Tìm nhóm</span>
                    </span>
                    <span
                      className={"bt "}
                      onClick={() => this.props.togglePostDrawer(true, true)}
                    >
                      <img src={createPost} />
                      <span>Tạo bài đăng</span>
                    </span>
                    <span
                      className={"bt "}
                      onClick={() => this.props.toggleCreateGroupDrawer(true)}
                    >
                      <img src={NewGr} />
                      <span>Tạo nhóm</span>
                    </span>
                    <span
                      className={"bt "}
                      onClick={() => {
                        this.props.toggleGroupDrawer(true);
                        this.getJoinedGroup(0);
                        this.getMyGroup(0);
                      }}
                    >
                      <img src={Members} />
                      <span>DS nhóm của tôi</span>
                    </span>
                    <span
                      className={"bt "}
                      onClick={() => {
                        this.props.toggleGroupInviteDrawer(true);
                        this.getInviteGroup(0);
                      }}
                    >
                      <img src={NewGr} />
                      <span>Lời mời vào nhóm</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Sticky>
          {allGroupPosteds && allGroupPosteds.length == 0 ? (
            <ul className="post-list">
              <EmptyPost />
            </ul>
          ) : (
              ""
            )}
          {allGroupPosteds && allGroupPosteds.length > 0 ? (
            <ul className="post-list">
              {allGroupPosteds.map((post, index) => (
                <li key={index}>
                  <Post
                    data={post}
                    history={this.props.history}
                    userId={post.iduserpost}
                  />
                </li>
              ))}
            </ul>
          ) : (
              ""
            )}
          <div style={{ height: "50px", background: "#f2f3f7", zIndex: 0 }}>
            {isLoadMore ? (
              <Loader
                type="small"
                style={{ background: "#f2f3f7" }}
                width={30}
                height={30}
              />
            ) : (
                ""
              )}
          </div>
        </StickyContainer>
        {renderSearchGroupDrawer(this)}
        {renderJoinGroupConfirm(this)}
        {renderCreateGroupDrawer(this)}
        {renderGroupListDrawer(this)}
        {renderGroupInviteDrawer(this)}
        {renderConfirmDrawer(this)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.app,
    ...state.user,
    ...state.posted,
    ...state.noti,
    ...state.group,
  };
};

const mapDispatchToProps = (dispatch) => ({
  addHeaderContent: (headerContent) =>
    dispatch(addHeaderContent(headerContent)),
  addFooterContent: (footerContent) =>
    dispatch(addFooterContent(footerContent)),
  toggleHeader: (isShow) => dispatch(toggleHeader(isShow)),
  toggleFooter: (isShow) => dispatch(toggleFooter(isShow)),
  toggleCreateGroupDrawer: (isShow) =>
    dispatch(toggleCreateGroupDrawer(isShow)),
  togglePostDrawer: (isShow, isPostToGroup) =>
    dispatch(togglePostDrawer(isShow, isPostToGroup)),
  toggleGroupDrawer: (isShow) => dispatch(toggleGroupDrawer(isShow)),
  toggleGroupInviteDrawer: (isShow) =>
    dispatch(toggleGroupInviteDrawer(isShow)),
  setGroupPosted: (posts) => dispatch(setGroupPosted(posts)),
  setJoinedGroup: (groups, total) => dispatch(setJoinedGroup(groups, total)),
  setMyGroup: (groups) => dispatch(setMyGroup(groups)),
  setInvitedGroup: (groups) => dispatch(setInvitedGroup(groups)),
  acceptGroup: (groupId, successCallback, errorCallback, currentGroup) =>
    dispatch(
      acceptGroup(groupId, successCallback, errorCallback, currentGroup)
    ),
  joinGroup: (groupId, successCallback, errorCallback) =>
    dispatch(joinGroup(groupId, successCallback, errorCallback)),
  toggleGroupDetailDrawer: (isShow) =>
    dispatch(toggleGroupDetailDrawer(isShow)),
  setCurrentGroup: (group) => dispatch(setCurrentGroup(group)),
  createGroupSuccess: (group) => dispatch(createGroupSuccess(group)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);

const renderHeader = (component) => {
  return (
    <div className="app-header">
      <IconButton
        style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
        onClick={() => component.props.history.push("/")}
      >
        <ChevronLeftIcon
          style={{ color: "#ff5a59", width: "25px", height: "25px" }}
        />
      </IconButton>
      <label>Hội nhóm</label>
    </div>
  );
};

const renderFooter = (component) => {
  let { woldNotiUnreadCount } = component.props;
  return (
    <div className="app-footer">
      <ul>
        <li onClick={() => component.props.history.replace("/community")}>
          <img src={Newfeed}></img>
          <span>Bản tin</span>
        </li>
        <li onClick={() => component.props.history.replace("/videos")}>
          <img src={Videos}></img>
          <span>Video</span>
        </li>
        <li onClick={() => component.props.history.replace("/groups")}>
          <img src={Group1}></img>
          <span style={{ color: "#f54746" }}>Nhóm</span>
        </li>
        <li onClick={() => component.props.history.replace("/community-noti")}>
          {woldNotiUnreadCount > 0 ? (
            <Badge
              badgeContent={woldNotiUnreadCount}
              max={99}
              className={"custom-badge"}
            >
              <img src={NotiBw}></img>
            </Badge>
          ) : (
              <img src={NotiBw}></img>
            )}
          <span>Thông báo</span>
        </li>
        <li
          onClick={() => component.props.history.replace("/communiti-profile")}
        >
          <img src={ProfileBW}></img>
          <span>Cá nhân</span>
        </li>
      </ul>
    </div>
  );
};

const renderSearchGroupDrawer = (component) => {
  let {
    showSearchGroupDrawer,
    searchKey,
    groups,
    isLoadMoreGroup,
  } = component.state;


  return (
    <Drawer
      anchor="bottom"
      className="tag-friend-drawer"
      open={showSearchGroupDrawer}
      onClose={() => component.setState({ showSearchGroupDrawer: false })}
    >
      <div className="drawer-detail">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() => component.setState({ showSearchGroupDrawer: false })}
          >
            <IconButton
              style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
            >
              <ChevronLeftIcon
                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
              />
            </IconButton>
            <label>Tìm nhóm</label>
          </div>
        </div>
        <div className="filter">
          <TextField
            className="custom-input"
            variant="outlined"
            placeholder="Nhập tên nhóm để tìm"
            className="search-box"
            value={searchKey}
            onChange={(e) => component.onSearchChange(e)}
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

        <div
          className="drawer-content"
          id="search-groups-box"
          style={{ overflow: "scroll", width: "100vw" }}
          onScroll={() => component.onSearchGroupScroll()}
        >
          <div className="my-group-list">
            <ul>
              {groups.map((group, index) => (
                <li
                  key={index}
                  onClick={() =>
                    component.setState(
                      { showGroupForPostDrawer: false },
                      () => {
                        component.props.setCurrentGroup(group);
                        component.props.toggleGroupDetailDrawer(true);
                      }
                    )
                  }
                >
                  <Avatar className="avatar">
                    <div
                      className="img"
                      style={{ background: group.thumbnail ? `url("${group.thumbnail}")`:`url("${noImageGroup}")` }}
                    />
                  </Avatar>
                  <div className="group-info">
                    <label>{group.groupname}</label>
                    <span
                      className={
                        "privacy " +
                        (group.typegroup === GroupPrivacies.Private.code
                          ? "red"
                          : "blued")
                      }
                    >
                      {
                        objToArray(GroupPrivacies).find(
                          (item) => item.code === group.typegroup
                        ).label
                      }
                    </span>
                    <span className="member-count">
                      {group.nummember} thành viên
                    </span>
                  </div>
                  {group.status === 0 ? (
                    <Button
                      className="bt-submit"
                      onClick={(event) => {
                        event.stopPropagation();
                        component.setState({
                          currentGroupId: group.groupid,
                          showJoinGroupConfirm: true,
                          isJoiningGroup: false,
                        });
                      }}
                    >
                      Tham gia
                    </Button>
                  ) : (
                      group.status === 1 && (
                        <Button className="bt-cancel">Đã gửi</Button>
                      )
                    )}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ height: "50px", background: "#fff", zIndex: 0 }}>
            {isLoadMoreGroup ? (
              <Loader
                type="small"
                style={{ background: "#fff" }}
                width={30}
                height={30}
              />
            ) : (
                ""
              )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

const renderJoinGroupConfirm = (component) => {
  let {
    showJoinGroupConfirm,
    isRead,
    currentGroupId,
    isJoiningGroup,
  } = component.state;
  return (
    <Drawer
      anchor="bottom"
      className="confirm-drawer"
      open={showJoinGroupConfirm}
      onClose={() =>
        component.setState({
          showJoinGroupConfirm: false,
          currentGroupId: null,
          isRead: false,
        })
      }
    >
      <div className="jon-group-confirm">
        <label>Nội quy nhóm</label>
        <p>Vui lòng đọc kỹ và xác nhận nội quy nhóm trước khi tham gia nhóm.</p>
        <div className="accept-role">
          <FormControlLabel
            control={
              <Checkbox
                checked={isRead}
                onChange={() => component.setState({ isRead: !isRead })}
                icon={<img src={checkIcon} style={{ width: 20, height: 20 }} />}
                checkedIcon={
                  <img src={checkedIcon} style={{ width: 20, height: 20 }} />
                }
                name="checkedH"
              />
            }
            label={<span>Xác nhận đã đọc nội quy</span>}
            labelPlacement="start"
          />
        </div>
        <div>
          <Button
            className="bt-cancel"
            onClick={() =>
              component.setState({
                showJoinGroupConfirm: false,
                currentGroupId: null,
                isRead: false,
              })
            }
          >
            Đóng
          </Button>
          {isRead ? (
            <Button
              className="bt-submit"
              onClick={() => component.joinGroup(currentGroupId)}
            >
              Tham gia nhóm
            </Button>
          ) : (
              <Button className="bt-submit" style={{ opacity: 0.5 }} disabled>
                Tham gia nhóm
              </Button>
            )}
        </div>
      </div>
    </Drawer>
  );
};

const renderCreateGroupDrawer = (component) => {
  let { showCreateGroupDrawer } = component.props;
  let {
    groupCoverImage,
    description,
    policygroup,
    groupName,
    groupType,
    showGroupPrivacySelectOption,
  } = component.state;

  return (
    <Drawer
      anchor="bottom"
      className="create-group-drawer"
      open={showCreateGroupDrawer}
    >
      <div className="drawer-detail">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() => component.closeCreateDrawer()}
          >
            <IconButton
              style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
            >
              <ChevronLeftIcon
                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
              />
            </IconButton>
            <label>Tạo nhóm</label>
          </div>
          <Button className="bt-submit" onClick={() => component.createGroup()}>
            Hoàn tất
          </Button>
        </div>
        <div className="filter"></div>
        <div
          className="content-form"
          style={{ overflow: "scroll", width: "100vw", paddingBottom: "100px" }}
        >
          <div>
            <label>Tên nhóm</label>
            <TextField
              className="custom-input"
              className="order-reason"
              variant="outlined"
              placeholder="Đặt tên nhóm"
              value={groupName}
              onChange={(e) =>
                component.setState({
                  groupName: e.target.value,
                  isChanged: true,
                })
              }
              style={{
                width: "100%",
                marginBottom: "10px",
              }}
            />
            {showCreateGroupDrawer ? (
              <MultiInput
                style={{
                  minHeight: "100px",
                  border: "1px solid rgba(0, 0, 0, 0.15)",
                  marginBottom: "10px",
                }}
                onChange={(value) =>
                  component.setState({
                    description: value.text,
                    isChanged: value.text.length > 0 ? true : false,
                  })
                }
                topDown={true}
                placeholder={"Mô tả nhóm"}
                enableHashtag={false}
                enableMention={false}
                centerMode={false}
                value={description}
                suggestionClass="custom-suggestion"
              />
            ) : (
                ""
              )}
            <label>Tải lên ảnh bìa</label>
            <div className="cover-image">
              {/* {
                groupCoverImage ? <div className="image" style={{ background: 'url(' + URL.createObjectURL(groupCoverImage) + ')' }}></div> : ""
              } */}
              {groupCoverImage ? (
                <GroupImage groupCoverImage={groupCoverImage} />
              ) : (
                  ""
                )}
              <Dropzone
                onDrop={(acceptedFiles) =>
                  component.setState({
                    groupCoverImage: acceptedFiles[0],
                    isChanged: true,
                  })
                }
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()}>
                    <input
                      {...getInputProps()}
                      accept="image/*"
                      multiple={false}
                    />
                    <Button className={groupCoverImage ? "light" : "dask"}>
                      Tải lại ảnh khác
                    </Button>
                  </div>
                )}
              </Dropzone>
            </div>
            <label>Quy định nhóm</label>
            {showCreateGroupDrawer ? (
              <MultiInput
                style={{
                  minHeight: "100px",
                  border: "1px solid rgba(0, 0, 0, 0.15)",
                  marginBottom: "10px",
                }}
                onChange={(value) =>
                  component.setState({
                    policygroup: value.text,
                    isChanged: value.text.length > 0 ? true : false,
                  })
                }
                topDown={true}
                placeholder={"Quy định nhóm"}
                enableHashtag={false}
                enableMention={false}
                centerMode={false}
                value={policygroup}
                suggestionClass="custom-suggestion"
              />
            ) : (
                ""
              )}
            <label>Quyền riêng tư</label>
            <ClickAwayListener
              onClickAway={() =>
                component.setState({ showGroupPrivacySelectOption: false })
              }
            >
              <div
                className="group-type-select custom"
                onClick={() =>
                  component.setState({
                    showGroupPrivacySelectOption: !showGroupPrivacySelectOption,
                  })
                }
              >
                <span className="title">
                  {groupType ? groupType.label : "Chọn quyền riêng tư"}
                </span>
                {showGroupPrivacySelectOption ? (
                  <div className="options">
                    <span
                      onClick={() =>
                        component.setState({
                          groupType: GroupPrivacies.Public,
                          isChanged: true,
                        })
                      }
                    >
                      {GroupPrivacies.Public.label}
                    </span>
                    <span
                      onClick={() =>
                        component.setState({
                          groupType: GroupPrivacies.Private,
                          isChanged: true,
                        })
                      }
                    >
                      {GroupPrivacies.Private.label}
                    </span>
                  </div>
                ) : (
                    ""
                  )}
              </div>
            </ClickAwayListener>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

const renderGroupListDrawer = (component) => {
  let {
    showGroupDrawer,
    joinedGroups,
    myGroups,
    joinedGroupsTotal,
  } = component.props;
  let { groupTabIndex } = component.state;

  return (
    <Drawer anchor="bottom" className="group-drawer" open={showGroupDrawer}>
      <div className="drawer-detail">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() => {
              setTimeout(() => {
                component.props.setJoinedGroup([]);
                component.props.setMyGroup([]);
                component.setState({
                  isEndOfJoinedGroup: false,
                  isEndOfMyGroup: false,
                  joinedGroupsCurrentPage: 0,
                  myGroupsCurrentPage: 0,
                  groupTabIndex: 0,
                });
              }, 200);
              component.props.toggleGroupDrawer(false);
            }}
          >
            <IconButton
              style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
            >
              <ChevronLeftIcon
                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
              />
            </IconButton>
            <label>Nhóm đã tham gia</label>
          </div>
          <div
            className="submit-bt"
            onClick={() => component.props.toggleCreateGroupDrawer(true)}
          >
            <img src={NewGr} />
            <span>Tạo nhóm</span>
          </div>
        </div>
        <div className="filter">
          <div className="joined-group-count">
            <span>
              Bạn đã gia nhập{" "}
              <span className="red bold">{joinedGroupsTotal}</span> hội nhóm
            </span>
          </div>
          <AppBar position="static" color="default" className={"custom-tab"}>
            <Tabs
              value={groupTabIndex}
              onChange={(e, value) =>
                component.setState({ groupTabIndex: value })
              }
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="full width tabs example"
              className="tab-header"
            >
              <Tab
                label="Nhóm đã tham gia"
                {...a11yProps(0)}
                className="tab-item"
              />
              <Tab
                label="Nhóm đang quản lí"
                {...a11yProps(1)}
                className="tab-item"
                onClick={() =>
                  !myGroups || myGroups.length == 0
                    ? component.getMyGroup(0)
                    : ""
                }
              />
            </Tabs>
          </AppBar>
        </div>
        <div
          className="content-form"
          id="group-list"
          style={{ overflow: "scroll", width: "100vw" }}
          onScroll={() => component.groupScroll(groupTabIndex)}
        >
          <SwipeableViews
            index={groupTabIndex}
            onChangeIndex={(value) =>
              component.setState({ groupTabIndex: value })
            }
            className="tab-content"
          >
            <TabPanel value={groupTabIndex} index={0} className="content-box">
              <div className="top-groups joined-group">
                {joinedGroups
                  ? joinedGroups.map((item, key) => (
                    <div
                      className="group-item"
                      key={key}
                      style={{
                        background: "url(" + item.backgroundimage + ")",
                      }}
                    >
                      <div
                        className="overlay"
                        onClick={() => {
                          component.props.toggleGroupDetailDrawer(true);
                          component.props.setCurrentGroup(item);
                        }}
                      />
                      <div className="group-info">
                        <Avatar aria-label="recipe" className="avatar">
                          <div
                            className="img"
                            style={{ background: `url("${item.thumbnail}")` }}
                          />
                        </Avatar>
                        <span className="group-name ellipsit">
                          {item.groupname}
                        </span>
                      </div>
                      <span className="posted">
                        {item.numpost} bài đăng
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          {GroupPrivacies[item.typegroupname].label}
                      </span>
                      <div
                        className="members-list"
                        style={{ position: "relative" }}
                      >
                        <span className="total">
                          Thành viên: {item.nummember}
                        </span>
                        <div className="members-list">
                          {item.managers && item.managers.length > 0 ? (
                            <div className="member-avatar">
                              {item.managers.map(
                                (manager, index) =>
                                  index < 2 && (
                                    <Avatar
                                      aria-label="recipe"
                                      className="avatar"
                                    >
                                      <div
                                        className="img"
                                        style={{
                                          background: `url("${manager.avatar}")`,
                                        }}
                                      />
                                    </Avatar>
                                  )
                              )}
                              {item.managers.length > 2 ? (
                                <Avatar
                                  aria-label="recipe"
                                  className="avatar"
                                >
                                  +{item.managers.length - 2}
                                </Avatar>
                              ) : (
                                  ""
                                )}
                            </div>
                          ) : (
                              ""
                            )}
                        </div>
                      </div>
                    </div>
                  ))
                  : ""}
              </div>
            </TabPanel>
            <TabPanel value={groupTabIndex} index={1}>
              <div className="top-groups joined-group">
                {myGroups
                  ? myGroups.map((item, key) => (
                    <div
                      className="group-item"
                      key={key}
                      style={{
                        background: "url(" + item.backgroundimage + ")",
                      }}
                    >
                      <div
                        className="overlay"
                        onClick={() => {
                          component.props.toggleGroupDetailDrawer(true);
                          component.props.setCurrentGroup(item);
                        }}
                      />
                      <div className="group-info">
                        <Avatar aria-label="recipe" className="avatar">
                          <div
                            className="img"
                            style={{ background: `url("${item.thumbnail}")` }}
                          />
                        </Avatar>
                        <span className="group-name ellipsit">
                          {item.groupname}
                        </span>
                      </div>
                      <span className="posted">
                        {item.numpost} bài đăng
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          {GroupPrivacies[item.typegroupname].label}
                      </span>
                      <div
                        className="members-list"
                        style={{ position: "relative" }}
                      >
                        <span className="total">
                          Thành viên: {item.nummember}
                        </span>
                        <div className="members-list">
                          {item.managers && item.managers.length > 0 ? (
                            <div className="member-avatar">
                              {item.managers.map(
                                (manager, index) =>
                                  index < 2 && (
                                    <Avatar
                                      aria-label="recipe"
                                      className="avatar"
                                    >
                                      <div
                                        className="img"
                                        style={{
                                          background: `url("${manager.avatar}")`,
                                        }}
                                      />
                                    </Avatar>
                                  )
                              )}
                              {item.managers.length > 2 ? (
                                <Avatar
                                  aria-label="recipe"
                                  className="avatar"
                                >
                                  +{item.managers.length - 2}
                                </Avatar>
                              ) : (
                                  ""
                                )}
                            </div>
                          ) : (
                              ""
                            )}
                        </div>
                      </div>
                    </div>
                  ))
                  : ""}
              </div>
            </TabPanel>
          </SwipeableViews>
        </div>
      </div>
    </Drawer>
  );
};

const renderGroupInviteDrawer = (component) => {
  let { showGroupInviteDrawer, invitedGroups } = component.props;

  return (
    <Drawer
      anchor="bottom"
      className="group-invite"
      open={showGroupInviteDrawer}
      onClose={() => {
        component.props.toggleGroupInviteDrawer(false)
        component.props.setInvitedGroup(null);
      }}
    >
      <div className="drawer-detail">
        <div className="drawer-header">
          <div
            className="direction"
            onClick={() => {
              component.props.toggleGroupInviteDrawer(false)
              component.props.setInvitedGroup(null);
            }}
          >
            <IconButton
              style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }}
            >
              <ChevronLeftIcon
                style={{ color: "#ff5a59", width: "25px", height: "25px" }}
              />
            </IconButton>
            <label>Lời mời vào nhóm</label>
          </div>
        </div>
        <div className="filter"></div>
        <div
          className="drawer-content"
          style={{ overflow: "scroll", width: "100vw" }}
        >
          <div className="my-group-list">
            <ul>
              {invitedGroups.map((group, index) => (
                <li key={index}>
                  <Avatar className="avatar">
                    <div
                      className="img"
                      style={{ background: group.thumbnail ? `url("${group.thumbnail}")`:`url("${noImageGroup}")` }}
                    />
                  </Avatar>
                  <div className="group-info">
                    <label>{group.groupname}</label>
                    <span
                      className={
                        "privacy mt05 " +
                        (group.typegroup == GroupPrivacies.Private.code
                          ? "red"
                          : "blued")
                      }
                    >
                      {
                        objToArray(GroupPrivacies).find(
                          (item) => item.code == group.typegroup
                        ).label
                      }
                    </span>
                    <span className="member-count mt05">
                      {group.nummember} thành viên
                    </span>
                    <Button
                      className="bt-submit"
                      onClick={() => component.handleAcceptGroup(group)}
                    >
                      Chấp nhận
                    </Button>
                    <Button
                      className="bt-cancel"
                      onClick={() => component.handleJoinGroup(group)}
                    >
                      Từ chối
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

const renderConfirmDrawer = (component) => {
  let {
    showConfim,
    okCallback,
    confirmTitle,
    confirmMessage,
  } = component.state;
  return (
    <Drawer
      anchor="bottom"
      className="confirm-drawer"
      open={showConfim}
      onClose={() => component.setState({ showConfim: false })}
    >
      <div className="jon-group-confirm">
        <label>{confirmTitle}</label>
        <p>{confirmMessage}</p>
        <div className="mt20">
          <Button
            className="bt-confirm"
            onClick={() =>
              component.setState({ showConfim: false }, () =>
                okCallback ? okCallback() : null
              )
            }
          >
            Đồng ý
          </Button>
          <Button
            className="bt-submit"
            onClick={() => component.setState({ showConfim: false })}
          >
            Quay lại
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
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
      {value === index && <div>{children}</div>}
    </div>
  );
}
