import React from "react";
import DropZone from 'react-drop-zone'
import { postFormData, put } from '../../../../api'
import { BASE_API as domain } from '../../../../constants/appSettings'
import TextInput from '../../../common/text-input'
import { notEmpty } from '../../../../utils/validators'
import defaultAva from '../../../../assets/images/avatar.png'
import { showSuccess, showError } from "../../../../utils/app";
import Modal from '../../../common/modal'
import Button from "@material-ui/core/Button";
import { getCurrentUser, setCurrentUser } from "../../../../auth";
const validationData = {
    fullName: [notEmpty]
};
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultAvatar: ""
        };
    }

    _onUpdateDefaultAva = () => {
        this.setState({
            avatar: this.state.defaultAvatar
        })
    }
    _onUpdateProfileInfo = () => {
        let param = {
            id: this.state.id,
            fullName: this.state.fullName,
            avatar: this.state.avatar
        };
        put("me/profile", param,
            () => {
                let user = getCurrentUser()
                user.fullName = param.fullName;
                user.avatar = param.avatar;
                setCurrentUser(user)
                this.props.onUpdateSucceed()
                showSuccess("Cập nhật thành công")
            },
            () => {
                showError("Server đang bảo trì, vui lòng thử lại sau")
            }
        )
        this.props.onClose()
    }
    componentWillReceiveProps(props) {
        const { fullName, avatar, id } = props
        if (!fullName && !avatar && !id) return;
        this.setState({
            id,
            fullName,
            avatar,
            defaultAvatar: avatar
        })
    }

    render() {
        let {
            avatar,
            fullName
        } = this.state;
        let styleAva = {
            width: 110,
            height: 110,
            backgroundImage: avatar && (avatar !== null) ? "url(" + domain + this.state.avatar + ")" : "url(" + defaultAva + ")",
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
        }
        let { open, onClose } = this.props
        return (
            <Modal
                className="add-new-options"
                open={open}
                onClose={onClose}
                header={
                    <div>
                        <span>Cập nhật</span>
                    </div>
                }
                content={
                    <div style={{ textAlign: "center" }}>
                        <div className="profile-picture">
                            <div className="avatar" style={styleAva}>
                                <DropZone onDrop={(file) => {
                                    let formData = new FormData();
                                    formData.append("file", file);
                                    
                                    postFormData("files/upload/" + "Avatars", formData, result => {
                                        this.setState({
                                            avatar: result[0].relativePath
                                        });
                                    });
                                }}>
                                    {
                                        ({ over, overDocument }) =>
                                            <div className="edit">
                                                {
                                                    over ?
                                                        'file is over element' :
                                                        overDocument ?
                                                            'file is over document' :
                                                            <div>
                                                                <i className="fas fa-camera"></i>
                                                                <p>Cập nhật</p>
                                                            </div>
                                                }
                                            </div>
                                    }
                                </DropZone>
                            </div>
                        </div>
                        <div className="user-box">
                            <table className="table list-item border-bottom">
                                <tbody>
                                    <tr>
                                        <td className="coin text-left width100">
                                            <span>Họ tên</span>
                                        </td>
                                        <td className="coin text-left width300">
                                            <TextInput
                                                className="name"
                                                value={fullName}
                                                label={"Họ tên"}
                                                name={"fullName"}
                                                placeholder={"Họ tên"}
                                                onChange={e =>
                                                    this.setState({ fullName: e.target.value })
                                                }
                                                displayName={"Họ tên"}
                                                validate={validationData.fullName}
                                                edit={true}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                }
                action={
                    <Button
                        color="primary"
                        onClick={() => {
                            this._onUpdateProfileInfo()
                        }}
                    >
                        Lưu
                    </Button>
                }
                allowCancel={true}
            />
        )
    }
}
export default Index