import React from "react";
import './style.scss'
import {
  addHeaderContent,
  addFooterContent,
  toggleHeader,
  toggleFooter,
} from '../../actions/app'
import {
  setWorldNoti,
  readNoti,
  setUnreadNotiCount
} from '../../actions/noti'
import Noti from './noti'
import { connect } from 'react-redux'
import {
  IconButton,
  Drawer,
  Button,
  Badge
} from '@material-ui/core'
import {
  ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons'
import { CurrentDate, SOCIAL_NET_WORK_API } from "../../constants/appSettings";
import { objToQuery, showNotification } from "../../utils/common";
import moment from 'moment'
import { get } from "../../api";
import $ from 'jquery'
import CommentBox from '../post/comment'
import { result } from "lodash";

const Newfeed = require('../../assets/icon/Lesson.png')
const Group1 = require('../../assets/icon/Group1@1x.png')
const NotiBw = require('../../assets/icon/NotiBw1.png')
const ProfileBW = require('../../assets/icon/ProfileBW.png')
const Videos = require('../../assets/icon/Video.png')


let currentdate = moment(new Date).format(CurrentDate)



class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      isEndOfNoti: false,
      isLoadMore: false,
      notiCurrentPage: 0,
      showCommentDrawer: false,
      currentPost: null
    };
  }

  hanldeGetCommunityNoti(currentpage) {
    let param = {
      currentpage: currentpage,
      currentdate: currentdate,
      limit: 30,
      typeproject: 1
    }
    this.setState({
      isLoadMore: true,
    })
    get(SOCIAL_NET_WORK_API, "Notification/GetListNotification" + objToQuery(param), result => {
      if (result && result.result == 1) {
        this.setState({
          isLoadMore: false
        })

        this.props.setWorldNoti(result.content.notifications)

        if (result.content.notifications.length == 0) {
          this.setState({
            isEndOfNoti: true,
            isLoadMore: false
          })
        }
      }
    })
  }

  onNotiClick(noti) {
    switch (noti.type) {
      case 5: {
        get(SOCIAL_NET_WORK_API, "PostNewsFeed/GetOneNewsFeed?newsfeedid=" + noti.postid, result => {
          if (result && result.result == 1) {
            this.setState({
              currentPost: result.content.newsFeed
            })
            this.setState({
              showCommentDrawer: true
            })
          }
          else {
            this.setState({
              okCallback: () => this.setState({ showConfim: false }),
              confirmTitle: "",
              confirmMessage: result.content.message,
              showConfim: true
            })
          }
        })
        this.setState({
          showCommentDrawer: true
        })
      }
      case 35: {
        get(SOCIAL_NET_WORK_API, "PostNewsFeed/GetOneNewsFeed?newsfeedid=" + noti.postid, result => {
          if (result && result.result == 1) {
            this.setState({
              currentPost: result.content.newsFeed
            })
            this.setState({
              showCommentDrawer: true
            })
          } else {
            this.setState({
              okCallback: () => this.setState({ showConfim: false }),
              confirmTitle: "",
              confirmMessage: result.message,
              showConfim: true
            })
          }
        })

      }
    }
    get(SOCIAL_NET_WORK_API, "Notification/UpdateViewNotification?notificationid=" + noti.notificationid, result => {
      if (result && result.result == 1) {
        this.props.readNoti(noti.notificationid)
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.woldNotiUnreadCount != this.props.woldNotiUnreadCount || nextProps.skillNotiUnreadCount != this.props.skillNotiUnreadCount)
      this.props.addFooterContent(renderFooter(this))
  }

  componentDidMount() {
    this.props.addHeaderContent(renderHeader(this))
    this.props.addFooterContent(renderFooter(this))
    this.props.toggleHeader(true)
    this.props.toggleFooter(true)
    this.hanldeGetCommunityNoti(0)

    document.addEventListener("scroll", () => {
      let element = $("html")
      let {
        notiCurrentPage,
        isEndOfNoti,
        isLoadMore
      } = this.state

      if (element.scrollTop() + window.innerHeight >= element[0].scrollHeight) {
        if (isLoadMore == false && isEndOfNoti == false) {
          this.setState({
            notiCurrentPage: notiCurrentPage + 1,
            isLoadMore: true
          }, () => {
            this.hanldeGetCommunityNoti(notiCurrentPage + 1)
          })
        }
      }
    })
  }
  render() {
    let {
      worldNoties
    } = this.props

    console.log("state.noti", this.props.noti)

    return (
      <div className="community-page groups-page" >
        <ul>
          {
            worldNoties.map((noti, index) => <Noti
              key={index}
              data={noti}
              onNotiClick={noti => this.onNotiClick(noti)}
            />)
          }
        </ul>

        {
          renderCommentDrawer(this)
        }
        {
          renderConfirmDrawer(this)
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.app,
    ...state.user,
    ...state.noti
  }
};

const mapDispatchToProps = dispatch => ({
  addHeaderContent: (headerContent) => dispatch(addHeaderContent(headerContent)),
  addFooterContent: (footerContent) => dispatch(addFooterContent(footerContent)),
  toggleHeader: (isShow) => dispatch(toggleHeader(isShow)),
  toggleFooter: (isShow) => dispatch(toggleFooter(isShow)),
  setWorldNoti: (noties) => dispatch(setWorldNoti(noties)),
  readNoti: (notiId) => dispatch(readNoti(notiId)),
  setUnreadNotiCount: (number) => dispatch(setUnreadNotiCount(number)),
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
      <label>Thông báo</label>
    </div>
  )
}
const renderFooter = (component) => {
  let {
    woldNotiUnreadCount
  } = component.props

  return (
    <div className="app-footer">
      <ul>
        <li onClick={() => component.props.history.replace('/community')}>
          <img src={Newfeed}></img>
          <span >Bản tin</span>
        </li>
        <li onClick={() => component.props.history.replace('/videos')}>
          <img src={Videos}></img>
          <span >Video</span>
        </li>
        <li onClick={() => component.props.history.replace('/groups')}>
          <img src={Group1}></img>
          <span >Nhóm</span>
        </li>
        <li onClick={() => component.props.history.replace('/community-noti')}>
          {
            woldNotiUnreadCount > 0 ? <Badge badgeContent={woldNotiUnreadCount} max={99} className={"custom-badge"} >
              <img src={NotiBw}></img>
            </Badge> : <img src={NotiBw}></img>
          }
          <span style={{ color: "#f54746" }}>Thông báo</span>
        </li>
        <li onClick={() => component.props.history.replace('/communiti-profile')}>
          <img src={ProfileBW}></img>
          <span>Cá nhân</span>
        </li>
      </ul>
    </div>
  )
}

const renderCommentDrawer = (component) => {
  let {
    showCommentDrawer,
    currentPost
  } = component.state
  return (
    <Drawer anchor="bottom" className="comment-drawer" open={showCommentDrawer}>
      <CommentBox data={currentPost} userId={currentPost ? currentPost.iduserpost : 0} onClose={() => component.setState({ showCommentDrawer: false })} />
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
        </div>
      </div>
    </Drawer>
  )
}