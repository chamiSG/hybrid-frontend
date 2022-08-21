import { useState, useRef, useEffect } from "react";
import "./input.scss";
import useMediaQuery from "@material-ui/core/useMediaQuery";

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
  }),
);

function Input(props: any) {
  const { label, value } = props;

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  return (
    <div className={classes.dropdownContainer}>
      <label>
        {label}
      </label>
      <div className={`${classes.root} input-root`}>
        <input value={value} type="text" className="form-input shadow-medium w-input" name="name" data-name="Name" placeholder="0 HFI" id="name" />
      </div>
    </div>
  );
}

export default Input;
