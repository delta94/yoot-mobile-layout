import React from "react";
import { postFormData } from "../../../api";
import { BASE_API } from "../../../constants/appSettings";
import Loader from "../../common/loader";
import "./style.scss";
import ViewModal from "../view-modal";
import { confirmSubmit } from "../../../utils/common";
import Dropzone from "react-dropzone";
import { get } from "../../../api";

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            isUploading: false,
            openViewModal: false,
            currentFile: {}
        };
    }

    _addFile = acceptedFiles => {
        let { type } = this.props;
        this.setState(
            {
                isUploading: true
            },
            () => {
                if (type) {
                    let formData = new FormData();
                    for (let i = 0; i < acceptedFiles.length; i++) {
                        const file = acceptedFiles[i];
                        formData.append(`file${i}`, file);
                    }

                    let { files } = this.state;

                    postFormData(
                        "files/upload/" + type,
                        formData,
                        result => {
                            files = files.concat(result);
                            this.setState(
                                {
                                    files: files,
                                    isUploading: false
                                },
                                () => {
                                    if (this.props.onChange) this.props.onChange(files);
                                }
                            );
                        },
                        () => {
                            this.setState({
                                isUploading: false
                            });
                        }
                    );
                }
            }
        );
    };

    _handleReset() {
        this.setState(
            {
                files: []
            },
            () => {
                this._seed(this.props);
            }
        );
    }

    _handleClickFile(file) {
        if (file.extension && (file.extension === "jpg" || file.extension === "png" || file.extension === "jpeg"))
            this.setState(
                {
                    currentFile: file
                },
                () =>
                    this.setState({
                        openViewModal: true
                    })
            );
        if (file.extension &&
            (
                file.extension === "pdf"
                || file.extension === "doc"
                || file.extension === "docx"
                || file.extension === "xls"
                || file.extension === "xlsx"
                || file.extension === "csv"
            )) {
            var win = window.open(BASE_API + file.relativePath, '_blank');
            win.focus();
        }
    }

    async _handleDeleteFile(file) {
        let { files } = this.state;
        files = files.filter(e => e.code !== file.code);
        if (this.props.onChange) this.props.onChange(files);
        await this.setState({
            files: files,
        })

        // files = files.filter(e => e.code !== file.code);
        // this.setState(
        //     {
        //         files: files
        //     },
        //     () => {
        //         if (this.props.onChange) {
        //             this.props.onChange(files);
        //         }
        //     }
        // );
    }

    _seed(props) {
        if (!props)
            return;

        let { files } = props;
        if (!files || files.length === 0) return
        files.map(file => {
            if (file) {
                let temp = file.split("/");
                get("files/" + temp[temp.length - 1], result => {
                    let filesList = this.state.files.filter(x => x.id !== result.id)
                    filesList.push(result)
                    this.setState({
                        files: filesList
                    })
                });
            }
        });
    }

    componentWillReceiveProps(props) {
        if (this.state.files.length > 0)
            return;
        this._seed(props);
    }

    componentDidMount() {
        this._seed(this.props);
    }

    render() {
        let { files, isUploading, openViewModal, currentFile } = this.state;
        let { edit, multiImages, className, displayName, errors } = this.props;
        return (
            <div>
                <div
                    className={
                        "file-drop-zone " +
                        (edit ? "" : "none") +
                        (isUploading ? " diable" : "")
                    }
                >
                    {edit &&
                        (
                            (multiImages || files.length === 0) && (
                                <div
                                    style={{
                                        borderBottom:
                                            files && files.length > 0 ? "1px solid #ddd" : "none"
                                    }}
                                >
                                    {
                                        <Dropzone onDrop={this._addFile} multiple={multiImages}>
                                            {({ getRootProps, getInputProps, isDragActive }) => {
                                                return (
                                                    <div {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        {isDragActive ? (
                                                            <p>Chọn file để tải lên...</p>
                                                        ) : (
                                                                <p>Chọn hoặc kéo thả file để tải lên...</p>
                                                            )}
                                                    </div>
                                                );
                                            }}
                                        </Dropzone>
                                    }
                                    {!isUploading && (
                                        <img
                                            alt="ảnh cmnd"
                                            className="icon-upload"
                                            src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgaGVpZ2h0PSI1MTJweCIgdmlld0JveD0iLTcyIDAgNDgwIDQ4MC4wMDAzIiB3aWR0aD0iNTEycHgiPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSItMTIuMjcxODUiIHgyPSIzMTYuMjcyMTUiIHkxPSI0MDcuMDQwMzAxIiB5Mj0iNzguNDk2MzAxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM0MWRmZDAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNlZTgzZWYiLz48L2xpbmVhckdyYWRpZW50PjxwYXRoIGQ9Im0yMDAgMTM2aC0xNnYtMTZoMTZ6bTAgMTZoLTE2djE2aDE2em0wIDY0aC0xNnYxNmgxNnptLTEwNCAzMmg5NmMuMTgzNTk0IDAgLjMzNTkzOC4wODk4NDQuNTExNzE5LjEwNTQ2OS43MTQ4NDMuMDQyOTY5IDEuNDIxODc1LjE4NzUgMi4wOTc2NTYuNDIxODc1LjI1MzkwNi4wNzQyMTguNTAzOTA2LjE2NDA2Mi43NS4yNjU2MjUuODM5ODQ0LjM3NSAxLjYwOTM3NS44OTQ1MzEgMi4yNzM0MzcgMS41MjczNDNsNDggNDhjLjYzMjgxMy42NjAxNTcgMS4xNTIzNDQgMS40MjU3ODIgMS41MjczNDQgMi4yNjU2MjYuMTAxNTYzLjI0NjA5My4xODc1LjQ5NjA5My4yNjU2MjUuNzUuMjM4MjgxLjY4NzUuMzgyODEzIDEuNDAyMzQzLjQyOTY4OCAyLjEyODkwNiAwIC4xNjc5NjguMDk3NjU2LjMxMjUuMDk3NjU2LjQ4MDQ2OHYxMzYuMDU0Njg4YzAgNC40MTc5NjktMy41ODIwMzEgOC04IDhoLTIzLjk1MzEyNXYyNGMwIDQuNDE3OTY5LTMuNTgyMDMxIDgtOCA4aC0xNDRjLTQuNDE3OTY5IDAtOC0zLjU4MjAzMS04LTh2LTE4NGMwLTQuNDE3OTY5IDMuNTgyMDMxLTggOC04aDI0di0yNGMwLTQuNDE3OTY5IDMuNTgyMDMxLTggOC04em0xMDQgMjAwaC0xMDRjLTQuNDE3OTY5IDAtOC0zLjU4MjAzMS04LTh2LTE0NGgtMTZ2MTY4aDEyOHptMC0xNTJoMjAuNjg3NWwtMjAuNjg3NS0yMC42ODc1em0tOTYgMTM2aDEyOHYtMTIwaC00MGMtNC40MTc5NjkgMC04LTMuNTgyMDMxLTgtOHYtNDBoLTgwem0tMTA0LTMwNGMuMDQyOTY4OC0zOS43NDYwOTQgMzIuMjUzOTA2LTcxLjk1NzAzMSA3Mi03MmgxOS43MTg3NWMxMC40NjQ4NDQtMzMuMzI0MjE5IDQxLjM1MTU2Mi01NiA3Ni4yODEyNS01NnM2NS44MTY0MDYgMjIuNjc1NzgxIDc2LjI4MTI1IDU2aDE5LjcxODc1YzM5Ljc2NTYyNSAwIDcyIDMyLjIzNDM3NSA3MiA3MnMtMzIuMjM0Mzc1IDcyLTcyIDcyaC0xMjB2MzJoLTE2di0zMmgtNTZjLTM5Ljc0NjA5NC0uMDQyOTY5LTcxLjk1NzAzMTItMzIuMjUzOTA2LTcyLTcyem0xNiAwYy4wMzUxNTYgMzAuOTE0MDYyIDI1LjA4NTkzOCA1NS45NjQ4NDQgNTYgNTZoNTZ2LTQxLjA0Njg3NWwtMTEuNTU4NTk0IDcuNzAzMTI1LTguODgyODEyLTEzLjMxMjUgMjQtMTZjMi40NTcwMzEtMS42MzY3MTkgNS42MTMyODEtMS43ODkwNjIgOC4yMTQ4NDQtLjM5ODQzOCAyLjYwMTU2MiAxLjM5MDYyNiA0LjIyNjU2MiA0LjEwNTQ2OSA0LjIyNjU2MiA3LjA1NDY4OHY1NmgxMjBjMzAuOTI5Njg4IDAgNTYtMjUuMDcwMzEyIDU2LTU2IDAtMzAuOTI1NzgxLTI1LjA3MDMxMi01Ni01Ni01NmgtMjUuODM5ODQ0Yy0zLjczODI4MS4wMDM5MDYtNi45NzY1NjItMi41NzgxMjUtNy44MDg1OTQtNi4yMjI2NTYtNi42MjEwOTMtMjkuMTA5Mzc1LTMyLjUtNDkuNzY1NjI1LTYyLjM1MTU2Mi00OS43NjU2MjVzLTU1LjczMDQ2OSAyMC42NTYyNS02Mi4zNTE1NjIgNDkuNzY1NjI1Yy0uODI4MTI2IDMuNjQ0NTMxLTQuMDcwMzEzIDYuMjI2NTYyLTcuODA4NTk0IDYuMjIyNjU2aC0yNS44Mzk4NDRjLTMwLjkxNDA2Mi4wMzUxNTYtNTUuOTY0ODQ0IDI1LjA4NTkzOC01NiA1NnptMCAwIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+Cg=="
                                        />
                                    )}
                                    {isUploading && <Loader />}
                                </div>
                            )
                        )
                    }
                    {files &&
                        (
                            files.length > 0 && (
                                <ul>
                                    {files &&
                                        files.map((file, i) => (
                                            <li key={i}>
                                                <div
                                                    className="file-item"
                                                    onClick={() => this._handleClickFile(file)}
                                                >
                                                    {file.extension === "png" ||
                                                        file.extension === "jpg" ||
                                                        file.extension === "jpeg" ? (
                                                            <img
                                                                alt="ảnh cmnd"
                                                                className="img"
                                                                src={BASE_API + file.relativePath}
                                                            />
                                                        ) : (
                                                            ""
                                                        )}
                                                    {file.extension === "pdf" ? (
                                                        <img alt="ảnh cmnd" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij4KPHBhdGggc3R5bGU9ImZpbGw6I0UyRTVFNzsiIGQ9Ik0xMjgsMGMtMTcuNiwwLTMyLDE0LjQtMzIsMzJ2NDQ4YzAsMTcuNiwxNC40LDMyLDMyLDMyaDMyMGMxNy42LDAsMzItMTQuNCwzMi0zMlYxMjhMMzUyLDBIMTI4eiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojQjBCN0JEOyIgZD0iTTM4NCwxMjhoOTZMMzUyLDB2OTZDMzUyLDExMy42LDM2Ni40LDEyOCwzODQsMTI4eiIvPgo8cG9seWdvbiBzdHlsZT0iZmlsbDojQ0FEMUQ4OyIgcG9pbnRzPSI0ODAsMjI0IDM4NCwxMjggNDgwLDEyOCAiLz4KPHBhdGggc3R5bGU9ImZpbGw6I0YxNTY0MjsiIGQ9Ik00MTYsNDE2YzAsOC44LTcuMiwxNi0xNiwxNkg0OGMtOC44LDAtMTYtNy4yLTE2LTE2VjI1NmMwLTguOCw3LjItMTYsMTYtMTZoMzUyYzguOCwwLDE2LDcuMiwxNiwxNiAgVjQxNnoiLz4KPGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTEwMS43NDQsMzAzLjE1MmMwLTQuMjI0LDMuMzI4LTguODMyLDguNjg4LTguODMyaDI5LjU1MmMxNi42NCwwLDMxLjYxNiwxMS4xMzYsMzEuNjE2LDMyLjQ4ICAgYzAsMjAuMjI0LTE0Ljk3NiwzMS40ODgtMzEuNjE2LDMxLjQ4OGgtMjEuMzZ2MTYuODk2YzAsNS42MzItMy41ODQsOC44MTYtOC4xOTIsOC44MTZjLTQuMjI0LDAtOC42ODgtMy4xODQtOC42ODgtOC44MTZWMzAzLjE1MnogICAgTTExOC42MjQsMzEwLjQzMnYzMS44NzJoMjEuMzZjOC41NzYsMCwxNS4zNi03LjU2OCwxNS4zNi0xNS41MDRjMC04Ljk0NC02Ljc4NC0xNi4zNjgtMTUuMzYtMTYuMzY4SDExOC42MjR6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTE5Ni42NTYsMzg0Yy00LjIyNCwwLTguODMyLTIuMzA0LTguODMyLTcuOTJ2LTcyLjY3MmMwLTQuNTkyLDQuNjA4LTcuOTM2LDguODMyLTcuOTM2aDI5LjI5NiAgIGM1OC40NjQsMCw1Ny4xODQsODguNTI4LDEuMTUyLDg4LjUyOEgxOTYuNjU2eiBNMjA0LjcyLDMxMS4wODhWMzY4LjRoMjEuMjMyYzM0LjU0NCwwLDM2LjA4LTU3LjMxMiwwLTU3LjMxMkgyMDQuNzJ6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTMwMy44NzIsMzEyLjExMnYyMC4zMzZoMzIuNjI0YzQuNjA4LDAsOS4yMTYsNC42MDgsOS4yMTYsOS4wNzJjMCw0LjIyNC00LjYwOCw3LjY4LTkuMjE2LDcuNjggICBoLTMyLjYyNHYyNi44NjRjMCw0LjQ4LTMuMTg0LDcuOTItNy42NjQsNy45MmMtNS42MzIsMC05LjA3Mi0zLjQ0LTkuMDcyLTcuOTJ2LTcyLjY3MmMwLTQuNTkyLDMuNDU2LTcuOTM2LDkuMDcyLTcuOTM2aDQ0LjkxMiAgIGM1LjYzMiwwLDguOTYsMy4zNDQsOC45Niw3LjkzNmMwLDQuMDk2LTMuMzI4LDguNzA0LTguOTYsOC43MDRoLTM3LjI0OFYzMTIuMTEyeiIvPgo8L2c+CjxwYXRoIHN0eWxlPSJmaWxsOiNDQUQxRDg7IiBkPSJNNDAwLDQzMkg5NnYxNmgzMDRjOC44LDAsMTYtNy4yLDE2LTE2di0xNkM0MTYsNDI0LjgsNDA4LjgsNDMyLDQwMCw0MzJ6Ii8+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=" />
                                                    ) : (
                                                            ""
                                                        )}
                                                    {file.extension === "doc" ||
                                                        file.extension === "docx" ? (
                                                            <img alt="ảnh cmnd" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ2OC4yOTMgNDY4LjI5MyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDY4LjI5MyA0NjguMjkzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij4KPHBhdGggc3R5bGU9ImZpbGw6I0UxRTZFOTsiIGQ9Ik0zMzcuMzM1LDBIOTUuMjE5Qzg0Ljg3NCwwLDc2LjQ4OCw4LjM4Niw3Ni40ODgsMTguNzMydjQzMC44MjljMCwxMC4zNDUsOC4zODYsMTguNzMyLDE4LjczMiwxOC43MzIgIEg0MDEuMTdjMTAuMzQ1LDAsMTguNzMyLTguMzg2LDE4LjczMi0xOC43MzJWODIuNTY3TDMzNy4zMzUsMHoiLz4KPHJlY3QgeD0iNDguMzkiIHk9IjI1OC4wNjciIHN0eWxlPSJmaWxsOiMyN0EyREI7IiB3aWR0aD0iMzcxLjUxMiIgaGVpZ2h0PSIxMjguMyIvPgo8Zz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNFQkYwRjM7IiBkPSJNMTgyLjcyMiwyOTMuNzQ0YzcuNTY3LDYuODUsMTEuMzQyLDE2LjM3NywxMS4zNDIsMjguNTgzYzAsMTIuMjAxLTMuNjY1LDIxLjg2MS0xMS4wMDQsMjguOTcxICAgYy03LjMzOSw3LjExNS0xOC41NzEsMTAuNjctMzMuNjg3LDEwLjY3aC0yNi4wNTZ2LTc4LjUwMWgyNi45NTJDMTY0LjM0MywyODMuNDY3LDE3NS4xNjQsMjg2Ljg5NCwxODIuNzIyLDI5My43NDR6ICAgIE0xODAuNzAyLDMyMi42NmMwLTE3Ljk2OC0xMC4yOTEtMjYuOTUyLTMwLjg4MS0yNi45NTJoLTEzLjI1MnY1My43OTNoMTQuNzE0YzkuNTA1LDAsMTYuNzg5LTIuMjYyLDIxLjg0My02Ljc5NSAgIEMxNzguMTc5LDMzOC4xNzksMTgwLjcwMiwzMzEuNDk4LDE4MC43MDIsMzIyLjY2eiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6I0VCRjBGMzsiIGQ9Ik0yNzYuODI4LDM1MS4xMjljLTcuOTMzLDcuNzUtMTcuNzM5LDExLjYyNS0yOS40MTksMTEuNjI1cy0yMS40ODYtMy44NzUtMjkuNDE5LTExLjYyNSAgIGMtNy45NDItNy43NDUtMTEuOTA4LTE3LjQwNi0xMS45MDgtMjguOTcxYzAtMTEuNTcsMy45NjYtMjEuMjI2LDExLjkwOC0yOC45NzZjNy45MzMtNy43NSwxNy43MzktMTEuNjIsMjkuNDE5LTExLjYyICAgczIxLjQ4NiwzLjg3LDI5LjQxOSwxMS42MmM3Ljk0Miw3Ljc1LDExLjkwOCwxNy40MDYsMTEuOTA4LDI4Ljk3NkMyODguNzM2LDMzMy43MjMsMjg0Ljc3LDM0My4zODMsMjc2LjgyOCwzNTEuMTI5eiAgICBNMjY3LjEyMiwzMDEuOTk3Yy01LjM1Ni01LjUzOC0xMS45MjctOC4zMDctMTkuNzEzLTguMzA3Yy03Ljc4NywwLTE0LjM1OCwyLjc2OS0xOS43MTMsOC4zMDcgICBjLTUuMzQ2LDUuNTQzLTguMDI0LDEyLjI2LTguMDI0LDIwLjE2MXMyLjY3OCwxNC42MTgsOC4wMjQsMjAuMTU2YzUuMzU2LDUuNTQzLDExLjkyNyw4LjMxMiwxOS43MTMsOC4zMTIgICBjNy43ODcsMCwxNC4zNTgtMi43NjksMTkuNzEzLTguMzEyYzUuMzQ2LTUuNTM4LDguMDI0LTEyLjI1Niw4LjAyNC0yMC4xNTZTMjcyLjQ2OSwzMDcuNTM5LDI2Ny4xMjIsMzAxLjk5N3oiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNFQkYwRjM7IiBkPSJNMzQxLjI5NiwzNDkuOTVjNC41NiwwLDguNDktMC43NjMsMTEuNzktMi4yOThjMy4yOS0xLjUzNSw2LjczNi0zLjk4OSwxMC4zMzYtNy4zNTdsOC41MjcsOC43NiAgIGMtOC4zMDgsOS4yMDgtMTguMzk3LDEzLjgxNC0zMC4yNiwxMy44MTRjLTExLjg3MiwwLTIxLjcxNS0zLjgyLTI5LjUzOC0xMS40NTZjLTcuODIzLTcuNjM2LTExLjczNS0xNy4yOTYtMTEuNzM1LTI4Ljk3NiAgIHMzLjk4NS0yMS40MDksMTEuOTYzLTI5LjJjNy45NjktNy43ODIsMTguMDQxLTExLjY3NSwzMC4yMDUtMTEuNjc1czIyLjMyNyw0LjQ5MiwzMC40ODgsMTMuNDc2bC04LjQxNyw5LjIwOCAgIGMtMy43NDctMy41OTItNy4yODQtNi4xLTEwLjYyLTcuNTI2Yy0zLjMyNy0xLjQyMS03LjIzOC0yLjEzNC0xMS43MzUtMi4xMzRjLTcuOTMzLDAtMTQuNTk1LDIuNTY4LTE5Ljk4Nyw3LjY5NSAgIGMtNS4zOTIsNS4xMjctOC4wODgsMTEuNjgtOC4wODgsMTkuNjU0YzAsNy45NzQsMi42NzgsMTQuNjM2LDguMDMzLDE5Ljk4N0MzMjcuNjE1LDM0Ny4yNzcsMzMzLjk1NywzNDkuOTUsMzQxLjI5NiwzNDkuOTV6Ii8+CjwvZz4KPHBvbHlnb24gc3R5bGU9ImZpbGw6IzJEOTNCQTsiIHBvaW50cz0iNDguMzksMzg2LjM2NCA3Ni40ODgsNDEyLjQ5MSA3Ni40ODgsMzg2LjM2NCAiLz4KPHBvbHlnb24gc3R5bGU9ImZpbGw6I0VCRjBGMzsiIHBvaW50cz0iMzM3LjMzNiw4Mi41NjcgNDE5LjkwMiw4Mi41NjcgMzM3LjMzNSwwICIvPgo8cG9seWdvbiBzdHlsZT0iZmlsbDojRDVENkRCOyIgcG9pbnRzPSIzNTMuMjIxLDgyLjU2NyA0MTkuOTAyLDEyMS4yNTUgNDE5LjkwMiw4Mi41NjcgIi8+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=" />
                                                        ) : (
                                                            ""
                                                        )}
                                                    {file.extension === "xls" ||
                                                        file.extension === "xlsx" ||
                                                        file.extension === "csv" ? (
                                                            <img alt="ảnh cmnd" src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4Ij4KPHBhdGggc3R5bGU9ImZpbGw6I0UyRTVFNzsiIGQ9Ik0xMjgsMGMtMTcuNiwwLTMyLDE0LjQtMzIsMzJ2NDQ4YzAsMTcuNiwxNC40LDMyLDMyLDMyaDMyMGMxNy42LDAsMzItMTQuNCwzMi0zMlYxMjhMMzUyLDBIMTI4eiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojQjBCN0JEOyIgZD0iTTM4NCwxMjhoOTZMMzUyLDB2OTZDMzUyLDExMy42LDM2Ni40LDEyOCwzODQsMTI4eiIvPgo8cG9seWdvbiBzdHlsZT0iZmlsbDojQ0FEMUQ4OyIgcG9pbnRzPSI0ODAsMjI0IDM4NCwxMjggNDgwLDEyOCAiLz4KPHBhdGggc3R5bGU9ImZpbGw6Izg0QkQ1QTsiIGQ9Ik00MTYsNDE2YzAsOC44LTcuMiwxNi0xNiwxNkg0OGMtOC44LDAtMTYtNy4yLTE2LTE2VjI1NmMwLTguOCw3LjItMTYsMTYtMTZoMzUyYzguOCwwLDE2LDcuMiwxNiwxNiAgVjQxNnoiLz4KPGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTE0NC4zMzYsMzI2LjE5MmwyMi4yNTYtMjcuODg4YzYuNjU2LTguNzA0LDE5LjU4NCwyLjQxNiwxMi4yODgsMTAuNzM2ICAgYy03LjY2NCw5LjA4OC0xNS43MjgsMTguOTQ0LTIzLjQwOCwyOS4wNGwyNi4wOTYsMzIuNDk2YzcuMDQsOS42LTcuMDI0LDE4LjgtMTMuOTM2LDkuMzI4bC0yMy41NTItMzAuMTkybC0yMy4xNTIsMzAuODQ4ICAgYy02LjUyOCw5LjMyOC0yMC45OTItMS4xNTItMTMuNjk2LTkuODU2bDI1LjcxMi0zMi42MjRjLTguMDY0LTEwLjExMi0xNS44NzItMTkuOTUyLTIzLjY2NC0yOS4wNCAgIGMtOC4wNDgtOS42LDYuOTEyLTE5LjQ0LDEyLjgtMTAuNDY0TDE0NC4zMzYsMzI2LjE5MnoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMTk3LjM2LDMwMy4xNTJjMC00LjIyNCwzLjU4NC03LjgwOCw4LjA2NC03LjgwOGM0LjA5NiwwLDcuNTUyLDMuNiw3LjU1Miw3LjgwOHY2NC4wOTZoMzQuOCAgIGMxMi41MjgsMCwxMi44LDE2Ljc1MiwwLDE2Ljc1MkgyMDUuNDRjLTQuNDgsMC04LjA2NC0zLjE4NC04LjA2NC03Ljc5MnYtNzMuMDU2SDE5Ny4zNnoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMjcyLjAzMiwzMTQuNjcyYzIuOTQ0LTI0LjgzMiw0MC40MTYtMjkuMjk2LDU4LjA4LTE1LjcyOGM4LjcwNCw3LjAyNC0wLjUxMiwxOC4xNi04LjE5MiwxMi41MjggICBjLTkuNDcyLTYtMzAuOTYtOC44MTYtMzMuNjQ4LDQuNDY0Yy0zLjQ1NiwyMC45OTIsNTIuMTkyLDguOTc2LDUxLjI5Niw0My4wMDhjLTAuODk2LDMyLjQ5Ni00Ny45NjgsMzMuMjQ4LTY1LjYzMiwxOC42NzIgICBjLTQuMjQtMy40NTYtNC4wOTYtOS4wNzItMS43OTItMTIuNTQ0YzMuMzI4LTMuMzEyLDcuMDI0LTQuNDY0LDExLjM5Mi0wLjg4YzEwLjQ4LDcuMTUyLDM3LjQ4OCwxMi41MjgsMzkuMzkyLTUuNjQ4ICAgQzMyMS4yOCwzMzkuNjMyLDI2OC4wNjQsMzUxLjAwOCwyNzIuMDMyLDMxNC42NzJ6Ii8+CjwvZz4KPHBhdGggc3R5bGU9ImZpbGw6I0NBRDFEODsiIGQ9Ik00MDAsNDMySDk2djE2aDMwNGM4LjgsMCwxNi03LjIsMTYtMTZ2LTE2QzQxNiw0MjQuOCw0MDguOCw0MzIsNDAwLDQzMnoiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==" />
                                                        ) : (
                                                            ""
                                                        )}
                                                </div>
                                                <div className="file-info">
                                                    <div className="name">
                                                        {file.extension === "png" ||
                                                            file.extension === "jpg" ||
                                                            file.extension === "jpeg" ? (
                                                                <i
                                                                    className="fas fa-file-image"
                                                                    style={{ color: "#244D7A" }}
                                                                />
                                                            ) : (
                                                                ""
                                                            )}
                                                        {file.extension === "pdf" ? (
                                                            <i
                                                                className="fas fa-file-pdf"
                                                                style={{ color: "#fe6650" }}
                                                            />
                                                        ) : (
                                                                ""
                                                            )}
                                                        {file.extension === "doc" ||
                                                            file.extension === "docx" ? (
                                                                <i
                                                                    className="fas fa-file-word"
                                                                    style={{ color: "#4285F4" }}
                                                                />
                                                            ) : (
                                                                ""
                                                            )}
                                                        {file.extension === "xls" ||
                                                            file.extension === "xlsx" ||
                                                            file.extension === "csv" ? (
                                                                <i
                                                                    class="fas fa-file-excel"
                                                                    style={{ color: "#1CA362" }}
                                                                />
                                                            ) : (
                                                                ""
                                                            )}
                                                        {file && (
                                                            <span>
                                                                {file.originalName.substr(0, 20) +
                                                                    (file.originalName.length > 20 ? " ..." : "")}
                                                            </span>
                                                        )}
                                                        {edit && (
                                                            <i
                                                                className="fas fa-trash-alt"
                                                                onClick={() =>
                                                                    confirmSubmit(
                                                                        "Xoá file",
                                                                        "Bạn có thật sự muốn xoá " +
                                                                        file.originalName,
                                                                        () => this._handleDeleteFile(file)
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                </ul>
                            )
                        )
                    }
                    <ViewModal
                        open={openViewModal}
                        files={[currentFile]}
                        onClose={() => this.setState({ openViewModal: false })}
                    />
                </div>
                {errors && (
                    <div
                        id={"validator-for-" + (className ? className : "") + "-container"}
                        className={"text-danger show " + (className ? className : "")}
                    >
                        <pre id={"validator-for-"}>{errors}</pre>
                        <a href id={"validator-name-" + className} hidden>
                            {displayName}
                        </a>
                    </div>
                )}

            </div>
        );
    }
}
export default Index;
