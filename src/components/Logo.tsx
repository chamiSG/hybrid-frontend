import { Link } from "@material-ui/core";
import { useStyles } from "src/styles"
import HybridLogo from "src/assets/images/hybrid-logo_horz2svg.svg"

function Logo( props: any ) {
  const { width, height } = props;
  const classes = useStyles();

  return (
    <Link href="/" underline="none" className={`${classes.logo}`} >
      <img src={HybridLogo} loading="lazy" alt="HybridLogo" width={width} height={height} />
    </Link>
  );
}

export default Logo;
