import React from "react";
import { withStyles } from "@material-ui/core/styles";
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import {
  toggleMediaViewerDrawer,
  setMediaToViewer,
} from '../../actions/app'
import { connect } from 'react-redux'
import Video from './video'
import './style.scss'

const DISC = require('../../assets/icon/DISC@1x.png')


const styles = theme => ({
  root: {
    marginBottom: '10px',
    boxShadow: 'none',
  },
  mediaDiv: {
    padding: '10px',
    borderBottom: '1px solid',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    border: '1px solid',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: 'rgb(245, 71, 70)',
    width: '25px',
    height: '25px',
    margin: '9px 0 9px 0',
  },
  chip: {
    margin: '10px',
    padding: "0 25px",
    background: '#f2f3f7',
    height: '25px',
    color: 'rgba(0, 0, 0, 0.75)',
    borderRadius: '8px',
    fontSize: '10px',
  },
  TypographyError: {
    color: 'rgb(245, 71, 70)',
  },
  CardHeaderHeader: {
    paddingBottom: '0 !important',
  },
  CardContent: {
    paddingTop: '5px !important',
    borderBottom: '1px solid',
  },
  CardHeaderAction: {
    display: 'flex',
  }
});

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      anchorEl: null,
      open: false
    };
    this.video = []
    // this.video = [React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef()]
    this.handleExpandClick = this.handleExpandClick.bind(this);
    this.handleClickAway = this.handleClickAway.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  handlePlayVideo(videoRef, index) {

    this.video.map((item, i) => {
      if (index != i)
        this.handlePauseVideo(item)
    })

    let video = videoRef.current

    if (video) {
      video.play()
      this.setState({
        playingIndex: index
      })
      // video.subscribeToStateChange((state, prevState) => {
      //   if (state.isActive == true)
      //     this.setState({
      //       playingIndex: index
      //     })
      //   else {
      //     this.setState({
      //       playingIndex: null
      //     })
      //   }
      // })
    }
  }

  handlePauseVideo(videoRef) {
    let video = videoRef.current
    if (video) {
      video.pause()
      this.setState({
        playingIndex: null
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
    const classes = this.props.classes;
    const isNew = this.props.isNew || false;
    const iconClass = clsx(classes.expand, {
      [classes.expandOpen]: this.state.expanded
    });
    let {
      playingIndex
    } = this.state
    let {
      suggestJobs,
      findedJobs
    } = this.props
    const jobList = findedJobs && findedJobs.length > 0 ? findedJobs : suggestJobs

    console.log(this.props)
    console.log("video", this.video)
    return (
      jobList.map((item, index) => <Card className={classes.root} key={index}>
        <CardHeader className={classes.CardHeaderHeader}
          action={<div className={classes.CardHeaderAction}>
            <Avatar aria-label="recipe" className={classes.avatar}><img className="drawerAvatar" src={DISC} /></Avatar>
            <Chip className={classes.chip} label="Chọn"></Chip>
          </div>
          }
          title={<Typography className={classes.TypographyError} variant="h6" color="colorError" gutterBottom>{item.text}</Typography>}
        />
        <CardContent className={classes.CardContent}>
          <Typography variant="subtitle1" color="textSecondary" component="p">{item.description}</Typography>
        </CardContent>
        {
          item.videolinks.length > 0 ? <div className={classes.mediaDiv}>
            {
              item.videolinks.map((video, j) => <Video videoURL={video} videoThumb={item.thumbnaillinks[j]} />)
            }
          </div> : ""
        }
      </Card>)
    );
  }

  handleExpandClick() {
    this.setState({ expanded: !this.state.expanded });
  }

  onClick(event) {
    this.setState({
      anchorEl: event.currentTarget,
      open: !this.state.open
    });
  }

  handleClickAway() {
    this.setState({
      open: false
    });
  }

  onChange() { }
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

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps
)(Index));