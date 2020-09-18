import React from "react";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

import "./style.scss";
class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isExpanded: false
        }
    }

    handleToggle() {
        this.setState({
            isExpanded: !this.state.isExpanded
        });
    };

    handleClose() {
        setTimeout(() => {
            this.setState({ isExpanded: false });
        }, 5);
    }

    render() {
        let {
            isExpanded
        } = this.state

        let {
            header,
            content
        } = this.props


        return (
            <div className={("custom-drop-down") + (isExpanded ? " active" : "")}>
                <div className="drop-down-header" onClick={() => this.handleToggle()}>
                    {
                        header ? header : ""
                    }
                </div>
                <Popper open={isExpanded} anchorEl={this.anchorEl} transition disablePortal className="drop-down-content">
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            id="menu-list-grow"
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                            <Paper>
                                <ClickAwayListener className="ds" onClickAway={() => this.handleClose()}>
                                    {
                                        content ? content : ""
                                    }
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div >
        );
    }
}
export default Index;
