import {
  Box,
  Typography
} from "@material-ui/core";
import "./pricecard.scss";
import useMediaQuery from "@material-ui/core/useMediaQuery";

function PriceCard(props: any) {

  const { label, value, theme } = props;
  const isVerySmallScreen = useMediaQuery("(max-width: 400px)");
  const isDark = theme == "dark" ? true : false;

  return (
    <Box className={'price-card'} sx={{
      color: isDark ? '#f5f5f5' : "#3a3a3a",
      padding: !isVerySmallScreen ? "2.5rem 30px" : "2rem 0px 1.5rem"
    }}>
      <Box display={'flex'} flexDirection={"column"} alignItems={'center'} sx={{
        padding: !isVerySmallScreen ? '20px' : "2px"
      }}>
        <Typography className="metric-label">
          {label}
        </Typography>
        <Typography variant="h4" component="h4" className="metric">
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export default PriceCard;
