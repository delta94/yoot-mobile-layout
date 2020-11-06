import React from "react";
import {
  toggleMediaViewerDrawer,
  setMediaToViewer,
} from '../../actions/app'
import {
  IconButton,
} from '@material-ui/core'
import {
  PlayArrow as PlayArrowIcon,
  Replay10 as Replay10Icon,
  Forward10 as Forward10Icon,
  Pause as PauseIcon,
} from '@material-ui/icons'
import { Player, ControlBar } from 'video-react';
import { connect } from 'react-redux'
import ScrollTrigger from "react-scroll-trigger";
import $ from 'jquery'
import './style.scss'


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      anchorEl: null,
      open: false
    };
    this.video = React.createRef()
  }

  handlePlayVideo(videoRef) {

    let video = videoRef.current

    if (video) {
      video.play()
      this.setState({
        playing: true
      })
    }
  }

  handlePauseVideo(videoRef) {
    let video = videoRef.current
    if (video) {
      video.pause()
      this.setState({
        playing: false
      })
    }
  }

  handleChangeCurrentTime(seconds, videoRef) {
    let video = videoRef.current
    if (video) {
      const { player } = video.getState();
      video.seek(player.currentTime + seconds)
    }
  }


  render() {
    let {
      playing
    } = this.state
    let {
      videoURL,
      videoThumb
    } = this.props
    return (
      <ScrollTrigger
        containerRef={document.getElementById("your-job-list")}
        onExit={() => this.handlePauseVideo(this.video)}
      >
        <div style={{ padding: "20vh 0px", margin: "-20vh 0px" }}>
          <Player
            ref={this.video}
            src={videoURL}
            playsInline={true}
            poster={videoThumb}
            className={"custome-video-layout" + (playing ? " active" : " inactive")}
          >
            <ControlBar autoHide={true} >
              <div className={"custom-bt-control-bar"}>
                {
                  playing ? <IconButton onClick={() => this.handleChangeCurrentTime(-10, this.video)}><Replay10Icon /></IconButton> : ""
                }
                <IconButton onClick={() => playing ? this.handlePauseVideo(this.video) : this.handlePlayVideo(this.video)}>
                  {
                    playing ? <PauseIcon /> : <PlayArrowIcon />
                  }
                </IconButton>
                {
                  playing ? <IconButton onClick={() => this.handleChangeCurrentTime(10, this.video)}><Forward10Icon /></IconButton> : ""
                }
              </div>
              <div className="fullscreen-overlay" onClick={() => {
                this.handlePauseVideo(this.video)
                this.props.setMediaToViewer([{ name: videoURL }])
                this.props.toggleMediaViewerDrawer(true, {
                  showInfo: false,
                  activeIndex: 0,
                  isvideo: true
                })
              }}></div>
            </ControlBar>
          </Player>
        </div>
      </ScrollTrigger>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.app,
  }
};

const mapDispatchToProps = dispatch => ({
  setMediaToViewer: (media) => dispatch(setMediaToViewer(media)),
  toggleMediaViewerDrawer: (isShow, feature) => dispatch(toggleMediaViewerDrawer(isShow, feature)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);