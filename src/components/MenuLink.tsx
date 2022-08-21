import { Link as ReactLink } from "react-router-dom";
import { Link } from "@material-ui/core";
import { useStyles } from "src/styles"

function MenuLink( props: any ) {
  const { text, href } = props;

  const classes = useStyles();
  
  return (
    <Link component={ReactLink} to={href} underline="none" className={`${classes.navbarLink}`}>
      {text}
    </Link>
  );
}

export default MenuLink;
