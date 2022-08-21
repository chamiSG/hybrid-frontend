import { useState, useRef, useEffect } from "react";
import "./select.scss";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { AvaxIcon } from "src/helpers/icons"

import {
  Button,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  Box
} from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dropdownContainer: {
      display: 'flex',
      flexDirection: 'column'
    },
    root: {
      display: 'flex',
      width: '100%',
      position: 'relative'
    },
    popper: {
      zIndex: 1
    },
    paper: {
      marginRight: theme.spacing(2),
    },
  }),
);


function Select(props: any) {

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div className={classes.dropdownContainer}>
      <label>
        Token
      </label>
      <div className={`${classes.root} select-root`}>
        <Button
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          className={"dropdown_component"}
        >
          Select Token
          <div className="dropdown_dropdown-icon w-icon-dropdown-toggle"></div>
        </Button>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal className={classes.popper}>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <MenuItem onClick={handleClose}>
                      <Box display={"flex"} gridColumnGap={10} alignItems="center">
                        <img src={AvaxIcon} alt="" />
                        <div>HyBrid</div>
                      </Box>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Box display={"flex"} gridColumnGap={10} alignItems="center">
                        <img src={AvaxIcon} alt="" />
                        <div>AVAX</div>
                      </Box>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Box display={"flex"} gridColumnGap={10} alignItems="center">
                        <img src={AvaxIcon} alt="" />
                        <div>BNB</div>
                      </Box>
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
}

export default Select;
