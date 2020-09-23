import React from 'react';
import {
    Drawer,
    IconButton,
    AppBar,
    Tabs,
    Tab
} from '@material-ui/core'
import {
    ChevronLeft as ChevronLeftIcon,
    Add as AddIcon
} from '@material-ui/icons'
import SwipeableViews from 'react-swipeable-views';
import { Loader } from '../common/loader'

const defaultImage = "https://dapp.dblog.org/img/default.jpg"

export class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mediaTabIndex: 0
        };
    }



    componentDidMount() {
    }


    render() {
        const postedImage = [
            "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
            "https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg",
            "https://photofolio.co.uk/wp-content/uploads/2015/01/stock-images-636x476.jpg",
            "https://www.robertwalters.com.hk/content/dam/robert-walters/global/images/article-images/digital-neon.jpg",
            "https://dyl80ryjxr1ke.cloudfront.net/external_assets/hero_examples/hair_beach_v1785392215/original.jpeg"
        ]
        const albums = [
            {
                name: "abc",
                items: [
                    "https://www.robertwalters.com.hk/content/dam/robert-walters/global/images/article-images/digital-neon.jpg",
                    "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
                    "https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg",
                    "https://dyl80ryjxr1ke.cloudfront.net/external_assets/hero_examples/hair_beach_v1785392215/original.jpeg",
                    "https://photofolio.co.uk/wp-content/uploads/2015/01/stock-images-636x476.jpg",
                ]
            },
            {
                name: "def",
                items: [
                ]
            }
        ]

        let {
            open,
            onClose,
            profile
        } = this.props
        let {
            mediaTabIndex
        } = this.state
        return (
            <div className="media-drawer">
                <Drawer anchor="bottom" open={open} onClose={() => onClose ? onClose() : ""}>
                    {
                        profile ? <div className="drawer-detail media-drawer">
                            <div className="drawer-header">
                                <div className="direction" onClick={() => onClose ? onClose() : ""}>
                                    <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
                                        <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                                    </IconButton>
                                    <label>Album của {profile.fullName}</label>
                                </div>
                            </div>
                            <div className="filter">
                                <AppBar position="static" color="default" className="custom-tab-1">
                                    <Tabs
                                        value={mediaTabIndex}
                                        onChange={(e, value) => this.setState({ mediaTabIndex: value })}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        variant="fullWidth"
                                        aria-label="full width tabs example"
                                        className="tab-header"
                                    >
                                        <Tab label="Bài đăng" {...a11yProps(0)} className="tab-item" />
                                        <Tab label="Ảnh đại diện" {...a11yProps(1)} className="tab-item" />
                                        <Tab label="Ảnh bìa" {...a11yProps(2)} className="tab-item" />
                                        <Tab label="Album" {...a11yProps(3)} className="tab-item" />
                                    </Tabs>
                                </AppBar>
                            </div>
                            <div className="content-form" style={{ overflow: "scroll", width: "100vw" }}>
                                <SwipeableViews
                                    index={mediaTabIndex}
                                    onChangeIndex={(value) => this.setState({ mediaTabIndex: value })}
                                    className="tab-content"
                                >
                                    <TabPanel value={mediaTabIndex} index={0} className="content-box">
                                        <div className="image-posted image-box">
                                            <ul className="image-list">
                                                {
                                                    postedImage.map((item, index) => <li style={{ background: "url(" + item + ")" }} key={index} onClick={() => {
                                                        this.props.setMediaToViewer({
                                                            commentCount: 30,
                                                            likeCount: 10,
                                                            content: "React Images Viewer is free to use for personal and commercial projects under the MIT license.Attribution is not required, but greatly appreciated.It does not have to be user- facing and can remain within the code.",
                                                            userName: "Tester 001202",
                                                            date: new Date,
                                                            medias: [
                                                                {
                                                                    type: "image",
                                                                    url: item
                                                                }
                                                            ]
                                                        })
                                                        this.props.toggleMediaViewerDrawer(true, { canDownload: true, showInfo: true })
                                                    }}>

                                                    </li>)
                                                }
                                            </ul>
                                        </div>
                                    </TabPanel>
                                    <TabPanel value={mediaTabIndex} index={1} className="content-box">
                                        <div className="avatar-image image-box">
                                            <ul className="image-list">
                                                {
                                                    postedImage.map((item, index) => <li style={{ background: "url(" + item + ")" }} key={index}>

                                                    </li>)
                                                }
                                            </ul>
                                        </div>
                                    </TabPanel>
                                    <TabPanel value={mediaTabIndex} index={2} className="content-box">
                                        <div className="cover-image image-box">
                                            <ul className="image-list">
                                                {
                                                    postedImage.map((item, index) => <li style={{ background: "url(" + item + ")" }} key={index}>

                                                    </li>)
                                                }
                                            </ul>
                                        </div>
                                    </TabPanel>
                                    <TabPanel value={mediaTabIndex} index={3} className="content-box">
                                        <div className="album image-box">
                                            <ul>
                                                <li className="add-bt">
                                                    <div className="demo-bg" >
                                                        <AddIcon />
                                                    </div>
                                                    <span className="name">Tạo album</span>
                                                </li>
                                                {
                                                    albums.map((album, index) => <li key={index}>
                                                        <div>
                                                            <div className="demo-bg" style={{ background: "url(" + (album.items.length > 0 ? album.items[0] : defaultImage) + ")" }} />
                                                        </div>
                                                        <span className="name">{album.name}</span>
                                                    </li>)
                                                }
                                            </ul>
                                        </div>
                                    </TabPanel>
                                </SwipeableViews>
                            </div>
                        </div> : ""
                    }
                </Drawer>
            </div>
        )
    }
}

export default Index;


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