import React from 'react';
import {
    IconButton,
    Drawer,
    Button,
    TextField,
} from '@material-ui/core'
import {
    ChevronLeft as ChevronLeftIcon,
    ControlPoint as ControlPointIcon,
    PlayArrow as PlayArrowIcon
} from '@material-ui/icons'
import School from './school'
import CustomSelect from '../common/select'
import Switch from 'react-ios-switch';

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
            showAddForm: false,
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

    componentDidMount() {
    }

    render() {
        let {
            showAddForm,
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
            data
        } = this.props
        return (
            <div className="content-box">
                <label>
                    <PlayArrowIcon />
                    <span>Học vấn</span>
                </label>
                <div className="add-bt" onClick={() => this.setState({ showAddForm: true })}>
                    <ControlPointIcon />
                    <span>Thêm trường...</span>
                </div>
                <ul className="job">
                    {
                        data.studies.map((item, index) => <School key={index} item={item} />)
                    }
                </ul>
                <Drawer anchor="bottom" className="drawer-form" open={showAddForm} onClose={() => this.setState({ showAddForm: false })}>
                    <div className="form-header">
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => this.setState({ showAddForm: false })}>
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
            </div>
        )
    }
}
export default Index




