
import React from 'react';
import {
    IconButton,
    Menu,
    MenuItem,
    Drawer,
    TextField,
    Button
} from '@material-ui/core'
import {
    MoreHoriz as MoreHorizIcon,
    ChevronLeft as ChevronLeftIcon,
    ExpandMore as ExpandMoreIcon
} from '@material-ui/icons'
import CustomSelect from '../common/select'
import Switch from 'react-ios-switch';
import { get, post } from '../../api';
import { SOCIAL_NET_WORK_API } from '../../constants/appSettings';
import {
    setUserProfile,
    getFolowedMe,
    getMeFolowing
} from '../../actions/user'
import {
    Privacies
} from '../../constants/constants'
import { showNotification, objToQuery, objToArray } from '../../utils/common';
import { connect } from 'react-redux'
import Loader from '../common/loader'
import CustomMenu from '../common/custom-menu'


const school = require('../../assets/icon/Education.png')


export class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLocalMenu: false,
            anchor: null,
            showUpdateForm: false,
            majors: "",
            classID: "",
            studentID: "",
            schoolSelected: null,
            degreeSelected: null,
            schoolName: "",
            isGraduted: false,
            graduatedRank: null,
            isProcessing: false,
            studyPrivacy: Privacies.Public,
        };
    }

    handleSetDefault() {
        let {
            item,
            schoolOptions,
            qualificationOptions,
            graduationOptions
        } = this.props
        if (!item || !schoolOptions || !qualificationOptions || !graduationOptions) return

        let PrivaciesOptions = objToArray(Privacies)

        let existPrivacy = PrivaciesOptions.find(privacy => privacy.code == item.levelauthorizeid)

        this.setState({
            schoolSelected: schoolOptions.find(school => school.value == item.schoolid),
            schoolName: item.schoolid <= 1 ? item.schoolname : "",
            qualificationSelected: qualificationOptions.find(quanlifi => quanlifi.value == item.qualificationid),
            majors: item.specialized,
            classID: item.codeclass,
            studentID: item.codestudent,
            startYear: item.fromyear,
            endYear: item.toyear,
            isGraduted: item.graduated == 1,
            graduationSelected: graduationOptions.find(graduate => graduate.value == item.graduationid),
            studyPrivacy: existPrivacy ? existPrivacy : Privacies.Public
        }, () => {
            this.setState({
                defaultState: this.state
            })
        })
    }

    handleUpdate() {
        let { item } = this.props
        if (!item) return
        let { schoolSelected, schoolName, studentID, classID, majors, qualificationSelected,
            graduationSelected, startYear, endYear, isGraduted, studyPrivacy
        } = this.state
        if (!schoolSelected) {
            showNotification("", <span className="app-noti-message">Vui lòng chọn trường.</span>, null)
            return
        }

        if (schoolSelected.value == 1 && schoolName == '') {
            showNotification("", <span className="app-noti-message">Vui lòng nhập tên trường.</span>, null)
            return
        }

        let param = {
            id: item.id,
            schoolid: schoolSelected.value,
            schoolname: schoolSelected.value != 0 ? schoolSelected.label : schoolName,
            codestudent: studentID,
            codeclass: classID,
            specialized: majors,
            facultyname: "",
            graduationid: graduationSelected ? graduationSelected.value : 0,
            qualificationid: qualificationSelected ? qualificationSelected.value : 0,
            graduated: isGraduted == true ? 1 : 0,
            fromyear: startYear,
            toyear: endYear,
            levelauthorizeid: studyPrivacy ? studyPrivacy.code : 2,
        }
        this.setState({
            isProcessing: true
        })
        console.log(param)
        post(SOCIAL_NET_WORK_API, "User/UpdateUserStudyGraduation", param, () => {
            this.setState({ showUpdateForm: false, isProcessing: false })
            this.getProfile()
        })
    }

    handleDelete() {
        let { item } = this.props
        if (!item) return
        let param = {
            userStudyGraduationId: item.id
        }
        this.setState({
            isProcessing: true
        })
        get(SOCIAL_NET_WORK_API, "User/DeleteUserStudyGraduation" + objToQuery(param), () => {
            this.setState({
                isProcessing: false,
                showDeleteSchoolConfirm: false
            })
            this.getProfile()
        })
    }


    getProfile() {
        get(SOCIAL_NET_WORK_API, "User/Index?forFriendId=0", result => {
            if (result && result.result === 1) {
                this.props.setUserProfile(result.content.user)
                this.props.getFolowedMe(0)
                this.props.getMeFolowing(0)
                this.setState({ isUpdatePreccessing: false })
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

    componentDidMount() {
        this.handleSetDefault()
    }

    render() {
        let {
            showLocalMenu, anchor, showUpdateForm, classID, studentID, schoolSelected, majors, schoolName, isGraduted,
            qualificationSelected, startYear, endYear, studyPrivacy, graduationSelected, showstudyPrivacyList, isProcessing
        } = this.state
        let { item, schoolOptions, qualificationOptions, graduationOptions } = this.props
        let PrivaciesOptions = objToArray(Privacies)
        return (
            //update học vấn
            <li className="job school">
                <img src={school} />
                <div>
                    <label>Trường học: <span>{item.schoolname}</span></label>
                    <label>Trình độ: <span>{item.qualificationname}</span></label>
                    <label>Chuyên ngành: <span>{item.specialized}</span></label>
                    <label>Mã lớp: <span>{item.codeclass}</span></label>
                    <label>Mã học sinh: <span>{item.codestudent}</span></label>
                    <span>Năm học {item.fromyear} - {item.graduated == 1 ? ("Tốt nghiệp năm " + item.toyear) : "Chưa tốt nghiệp"}</span>
                </div>
                <CustomMenu>
                    <MenuItem onClick={() => this.setState({ showLocalMenu: false, showUpdateForm: true }, () => this.handleSetDefault())}>Chỉnh sửa</MenuItem>
                    <MenuItem onClick={() => this.setState({ showLocalMenu: false, showDeleteSchoolConfirm: true })}>Xoá</MenuItem>
                </CustomMenu>

                <Drawer anchor="bottom" className="drawer-form" id="add-school" open={showUpdateForm} onClose={() => this.setState({ showUpdateForm: false })}>
                    <div className="form-header">
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => this.handleClose()}>
                            <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                        </IconButton>
                        <label>Học vấn</label>
                    </div>
                    <div className="form-content">
                        <label>Thêm thông tin học vấn</label>
                        <p>Vui lòng cho chúng tôi biết về trình độ học vấn, kiến thức chuyên môn của bạn.</p>
                        <div className='input-field'>
                            <label>Trường học / đơn vị đào tạo</label>
                            <CustomSelect
                                value={schoolSelected}
                                title="Trường học"
                                placeholder="Chọn trường học"
                                height={"500px"}
                                options={schoolOptions}
                                onSelected={value => this.setState({ schoolSelected: value, isChange: true })}
                                clearable={true}
                                style={{
                                    marginBottom: "10px"
                                }}
                                searchable={true}
                            />
                        </div>
                        {
                            schoolSelected && schoolSelected.value == 0 ? <div className='input-field'>
                                <label>Tên trường học</label>
                                <TextField
                                    className="custom-input"
                                    variant="outlined"
                                    placeholder="Nhập tên trường"
                                    style={{
                                        width: "100%",
                                        marginBottom: "10px"
                                    }}
                                    value={schoolName}
                                    onChange={e => this.setState({ schoolName: e.target.value, isChange: true })}
                                />
                            </div> : ""
                        }
                        <div className='input-field'>
                            <label>Trình độ</label>
                            <CustomSelect
                                value={qualificationSelected}
                                title="Trình độ"
                                placeholder="Chọn cấp bậc học"
                                height={"500px"}
                                options={qualificationOptions}
                                onSelected={value => this.setState({ qualificationSelected: value, isChange: true })}
                                clearable={true}
                                style={{
                                    marginBottom: "10px"
                                }}
                            />
                        </div>
                        <div className='input-field'>
                            <label>Chuyên ngành</label>
                            <TextField
                                className="custom-input"
                                variant="outlined"
                                placeholder="Nhập chuyên ngành"
                                style={{
                                    width: "100%",
                                    marginBottom: "10px"
                                }}
                                value={majors}
                                onChange={e => this.setState({ majors: e.target.value, isChange: true })}
                            />
                        </div>
                        <div className='input-field'>
                            <label>Mã lớp</label>
                            <TextField
                                className="custom-input"
                                variant="outlined"
                                placeholder="Nhập mã lớp"
                                style={{
                                    width: "100%",
                                    marginBottom: "10px"
                                }}
                                value={classID}
                                onChange={e => this.setState({ classID: e.target.value, isChange: true })}
                            />
                        </div>
                        <div className='input-field'>
                            <label>Mã HS/SV</label>
                            <TextField
                                className="custom-input"
                                variant="outlined"
                                placeholder="Nhập mã HS/SV"
                                style={{
                                    width: "100%",
                                    marginBottom: "10px",
                                }}
                                value={studentID}
                                onChange={e => this.setState({ studentID: e.target.value, isChange: true })}
                            />
                        </div>
                        {
                            isGraduted ? <div className='input-field'>
                                <label>Loại tốt nghiệp</label>
                                <CustomSelect
                                    value={graduationSelected}
                                    title="Loại tốt nghiệp"
                                    placeholder="Chọn loại tốt nghiệp"
                                    height={"160px"}
                                    options={graduationOptions}
                                    onSelected={value => this.setState({ graduationSelected: value, isChange: true })}
                                    clearable={true}
                                    style={{
                                        marginBottom: "10px"
                                    }}
                                    optionStyle={{
                                        justifyContent: "flex-start"
                                    }}
                                    closeButtonStyle={{
                                        background: "#ff5a5a",
                                        color: "#fff"
                                    }}
                                    actionStyle={{
                                        display: "block"
                                    }}
                                />
                            </div> : ""
                        }
                        <div className='input-field inline'>
                            <label>Đã tốt nghiệp</label>
                            <Switch
                                checked={isGraduted}
                                handleColor="#fff"
                                offColor="#666"
                                onChange={() => this.setState({ isGraduted: !isGraduted, isChange: true })}
                                onColor="#ff5a5a"
                                className="custom-switch"
                            />
                        </div>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: isGraduted ? "repeat(2,1fr)" : "repeat(1,1fr)",
                            gridColumnGap: "10px"
                        }}>
                            <div className="input-field">
                                <label>Năm bắt đầu</label>
                                <TextField
                                    className="custom-input"
                                    variant="outlined"
                                    placeholder="Năm"
                                    type="number"
                                    style={{
                                        width: "100%",
                                        marginBottom: "10px",
                                    }}
                                    value={startYear}
                                    onChange={e => this.setState({ startYear: e.target.value, isChange: true })}
                                />
                            </div>
                            {

                                isGraduted ? <div className="input-field">
                                    <label>Năm kết thúc</label>
                                    <TextField
                                        className="custom-input"
                                        variant="outlined"
                                        placeholder="Năm"
                                        type="number"
                                        style={{
                                            width: "100%",
                                            marginBottom: "10px",
                                        }}
                                        value={endYear}
                                        onChange={e => this.setState({ endYear: e.target.value, isChange: true })}
                                    />
                                </div> : ""
                            }
                        </div>
                        <div className="privacy-select">
                            <IconButton onClick={(e) => this.setState({ showstudyPrivacyList: true, anchor: e.target })}>
                                {
                                    studyPrivacy ? <img src={studyPrivacy.icon}></img> : ""
                                }
                                {
                                    studyPrivacy.label
                                }
                                <ExpandMoreIcon />
                            </IconButton>
                            <Menu
                                className="privacy-menu"
                                anchorEl={anchor}
                                keepMounted
                                open={showstudyPrivacyList}
                                onClose={() => this.setState({ showstudyPrivacyList: false })}
                            >
                                {
                                    PrivaciesOptions.map((privacy, index) => <MenuItem key={index} onClick={() => this.setState({ showstudyPrivacyList: false, studyPrivacy: privacy, isChange: true })}>
                                        <img src={privacy.icon1} />
                                        <div>
                                            <label>{privacy.label}</label>
                                            <span>{privacy.description}</span>
                                        </div>
                                    </MenuItem>)
                                }
                            </Menu>
                        </div>
                        <Button variant="contained" className={"bt-submit"} onClick={() => this.handleUpdate()}>Lưu thông tin</Button>
                    </div>
                    {
                        isProcessing ? <Loader type="dask-mode" isFullScreen={true} /> : ""
                    }
                </Drawer>
                {
                    renderDeleteSchoolConfirm(this)
                }
                {
                    renderCloseForm(this)
                }
            </li>

        )
    }
}
const mapDispatchToProps = dispatch => ({
    setUserProfile: (user) => dispatch(setUserProfile(user)),
    getFolowedMe: (currentpage) => dispatch(getFolowedMe(currentpage)),
    getMeFolowing: (currentpage) => dispatch(getMeFolowing(currentpage))
});

export default connect(
    null,
    mapDispatchToProps
)(Index);

const renderDeleteSchoolConfirm = (component) => {
    let {
        showDeleteSchoolConfirm,
        isProcessing
    } = component.state
    return (
        <Drawer anchor="bottom" className="confirm-drawer" open={showDeleteSchoolConfirm} onClose={() => component.setState({ showDeleteSchoolConfirm: false })}>
            <div className='jon-group-confirm'>
                <label>Xoá thông tin học vấn.</label>
                <p>Bạn có chắc chắn muốn xoá thông tin này không?</p>
                <div className="mt20">
                    <Button className="bt-confirm" onClick={() => component.handleDelete()}>Xoá</Button>
                    <Button className="bt-submit" onClick={() => component.setState({ showDeleteSchoolConfirm: false })}>Huỷ</Button>
                </div>
            </div>
            {
                isProcessing ? <Loader type="dask-mode small" isFullScreen={false} /> : ""
            }
        </Drawer>
    )
}

const renderCloseForm = (component) => {
    let {
        showCloseConfim,
    } = component.state
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
