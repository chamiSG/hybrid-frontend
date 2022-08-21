import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Box, Divider } from "@material-ui/core";
import "./my-investment.scss";
import Banner from "../../components/Banner";
import { bannerText } from "../../constants/bannerText"
import PriceCard from "src/components/PriceCard";
import Chart from "src/components/Chart";
import useMediaQuery from "@material-ui/core/useMediaQuery";


function MyInvestment() {
  const dispatch = useDispatch();

  const isVerySmallScreen = useMediaQuery("(max-width: 400px)");


  return (
    <div className="my-investment-page">
      <Banner title={bannerText.my_investment} content={bannerText.content} theme="light"></Banner>
      <Container maxWidth="lg">
        <Box 
          display={'grid'}
          justifyContent={"center"}
          gridAutoColumns={"1fr"} 
          gridTemplateColumns={"1fr 1fr 1fr 1fr"} 
          gridRowGap={isVerySmallScreen ? "16px" : "16px"} 
          gridColumnGap={"16px"}
        >
          <Box display={'flex'} alignItems={"center"}>
            <PriceCard label={'Token'} value={"3456.34"} theme="light"></PriceCard>
            {!isVerySmallScreen && <Divider orientation="vertical" className="divider-dark price-card-divider" flexItem />}
          </Box>
          <Box display={'flex'} alignItems={"center"}>
            <PriceCard label={'ROI'} value={"$1865.87"} theme="light"></PriceCard>
            {!isVerySmallScreen && <Divider orientation="vertical" className="divider-dark price-card-divider" flexItem />}
          </Box>
          <Box display={'flex'} alignItems={"center"}>
            <PriceCard label={'veHFI'} value={"4579"} theme="light"></PriceCard>
            {!isVerySmallScreen && <Divider orientation="vertical" className="divider-dark price-card-divider" flexItem />}
          </Box>
          <Box display={'flex'} alignItems={"center"}>
            <PriceCard label={'UnLock In'} value={"02:21:52"} theme="light"></PriceCard>
          </Box>
        </Box>
        <Box display={'flex'} justifyContent={"center"} gridGap={"1rem"} pb={"10rem"}>
          <Chart theme="light"></Chart>
        </Box>
      </Container>
    </div>
  );
}

export default MyInvestment;
