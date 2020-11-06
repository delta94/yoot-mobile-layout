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
import { Button } from "@material-ui/core";

const DISC = require('../../assets/icon/DISC@1x.png')
const bannervideo = require('../../assets/images/bannervideo.png')


const styles = theme => ({
  root: {
    marginBottom: '10px',
    boxShadow: 'none',
    borderRadius: '0px',
  },
  mediaDiv: {
    padding: '0px',
  },
  defaultImage: {
    width: "100%"
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
  chipActive: {
    margin: '10px',
    padding: "0 25px",
    background: '#ff5a5a',
    height: '25px',
    color: '#fff',
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
  },
  CardHeaderAction: {
    display: 'flex',
    alignItems: "center"
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
      suggestJobs,
      findedJobs,
      searchKey,
      jobSelected
    } = this.props
    if (!jobSelected) jobSelected = []

    const jobList = searchKey && searchKey.length > 0 ? findedJobs : jobSelected.concat(suggestJobs.filter(item => item.selected == false))

    return (
      jobList.map((item, index) => <Card className={classes.root} key={index}>
        <CardHeader className={classes.CardHeaderHeader}
          action={<div className={classes.CardHeaderAction}>
            <Avatar aria-label="recipe" className={classes.avatar}><img className="drawerAvatar" src={DISC} /></Avatar>
            <Button className={"ml10 height30 " + (item.selected ? "bt-submit" : "bt-cancel")} onClick={() => this.props.onJobClick(item)}>{item.selected ? "Bỏ chọn" : "Chọn"}</Button>
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
          </div> : <img src={bannervideo} className={classes.defaultImage} />
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