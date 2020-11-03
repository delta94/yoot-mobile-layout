import React from "react";
import './style.scss'
import {
  addHeaderContent,
  addFooterContent,
  toggleHeader,
  toggleFooter,
} from '../../actions/app'
import {
  setVideoPosted
} from '../../actions/posted'
import { connect } from 'react-redux'
import {
  IconButton, Button, Badge
} from '@material-ui/core'
import {
  ChevronLeft as ChevronLeftIcon, SpaOutlined
} from '@material-ui/icons'
import { StickyContainer, Sticky } from 'react-sticky';
import Post from '../post'
import $ from 'jquery'
import { CurrentDate, SOCIAL_NET_WORK_API } from "../../constants/appSettings";
import { objToQuery } from "../../utils/common";
import { get } from "../../api";
import EmptyPost from '../common/empty-post'
import moment from 'moment'
import Loader from '../common/loader'

const Newfeed = require('../../assets/icon/Lesson.png')
const Group1 = require('../../assets/icon/Group1@1x.png')
const NotiBw = require('../../assets/icon/NotiBw@1x.png')
const ProfileBW = require('../../assets/icon/ProfileBW.png')
const Videos = require('../../assets/icon/Videos.png')



let currentDate = moment(new Date).format(CurrentDate)


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postedsCurrentPage: 0,
      isEndOfPosteds: false,
      isLoadMore: false
    };
  }
  handleGetPost(currentpage) {
    let {
      videoPosteds
    } = this.props
    let param = {
      currentpage: currentpage,
      currentdate: currentDate,
      limit: 20,
      groupid: 0,
      isVideo: 1,
      suggestGroup: 0,
      forFriendId: 0,
      albumid: 0
    }
    if (!videoPosteds) videoPosteds = []
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
        this.props.setVideoPosted(result.content.newsFeeds)

        if (result.content.newsFeeds.length == 0) {
          this.setState({
            isEndOfPosteds: true,
            isLoadMore: false
          })
        }
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.woldNotiUnreadCount != this.props.woldNotiUnreadCount || nextProps.skillNotiUnreadCount != this.props.skillNotiUnreadCount)
      this.props.addFooterContent(renderFooter(this))
  }

  componentWillMount() {
    this.props.addHeaderContent(renderHeader(this))
    this.props.addFooterContent(renderFooter(this))
    this.props.toggleHeader(true)
    this.props.toggleFooter(true)

  }
  componentDidMount() {
    this.handleGetPost(0)
    document.addEventListener("scroll", () => {
      let element = $("html")
      let {
        postedsCurrentPage,
        isEndOfPosteds,
        isLoadMore
      } = this.state
      let {
        videoPosteds
      } = this.props

      if (!videoPosteds || videoPosteds.length == 0) return
      if (element.scrollTop() + window.innerHeight >= element[0].scrollHeight) {
        if (isLoadMore == false && isEndOfPosteds == false) {
          this.setState({
            postedsCurrentPage: postedsCurrentPage + 1,
            isLoadMore: true
          }, () => {
            this.handleGetPost(postedsCurrentPage + 1)
          })
        }
      }
    })
  }
  render() {
    let {
      videoPosteds,
    } = this.props
    let {
      isLoadMore
    } = this.state
    return (
      <div className="community-page dask-mode" >
        <div className="page-detail" style={{ minHeight: "calc(100vh - 150px)" }}>
          {
            videoPosteds && videoPosteds.length == 0 ? <ul className="post-list">
              <EmptyPost daskMode={true} />
            </ul> : ""
          }
          {
            videoPosteds && videoPosteds.length > 0 ? <ul className="post-list">
              {
                videoPosteds.map((post, index) => <li key={index} >
                  <Post data={post} history={this.props.history} userId={post.iduserpost} daskMode={true} />
                </li>)
              }
            </ul> : ""
          }
          <div style={{ height: "50px", background: "#000", zIndex: 0 }}>
            {
              isLoadMore ? <Loader type="small" daskMode={true} style={{ background: "#000" }} width={30} height={30} /> : ""
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.app,
    ...state.user,
    ...state.posted,
    ...state.noti
  }
};

const mapDispatchToProps = dispatch => ({
  addHeaderContent: (headerContent) => dispatch(addHeaderContent(headerContent)),
  addFooterContent: (footerContent) => dispatch(addFooterContent(footerContent)),
  toggleHeader: (isShow) => dispatch(toggleHeader(isShow)),
  toggleFooter: (isShow) => dispatch(toggleFooter(isShow)),
  setVideoPosted: (posteds) => dispatch(setVideoPosted(posteds))
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
const renderFooter = (component) => {
  let {
    woldNotiUnreadCount
  } = component.props
  return (
    <div className="app-footer dask-mode">
      <ul>
        <li onClick={() => component.props.history.replace('/community')}>
          <img src={Newfeed}></img>
          <span >Bản tin</span>
        </li>
        <li onClick={() => component.props.history.replace('/videos')}>
          <img src={Videos}></img>
          <span style={{ color: "#f54746" }}>Video</span>
        </li>
        <li onClick={() => component.props.history.replace('/groups')}>
          <img src={Group1}></img>
          <span>Nhóm</span>
        </li>
        <li onClick={() => component.props.history.replace('/community-noti')}>
          {
            woldNotiUnreadCount > 0 ? <Badge badgeContent={woldNotiUnreadCount} max={99} className={"custom-badge dask-mode"} >
              <img src={NotiBw}></img>
            </Badge> : <img src={NotiBw}></img>
          }
          <span>Thông báo</span>
        </li>
        <li onClick={() => component.props.history.replace('/communiti-profile')}>
          <img src={ProfileBW}></img>
          <span>Cá nhân</span>
        </li>
      </ul>
    </div>
  )
}
