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
  LinearProgress,
  CircularProgress
} from '@material-ui/core'
import {
  ChevronLeft as ChevronLeftIcon,
  PlayCircleFilled as PlayCircleFilledIcon
} from '@material-ui/icons'
import { StickyContainer, Sticky } from 'react-sticky';
import ReactPlayer from 'react-player'

const noti = require('../../assets/icon/NotiBw@1x.png')
const Newfeed = require('../../assets/icon/Newfeed@1x.png')
const Coins_Y = require('../../assets/icon/Coins_Y.png')
const pdf_download = require('../../assets/icon/pdf-download.png')


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
      <div className="source-item-page" >
        <StickyContainer className="container">
          <Sticky topOffset={-60} >
            {({ style }) => (
              <div style={{ ...style, top: "60px", zIndex: 999 }}>
                <div className="lesson-video">
                  <label className="source-name">{lesson.name}</label>
                  <div className="reward">
                    <span>Đã hoàn thành: <span className="red"> {lesson.lessonFinish}/{lesson.lessonCount}</span></span>
                    <span className="reward-point">1 VIDEO thưởng {lesson.reward} <img src={Coins_Y} /></span>
                  </div>
                  <div className="proccess">
                    <LinearProgress value={lesson.lessonFinish * 100 / lesson.lessonCount} className="proccess-bar" variant="determinate" />
                    <span>+ 0 <img src={Coins_Y} /></span>
                  </div>
                  <div className="video">
                    <ReactPlayer url='http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' controls playing={true} />
                  </div>
                  <div className="lesson-name">
                    <PlayCircleFilledIcon />
                    <span>Giới thiệu bản thân</span>
                  </div>
                </div>
              </div>
            )}
          </Sticky>
          <div className="lesson-list">
            <label>Tài liệu</label>
            <ul className="document">
              {
                lesson.documents.map((document, index) => <li key={index}>
                  <div>
                    {
                      document.type == "pdf" ? <img src={pdf_download} /> : ""
                    }
                    <span>{document.fileName}</span>
                  </div>
                </li>)
              }
            </ul>
            <label>Bài học</label>
            <ul className="lesson">
              {
                lesson.lessons.map((document, index) => <li key={index}>
                  <div className="name">
                    <PlayCircleFilledIcon />
                    <span>{document.fileName}</span>
                  </div>
                  <CircularProgress className="process" variant="static" value={index == 0 ? 25 : 0} size={22} thickness={6} />
                </li>)
              }
            </ul>
          </div>
        </StickyContainer>
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
      <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => component.props.history.goBack()}>
        <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
      </IconButton>
      <label>Khoá học</label>
    </div>
  )
}
const renderFooter = (history) => {
  return (
    <div className="app-footer">
      <ul>
        <li>
          <img src={Newfeed}></img>
          <span style={{ color: "#f54746" }}>Bài học</span>
        </li>
        <li onClick={() => history.push("/skills/1219/exercise")}>
          <img src={noti}></img>
          <span >Thực hành</span>
        </li>
        <li onClick={() => history.push("/skills/1219/assess")}>
          <img src={noti}></img>
          <span >Đánh giá</span>
        </li>
      </ul>
    </div>
  )
}

const lesson = {
  name: "Nghệ thuật Diễn Thuyết Truyền Cảm Hứng",
  lessonCount: 10,
  lessonFinish: 5,
  reward: 500,
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

