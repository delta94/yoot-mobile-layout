import React from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import {
  IconButton
} from '@material-ui/core'
import {
  MoreHoriz as MoreHorizIcon,
  ExpandMore as ExpandMoreIcon
} from '@material-ui/icons'
import MenuList from '@material-ui/core/MenuList';
import './style.scss'


export default function MenuListComposition(props) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, []);

  return (
    <div className="custome-menu list">
      <ClickAwayListener onClickAway={handleClose}>

        <div>
          {
            props.customButton ? <IconButton aria-label="settings" onClick={handleToggle}>
              {
                props.customButton
              }
              <ExpandMoreIcon />
            </IconButton> : <IconButton aria-label="settings" onClick={handleToggle}>
                <MoreHorizIcon />
              </IconButton>
          }
          <Popper open={open}
            placement="bottom-end"
            className={"custom-menu-content" + (props.centerMode == true ? " center-mode" : "")}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Fade {...TransitionProps} timeout={350} >
                <Paper>
                  <MenuList autoFocusItem={open} onKeyDown={handleListKeyDown} onClick={handleToggle}>
                    {
                      props.children
                    }
                  </MenuList>
                </Paper>
              </Fade>
            )}
          </Popper>
        </div>
      </ClickAwayListener>

    </div>

  );
}
