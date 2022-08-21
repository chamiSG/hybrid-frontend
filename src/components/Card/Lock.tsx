import { useState } from "react";
import "./card.scss";
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Card, Box, Typography } from '@material-ui/core';
import { LockIcon, UnLockIcon, MoreIcon, LessIcon } from "src/helpers/icons"

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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Lock(props: any) {

  const { title, content, theme } = props;

  const [backface, setBackface] = useState(true);
  const [active, setTabActive] = useState(true);
  const [selected, setBoxSelect] = useState(0);

  const handleBackface = () => {
    setBackface((prevBackface) => !prevBackface);
  };

  const handleChange = () => {
    setTabActive((prevActive) => !prevActive);
  };

  const periods = [
    { month: 3, value: 1.250},
    { month: 6, value: 1.650},
    { month: 12, value: 2.0},
  ]

  const handleSelect = (event: React.MouseEvent<EventTarget>, i: number) => {
    setBoxSelect(i);
  };
  
  const classes = useStyles(backface);
  const isVerySmallScreen = useMediaQuery("(max-width: 400px)");

  return (
      <Card className={`${classes.root} lock-card`} >
        <Box className="card-front" gridRowGap={0}>
            <Box display={"flex"} justifyContent={"center"} gridColumnGap={'1rem'} mb={"2rem"}>
              <Box onClick={handleChange} className={`tab-header ${active ? 'tab-active' : ''}`} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"} pb={"0.35rem"} width={'6rem'}>
                <Box>
                  <img src={LockIcon} alt="" width={32} />
                </Box>
                <Typography className="card-title">Lock</Typography>
              </Box>
              <Box onClick={handleChange} className={`tab-header ${!active ? 'tab-active' : ''}`} display={"flex"} justifyContent={"center"} alignItems={"center"} flexDirection={"column"} pb={"0.35rem"} width={'6rem'}>
                <Box>
                  <img src={UnLockIcon} alt="" width={32} />
                </Box>
                <Typography className="card-title">UnLock</Typography>
              </Box>
            </Box>
            <Box className={`${!active ? 'tab-content-show' : 'tab-content-hidden'}`} display={"flex"} justifyContent={"space-between"} flexDirection={"column"} height={"100%"}>
              <div className="card_top-half-wrapper">
                <Box display={"flex"} justifyContent={"center"} flexDirection={"column"} gridRowGap={"2rem"}>
                  <Box display={"flex"} justifyContent={"center"} flexDirection={"column"}>
                    <label>Unlockable veHFI</label>
                    <Box display={"flex"} justifyContent={"center"} flexDirection={"column"} p={"1rem"} borderRadius={"8px"} bgcolor={"#ffffff59"}>
                      <Box display={"flex"} flexDirection={'column'} alignItems={'flex-start'}>
                        <Typography className="info-card-text">12,345.948 HFI</Typography>
                        <Typography className="info-card-sub-text">$8,567.78 USD</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Input label="Unlock Amount"></Input>
                </Box>
              </div>
              <div className="card_bottom-half-wrapper">
                <CardInfo label1="Locking Period" label2="veHFI Rewards" value1={"3 months"} value2={"6.5veHFI"}></CardInfo>
                <Button label="Unlock 1,000 HFI"></Button>
                <Box display={"flex"} justifyContent={"flex-end"}>
                  <a href="javascript:void(0)" className="cardlip-more w-inline-block">
                    <div onClick={handleBackface} className="text-block-6">Learn More</div>
                    <img src={MoreIcon} loading="lazy" width="28" alt="" className="cardflip-more" />
                  </a>
                </Box>
              </div>
            </Box>

            <Box className={`${active ? 'tab-content-show' : 'tab-content-hidden'}`} display={"flex"} justifyContent={"space-between"} flexDirection={"column"} height={"100%"}>
              <div className="card_top-half-wrapper">
                <Box display={"flex"} justifyContent={"center"} flexDirection={"column"} gridRowGap={"2rem"}>
                  <Box display={"flex"} justifyContent={"center"} flexDirection={"column"}>
                    <label>Select Lock Period</label>
                    <Box
                      display={'grid'}
                      justifyContent={"center"}
                      gridAutoColumns={"1fr"} 
                      gridTemplateColumns={"1fr 1fr 1fr"} 
                      gridColumnGap={"0.9rem"}
                    >
                      {periods.map((period, i) => (
                          <a 
                            onClick={(e) => {
                              handleSelect(e, i)
                            }} 
                            href="javascript:void(0)" className={`${selected == i ? "selected" : ''} lock-period_button shadow-medium w-inline-block`}>
                            <div className="lock-period_month-wrapper">
                              <div className="lock-period_month-count">{period.month}</div>
                              <div className="text-size-small">Months</div>
                            </div>
                            <div className={`${selected == i ? "selected" : ''} multiplier`}>{period.value}x</div>
                          </a>
                        ))

                      }
                    </Box>
                  </Box>
                  <Input label="Lock Amount"></Input>
                </Box>
              </div>
              <div className="card_bottom-half-wrapper">
                <CardInfo label1="Locking Period" label2="veHFI Rewards" value1={"3 months"} value2={"6.5veHFI"}></CardInfo>
                <Button label="Lock 1,000 HFI"></Button>
                <Box display={"flex"} justifyContent={"flex-end"}>
                  <a href="javascript:void(0)" className="cardlip-more w-inline-block">
                    <div onClick={handleBackface} className="text-block-6">Learn More</div>
                    <img src={MoreIcon} loading="lazy" width="28" alt="" className="cardflip-more" />
                  </a>
                </Box>
              </div>
            </Box>
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

export default Lock;
