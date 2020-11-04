import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import $ from 'jquery'
import './style.scss'

export default function TriggersTooltips(props) {
    const [open, setOpen] = React.useState(false);

    const handleTooltipClose = () => {
        setOpen(false);
        $('body').css("overflow", "unset")
    };

    const handleTooltipOpen = () => {
        setOpen(true);
        $('body').css("overflow", "hidden")
    };

    return (
        <div>
            <Grid container justify="center">
                <Grid item>
                    <ClickAwayListener onClickAway={handleTooltipClose}>
                        <div className={"click-tooltip " + props.placement}>
                            <Tooltip
                                PopperProps={{
                                    disablePortal: true,
                                }}
                                onClose={handleTooltipClose}
                                open={open}
                                disableFocusListener
                                disableHoverListener
                                disableTouchListener
                                title={props.title}
                                placement={props.placement}
                                arrow
                            >
                                <Button onClick={handleTooltipOpen} className={props.className}>
                                    {
                                        props.children
                                    }
                                </Button>
                            </Tooltip>
                        </div>
                    </ClickAwayListener>
                </Grid>
            </Grid>
        </div>
    );
}
