import React from 'react';
import {
    IconButton,
    Drawer,
    Button,
    TextField
} from '@material-ui/core'
import {
    ChevronLeft as ChevronLeftIcon,
    ControlPoint as ControlPointIcon,
    PlayArrow as PlayArrowIcon
} from '@material-ui/icons'
import Job from './job'
import moment from 'moment'


export class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showAddForm: false,
            companyName: "",
            position: "",
            description: ""
        };
    }

    componentDidMount() {
    }

    render() {
        let {
            showAddForm,
            companyName,
            position,
            description
        } = this.state
        let {
            data
        } = this.props
        return (
            <div className="content-box">
                <label>
                    <PlayArrowIcon />
                    <span>Kinh nghiệm làm việc</span>
                </label>
                <div className="add-bt" onClick={() => this.setState({ showAddForm: true })}>
                    <ControlPointIcon />
                    <span>Thêm công việc...</span>
                </div>
                <ul className="job">
                    {
                        data.jobs.map((item, index) => <Job key={index} item={item} />)
                    }
                </ul>
                <Drawer anchor="bottom" className="drawer-form" open={showAddForm} onClose={() => this.setState({ showAddForm: false })}>
                    <div className="form-header">
                        <IconButton style={{ background: "rgba(255,255,255,0.8)", padding: "8px" }} onClick={() => this.setState({ showAddForm: false })}>
                            <ChevronLeftIcon style={{ color: "#ff5a59", width: "25px", height: "25px" }} />
                        </IconButton>
                        <label>Kinh nghiệm làm việc</label>
                    </div>
                    <div className="form-content">
                        <label>Thêm kinh nghiệm làm việc của bạn</label>
                        <p>Vui lòng cung cấp cho chúng tôi những thông tin về công việc hiện tại hoặc trước đây của bạn.</p>
                        <div className='input-field'>
                            <label>Công ty của bạn</label>
                            <TextField
                                variant="outlined"
                                placeholder="Nhập tên công ty"
                                style={{
                                    width: "100%",
                                    marginBottom: "10px"
                                }}
                                value={companyName}
                                onChange={e => this.setState({ companyName: e.target.value })}
                            />
                        </div>
                        <div className='input-field'>
                            <label>Chức danh / Vị trí công việc của bạn</label>
                            <TextField
                                variant="outlined"
                                placeholder="Nhập chức danh (không bắt buộc)"
                                style={{
                                    width: "100%",
                                    marginBottom: "10px"
                                }}
                                value={position}
                                onChange={e => this.setState({ position: e.target.value })}
                            />
                        </div>
                        <div className='input-field'>
                            <label>Mô tả công việc</label>
                            <TextField
                                variant="outlined"
                                placeholder="Mô tả công việc (không bắt buộc)"
                                style={{
                                    width: "100%",
                                    marginBottom: "10px",
                                }}
                                multiline
                                value={description}
                                onChange={e => this.setState({ description: e.target.value })}
                            />
                        </div>
                        <Button variant="contained" className={"bt-submit"}>Lưu thông tin</Button>
                    </div>
                </Drawer>
            </div>
        )
    }
}
export default Index




