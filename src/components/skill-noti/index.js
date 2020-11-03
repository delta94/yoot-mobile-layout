import React from "react";
import './style.scss'
import {
  addHeaderContent,
  addFooterContent,
  toggleHeader,
  toggleFooter,
} from '../../actions/app'
import {
  setSkillNoti,
  readNoti,
  getSkillNoti,
  setSkillUnreadNotiCount
} from '../../actions/noti'
import { connect } from 'react-redux'
import {
  IconButton,
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
import Noti from './noti'

let currentdate = moment(new Date).format(CurrentDate)

const noti = require('../../assets/icon/NotiBw1.png')
const Newfeed = require('../../assets/icon/Lesson.png')

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  hanldeGetSkillNoti(currentpage) {
    let param = {
      currentpage: currentpage,
      currentdate: currentdate,
      limit: 30,
      typeproject: 2
    }
    this.setState({
      isLoadMore: true,
    })
    get(SOCIAL_NET_WORK_API, "Notification/GetListNotification" + objToQuery(param), result => {
      if (result && result.result == 1) {
        this.setState({
          isLoadMore: false
        })

        this.props.setSkillNoti(result.content.notifications)

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
  getUnreadNoti() {
    get(SOCIAL_NET_WORK_API, "Notification/CountNotificationNoRead?typeproject=2", result => {
      if (result && result.result == 1) {
        this.props.setSkillUnreadNotiCount(result.content.noUnRead)
        this.props.addFooterContent(renderFooter(this))
      }
    })
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.skillNotiUnreadCount != this.props.skillNotiUnreadCount)
      this.props.addFooterContent(renderFooter(this))
  }

  componentDidMount() {
    this.props.addHeaderContent(renderHeader(this))
    this.props.addFooterContent(renderFooter(this))
    this.props.toggleHeader(true)
    this.props.toggleFooter(true)
    this.props.getSkillNoti()
    this.getUnreadNoti()
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
            this.hanldeGetSkillNoti(notiCurrentPage + 1)
          })
        }
      }
    })
  }
  render() {
    let {
      skillNoties
    } = this.props
    return (
      <div className="skills-noti community-page groups-page" >
        <ul>
          {
            skillNoties.map((noti, index) => <Noti
              key={index}
              data={noti}
              onNotiClick={noti => this.onNotiClick(noti)}
              history={this.props.history}
            />)
          }
        </ul>
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
  setSkillNoti: (noties) => dispatch(setSkillNoti(noties)),
  readNoti: (notiId) => dispatch(readNoti(notiId)),
  getSkillNoti: () => dispatch(getSkillNoti()),
  setSkillUnreadNotiCount: (number) => dispatch(setSkillUnreadNotiCount(number))
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
    skillNotiUnreadCount
  } = component.props
  return (
    <div className="app-footer">
      <ul>
        <li onClick={() => component.props.history.push('/skills')}>
          <img src={Newfeed}></img>
          <span >Danh sách</span>
        </li>
        <li>
          {
            skillNotiUnreadCount > 0 ? <Badge badgeContent={skillNotiUnreadCount} max={99} className={"custom-badge"} >
              <img src={noti}></img>
            </Badge> : <img src={noti}></img>
          }
          <span style={{ color: "#f54746" }}>Thông báo</span>
        </li>
      </ul>
    </div>
  )
}

