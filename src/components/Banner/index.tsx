import {
  Container,
  Box,
  Typography,
  Divider
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./banner.scss";
import LogoHorz from "src/assets/images/logo_horz.svg"
import LogoHorzDark from "src/assets/images/logo_horz_dark.svg"

function Banner(props: any) {

  const { title, content, theme } = props;
  const isVerySmallScreen = useMediaQuery("(max-width: 400px)");
  const isDark = theme == "dark" ? true : false;

  return (
    <Container maxWidth="md">
      <Box className="banner" display={'flex'} flexDirection={"column"} alignItems={'center'} sx={{
        color: isDark? "#ffffff" : "#3a3a3a",
        padding: !isVerySmallScreen ? '6rem 0' : '3.5rem 0'
      }}>
        <div>
          <img src={isDark ? LogoHorz : LogoHorzDark} loading="lazy" alt="" />
        </div>
        <Typography variant="h1" component="h1">
          {title}
        </Typography>
        <Box sx={{
          padding: !isVerySmallScreen ? "1.5rem 4rem" : '1.5rem 0',
          textAlign: "center"
        }}>
          <Divider className={isDark ? "divider-light" : "divider-dark"} variant="middle" />
          <Box py={"1.5rem"}>
            <Typography variant="h4" component="h4">
              {content}
            </Typography>
          </Box>
          <Divider className={isDark ? "divider-light" : "divider-dark"} variant="middle" />
        </Box>
      </Box>
    </Container>
  );
}

export default Banner;
