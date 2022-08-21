import { AppBar, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ConnectButton from "./connect-button";
import "./header.scss";
import { TRANSITION_DURATION } from "../../constants/style";
import { Menu, Close } from '@material-ui/icons';
import Logo from "../Logo";
import MenuLink from "../MenuLink";

interface IHeader {
  handleDrawerToggle: () => void;
  open: boolean;
}

const useStyles = makeStyles(theme => ({
  appBar: {
    minHeight: "5.3rem",
    [theme.breakpoints.up("sm")]: {
      width: "100%",
    },
    paddingLeft: "5%",
    paddingRight: "5%",

    justifyContent: "flex-end",
    alignItems: "center",
    background: "transparent",
    backdropFilter: "none",
    zIndex: 10,
    backgroundColor: "#fff",
    boxShadow: "0 24px 48px -12px rgb(16 24 40 / 18%)"
  },
  topBar: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: TRANSITION_DURATION,
    }),
  },
  topBarShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: TRANSITION_DURATION,
    }),
    marginLeft: 0,
  },
}));

function Header({ handleDrawerToggle, open }: IHeader) {
  const classes = useStyles();
  const isVerySmallScreen = useMediaQuery("(max-width: 400px)");

  return (

    <div className={`${classes.topBar} ${!isVerySmallScreen && classes.topBarShift}`}>
      <AppBar position="sticky" className={classes.appBar} elevation={0}>
        <Toolbar disableGutters className="dapp-topbar">
          <Logo width={"173"} height={"55"}></Logo>

          <div className="dapp-topbar-btns-wrap">
            {!isVerySmallScreen && <MenuLink text="Dashboard" href="/" ></MenuLink>}
            {!isVerySmallScreen && <MenuLink text="Invest" href="/invest" ></MenuLink>}
            {!isVerySmallScreen && <MenuLink text="My Investment" href="/my-investment" ></MenuLink>}
            {!isVerySmallScreen && <MenuLink text="Treasury" href="/treasury" ></MenuLink>}
            {!isVerySmallScreen && <ConnectButton />}
          </div>
          {!open && <Menu color="action" fontSize="large" onClick={handleDrawerToggle} className="dapp-topbar-slider-btn" />}
          {open && <Close color="action" fontSize="large" onClick={handleDrawerToggle} className="dapp-topbar-slider-btn" />}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
