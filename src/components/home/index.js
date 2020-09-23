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
  setCurrenUserDetail,
} from '../../actions/user'
import {
  joinGroup,
  acceptGroup
} from '../../actions/group'
import { connect } from 'react-redux'
import { StickyContainer, Sticky } from 'react-sticky';
import {
  SOCIAL_NET_WORK_API,
  SYSTEM_API
} from '../../constants/appSettings'
import Slider from "react-slick";
import {
  AppBar,
  Tabs,
  Tab,
  Avatar,
  Button,
  FormControlLabel,
  Checkbox,
  Drawer,
  IconButton
} from '@material-ui/core'
import {
  ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons'
import SwipeableViews from 'react-swipeable-views';
import { get } from "../../api";
import moment from 'moment'
import { objToQuery } from "../../utils/common";
import Loader from '../common/loader'
import $ from 'jquery'

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

const checkIcon = require('../../assets/images/check.png')
const checkedIcon = require('../../assets/images/checked.png')


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
      tabIndex: 0,
      joinGroupProccessingId: 80,
      isRead: false,
      topGroups: [],
      topUsers: [],
      groupCurrentPage: 0,
      isEndOfGroupList: false,
      userCurrenntPage: 0,
      isEndOfUserList: false
    };
  }

  getBanner() {
    get(SYSTEM_API, "System/GetBanners", result => {
      this.setState({
        panners: result.content.banners
      })
    })
  }


  getTopUser(currentpage) {
    let {
      topUsers
    } = this.state
    let param = {
      currentpage: currentpage,
      currentdate: moment(new Date).format("YYYY-MM-DD hh:mm:ss"),
      limit: 20
    }
    let queryParam = objToQuery(param)
    get(SOCIAL_NET_WORK_API, "User/GetTopUsers" + queryParam, result => {
      if (result.result == 1) {
        let list = result.content.topUsers
        list.map(item => item.friendid = item.userid)
        this.setState({
          topUsers: topUsers.concat(list),
          isLoadMoreGroup: false
        })
        if (result.content.topUsers.length == 0) {
          this.setState({
            isEndOfUserList: true
          })
        }
      }
    })
  }

  getTopGroup(currentpage) {
    if (currentpage < 0) return
    let {
      topGroups
    } = this.state
    let param = {
      currentpage: currentpage,
      currentdate: moment(new Date).format("YYYY-MM-DD hh:mm:ss"),
      limit: 20,
      skin: 'TopGroup'
    }
    let queryParam = objToQuery(param)
    get(SOCIAL_NET_WORK_API, "GroupUser/GetListGroupUser" + queryParam, result => {
      if (result.result == 1) {
        this.setState({
          topGroups: topGroups.concat(result.content.groupUsers),
          isLoadMoreGroup: false
        })
        if (result.content.groupUsers.length == 0) {
          this.setState({
            isEndOfGroupList: true
          })
        }
      }
    })
  }

  joinGroup(groupid) {
    let {
      topGroups
    } = this.state
    this.setState({
      joinGroupProccessingId: groupid,
      showJoinGroupConfirm: false
    })
    this.props.joinGroup(groupid, () => {
      topGroups.map(group => {
        if (group.groupid == groupid) {
          group.status = 1
        }
      })
      this.setState({
        joinGroupProccessingId: null,
      })
    }, () => {
      this.setState({
        joinGroupProccessingId: null
      })
    })
  }

  acceptGroup(groupid) {
    let {
      topGroups
    } = this.state

    this.setState({
      joinGroupProccessingId: groupid,
      showJoinGroupConfirm: false
    })
    this.props.acceptGroup(groupid, () => {
      topGroups.map(group => {
        if (group.groupid == groupid) {
          group.status = 1
        }
      })
      this.setState({
        joinGroupProccessingId: null,
        topGroups: topGroups
      })
    }, () => {
      this.setState({
        joinGroupProccessingId: null
      })
    })
  }

  onScroll() {
    let element = $("#top-rank-content")
    let {
      groupCurrentPage,
      userCurrenntPage,
      rankTabIndex,
      isLoadMoreGroup,
      isEndOfGroupList,
      isEndOfUserList
    } = this.state
    if (element && rankTabIndex >= 0)
      if (element.scrollTop() + element.innerHeight() >= element[0].scrollHeight) {
        if (rankTabIndex == 0) {
          if (isLoadMoreGroup == false && isEndOfUserList == false) {
            this.setState({
              userCurrenntPage: userCurrenntPage + 1,
              isLoadMoreGroup: true
            }, () => {
              this.getTopUser(userCurrenntPage + 1)
            })
          }
        }
        else {
          if (isLoadMoreGroup == false && isEndOfGroupList == false) {
            this.setState({
              groupCurrentPage: groupCurrentPage + 1,
              isLoadMoreGroup: true
            }, () => {
              this.getTopGroup(groupCurrentPage + 1)
            })
          }
        }
      }
  }

  componentWillMount() {
    let {
      groupCurrentPage,
      userCurrenntPage
    } = this.state
    this.getBanner()
    this.getTopUser(userCurrenntPage)
    this.getTopGroup(groupCurrentPage)
    this.props.addHeaderContent(renderHeader())
    this.props.addFooterContent(renderFooter(this.props.history))
    this.props.toggleHeader(true)
    this.props.toggleFooter(true)
  }
  render() {
    let {
      tabIndex,
      panners,
      topUsers,
      topGroups,
      joinGroupProccessingId,
      groupCurrentPage
    } = this.state

    return (
      <div className="home-page" >
        <div className="home-slider">
          <Slider {...settings}>
            {
              panners && panners.map((banner, index) => <div className="slide-item" key={index}>
                <img src={banner.link} />
              </div>)
            }
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
                    topUsers ? topUsers.map((item, key) => <div key={key} className={"member " + ("color-" + key % 3)} onClick={() => {
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
                        <span className="user-name">{item.fullname}</span>
                        <span className="point">
                          <span>Điển YOOT: {item.point}</span>
                          <img src={coin} />
                        </span>
                        <div className="react-reward">
                          <ul>
                            <li>
                              <span><img src={like}></img></span>
                              <span>{item.numlike}</span>
                            </li>
                            <li>
                              <span><img src={follower}></img></span>
                              <span>{item.numfollow}</span>
                            </li>
                            <li>
                              <span><img src={donePractice}></img></span>
                              <span>{item.numpost}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>) : ""
                  }
                  <span className="link-to-standing" onClick={() => this.setState({ showRankDrawer: true, rankTabIndex: tabIndex })}>Đến bảng xếp hạng</span>
                </div>
              </TabPanel>
              <TabPanel value={tabIndex} index={1} >
                <div className="top-groups">
                  {
                    topGroups ? topGroups.map((item, key) => <div className="group-item" key={key} style={{ background: "url(" + item.backgroundimage + ")" }}>
                      <div className="group-info">
                        <Avatar aria-label="recipe" className="avatar">
                          <img src={item.thumbnail} style={{ width: "100%" }} />
                        </Avatar>
                        <span className="group-name">{item.groupname}</span>
                      </div>
                      <span className="posted">{item.numpost} bài đăng</span>
                      <div className="members-list">
                        <span className="total">Thành viên: {item.nummember}</span>
                        <div>
                          {
                            item.managers && item.managers.length > 0 ? <div className="member-avatar">
                              {
                                item.managers.map((manager, index) => index < 2 && <Avatar aria-label="recipe" className="avatar">
                                  <img src={manager.avatar} style={{ width: "100%" }} />
                                </Avatar>
                                )
                              }
                              {
                                item.managers.length > 2 ? < Avatar aria-label="recipe" className="avatar">
                                  +{item.managers.length - 2}
                                </Avatar> : ""
                              }
                            </div> : ""
                          }
                          {
                            item.status == 0 ? <span className="action-bt sumit" onClick={() => this.setState({ currentGroupId: item.groupid, showJoinGroupConfirm: true, isJoiningGroup: true })}>
                              Tham gia
                           {
                                joinGroupProccessingId == item.groupid ? <Loader type="small" /> : ""
                              }
                            </span> : ""
                          }
                          {
                            item.status == 2 ? <span className="action-bt accepted" onClick={() => this.setState({ currentGroupId: item.groupid, showJoinGroupConfirm: true, isJoiningGroup: false })}>
                              Chấp nhận
                               {
                                joinGroupProccessingId == item.groupid ? <Loader type="small" /> : ""
                              }
                            </span> : ""
                          }
                        </div>
                      </div>

                    </div>) : ""
                  }
                  <span className="link-to-standing" onClick={() => this.setState({ showRankDrawer: true, rankTabIndex: tabIndex })}>Đến bảng xếp hạng</span>
                </div>
              </TabPanel>
            </SwipeableViews>
          </div>
        </StickyContainer>
        {
          renderJoinGroupConfirm(this)
        }
        {
          renderTopRankDrawer(this)
        }
      </div>

    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.app,
    ...state.user
  }
};

const mapDispatchToProps = dispatch => ({
  addHeaderContent: (headerContent) => dispatch(addHeaderContent(headerContent)),
  addFooterContent: (footerContent) => dispatch(addFooterContent(footerContent)),
  toggleHeader: (isShow) => dispatch(toggleHeader(isShow)),
  toggleFooter: (isShow) => dispatch(toggleFooter(isShow)),
  toggleUserPageDrawer: (isShow) => dispatch(toggleUserPageDrawer(isShow)),
  setCurrenUserDetail: (user) => dispatch(setCurrenUserDetail(user)),
  joinGroup: (groupId, successCallback, errorCallback) => dispatch(joinGroup(groupId, successCallback, errorCallback)),
  acceptGroup: (groupId, successCallback, errorCallback) => dispatch(acceptGroup(groupId, successCallback, errorCallback))
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
        {/* <li onClick={() => history.replace('/yoot-noti')}>
          <img src={noti}></img>
          <span>Thông báo</span>
        </li> */}
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

const renderJoinGroupConfirm = (component) => {
  let {
    showJoinGroupConfirm,
    isRead,
    currentGroupId,
    isJoiningGroup
  } = component.state
  return (
    <Drawer anchor="bottom" className="confirm-drawer" open={showJoinGroupConfirm} onClose={() => component.setState({ showJoinGroupConfirm: false, currentGroupId: null })}>
      <div className='jon-group-confirm'>
        <label>Nội quy nhóm</label>
        <p>Vui lòng đọc kỹ và xác nhận nội quy nhóm trước khi tham gia nhóm.</p>
        <div className="accept-role">
          <FormControlLabel
            control={<Checkbox checked={isRead} onChange={() => component.setState({ isRead: !isRead })} icon={<img src={checkIcon} style={{ width: 20, height: 20 }} />} checkedIcon={<img src={checkedIcon} style={{ width: 20, height: 20 }} />} name="checkedH" />}
            label={<span>Xác nhận đã đọc nội quy</span>}
            labelPlacement="start"
          />
        </div>
        <div>
          <Button className="bt-cancel" onClick={() => component.setState({ showJoinGroupConfirm: false, currentGroupId: null })}>Đóng</Button>
          {
            isRead ? <Button className="bt-submit" onClick={() => isJoiningGroup == true ? component.joinGroup(currentGroupId) : component.acceptGroup(currentGroupId)}>Tham gia nhóm</Button> : <Button className="bt-submit" style={{ opacity: 0.5 }} disabled>Tham gia nhóm</Button>
          }
        </div>
      </div>
    </Drawer>
  )
}

const renderTopRankDrawer = (component) => {

  let {
    rankTabIndex,
    panners,
    topUsers,
    topGroups,
    joinGroupProccessingId,
    showRankDrawer,
    isLoadMoreGroup
  } = component.state


  return (
    <Drawer anchor="bottom" className="top-rank-drawer" open={showRankDrawer} onClose={() => component.setState({ showRankDrawer: false })}>
      <div className="drawer-detail">
        <div className="drawer-header">
          <div className="direction" onClick={() => component.setState({
            showRankDrawer: false,
            topGroups: topGroups.slice(0, 20),
            topUsers: topUsers.slice(0, 20),
            rankTabIndex: -1
          })}>
            <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} >
              <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
            </IconButton>
            <label>Bảng xếp hạng</label>
          </div>
        </div>
        <div className="filter">
          <AppBar position="static" color="default" className={"custom-tab"}>
            <Tabs
              value={rankTabIndex}
              onChange={(e, value) => component.setState({ rankTabIndex: value })}
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
        </div>
        <div className="content-form" style={{ overflow: "scroll", width: "100vw" }} id="top-rank-content" onScroll={(e) => component.onScroll(e)}>
          <div className="member-list">
            <SwipeableViews
              index={rankTabIndex}
              onChangeIndex={(value) => component.setState({ rankTabIndex: value })}
              className="tab-content"
            >
              <TabPanel value={rankTabIndex} index={0} className="content-box">
                <div className="top-members">
                  {
                    topUsers ? topUsers.map((item, key) => <div key={key} className={"member " + ("color-" + key % 3)} onClick={() => {
                      component.props.setCurrenUserDetail(item)
                      component.props.toggleUserPageDrawer(true)
                    }}>
                      <div className="member-avatar">
                        <Avatar aria-label="recipe" className="avatar">
                          <img src={item.avatar} style={{ width: "100%" }} />
                        </Avatar>
                      </div>
                      <div className="user-info">
                        <span className="rank">#{key + 1}</span>
                        <span className="user-name">{item.fullname}</span>
                        <span className="point">
                          <span>Điển YOOT: {item.point}</span>
                          <img src={coin} />
                        </span>
                        <div className="react-reward">
                          <ul>
                            <li>
                              <span><img src={like}></img></span>
                              <span>{item.numlike}</span>
                            </li>
                            <li>
                              <span><img src={follower}></img></span>
                              <span>{item.numfollow}</span>
                            </li>
                            <li>
                              <span><img src={donePractice}></img></span>
                              <span>{item.numpost}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>) : ""
                  }
                  {
                    isLoadMoreGroup ? <div style={{ height: "50px" }}><Loader type="small" /></div> : ""
                  }
                </div>
              </TabPanel>
              <TabPanel value={rankTabIndex} index={1} >
                <div className="top-groups">
                  {
                    topGroups ? topGroups.map((item, key) => <div className="group-item" key={key} style={{ background: "url(" + item.backgroundimage + ")" }}>
                      <div className="group-info">
                        <Avatar aria-label="recipe" className="avatar">
                          <img src={item.thumbnail} style={{ width: "100%" }} />
                        </Avatar>
                        <span className="group-name">{item.groupname}</span>
                      </div>
                      <span className="posted">{item.numpost} bài đăng</span>
                      <div className="members-list">
                        <span className="total">Thành viên: {item.nummember}</span>
                        <div>
                          {
                            item.managers && item.managers.length > 0 ? <div className="member-avatar">
                              {
                                item.managers.map((manager, index) => index < 2 && <Avatar aria-label="recipe" className="avatar">
                                  <img src={manager.avatar} style={{ width: "100%" }} />
                                </Avatar>
                                )
                              }
                              {
                                item.managers.length > 2 ? < Avatar aria-label="recipe" className="avatar">
                                  +{item.managers.length - 2}
                                </Avatar> : ""
                              }
                            </div> : ""
                          }
                          {
                            item.status == 0 ? <span className="action-bt sumit" onClick={() => component.setState({ currentGroupId: item.groupid, showJoinGroupConfirm: true, isJoiningGroup: true })}>
                              Tham gia
                           {
                                joinGroupProccessingId == item.groupid ? <Loader type="small" /> : ""
                              }
                            </span> : ""
                          }
                          {
                            item.status == 2 ? <span className="action-bt accepted" onClick={() => component.setState({ currentGroupId: item.groupid, showJoinGroupConfirm: true, isJoiningGroup: false })}>
                              Chấp nhận
                               {
                                joinGroupProccessingId == item.groupid ? <Loader type="small" /> : ""
                              }
                            </span> : ""
                          }
                        </div>
                      </div>
                    </div>) : ""
                  }
                  {
                    isLoadMoreGroup ? <div style={{ height: "50px" }}><Loader type="small" /></div> : ""
                  }
                </div>
              </TabPanel>
            </SwipeableViews>
          </div>
        </div>
      </div>
    </Drawer>
  )
}