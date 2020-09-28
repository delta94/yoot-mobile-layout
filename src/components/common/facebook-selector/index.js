import React from 'react';
import { Tooltip, ClickAwayListener, Button } from '@material-ui/core'
import LongPress from 'react-long'
import {
    ReactSelectorIcon
} from '../../../constants/constants'
import './style.scss';

const like1 = require('../../../assets/icon/like1@1x.png')



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
            onShortPress,
            type,
            active
        } = this.props
        let {
            open
        } = this.state
        return (
            <ClickAwayListener className="d" onClickAway={() => setTimeout(() => {
                this.setState({ open: false })
            }, 100)}>
                <LongPress
                    time={300}
                    onLongPress={() => this.setState({ open: true })}
                    onPress={() => onShortPress(ReactSelectorIcon[1])}
                >
                    {
                        active ? <Button style={{ color: ReactSelectorIcon[active].color }}><img src={ReactSelectorIcon[active].icon} />{type == "MiniButton" ? "" : ReactSelectorIcon[active].disciption}</Button>
                            : <Button><img src={like1} />{type == "MiniButton" ? "" : "Thích"}</Button>
                    }
                </LongPress>
                <div className={"facebook-selector" + (open ? "" : " close")}>
                    {
                        ReactSelectorIcon.map((icon) => icon ? <Tooltip key={icon.code} title={<h5>{icon.disciption}</h5>} placement="top" >
                            <div style={{ backgroundImage: "url(" + icon.icon + ")" }} onClick={() => onReaction(icon)}>
                            </div>
                        </Tooltip> : "")
                    }
                </div>

            </ClickAwayListener >
        );
    }
}
export default FacebookSelector
