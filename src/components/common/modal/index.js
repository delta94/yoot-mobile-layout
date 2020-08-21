import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import "./style.scss";

class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {

    }

    render() {
        let {
            header,
            content,
            action,
            open,
            fullScreen,
            fullWidth,
            className,
            onClose,
            allowCancel
        } = this.props

        return (
            <Dialog
                open={open ? open : false}
                onClose={onClose ? () => onClose() : ""}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                disableBackdropClick={true}
                fullScreen={fullScreen ? fullScreen : false}
                fullWidth={fullWidth ? fullWidth : false}
                className={"custom-modal " + (className ? className : "")}
            >
                <DialogTitle className="alert-dialog-title">
                    <div className="custom-modal-header">
                        {
                            header ? header : ""
                        }
                        <IconButton
                            aria-label="Delete"
                            onClick={onClose ? () => onClose() : ""}
                            style={{ float: "right" }}
                            size="small"
                            className="close-bt"
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </div>
                </DialogTitle>
                <DialogContent className="alert-dialog-content">
                    <div className="custom-modal-content">
                        {
                            content ? content : ""
                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    <div className="custom-modal-actions" style={{
                        padding: "0px 20px"
                    }}>
                        {
                            allowCancel && <Button
                                onClick={() => {
                                    if (this.props.onCancel)
                                        this.props.onCancel()
                                    else
                                        this.props.onClose()
                                }}
                                className="cancel-button"
                                style={{ marginRight: "20px" }}
                            >Huỷ</Button>
                        }
                        {
                            action ? action : ""
                        }
                    </div>
                </DialogActions>
            </Dialog>
        );
    }
}
export default Index;
