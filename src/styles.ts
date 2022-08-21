import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export const useStyles = makeStyles(theme => ({
  navbarLink: {
    padding: "0.5rem 2rem",
    fontFamily: "Merriweather, serif",
    color: "#3a3a3a",
    fontWeight: 300,
    letterSpacing: "1px",
    textTransform: "none",
  },
  logo: {
    lineHeight: 0,
    justifySelf: "center"
  }

}));
