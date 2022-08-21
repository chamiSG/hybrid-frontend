import { useState, useRef, useEffect } from "react";
import "./button.scss";
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

function Button(props: any) {

  const { label, active } = props;
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
    <div className={`${!active ? "" : "hidden"} button-row is-button-row-center`}>
      <a href="javascript:void(0)" className="button-secondary max-width-full shadow-medium w-button">{label}</a>
    </div>
  );
}

export default Button;
