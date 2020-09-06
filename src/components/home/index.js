import React from "react";
import './style.scss'
import {
  addHeaderContent,
  addFooterContent,
  toggleHeader,
  toggleFooter,
  toggleUserPageDrawer
} from '../../actions/app'
import {
  setCurrenUserDetail
} from '../../actions/user'
import { connect } from 'react-redux'
import { StickyContainer, Sticky } from 'react-sticky';
import Slider from "react-slick";
import {
  AppBar,
  Tabs,
  Tab,
  Avatar
} from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views';

const noti = require('../../assets/icon/NotiBw@1x.png')
const profileBw = require('../../assets/icon/ProfileBW.png')
const settingBw = require('../../assets/icon/seting1@1x.png')
const home = require('../../assets/icon/home@1x.png')
const yootLogo = require('../../assets/icon/Logo_y@1x.png')
const community = require('../../assets/icon/community@1x.png')
const skill = require('../../assets/icon/Skill.png')
const job1 = require('../../assets/icon/Vocational_guidance.png')
const job = require('../../assets/icon/job@1x.png')
const house = require('../../assets/icon/Motel.png')
const teach = require('../../assets/icon/teach.png')
const coin = require('../../assets/icon/Coins_Y.png')
const like = require('../../assets/icon/like@1x.png')
const follower = require('../../assets/icon/Follower@1x.png')
const donePractice = require('../../assets/icon/DonePractive@1x.png')


const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
};

const member = [
  {
    coverImage: "https://ak.picdn.net/shutterstock/videos/33673936/thumb/1.jpg",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQF5qxHcyf8b5jCFVBLHZhiEEuelb2rcal-mA&usqp=CAU",
    fullName: "Nguyễn Thị Vân Anh",
    point: 20,
    liked: 1231,
    folow: 221,
    posted: 2533,
    birthday: new Date(),
    gender: "Nam",
    friends: [
      {
        coverImage: "https://ak.picdn.net/shutterstock/videos/33673936/thumb/1.jpg",
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQF5qxHcyf8b5jCFVBLHZhiEEuelb2rcal-mA&usqp=CAU",
        fullName: "Nguyễn Thị Vân Anh 1",
        point: 111,
        liked: 111,
        folow: 111,
        posted: 111,
        birthday: new Date(),
        gender: "Nam",
        friends: [
          {
            coverImage: "https://ak.picdn.net/shutterstock/videos/33673936/thumb/1.jpg",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQF5qxHcyf8b5jCFVBLHZhiEEuelb2rcal-mA&usqp=CAU",
            fullName: "Nguyễn Thị Vân Anh 11",
            point: 111,
            liked: 111,
            folow: 111,
            posted: 111,
            birthday: new Date(),
            gender: "Nam",
            friends: [

            ],
            folowing: [
              {
                avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
                fullName: "Apple Ánh"
              },
              {
                avatar: "https://wp-en.oberlo.com/wp-content/uploads/2019/01/Copy-of-Blog-Header-Image-880x450-5-min.jpg",
                fullName: "Võ Gia Huy"
              },
              {
                avatar: "https://girlbehindthereddoor.com/wp-content/uploads/2016/11/girl-behind-the-red-door-lomo-instant-wide-instax-fujifilm-sky-550x360.jpg",
                fullName: "Quynh"
              }
            ],
            folowed: [
              {
                avatar: "https://wp-en.oberlo.com/wp-content/uploads/2019/01/Copy-of-Blog-Header-Image-880x450-5-min.jpg",
                fullName: "Võ Gia Huy"
              },
              {
                avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
                fullName: "Apple Ánh"
              },
              {
                avatar: "https://girlbehindthereddoor.com/wp-content/uploads/2016/11/girl-behind-the-red-door-lomo-instant-wide-instax-fujifilm-sky-550x360.jpg",
                fullName: "Quynh"
              }
            ],
            jobs: [
              {
                position: "Nhân viên Thiết kế",
                company: "Công ty Cổ phần Công nghệ & Đào tạo YOOT",
                description: "Không có mô tả",
                start: "10/20/2019",
                end: "10/20/2020"
              }
            ],
            studies: [
              {
                majors: "Nhân viên Thiết kế",
                school: "Công ty Cổ phần Công nghệ & Đào tạo YOOT",
                className: "D15_MT3DH",
                graduate: "Khá",
                masv: "DH12283",
                start: "1999",
                end: "2004",
                isFinish: true
              }
            ],
            address: "33 Kinh Dương Vương, Bình Chánh, HCM",
            email: "btcvn07@gmail.com",
            skills: ["Quản lý thời gian", "Lãnh đạo"],
            hopies: "Ca hát, thể thao",
            orderSkills: "Ca hát",
            mutualFriendCount: 2

          }

        ],
        folowing: [
          {
            avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
            fullName: "Apple Ánh"
          },
          {
            avatar: "https://wp-en.oberlo.com/wp-content/uploads/2019/01/Copy-of-Blog-Header-Image-880x450-5-min.jpg",
            fullName: "Võ Gia Huy"
          },
          {
            avatar: "https://girlbehindthereddoor.com/wp-content/uploads/2016/11/girl-behind-the-red-door-lomo-instant-wide-instax-fujifilm-sky-550x360.jpg",
            fullName: "Quynh"
          }
        ],
        folowed: [
          {
            avatar: "https://wp-en.oberlo.com/wp-content/uploads/2019/01/Copy-of-Blog-Header-Image-880x450-5-min.jpg",
            fullName: "Võ Gia Huy"
          },
          {
            avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
            fullName: "Apple Ánh"
          },
          {
            avatar: "https://girlbehindthereddoor.com/wp-content/uploads/2016/11/girl-behind-the-red-door-lomo-instant-wide-instax-fujifilm-sky-550x360.jpg",
            fullName: "Quynh"
          }
        ],
        jobs: [
          {
            position: "Nhân viên Thiết kế",
            company: "Công ty Cổ phần Công nghệ & Đào tạo YOOT",
            description: "Không có mô tả",
            start: "10/20/2019",
            end: "10/20/2020"
          }
        ],
        studies: [
          {
            majors: "Nhân viên Thiết kế",
            school: "Công ty Cổ phần Công nghệ & Đào tạo YOOT",
            className: "D15_MT3DH",
            graduate: "Khá",
            masv: "DH12283",
            start: "1999",
            end: "2004",
            isFinish: true
          }
        ],
        address: "33 Kinh Dương Vương, Bình Chánh, HCM",
        email: "btcvn07@gmail.com",
        skills: ["Quản lý thời gian", "Lãnh đạo"],
        hopies: "Ca hát, thể thao",
        orderSkills: "Ca hát",
        mutualFriendCount: 2
      },
      {
        coverImage: "https://ak.picdn.net/shutterstock/videos/33673936/thumb/1.jpg",
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQF5qxHcyf8b5jCFVBLHZhiEEuelb2rcal-mA&usqp=CAU",
        fullName: "Nguyễn Thị Vân Anh 2",
        point: 222,
        liked: 222,
        folow: 222,
        posted: 222,
        birthday: new Date(),
        gender: "Nam",
        friends: [

        ],
        folowing: [
          {
            avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
            fullName: "Apple Ánh"
          },
          {
            avatar: "https://wp-en.oberlo.com/wp-content/uploads/2019/01/Copy-of-Blog-Header-Image-880x450-5-min.jpg",
            fullName: "Võ Gia Huy"
          },
          {
            avatar: "https://girlbehindthereddoor.com/wp-content/uploads/2016/11/girl-behind-the-red-door-lomo-instant-wide-instax-fujifilm-sky-550x360.jpg",
            fullName: "Quynh"
          }
        ],
        folowed: [
          {
            avatar: "https://wp-en.oberlo.com/wp-content/uploads/2019/01/Copy-of-Blog-Header-Image-880x450-5-min.jpg",
            fullName: "Võ Gia Huy"
          },
          {
            avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
            fullName: "Apple Ánh"
          },
          {
            avatar: "https://girlbehindthereddoor.com/wp-content/uploads/2016/11/girl-behind-the-red-door-lomo-instant-wide-instax-fujifilm-sky-550x360.jpg",
            fullName: "Quynh"
          }
        ],
        jobs: [
          {
            position: "Nhân viên Thiết kế",
            company: "Công ty Cổ phần Công nghệ & Đào tạo YOOT",
            description: "Không có mô tả",
            start: "10/20/2019",
            end: "10/20/2020"
          }
        ],
        studies: [
          {
            majors: "Nhân viên Thiết kế",
            school: "Công ty Cổ phần Công nghệ & Đào tạo YOOT",
            className: "D15_MT3DH",
            graduate: "Khá",
            masv: "DH12283",
            start: "1999",
            end: "2004",
            isFinish: true
          }
        ],
        address: "33 Kinh Dương Vương, Bình Chánh, HCM",
        email: "btcvn07@gmail.com",
        skills: ["Quản lý thời gian", "Lãnh đạo"],
        hopies: "Ca hát, thể thao",
        orderSkills: "Ca hát",
        mutualFriendCount: 20
      },
    ],
    folowing: [
      {
        avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
        fullName: "Apple Ánh"
      },
      {
        avatar: "https://wp-en.oberlo.com/wp-content/uploads/2019/01/Copy-of-Blog-Header-Image-880x450-5-min.jpg",
        fullName: "Võ Gia Huy"
      },
      {
        avatar: "https://girlbehindthereddoor.com/wp-content/uploads/2016/11/girl-behind-the-red-door-lomo-instant-wide-instax-fujifilm-sky-550x360.jpg",
        fullName: "Quynh"
      }
    ],
    folowed: [
      {
        avatar: "https://wp-en.oberlo.com/wp-content/uploads/2019/01/Copy-of-Blog-Header-Image-880x450-5-min.jpg",
        fullName: "Võ Gia Huy"
      },
      {
        avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
        fullName: "Apple Ánh"
      },
      {
        avatar: "https://girlbehindthereddoor.com/wp-content/uploads/2016/11/girl-behind-the-red-door-lomo-instant-wide-instax-fujifilm-sky-550x360.jpg",
        fullName: "Quynh"
      }
    ],
    jobs: [
      {
        position: "Nhân viên Thiết kế",
        company: "Công ty Cổ phần Công nghệ & Đào tạo YOOT",
        description: "Không có mô tả",
        start: "10/20/2019",
        end: "10/20/2020"
      }
    ],
    studies: [
      {
        majors: "Nhân viên Thiết kế",
        school: "Công ty Cổ phần Công nghệ & Đào tạo YOOT",
        className: "D15_MT3DH",
        graduate: "Khá",
        masv: "DH12283",
        start: "1999",
        end: "2004",
        isFinish: true
      }
    ],
    address: "33 Kinh Dương Vương, Bình Chánh, HCM",
    email: "btcvn07@gmail.com",
    skills: ["Quản lý thời gian", "Lãnh đạo"],
    hopies: "Ca hát, thể thao",
    orderSkills: "Ca hát"
  },
  {
    coverImage: "https://ak.picdn.net/shutterstock/videos/33673936/thumb/1.jpg",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQF5qxHcyf8b5jCFVBLHZhiEEuelb2rcal-mA&usqp=CAU",
    fullName: "Bảo Ngọc",
    point: 20,
    liked: 1231,
    folow: 221,
    posted: 2533,
    birthday: new Date(),
    gender: "Nam",
    friends: [

    ],
    folowing: [
      {
        avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
        fullName: "Apple Ánh"
      },
      {
        avatar: "https://wp-en.oberlo.com/wp-content/uploads/2019/01/Copy-of-Blog-Header-Image-880x450-5-min.jpg",
        fullName: "Võ Gia Huy"
      },
      {
        avatar: "https://girlbehindthereddoor.com/wp-content/uploads/2016/11/girl-behind-the-red-door-lomo-instant-wide-instax-fujifilm-sky-550x360.jpg",
        fullName: "Quynh"
      }
    ],
    folowed: [
      {
        avatar: "https://wp-en.oberlo.com/wp-content/uploads/2019/01/Copy-of-Blog-Header-Image-880x450-5-min.jpg",
        fullName: "Võ Gia Huy"
      },
      {
        avatar: "https://znews-photo.zadn.vn/w660/Uploaded/squfcgmv/2019_09_16/4.jpg",
        fullName: "Apple Ánh"
      },
      {
        avatar: "https://girlbehindthereddoor.com/wp-content/uploads/2016/11/girl-behind-the-red-door-lomo-instant-wide-instax-fujifilm-sky-550x360.jpg",
        fullName: "Quynh"
      }
    ],
    jobs: [
      {
        position: "Nhân viên Thiết kế",
        company: "Công ty Cổ phần Công nghệ & Đào tạo YOOT",
        description: "Không có mô tả",
        start: "10/20/2019",
        end: "10/20/2020"
      }
    ],
    studies: [
      {
        majors: "Nhân viên Thiết kế",
        school: "Công ty Cổ phần Công nghệ & Đào tạo YOOT",
        className: "D15_MT3DH",
        graduate: "Khá",
        masv: "DH12283",
        start: "1999",
        end: "2004",
        isFinish: true
      }
    ],
    address: "33 Kinh Dương Vương, Bình Chánh, HCM",
    email: "btcvn07@gmail.com",
    skills: ["Quản lý thời gian", "Lãnh đạo"],
    hopies: "Ca hát, thể thao",
    orderSkills: "Ca hát"
  },
]

const groups = [
  {
    groupName: "MÓN NGON DỄ LÀM NGON BỔ RẺ",
    groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage: "https://c.tadst.com/gfx/600x337/moon-photography-camera.jpg?1",
    posted: 373,
    members: [
      {
        avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
      },
      {
        avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
      }
    ]
  },
  {
    groupName: "MÓN NGON DỄ LÀM NGON BỔ RẺ",
    groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage: "https://media.macphun.com/img/uploads/customer/how-to/579/15349456005b7d69405aabf4.32904503.jpg?q=85&w=1340",
    posted: 373,
    members: [
      {
        avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
      },
      {
        avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
      },
      {
        avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
      },
    ]
  },
  {
    groupName: "MÓN NGON DỄ LÀM NGON BỔ RẺ",
    groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage: "https://c.tadst.com/gfx/600x337/moon-photography-camera.jpg?1",
    posted: 373,
    members: [
      {
        avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
      },
      {
        avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
      }
    ],
    owner: true
  },
  {
    groupName: "MÓN NGON DỄ LÀM NGON BỔ RẺ",
    groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage: "https://media.macphun.com/img/uploads/customer/how-to/579/15349456005b7d69405aabf4.32904503.jpg?q=85&w=1340",
    posted: 373,
    members: [
      {
        avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
      },
      {
        avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
      }
    ]
  },
  {
    groupName: "MÓN NGON DỄ LÀM NGON BỔ RẺ",
    groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage: "https://c.tadst.com/gfx/600x337/moon-photography-camera.jpg?1",
    posted: 373,
    members: [
      {
        avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
      },
      {
        avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
      }
    ]
  },
  {
    groupName: "MÓN NGON DỄ LÀM NGON BỔ RẺ",
    groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage: "https://media.macphun.com/img/uploads/customer/how-to/579/15349456005b7d69405aabf4.32904503.jpg?q=85&w=1340",
    posted: 373,
    members: [
      {
        avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
      },
      {
        avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
      }
    ]
  },
  {
    groupName: "MÓN NGON DỄ LÀM NGON BỔ RẺ",
    groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage: "https://c.tadst.com/gfx/600x337/moon-photography-camera.jpg?1",
    posted: 373,
    members: [
      {
        avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
      },
      {
        avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
      },
      {
        avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
      },
    ],
    owner: true
  },
  {
    groupName: "MÓN NGON DỄ LÀM NGON BỔ RẺ",
    groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage: "https://media.macphun.com/img/uploads/customer/how-to/579/15349456005b7d69405aabf4.32904503.jpg?q=85&w=1340",
    posted: 373,
    members: [
      {
        avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
      },
      {
        avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
      }
    ]
  },
  {
    groupName: "MÓN NGON DỄ LÀM NGON BỔ RẺ",
    groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage: "https://c.tadst.com/gfx/600x337/moon-photography-camera.jpg?1",
    posted: 373,
    members: [
      {
        avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
      },
      {
        avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
      },
      {
        avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
      }
    ]
  },
  {
    groupName: "MÓN NGON DỄ LÀM NGON BỔ RẺ",
    groupAvatar: "https://i.pinimg.com/originals/b8/61/3b/b8613b448bc615045a663186783aa85c.jpg",
    coverImage: "https://media.macphun.com/img/uploads/customer/how-to/579/15349456005b7d69405aabf4.32904503.jpg?q=85&w=1340",
    posted: 373,
    members: [
      {
        avatar: "https://photographyandthemac.com/wp-content/uploads/2019/04/heron700px.jpg"
      },
      {
        avatar: "https://bucket.nhanh.vn/store1/42431/ps/20200227/fujifilm_x_t4_mirrorless_digital_camera__body_only__silver_.jpg"
      }
    ]
  },
]

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0
    };
  }
  componentWillMount() {
    this.props.addHeaderContent(renderHeader())
    this.props.addFooterContent(renderFooter(this.props.history))
    this.props.toggleHeader(true)
    this.props.toggleFooter(true)
  }
  render() {
    let {
      tabIndex
    } = this.state
    return (
      <div className="home-page" >
        <div className="home-slider">
          <Slider {...settings}>
            <div className="slide-item">
              <img src="http://157.119.251.140:9669/Assets/Image/Banner/banner02.png?utm_source=zalo&utm_medium=zalo&utm_campaign=zalo&zarsrc=31" />
            </div>
            <div className="slide-item">
              <img src="http://157.119.251.140:9669/Assets/Image/Banner/banner02.png?utm_source=zalo&utm_medium=zalo&utm_campaign=zalo&zarsrc=31" />
            </div>
            <div className="slide-item">
              <img src="http://157.119.251.140:9669/Assets/Image/Banner/banner02.png?utm_source=zalo&utm_medium=zalo&utm_campaign=zalo&zarsrc=31" />
            </div>
          </Slider>
        </div>
        <StickyContainer className="container">
          <Sticky topOffset={-60} >
            {({ style }) => (
              <div style={{ ...style, top: "60px", zIndex: 999 }}>
                <div className="home-menu">
                  <div>
                    <ul>
                      <li onClick={() => this.props.history.push("/community")}>
                        <img src={community}></img>
                        <span>Cộng đồng</span>
                      </li>
                      <li onClick={() => this.props.history.push("/skills")}>
                        <img src={skill}></img>
                        <span>Kỹ năng</span>
                      </li>
                      <li onClick={() => this.props.history.push("/career-guidance")}>
                        <img src={job1}></img>
                        <span>Hướng nghiệp</span>
                      </li>
                      <li>
                        <img src={job}></img>
                        <span>Việc làm</span>
                      </li>
                      <li>
                        <img src={house}></img>
                        <span>Nhà trọ</span>
                      </li>
                      <li>
                        <img src={teach}></img>
                        <span>Gia sư</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </Sticky>
          <div className="member-list">
            <AppBar position="static" color="default" className={"custom-tab"}>
              <Tabs
                value={tabIndex}
                onChange={(e, value) => this.setState({ tabIndex: value })}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                aria-label="full width tabs example"
                className="tab-header"
              >
                <Tab label="Thành viên tích cực" {...a11yProps(0)} className="tab-item" />
                <Tab label="Nhóm chất lượng" {...a11yProps(1)} className="tab-item" />
              </Tabs>
            </AppBar>
            <SwipeableViews
              index={tabIndex}
              onChangeIndex={(value) => this.setState({ tabIndex: value })}
              className="tab-content"
            >
              <TabPanel value={tabIndex} index={0} className="content-box">
                <div className="top-members">
                  {
                    member.map((item, key) => <div key={key} className={"member " + ("color-" + key % 3)} onClick={() => {
                      this.props.setCurrenUserDetail(item)
                      this.props.toggleUserPageDrawer(true)
                    }}>
                      <div className="member-avatar">
                        <Avatar aria-label="recipe" className="avatar">
                          <img src={item.avatar} style={{ width: "100%" }} />
                        </Avatar>
                      </div>
                      <div className="user-info">
                        <span className="rank">#{key + 1}</span>
                        <span className="user-name">{item.fullName}</span>
                        <span className="point">
                          <span>Điển YOOT: {item.point}</span>
                          <img src={coin} />
                        </span>
                        <div className="react-reward">
                          <ul>
                            <li>
                              <span><img src={like}></img></span>
                              <span>{item.liked}</span>
                            </li>
                            <li>
                              <span><img src={follower}></img></span>
                              <span>{item.folow}</span>
                            </li>
                            <li>
                              <span><img src={donePractice}></img></span>
                              <span>{item.posted}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>)
                  }
                  <span className="link-to-standing">Đến bảng xếp hạng</span>
                </div>
              </TabPanel>
              <TabPanel value={tabIndex} index={1} >
                <div className="top-groups">
                  {
                    groups.map((item, key) => <div className="group-item" key={key} style={{ background: "url(" + item.coverImage + ")" }}>
                      <div className="group-info">
                        <Avatar aria-label="recipe" className="avatar">
                          <img src={item.groupAvatar} style={{ width: "100%" }} />
                        </Avatar>
                        <span className="group-name">{item.groupName}</span>
                      </div>
                      <span className="posted">{item.posted} bài đăng</span>
                      <div className="members-list">
                        <span className="total">Thành viên: {item.members.length}</span>
                        <div className="member-avatar">
                          {
                            item.members.map((item, index) => index < 2 && <Avatar aria-label="recipe" className="avatar">
                              <img src={item.avatar} style={{ width: "100%" }} />
                            </Avatar>
                            )
                          }
                          {
                            item.members.length > 2 ? < Avatar aria-label="recipe" className="avatar">
                              +{item.members.length - 2}
                            </Avatar> : ""
                          }
                        </div>
                      </div>
                      {
                        item.owner == true ? <span className="action-bt accepted">Chấp nhận</span> : <span className="action-bt sumit">Tham gia</span>
                      }
                    </div>)
                  }
                  <span className="link-to-standing">Đến bảng xếp hạng</span>
                </div>
              </TabPanel>
            </SwipeableViews>
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
  toggleUserPageDrawer: (isShow) => dispatch(toggleUserPageDrawer(isShow)),
  setCurrenUserDetail: (user) => dispatch(setCurrenUserDetail(user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);

const renderHeader = () => {
  return (
    <div className="app-header">
      <img src={yootLogo} className="logo"></img>
    </div>
  )
}
const renderFooter = (history) => {
  return (
    <div className="app-footer">
      <ul>
        <li>
          <img src={home}></img>
          <span style={{ color: "#f54746" }}>Trang chủ</span>
        </li>
        <li onClick={() => history.replace('/yoot-noti')}>
          <img src={noti}></img>
          <span>Thông báo</span>
        </li>
        <li onClick={() => history.replace('/profile')}>
          <img src={profileBw}></img>
          <span>Cá nhân</span>
        </li>
        <li onClick={() => history.replace('/setting')}>
          <img src={settingBw}></img>
          <span>Cài đặt</span>
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