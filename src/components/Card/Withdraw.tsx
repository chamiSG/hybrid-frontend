import { useState } from "react";
import "./card.scss";
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Card, Box, Typography  } from '@material-ui/core';
import { WithdrawIcon, MoreIcon, LessIcon } from "src/helpers/icons"

import Input from "../Input";
import Button from "../Button";
import CardInfo from "./CardInfo"

const useStyles = makeStyles({
  root: {
    // minWidth: 384,
    width: "100%",
    height: "100%",
    overflow: "visible",
    transform: withdrawBackface => withdrawBackface ? "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)" 
                : "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(180deg) rotateZ(0deg) skew(0deg, 0deg)",
    transformStyle: "preserve-3d",
    transition: 'transform 0.4s',
    willChange: "transform"
  },
  content: {
    display: 'flex',
    color: "#f5f5f5",
    padding: 0
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

function Withdraw(props: any) {

  const { title, content, theme } = props;

  const [withdrawBackface, setWithdrawBackface] = useState(true);

  const handleBackface = () => {
    setWithdrawBackface((prevBackface) => !prevBackface);
  };
  
  const classes = useStyles(withdrawBackface);
  const isVerySmallScreen = useMediaQuery("(max-width: 400px)");

  return (
      <Card className={`${classes.root} withdraw-card`} >
        <Box className="card-front">
          <div className="card_top-half-wrapper">
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"} pb={"0.675rem"}>
              <Box>
                <img src={WithdrawIcon} alt="" width={32} />
              </Box>
              <Typography className="card-title">WITHDRAW</Typography>
            </Box>
            <Box display={"flex"} justifyContent={"center"} flexDirection={"column"} gridRowGap={"2rem"}>
              <Box display={"flex"} justifyContent={"center"} flexDirection={"column"}>
                <label>Tokens Held</label>
                <Box display={"flex"} justifyContent={"center"} flexDirection={"column"} p={"1rem"} borderRadius={"8px"} bgcolor={"#ffffff59"}>
                  <Box display={"flex"} flexDirection={'column'} alignItems={'flex-start'}>
                    <Typography className="info-card-text">12,345.948 HFI</Typography>
                    <Typography className="info-card-sub-text">$8,567.78 USD</Typography>
                  </Box>
                </Box>
              </Box>
              
              <Input label="Withdrawal Amount"></Input>
            </Box>
          </div>
          <div className="card_bottom-half-wrapper">
            <CardInfo label1="Withdrawal" label2="Value" value1={"10,000 HFI"} value2={"$6,587 USDC"}></CardInfo>
            <Button label="Withdraw 6,586 USDC"></Button>
            <Box display={"flex"} justifyContent={"flex-end"}>
              <a href="javascript:void(0)" className="cardlip-more w-inline-block">
                <div onClick={handleBackface} className="text-block-6">Learn More</div>
                <img src={MoreIcon} loading="lazy" width="28" alt="" className="cardflip-more" />
              </a>
            </Box>
          </div>
        </Box>
        <Box className="card-back">
          <Box display={"flex"} justifyContent={"space-between"} flexDirection={"column"} height={"100%"}>
            <Box p={"2.5rem 2.25rem 3rem"}>
              <Typography className="card-back-content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.
              </Typography>
            </Box>
            <Box display={"flex"} justifyContent={"flex-end"} px={"2.5rem"} pb={"2rem"}>
              <a onClick={handleBackface} href="javascript:void(0)" className="cardlip-more w-inline-block">
                <img src={LessIcon} loading="lazy" width="28" alt="" className="cardflip-more" />
              </a>
            </Box>
          </Box>
        </Box>
      </Card>
  );
}

export default Withdraw;
