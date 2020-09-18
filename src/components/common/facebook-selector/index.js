import React from 'react';
import { Tooltip, ClickAwayListener, Button } from '@material-ui/core'
import LongPress from 'react-long'
import './style.scss';

const like1 = require('../../../assets/icon/like1@1x.png')
const like = require('../../../assets/icon/Feeling/like.png')
const love = require('../../../assets/icon/Feeling/love.png')
const haha = require('../../../assets/icon/Feeling/haha.png')
const wow = require('../../../assets/icon/Feeling/wow.png')
const sad = require('../../../assets/icon/Feeling/sad.png')
const huhu = require('../../../assets/icon/Feeling/huhu.png')
const Angry = require('../../../assets/icon/Feeling/Angry.png')



export class FacebookSelector extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false
        }
    }

    render() {
        let {
            onReaction,
            type
        } = this.props
        let {
            open
        } = this.state
        return (
            <ClickAwayListener className="d" onClickAway={() => this.setState({ open: false })}>
                <LongPress
                    time={300}
                    onLongPress={() => this.setState({ open: true })}
                    onPress={() => onReaction("Like")}
                >
                    <Button><img src={like1} />{type == "MiniButton" ? "" : "Thích"}</Button>
                </LongPress>
                <div className={"facebook-selector" + (open ? "" : " close")}>
                    <Tooltip title={<h5>Thích</h5>} placement="top" onClick={() => onReaction("Like")}>
                        <div style={{ backgroundImage: "url(" + like + ")" }} >
                        </div>
                    </Tooltip>
                    <Tooltip title={<h5>Yêu thích</h5>} placement="top" onClick={() => onReaction("Love")}>
                        <div style={{ backgroundImage: "url(" + love + ")" }} >
                        </div>
                    </Tooltip>
                    <Tooltip title={<h5>Haha</h5>} placement="top" onClick={() => onReaction("Haha")}>
                        <div style={{ backgroundImage: "url(" + haha + ")" }} >
                        </div>
                    </Tooltip>
                    <Tooltip title={<h5>Wow</h5>} placement="top" onClick={() => onReaction("Wow")}>
                        <div style={{ backgroundImage: "url(" + wow + ")" }} >
                        </div>
                    </Tooltip>
                    <Tooltip title={<h5>Buồn</h5>} placement="top" onClick={() => onReaction("Sad")}>
                        <div style={{ backgroundImage: "url(" + sad + ")" }} >
                        </div>
                    </Tooltip>
                    <Tooltip title={<h5>Khóc</h5>} placement="top" onClick={() => onReaction("Huhu")}>
                        <div style={{ backgroundImage: "url(" + huhu + ")" }} >
                        </div>
                    </Tooltip>
                    <Tooltip title={<h5>Phẩn nộ</h5>} placement="top" onClick={() => onReaction("Angry")}>
                        <div style={{ backgroundImage: "url(" + Angry + ")" }} >
                        </div>
                    </Tooltip>
                </div>

            </ClickAwayListener>
        );
    }
}
export default FacebookSelector
