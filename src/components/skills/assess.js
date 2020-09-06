import React from "react";
import './style.scss'
import {
  addHeaderContent,
  addFooterContent,
  toggleHeader,
  toggleFooter,
} from '../../actions/app'
import { connect } from 'react-redux'
import {
  IconButton,
  AppBar,
  Tabs,
  Tab,
  Button,
  Avatar,
  Drawer
} from '@material-ui/core'
import {
  ChevronLeft as ChevronLeftIcon,
  Cancel as CancelIcon
} from '@material-ui/icons'
import { StickyContainer, Sticky } from 'react-sticky';
import SwipeableViews from 'react-swipeable-views';
import Dropzone from 'react-dropzone'

const noti = require('../../assets/icon/NotiBw@1x.png')
const Newfeed = require('../../assets/icon/Newfeed@1x.png')
const Coins_Y = require('../../assets/icon/Coins_Y.png')
const IMG_1038 = require('../../assets/images/IMG_1038.jpg')
const Logo_y = require('../../assets/icon/Logo_y@1x.png')
const upload_video = require('../../assets/icon/upload_video.png')




class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      <div className="assess-page" >

      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.app,
  }
};

const mapDispatchToProps = dispatch => ({
  addHeaderContent: (headerContent) => dispatch(addHeaderContent(headerContent)),
  addFooterContent: (footerContent) => dispatch(addFooterContent(footerContent)),
  toggleHeader: (isShow) => dispatch(toggleHeader(isShow)),
  toggleFooter: (isShow) => dispatch(toggleFooter(isShow)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);

const renderHeader = (component) => {
  return (
    <div className="app-header">
      <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => component.props.history.push('/skills')}>
        <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
      </IconButton>
      <label>Đánh giá</label>
    </div>
  )
}
const renderFooter = (history) => {
  return (
    <div className="app-footer">
      <ul>
        <li onClick={() => history.push("/skills/2131")}>
          <img src={Newfeed}></img>
          <span >Bài học</span>
        </li>
        <li onClick={() => history.push("/skills/1219/exercise")}>
          <img src={noti}></img>
          <span >Thực hành</span>
        </li>
        <li>
          <img src={noti}></img>
          <span style={{ color: "#f54746" }}>Đánh giá</span>
        </li>
      </ul>
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
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
      {value === index && (
        <div>{children}</div>
      )}
    </div>
  );
}

const renderAddAssessDrawer = (component) => {
  let {
    showAddAssessDrawer,
  } = component.state

  return (
    <Drawer anchor="bottom" className="add-assess-drawer" open={showAddAssessDrawer} onClose={() => component.setState({ showAddAssessDrawer: false })}>
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.setState({ showAddAssessDrawer: false })}>
            <label>Thêm người chấm bài</label>
            <IconButton style={{ padding: "8px" }} >
              <CancelIcon style={{ width: "25px", height: "25px" }} />
            </IconButton>
          </div>
        </div>
        <div className="drawer-content" style={{ overflow: "scroll" }}>
          <ul className="assess-list">
            {
              assessors.map((assess, index) => <li key={index}>
                <div>
                  <Avatar className="avatar"><img src={assess.avatar} /></Avatar>
                  <span>{assess.fullName}</span>
                </div>
                <Button className="bt-submit">Thêm</Button>
              </li>)
            }
          </ul>
        </div>
        <div className="actions">
          <Button className="bt-submit">Thêm bấi kỳ</Button>
          <Button className="bt-cancel">Đóng</Button>
        </div>
      </div>
    </Drawer>
  )
}

const renderApplyDrawer = (component) => {
  let {
    showApplyDrawer,
  } = component.state

  return (
    <Drawer anchor="bottom" className="apply-drawer" open={showApplyDrawer} onClose={() => component.setState({ showApplyDrawer: false })}>
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.setState({ showApplyDrawer: false })}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Nộp bài tập</label>
          </div>
        </div>
        <div className="filter"></div>
        <div className="drawer-content" style={{ overflow: "scroll", width: "100vw" }}>
          <div className="apply-form">
            <label>{lesson.name}</label>
            <span>Bài tập: </span>
            <img src={IMG_1038} />
            <span>Bài làm của bạn:</span>
            <Dropzone onDrop={acceptedFiles => component.setState({ videoSelected: acceptedFiles })}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} id="bt-select-video">
                  <input {...getInputProps()} accept="video/*" />
                  <div className="bt-upload">
                    <img src={upload_video} />
                    <span>Tải lên video</span>
                  </div>
                </div>
              )}
            </Dropzone>

            <Button className="bt-submit">Nộp bài</Button>
          </div>
        </div>
      </div>
    </Drawer>
  )
}


const lesson = {
  name: "Nghệ thuật Diễn Thuyết Truyền Cảm Hứng",
  lessonCount: 10,
  lessonFinish: 5,
  reward: 500,
  background: "https://andrews.edu.vn/wp-content/uploads/Prensention_mbaandrews.jpg",
  documents: [
    {
      fileName: "Nghệ thuật Diễn Thuyết Truyền Cảm Hứng",
      type: "pdf"
    }
  ],
  lessons: [
    {
      fileName: "1 - Giới thiệu bản thân",
    },
    {
      fileName: "1 - Giới thiệu bản thân",
    },
    {
      fileName: "1 - Giới thiệu bản thân",
    },
    {
      fileName: "1 - Giới thiệu bản thân",
    },
    {
      fileName: "1 - Giới thiệu bản thân",
    },
    {
      fileName: "1 - Giới thiệu bản thân",
    },
    {
      fileName: "1 - Giới thiệu bản thân",
    }
  ]
}

const assessors = [
  {
    fullName: "Hậu",
    avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
  },
  {
    fullName: "Hậu",
    avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
  },
  {
    fullName: "Hậu",
    avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
  }
]

