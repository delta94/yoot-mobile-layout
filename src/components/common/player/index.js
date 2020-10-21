import React from 'react';
import { Player, ControlBar, BigPlayButton } from 'video-react';
import {
    IconButton,
} from '@material-ui/core'
import {
    MusicOff as MusicOffIcon,
    MusicNote as MusicNoteIcon,
    PlayArrow as PlayArrowIcon,
    Pause as PauseIcon,
    Forward10 as Forward10Icon,
    Replay10 as Replay10Icon
} from '@material-ui/icons'
import $ from 'jquery'
import './style.scss'

const mute = require('../../../assets/icon/mute.png')
const unmute = require('../../../assets/icon/unmute.png')


export class Loader extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isPlaying: true,
            isMuted: false
        };
        this.player = React.createRef()
    }


    handlePlayVideo() {
        let video = this.player.current
        if (video) {
            this.handleSetMuted(true)
            video.play()
            video.subscribeToStateChange((state, prevState) => {
                if (state.ended == true) {
                    this.setState({
                        isPlaying: false
                    })
                }
            })
            this.setState({
                isPlaying: true
            })
        }
    }

    handlePauseVideo() {
        let video = this.player.current
        if (video) {
            video.pause()
            this.setState({
                isPlaying: false
            })
        }
    }

    handleSetMuted(isMuted) {
        let video = this.player.current
        if (video) {
            video.muted = isMuted
            this.setState({
                isMuted: isMuted
            })
        }
    }

    handleFullScreen() {
        let {
            isFullScreen
        } = this.state
        let video = this.player.current
        if (video) {
            video.toggleFullscreen()
            this.setState({
                isFullScreen: !isFullScreen
            }, () => {
                this.handleSetMuted(isFullScreen)
            })
        }
    }

    handleChangeCurrentTime(seconds) {
        let video = this.player.current
        if (video) {
            const { player } = video.getState();
            video.seek(player.currentTime + seconds)
        }
    }

    render() {
        let {
            isPlaying,
            isMuted
        } = this.state
        let {
            video
        } = this.props
        return (
            <div className={"custom-video-full-screen"}>
                <Player
                    ref={this.player}
                    poster={video.thumbnailname}
                    src={video.name}
                    playsInline={true}
                    autoPlay={true}
                >
                    <ControlBar disableDefaultControls={false} autoHide={true} className={"custom-toolbar"} >
                        <div className="custom-toolbar-actions">
                            {
                                <div>
                                    {
                                        isPlaying ? <IconButton onClick={() => this.handleChangeCurrentTime(-10)}><Replay10Icon /></IconButton> : ""
                                    }
                                    <IconButton >
                                        {
                                            isPlaying ? <PauseIcon onClick={() => this.handlePauseVideo()} /> : <PlayArrowIcon onClick={() => this.handlePlayVideo()} />
                                        }
                                    </IconButton>
                                    {
                                        isPlaying ? <IconButton onClick={() => this.handleChangeCurrentTime(10)}><Forward10Icon /></IconButton> : ""
                                    }
                                </div>
                            }
                            <div>
                                <IconButton onClick={() => this.handleSetMuted(!isMuted)}>
                                    {isMuted == true ? <img style={{ width: 24, height: 24 }} src={mute} /> : <img style={{ width: 24, height: 24 }} src={unmute} />}
                                </IconButton>
                            </div>
                        </div>
                    </ControlBar>
                </Player>
            </div>
        )
    }
}
export default Loader
