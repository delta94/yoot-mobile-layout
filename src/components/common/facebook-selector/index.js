import React from 'react';
import {
    Tooltip,
    Button
} from '@material-ui/core'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { ReactSelectorIcon } from '../../../constants/constants'
import './style.scss';

const like1 = require('../../../assets/icon/like1@1x.png')

export default function FacebookSelector({ active, type, onReaction, onShortPress }) {
    const [open, setOpen] = React.useState(false)
    
    const handleClickAway = () => {
        setOpen(false);
    };
    var longpress = false;
    var presstimer = null;

    var cancel = function (e) {
        if (presstimer !== null) {
            clearTimeout(presstimer);
            presstimer = null;
        }
    };

    var click = function (e) {
        if (presstimer !== null) {
            clearTimeout(presstimer);
            presstimer = null;
        }

        if (longpress) {
            return false;
        }
        //short press
        if (open === false) onShortPress(ReactSelectorIcon[1])
    };

    var start = function (e) {
        if (e.type === "click" && e.button !== 0) {
            return;
        }
        longpress = false;
        presstimer = setTimeout(function () {
            //long press
            setOpen(true);
            longpress = true;
        }, 500);
        return false;
    };

    return (
        <>
            <ClickAwayListener onClickAway={handleClickAway}>
                <div
                    style={{ width: "100%" }}
                    onMouseDown={start}
                    onTouchStart={start}
                    onClick={click}
                    onMouseOut={cancel}
                    onTouchEnd={cancel}
                    onTouchCancel={cancel}
                    id="btn-like"
                >
                    {
                        active && active > 0 ? <Button style={{ width: "100%", textTransform: "initial", color: ReactSelectorIcon[active].color }}><img style={{ width: "20px", margin: "0 10px 2px 0" }} src={ReactSelectorIcon[active].icon} />{type == "MiniButton" ? "" : ReactSelectorIcon[active].disciption}</Button>
                            : <Button style={{ width: "100%", textTransform: "initial", }}><img style={{ width: "20px", margin: "0 10px 2px 0" }} src={like1} />{type == "MiniButton" ? "" : "Thích"}</Button>
                    }
                </div>
                <div className={"facebook-selector" + (open ? "" : " close")}>
                    {
                        ReactSelectorIcon.map((icon) => icon &&
                            <Tooltip key={icon.code} title={<h5>{icon.disciption}</h5>} placement="top" >
                                <div style={{ backgroundImage: "url(" + icon.icon + ")" }} onClick={() => icon.code > 0 && onReaction(icon)}>
                                </div>
                            </Tooltip>)
                    }
                </div>
            </ClickAwayListener>
        </>
    );
}

