import React from "react";
import { BASE_API } from '../../../constants/appSettings'
import "./style.scss";
import Modal from '../modal'


class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentFile: {},
            fileIndex: 0
        };
    }

    _handleClickThum(file, index) {
        this.setState({
            currentFile: file,
            fileIndex: index
        })
    }

    componentWillReceiveProps(nextProps) {
        let {
            files
        } = this.props
        if (files && files.length > 0) {
            this.setState({
                currentFile: files[0],
                fileIndex: 0
            })
        }
    }


    render() {
        let { currentFile, fileIndex } = this.state
        let { open, files } = this.props
        return (
            <Modal
                open={open}
                className="view-modal"
                fullScreen={true}
                onClose={() => this.props.onClose()}
                content={
                    <div className='viewer-content'>
                        {
                            currentFile.relativePath && <div className="viewer-detail">
                                <img alt="" src={BASE_API + currentFile.relativePath} />
                            </div>
                        }
                        {
                            files && files.length > 1 && <div className="viewer-thum">
                                <ul>
                                    {
                                        files.map((item, i) =>
                                            item.relativePath
                                            && <li
                                                key={i}
                                                onClick={() => this._handleClickThum(item, i)}
                                                className={i === fileIndex ? "active" : ""}
                                            >
                                                <img alt="" src={BASE_API + item.relativePath} />
                                            </li>
                                        )
                                    }
                                </ul>
                            </div>
                        }
                    </div>
                }
            />
        );
    }
}
export default Index;

