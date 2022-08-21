import { useState } from "react";
import "./card.scss";
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Card, Box, Typography  } from '@material-ui/core';
import { DepositIcon, MoreIcon, LessIcon } from "src/helpers/icons"
import Select from "src/components/Select";
import Input from "../Input";
import Button from "../Button";
import CardInfo from "./CardInfo"

const useStyles = makeStyles({
  root: {
    // minWidth: 384,
    width: "100%",
    height: "100%",
    overflow: "visible",
    transform: backface => backface ? "translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)" 
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

function Deposit(props: any) {

  const { title, content, theme } = props;

  const [backface, setBackface] = useState(true);

  const handleBackface = () => {
    setBackface((prevBackface) => !prevBackface);
  };
  
  const classes = useStyles(backface);
  const isVerySmallScreen = useMediaQuery("(max-width: 400px)");

  return (
      <Card className={`${classes.root} deposit-card`} >
        <Box className="card-front">
          <div className="card_top-half-wrapper">
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"} pb={"0.675rem"}>
              <Box>
                <img src={DepositIcon} alt="" width={32} />
              </Box>
              <Typography className="card-title">DEPOSIT</Typography>
            </Box>
            <Box display={"flex"} justifyContent={"center"} flexDirection={"column"} gridRowGap={"2rem"}>
              <Select></Select>
              <Input label="Deposit Amount"></Input>
            </Box>
          </div>
          <div className="card_bottom-half-wrapper">
            <CardInfo label1="Tax" label2="Final Desposit" value1={"-15%"} value2={"85.00 USD+"}></CardInfo>
            <Button label="Deposit 85.00 USD+"></Button>
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

export default Deposit;
