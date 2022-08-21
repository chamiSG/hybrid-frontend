import { Link as ReactLink } from "react-router-dom";
import { Container, Box, Divider, Typography, Link } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./footer.scss";
import Logo from "../Logo";
import MenuLink from "../MenuLink";
import Social from "../Social"

function Footer() {
  const isVerySmallScreen = useMediaQuery("(max-width: 400px)");

  return (
    <>
      <div className="footer">
        <Container maxWidth="lg">
          <Box py={"2rem"}>
            <Box 
              display={'grid'}
              justifyContent={"space-between"}
              alignItems={"center"}
              gridAutoFlow={!isVerySmallScreen ? "column" : "row"}
              gridAutoColumns={"1fr"} 
              gridTemplateColumns={!isVerySmallScreen ? "0.25fr 1fr 0.25fr" : "1fr"} 
              gridTemplateRows={"auto"} 
              gridRowGap={isVerySmallScreen ? "3rem" : "16px"} 
              gridColumnGap={"4vw"}
            >
              <Box 
                display={'flex'} 
                justifyContent={ isVerySmallScreen ? "center" : "start"} 
              >
                <Logo width={"120"} height={"40"}></Logo>
              </Box>
              <Box 
                display={'flex'} 
                justifyContent={"center"} 
                flexDirection={!isVerySmallScreen ? "row" : "column"}
                alignItems={"center"}
              >
                  <MenuLink text="Dashboard" href="/" ></MenuLink>
                  <MenuLink text="Invest" href="/invest" ></MenuLink>
                  <MenuLink text="Treasury" href="/treasury" ></MenuLink>
              </Box>
              <Social />
            </Box>
            <Divider className="footer-divider" />
            <Box 
              display={'grid'}
              justifyContent={"center"}
              justifyItems={!isVerySmallScreen ? "start" : "center"}
              alignItems={"center"}
              gridAutoFlow={!isVerySmallScreen ? "column" : "row"}
              gridAutoColumns={"max-content"} 
              gridTemplateColumns={"max-content"} 
              gridTemplateRows={"auto"} 
              gridRowGap={!isVerySmallScreen ? 0 : "1rem"} 
              gridColumnGap={!isVerySmallScreen ? "1.5rem" : 0}
              pt={"2rem"}
            >
              <Typography className={"footer-legal-link footer-credit-text"}> © 2022 Hybrid. All right reserved.</Typography>
              <Link component={ReactLink} to={"/"} className={"footer-legal-link"} underline="always">Privacy Policy</Link>
              <Link component={ReactLink} to={"/"} className={"footer-legal-link"} underline="always">Terms of Service</Link>
              <Link component={ReactLink} to={"/"} className={"footer-legal-link"} underline="always">Cookies Settings</Link>
            </Box>
          </Box>
        </Container>
      </div>
    </>
    
  );
}

export default Footer;
