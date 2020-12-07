import React from "react";
import './style.scss'
import { addHeaderContent, addFooterContent, toggleHeader, toggleFooter, } from '../../actions/app'
import { setSkillNoti, setSkillUnreadNotiCount } from '../../actions/noti'
import { connect } from 'react-redux'
import {
  IconButton, Badge
} from '@material-ui/core'
import { ChevronLeft as ChevronLeftIcon } from '@material-ui/icons'
import { get } from '../../api'
import { SCHOOL_API, SOCIAL_NET_WORK_API } from "../../constants/appSettings";
import { formatCurrency } from "../../utils/common";

const noti = require('../../assets/icon/NotiBw@1x.png')
const Newfeed = require('../../assets/icon/Newfeed@1x.png')

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allSource: []
    };
  }
  goback() {
    let path = window.localStorage.getItem("REDIRECT")
    if (path) {
      this.props.history.replace(path)
      window.localStorage.removeItem("REDIRECT")
    } else {
      this.props.history.push('/')
    }
  }
  getAllSource() {
    get(SCHOOL_API, "Course/getalls", result => {
      if (result && result.StatusCode == 1) {
        this.setState({
          allSource: result.Data
        })
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

  componentWillMount() {
    this.props.addHeaderContent(renderHeader(this))
    this.props.addFooterContent(renderFooter(this))
    this.props.toggleHeader(true)
    this.props.toggleFooter(true)
  }

  componentDidMount() {
    this.getUnreadNoti()
    this.getAllSource()
  }
  render() {
    let {
      allSource
    } = this.state

    return (
      <div className="skills-page" >
        {
          allSource && allSource.length > 0 ? <ul>
            {
              allSource.map((source, index) => <li key={index} className="source-item" onClick={() => this.props.history.push("/skills/" + source.ID)}>
                <div style={{ background: "url(" + source.IMAGE + ")" }}>
                  <div>
                    <div className="reward">
                      <span>{source.NUM_LESSION} bài</span>
                      <span>{source.NUM_DOCUMENT} tài liệu</span>
                    </div>
                    <span className="source-name">{source.NAME}</span>
                  </div>
                </div>
              </li>)
            }
          </ul> : ""
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.app,
    ...state.noti
  }
};

const mapDispatchToProps = dispatch => ({
  addHeaderContent: (headerContent) => dispatch(addHeaderContent(headerContent)),
  addFooterContent: (footerContent) => dispatch(addFooterContent(footerContent)),
  toggleHeader: (isShow) => dispatch(toggleHeader(isShow)),
  toggleFooter: (isShow) => dispatch(toggleFooter(isShow)),
  setSkillNoti: (noties) => dispatch(setSkillNoti(noties)),
  setSkillUnreadNotiCount: (number) => dispatch(setSkillUnreadNotiCount(number))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);

const renderHeader = (component) => {
  return (
    <div className="app-header">
      <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => component.goback()}>
        <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
      </IconButton>
      <label>Khoá học</label>
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
        <li>
          <img src={Newfeed}></img>
          <span style={{ color: "#f54746" }}>Danh sách</span>
        </li>
        <li onClick={() => component.props.history.push('/skills-noti')}>
          {
            skillNotiUnreadCount > 0 ? <Badge badgeContent={skillNotiUnreadCount} max={99} className={"custom-badge"} >
              <img src={noti}></img>
            </Badge> : <img src={noti}></img>
          }
          <span >Thông báo</span>
        </li>
      </ul>
    </div>
  )
}
