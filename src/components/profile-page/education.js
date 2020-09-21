import React from 'react';
import {
    IconButton,
    Drawer,
    Button,
    TextField,
    Menu,
    MenuItem
} from '@material-ui/core'
import {
    ChevronLeft as ChevronLeftIcon,
    ControlPoint as ControlPointIcon,
    PlayArrow as PlayArrowIcon,
    ExpandMore as ExpandMoreIcon
} from '@material-ui/icons'
import School from './school'
import CustomSelect from '../common/select'
import { Privacies } from '../../constants/constants'
import Switch from 'react-ios-switch';
import { get, post } from '../../api';
import { SCHOOL_API } from '../../constants/appSettings';
import { showNotification, objToArray, objToQuery } from '../../utils/common';
import { SOCIAL_NET_WORK_API } from '../../constants/appSettings';
import {
    setUserProfile,
    getFolowedMe,
    getMeFolowing
} from '../../actions/user'
import { connect } from "react-redux"
import { Loader } from '../common/loader'

const schools = [
    {
        value: 1,
        label: "Khác"
    },
]

const graduationSelectedOptions = [
    {
        value: 0,
        label: "Lao đọng"
    },
    {
        value: 2,
        label: "Khá"
    },
    {
        value: 3,
        label: "Giỏi"
    },
]


export class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showAddForm: false,
            majors: "",
            classID: "",
            studentID: "",
            schoolSelected: null,
            schoolName: "",
            isGraduted: false,
            graduationSelected: null,
            studyPrivacy: Privacies.Public,
            startYear: "",
            endYear: "",
            isProccessing: false
        };
    }

    handleResetState() {
        this.setState({
            showAddForm: false,
            majors: "",
            classID: "",
            studentID: "",
            schoolSelected: null,
            schoolName: "",
            isGraduted: false,
            graduationSelected: null,
            studyPrivacy: Privacies.Public,
            startYear: "",
            endYear: "",
            isProccessing: false,
            isChange: false
        })
    }

    handleGetSchools() {
        get(SCHOOL_API, "User/getSchoolSelection", result => {
            if (result.StatusCode == 1) {
                let schoolOption = result.Data
                schoolOption.map(item => {
                    item.value = item.Value
                    item.label = item.Text
                })
                this.setState({
                    schoolOptions: schoolOption
                })
            }
        })
    }

    handleGetQualifications() {
        get(SCHOOL_API, "User/getQualifications", result => {
            console.log("result", result)
            if (result.StatusCode == 1) {
                let qualification = result.Data
                qualification.map(item => {
                    item.value = item.ID
                    item.label = item.NAME
                })
                this.setState({
                    qualificationOptions: qualification
                })
            }
        })
    }

    handleGetGraduations() {
        get(SCHOOL_API, "User/getGRADUATION", result => {
            if (result.StatusCode == 1) {
                let graduation = result.Data
                graduation.map(item => {
                    item.value = item.ID
                    item.label = item.NAME
                })
                this.setState({
                    graduationOptions: graduation
                })
            }
        })
    }

    handleAddNew() {
        let {
            schoolSelected,
            schoolName,
            studentID,
            classID,
            majors,
            qualificationSelected,
            graduationSelected,
            startYear,
            endYear,
            isGraduted,
            studyPrivacy
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
            isProccessing: true
        })
        post(SOCIAL_NET_WORK_API, "User/UpdateUserStudyGraduation", param, () => {
            this.setState({ showAddForm: false, isProcessing: false })
            this.getProfile()
        })
    }

    getProfile() {
        get(SOCIAL_NET_WORK_API, "User/Index?forFriendId=0", result => {
            if (result.result == 1) {
                this.props.setUserProfile(result.content.user)
                this.props.getFolowedMe(0)
                this.props.getMeFolowing(0)
                this.setState({ isProccessing: false })
            } else {
                showNotification("", <span className="app-noti-message">{result.message}</span>, null)
            }

        })
    }


    handleClose() {
        let { isChange } = this.state
        if (isChange) {
            this.setState({
                showCloseConfim: true
            })
        } else {
            this.setState({
                showAddForm: false
            })
        }
    }

    componentDidMount() {
        this.handleGetSchools()
        this.handleGetQualifications()
        this.handleGetGraduations()
    }


    render() {
        let {
            showAddForm,
            classID,
            studentID,
            schoolSelected,
            qualificationSelected,
            majors,
            schoolName,
            isGraduted,
            graduationSelected,
            schoolOptions,
            qualificationOptions,
            graduationOptions,
            startYear,
            endYear,
            studyPrivacy,
            anchor,
            showstudyPrivacyList,
            isProccessing
        } = this.state
        let {
            data
        } = this.props
        schoolOptions = [{ value: 0, label: "Khác" }].concat(schoolOptions)
        let PrivaciesOptions = objToArray(Privacies)
        return (
            <div className="content-box">
                <label>
                    <PlayArrowIcon />
                    <span>Học vấn</span>
                </label>
                <div className="add-bt" onClick={() => this.setState({ showAddForm: true },)}>
                    <ControlPointIcon />
                    <span>Thêm trường...</span>
                </div>
                <ul className="job">
                    {
                        data.userStudyGraduation.map((item, index) => <School
                            key={index}
                            item={item}
                            schoolOptions={schoolOptions}
                            qualificationOptions={qualificationOptions}
                            graduationOptions={graduationOptions}
                        />)
                    }
                </ul>
                <Drawer anchor="bottom" className="drawer-form" open={showAddForm} onClose={() => this.setState({ showAddForm: false })}>
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
                        {
                            isGraduted ? <div className='input-field'>
                                <label>Loại tốt nghiệp</label>
                                <CustomSelect
                                    value={graduationSelected}
                                    title="Trình độ"
                                    placeholder="Chọn loại tốt nghiệp"
                                    height={"160px"}
                                    options={graduationOptions}
                                    onSelected={value => this.setState({ graduationSelected: value, isChange: true })}
                                    clearable={true}
                                    style={{
                                        marginBottom: "10px"
                                    }}
                                    optionStyle={{
                                        justifyContent: "center"
                                    }}
                                />
                            </div> : ""
                        }
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
                        <Button variant="contained" className={"bt-submit"} onClick={() => this.handleAddNew()}>Lưu thông tin</Button>
                    </div>
                    {
                        isProccessing ? <Loader type="dask-mode" isFullScreen={true} /> : ""
                    }
                </Drawer>
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

export default connect(
    null,
    mapDispatchToProps
)(Index);



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
                    <Button className="bt-confirm" onClick={() => component.setState({ showCloseConfim: false, showAddForm: false }, () => component.handleResetState())}>Đồng ý rời khỏi</Button>
                    <Button className="bt-submit" onClick={() => component.setState({ showCloseConfim: false })}>Quay lại thay đổi</Button>
                </div>
            </div>
        </Drawer>
    )
}

