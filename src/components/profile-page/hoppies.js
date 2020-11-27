import React from 'react';
import {
    IconButton,
    Drawer,
    Button,
    Menu,
    MenuItem,
    TextField
} from '@material-ui/core'
import {
    ChevronLeft as ChevronLeftIcon,
    PlayArrow as PlayArrowIcon,
    MoreHoriz as MoreHorizIcon,
} from '@material-ui/icons'
import { get, post } from '../../api';
import { SCHOOL_API, SOCIAL_NET_WORK_API } from '../../constants/appSettings';
import {
    setUserProfile,
    getFolowedMe,
    getMeFolowing
} from '../../actions/user'
import { showNotification } from '../../utils/common';
import { connect } from 'react-redux'
import Loader from '../common/loader'
import CustomMenu from '../common/custom-menu'

export class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            anchor: null,
            showLocalMenu: false,
            showUpdateForm: false,
            hoppies: "",
            otherSkill: "",
            skills: [],
            isProcessing: false
        };
    }

    componentDidMount() {
        this.handleGetSkills()
    }

    handleGetSkills() {
        get(SCHOOL_API, "Course/getSkills", result => {
            if (result.StatusCode == 1) {
                this.setState({
                    skills: result.Data
                })
            }
        })
    }

    handleSelect(skill) {
        let {
            skills
        } = this.state
        skills.map(item => {
            if (item.ID == skill.ID)
                item.isChecked = item.isChecked ? !item.isChecked : true
        })
        this.setState({
            skills,
            isChange: true
        })
    }

    handleSetDefault() {
        let {
            data
        } = this.props
        let {
            skills
        } = this.state
        if (!data) return

        skills.map(item => {
            let existSkill = data.userSkill.find(e => e.skill_fk == item.ID)
            if (existSkill) {
                item.isChecked = true
            } else {
                item.isChecked = false
            }
        })

        this.setState({
            hoppies: data.likes,
            otherSkill: data.special,
            skills: skills
        })
    }

    handleUpdate() {
        let {
            skills,
            hoppies,
            otherSkill
        } = this.state
        let skillsForUpdate = skills.filter(skill => skill.isChecked == true)
        let updateFinishCount = 0
        let skillParam = []
        this.setState({
            isProcessing: true
        })

        skillsForUpdate.map(skill => {
            skillParam.push({
                userid: 0,
                skill_fk: skill.ID
            })
        })
        post(SOCIAL_NET_WORK_API, "User/UpdateUserSkill", skillParam, () => {
            if (updateFinishCount > 0) {
                this.setState({
                    isProcessing: false,
                    showUpdateForm: false
                })
                this.getProfile()
            } else {
                updateFinishCount += 1;
            }
        })
        let favoriteParam = {
            likes: hoppies,
            special: otherSkill
        }
        post(SOCIAL_NET_WORK_API, "User/UpdateUserFavorite", favoriteParam, () => {
            if (updateFinishCount > 0) {
                this.setState({
                    isProcessing: false,
                    showUpdateForm: false
                })
                this.getProfile()
            } else {
                updateFinishCount += 1;
            }
        })
    }

    getProfile() {
        get(SOCIAL_NET_WORK_API, "User/Index?forFriendId=0", result => {
            if (result.result == 1) {
                this.props.setUserProfile(result.content.user)
                this.props.getFolowedMe(0)
                this.props.getMeFolowing(0)
                this.setState({ isUpdatePreccessing: false })
            } else {
                showNotification("", <span className="app-noti-message">{result.message}</span>, null)
            }

        })
    }

    handleDelete() {

        let updateFinishCount = 0

        this.setState({ isProcessing: true })

        post(SOCIAL_NET_WORK_API, "User/UpdateUserSkill", [], () => {
            if (updateFinishCount > 0) {
                this.setState({
                    isProcessing: false,
                    showDeleteConfirm: false
                })
                this.getProfile()
            } else {
                updateFinishCount += 1;
            }
        })
        let favoriteParam = {
            likes: "",
            special: ""
        }
        post(SOCIAL_NET_WORK_API, "User/UpdateUserFavorite", favoriteParam, () => {
            if (updateFinishCount > 0) {
                this.setState({
                    isProcessing: false,
                    showDeleteConfirm: false
                })
                this.getProfile()
            } else {
                updateFinishCount += 1;
            }
        })
    }

    handleClose() {
        if (this.state.isChange) {
            this.setState({
                showCloseConfim: true
            })
        } else {
            this.setState({
                showUpdateForm: false
            })
        }
    }


    render() {
        let { anchor, showLocalMenu, showUpdateForm, hoppies, otherSkill, skills, isProcessing } = this.state
        let { data } = this.props
        return (
            <div className="content-box">
                <label>
                    <img src={require('../../assets/icon/Arrow@1x.png')} style={{ width: "15px", height: "15px", margin: "0px 4px" }} />
                    <span className="ml07">Kỹ năng sở trường</span>
                </label>
                <ul>
                    <li className="mt10">
                        <label>Kỹ năng</label>
                        {
                            data.userSkill && data.userSkill.length > 0 ? <ul className="skills">
                                {
                                    data.userSkill.map((item, index) => <li key={index} className="skill"><span>
                                        {
                                            item.skill_name
                                        }
                                    </span></li>)
                                }

                            </ul> : ""
                        }
                    </li>
                    <li className="mt10">
                        <label style={{ display: "inline-block", width: "100%" }}>Sở thích</label>
                        {
                            data.likes ? <span>{data.likes}</span> : ""
                        }
                    </li>
                    <li className="mt10">
                        <label style={{ display: "inline-block", width: "100%" }}>Kỹ năng đặc biệt / tài lẻ</label>
                        {
                            data.special ? <span>{data.special}</span> : ""
                        }
                    </li>
                </ul>
                <CustomMenu>
                    <MenuItem onClick={() => this.setState({ showLocalMenu: false, showUpdateForm: true }, () => {
                        this.handleSetDefault()
                    })}>Chỉnh sửa</MenuItem>
                    <MenuItem onClick={() => this.setState({ showLocalMenu: false, showDeleteConfirm: true })}>Xoá</MenuItem>
                </CustomMenu>

                <Drawer anchor="bottom" className="drawer-form update-skill" open={showUpdateForm} onClose={() => this.setState({ showUpdateForm: false })}>
                    <div className="form-header">
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => this.handleClose()}>
                            <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                        </IconButton>
                        <label>Kỹ năng và sở trường</label>
                    </div>
                    <div className="form-content">
                        <div>
                            <label>Thêm thông tin về bạn</label>
                            <p>Hãy cho chúng tối biết sở thích, sở trường của bạn và những kỹ năng bạn tự tin nhất.</p>
                        </div>
                        <div className="skill">
                            <label>Kỹ năng</label>
                            <ul>
                                {
                                    skills.map((item, index) => <li key={index} className={item.isChecked ? "active" : ""}>
                                        <Button onClick={() => this.handleSelect(item)}>{item.NAME}</Button>
                                    </li>)
                                }
                            </ul>
                        </div>
                        <div className="skill">
                            <label>Sở thích</label>
                            <TextField
                                className="custom-input"
                                variant="outlined"
                                placeholder="Nhập sở thích của bạn"
                                style={{
                                    width: "100%",
                                    marginTop: "10px",
                                }}
                                multiline
                                value={hoppies}
                                onChange={e => this.setState({ hoppies: e.target.value, isChange: true })}
                            />
                        </div>
                        <div className="skill" style={{ border: "none" }}>
                            <label>Kỹ năng đặc biệt / Tài lẻ</label>
                            <TextField
                                className="custom-input"
                                variant="outlined"
                                placeholder="Nhập thông tin"
                                style={{
                                    width: "100%",
                                    marginTop: "10px",
                                }}
                                multiline
                                value={otherSkill}
                                onChange={e => this.setState({ otherSkill: e.target.value, isChange: true })}
                            />
                        </div>
                        <Button variant="contained" className={"bt-submit"} onClick={() => this.handleUpdate()}>Lưu thông tin</Button>
                    </div>
                    {
                        isProcessing ? <Loader type="dask-mode" isFullScreen={true} /> : ""
                    }
                </Drawer>
                {
                    renderDeleteConfirm(this)
                }
                {
                    renderCloseForm(this)
                }
            </div>
        )
    }
}
const mapDispatchToProps = dispatch => ({
    setUserProfile: (user) => dispatch(setUserProfile(user)),
    getFolowedMe: (currentpage) => dispatch(getFolowedMe(currentpage)),
    getMeFolowing: (currentpage) => dispatch(getMeFolowing(currentpage))
});

export default connect(null, mapDispatchToProps)(Index);

const renderDeleteConfirm = (component) => {
    let { showDeleteConfirm, isProcessing } = component.state
    return (
        <Drawer anchor="bottom" className="confirm-drawer" open={showDeleteConfirm} onClose={() => component.setState({ showDeleteConfirm: false })}>
            <div className='jon-group-confirm'>
                <label>Xoá thông tin sở trường.</label>
                <p>Bạn có chắc chắn muốn xoá thông tin này không?</p>
                <div className="mt20">
                    <Button className="bt-confirm" onClick={() => component.handleDelete()}>Xoá</Button>
                    <Button className="bt-submit" onClick={() => component.setState({ showDeleteConfirm: false })}>Huỷ</Button>

                </div>
            </div>
            {
                isProcessing ? <Loader type="dask-mode small" isFullScreen={false} /> : ""
            }
        </Drawer>
    )
}



const renderCloseForm = (component) => {
    let { showCloseConfim, } = component.state
    return (
        <Drawer anchor="bottom" className="confirm-drawer" open={showCloseConfim} onClose={() => component.setState({ showCloseConfim: false })}>
            <div className='jon-group-confirm'>
                <label>Bạn muốn rời khỏi trang này?</label>
                <p>Những thông tin vừa thay đổi vẫn chưa được lưu.</p>
                <div className="mt20">
                    <Button className="bt-confirm" onClick={() => component.setState({ showCloseConfim: false, showUpdateForm: false, isChange: false })}>Đồng ý</Button>
                    <Button className="bt-submit" onClick={() => component.setState({ showCloseConfim: false })}>Quay lại</Button>
                </div>
            </div>
        </Drawer>
    )
}

