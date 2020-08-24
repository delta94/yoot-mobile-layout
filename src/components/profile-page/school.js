
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
    ChevronLeft as ChevronLeftIcon
} from '@material-ui/icons'
import CustomSelect from '../common/select'
import Switch from 'react-ios-switch';

const school = require('../../assets/images/school.png')

const schools = [
    {
        value: 1,
        label: "Khác"
    },
    {
        value: 2,
        label: "Đại học Tôn Đức Thắng"
    },
    {
        value: 3,
        label: "Cao đẳng Kỹ thuật Cao Thắng"
    },
    {
        value: 4,
        label: "Đại học Sài Gòn"
    },
    {
        value: 5,
        label: "Troy University (STU campus)"
    },
    {
        value: 6,
        label: "Đại học Công Nghệ Thông Tin - ĐH Quốc gia Tp.HCM"
    },
    {
        value: 7,
        label: "Đại học Khoa học Tự nhiên - ĐH Quốc gia Tp.HCM"
    },
    {
        value: 8,
        label: "Đại học Y Dược Tp.HCM"
    },
    {
        value: 9,
        label: "Đại học Y khoa Phạm Ngọc Thạch"
    },
    {
        value: 10,
        label: "Đại học Ngân hàng Tp.HCM"
    },
    {
        value: 11,
        label: "Học viện Hàng không Việt Nam"
    },
    {
        value: 12,
        label: "Đại học Sư phạm Tp.HCM"
    },
    {
        value: 13,
        label: "Đại học Bình Dương"
    },
    {
        value: 14,
        label: "Đại học Văn Lang"
    },
    {
        value: 7,
        label: "Đại học Hùng Vương"
    },
    {
        value: 2,
        label: "Đại học Tôn Đức Thắng"
    },
    {
        value: 3,
        label: "Cao đẳng Kỹ thuật Cao Thắng"
    },
    {
        value: 4,
        label: "Đại học Sài Gòn"
    },
    {
        value: 5,
        label: "Troy University (STU campus)"
    },
    {
        value: 6,
        label: "Đại học Công Nghệ Thông Tin - ĐH Quốc gia Tp.HCM"
    },
    {
        value: 7,
        label: "Đại học Khoa học Tự nhiên - ĐH Quốc gia Tp.HCM"
    },
    {
        value: 8,
        label: "Đại học Y Dược Tp.HCM"
    },
    {
        value: 9,
        label: "Đại học Y khoa Phạm Ngọc Thạch"
    },
    {
        value: 10,
        label: "Đại học Ngân hàng Tp.HCM"
    },
    {
        value: 11,
        label: "Học viện Hàng không Việt Nam"
    },
    {
        value: 12,
        label: "Đại học Sư phạm Tp.HCM"
    },
    {
        value: 13,
        label: "Đại học Bình Dương"
    },
    {
        value: 14,
        label: "Đại học Văn Lang"
    },
    {
        value: 7,
        label: "Đại học Hùng Vương"
    }
]

const graduatedRankOptions = [
    {
        value: 1,
        label: "Trung bình"
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
            graduatedRank: null
        };
    }

    handleSetDefault() {
        let { item } = this.props
        if (!item) return
        console.log("item", item)
        this.setState({

        })
    }

    componentDidMount() {
        this.handleSetDefault()
    }

    render() {
        let {
            showLocalMenu,
            anchor,
            showUpdateForm,
            classID,
            studentID,
            schoolSelected,
            degreeSelected,
            majors,
            schoolName,
            isGraduted,
            graduatedRank
        } = this.state
        let {
            item
        } = this.props
        return (
            <li className="job">
                <img src={school} />
                <div>
                    <label>Trường học: <span>{item.school}</span></label>
                    <label>Trình độ: <span>{item.graduate}</span></label>
                    <label>Chuyên ngành: <span>{item.majors}</span></label>
                    <label>Mã lớp: <span>{item.className}</span></label>
                    <label>Mã học sinh: <span>{item.masv}</span></label>
                    <span>Năm học {item.start} - {item.isFinish ? ("Tốt nghiệp năm " + item.end) : "Chưa tốt nghiệp"}</span>
                </div>
                <IconButton onClick={(e) => this.setState({ showLocalMenu: true, anchor: e.target })}>
                    <MoreHorizIcon />
                </IconButton>
                <Menu
                    className="custom-menu"
                    anchorEl={anchor}
                    keepMounted
                    open={showLocalMenu}
                    onClose={() => this.setState({ showLocalMenu: false })}
                >
                    <MenuItem onClick={() => this.setState({ showLocalMenu: false, showUpdateForm: true })}>Chỉnh sửa</MenuItem>
                    <MenuItem onClick={() => this.setState({ showLocalMenu: false })}>Xoá</MenuItem>
                </Menu>

                <Drawer anchor="bottom" className="drawer-form" open={showUpdateForm} onClose={() => this.setState({ showUpdateForm: false })}>
                    <div className="form-header">
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => this.setState({ showUpdateForm: false })}>
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
                                options={schools}
                                onSelected={value => this.setState({ schoolSelected: value })}
                                clearable={true}
                                style={{
                                    marginBottom: "10px"
                                }}
                                searchable={true}
                            />
                        </div>
                        {
                            schoolSelected && schoolSelected.value == 1 ? <div className='input-field'>
                                <label>Tên trường học</label>
                                <TextField
                                    variant="outlined"
                                    placeholder="Nhập tên trường"
                                    style={{
                                        width: "100%",
                                        marginBottom: "10px"
                                    }}
                                    value={schoolName}
                                    onChange={e => this.setState({ schoolName: e.target.value })}
                                />
                            </div> : ""
                        }
                        <div className='input-field'>
                            <label>Trình độ</label>
                            <CustomSelect
                                value={degreeSelected}
                                title="Trình độ"
                                placeholder="Chọn cấp bậc học"
                                height={"500px"}
                                options={schools}
                                onSelected={value => this.setState({ degreeSelected: value })}
                                clearable={true}
                                style={{
                                    marginBottom: "10px"
                                }}
                            />
                        </div>
                        <div className='input-field'>
                            <label>Chuyên ngành</label>
                            <TextField
                                variant="outlined"
                                placeholder="Nhập chuyên ngành"
                                style={{
                                    width: "100%",
                                    marginBottom: "10px"
                                }}
                                value={majors}
                                onChange={e => this.setState({ majors: e.target.value })}
                            />
                        </div>
                        <div className='input-field'>
                            <label>Mã lớp</label>
                            <TextField
                                variant="outlined"
                                placeholder="Nhập mã lớp"
                                style={{
                                    width: "100%",
                                    marginBottom: "10px"
                                }}
                                value={classID}
                                onChange={e => this.setState({ classID: e.target.value })}
                            />
                        </div>
                        <div className='input-field'>
                            <label>Mã HS/SV</label>
                            <TextField
                                variant="outlined"
                                placeholder="Nhập mã HS/SV"
                                style={{
                                    width: "100%",
                                    marginBottom: "10px",
                                }}
                                value={studentID}
                                onChange={e => this.setState({ studentID: e.target.value })}
                            />
                        </div>
                        <div className='input-field inline'>
                            <label>Đã tốt nghiệp</label>
                            <Switch
                                checked={isGraduted}
                                handleColor="#fff"
                                offColor="#666"
                                onChange={() => this.setState({ isGraduted: !isGraduted })}
                                onColor="#ff5a5a"
                                className="custom-switch"
                            />
                        </div>
                        {
                            isGraduted ? <div className='input-field'>
                                <label>Loại tốt nghiệp</label>
                                <CustomSelect
                                    value={graduatedRank}
                                    title="Trình độ"
                                    placeholder="Chọn loại tốt nghiệp"
                                    height={"160px"}
                                    options={graduatedRankOptions}
                                    onSelected={value => this.setState({ graduatedRank: value })}
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
                        <Button variant="contained" className={"bt-submit"}>Lưu thông tin</Button>
                    </div>
                </Drawer>
            </li>

        )
    }
}
export default Index