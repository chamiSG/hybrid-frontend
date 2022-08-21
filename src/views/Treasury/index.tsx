import { useState } from "react";
import { Container, Box, Divider } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./treasury.scss";
import Banner from "../../components/Banner";
import { bannerText } from "../../constants/bannerText"
import { LogoIcon, BinanceIcon, AvaxIcon, EthIcon, PolyIcon } from "src/helpers/icons"
import Chart from "src/components/Chart";
import TreasuryTabel from "./components/TreasuryTable";

function Treasury() {
  const isVerySmallScreen = useMediaQuery("(max-width: 400px)");
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: 'Total Treasury', value: 160934, icon: LogoIcon, classnames: 'w--current' },
    { label: 'Avalanch', value: 160934, icon: AvaxIcon, classnames: 'w--current' },
    { label: 'Polygon', value: 160934, icon: PolyIcon, classnames: 'w--current' },
    { label: 'Binance', value: 160934, icon: BinanceIcon, classnames: 'w--current' },
    { label: 'Ethereum', value: 160934, icon: EthIcon, classnames: 'w--current' },
  ];

  const handleTab = (event: React.MouseEvent<EventTarget>, i: number) => {
    setActiveTab(i);
  };

  const data = [
    { asset: 'SushinSwap OHM v2-ETH Liquidity Pool', category: "Stablecoins", value: 12345654, apy: 12.53 },
    { asset: 'SushinSwap OHM v2-ETH Liquidity Pool', category: "Protocol-Owned Liquidity", value: 12345654, apy: 12.53 },
    { asset: 'SushinSwap OHM v2-ETH Liquidity Pool', category: "Stablecoins", value: 12345654, apy: 12.53 },
    { asset: 'Curve FRAX3Pool - Staked in Convex (cvxFRAX3CRV)', category: "Stablecoins", value: 12345654, apy: 12.53 },
    { asset: 'SushinSwap OHM v2-ETH Liquidity Pool', category: "Stablecoins", value: 12345654, apy: 12.53 },
  ];

  return (
    <div className="treasury-page">
      <Banner title={bannerText.treasury} content={bannerText.content} theme="dark"></Banner>
      <Container maxWidth="lg">
        <Box
          display={'grid'}
          justifyContent={"center"}
          gridAutoColumns={"1fr"}
          gridTemplateColumns={"1fr 1fr 1fr 1fr"}
          gridTemplateRows={"auto"}
          gridRowGap={"16px"}
          gridColumnGap={"16px"}
          flex={1}
          className="treasury-tabs_menu"
        >
          {tabs.map((tab, i) => (             
            <a 
              onClick={(e) => {
                handleTab(e, i)
              }} 
              className={`${activeTab == i ? tab.classnames : ''} ${i == 0 ? "total treasury_chart-block" : ""} treasury_stat-block w-inline-block w-tab-link`} href="javascript:void(0)" role="tab" aria-controls="w-tabs-0-data-w-pane-0">
              <img loading="lazy" src={tab.icon} alt="" />
              <div className="metric-label">{tab.label}</div>
              <div className="metric">${tab.value}</div>
            </a>
          ))}
        </Box>
        <Box display={'flex'} justifyContent={"center"} gridGap={"1rem"} pb={"10rem"}>
          <div className={`${activeTab == 0 ? 'w--tab-active' : ''} treasury-tabs_tab-pane w-tab-pane`} role="tabpanel">
            <Chart theme="dark"></Chart>
          </div>
          <div className={`${activeTab == 1 ? 'w--tab-active' : ''} treasury-tabs_tab-pane w-tab-pane`} role="tabpanel">
            <TreasuryTabel icon={AvaxIcon} value={160934} data={data} ></TreasuryTabel>
          </div>
          <div className={`${activeTab == 2 ? 'w--tab-active' : ''} treasury-tabs_tab-pane w-tab-pane`} role="tabpanel">
            <TreasuryTabel icon={PolyIcon} value={160934} data={data} ></TreasuryTabel>
          </div>
          <div className={`${activeTab == 3 ? 'w--tab-active' : ''} treasury-tabs_tab-pane w-tab-pane`} role="tabpanel">
            <TreasuryTabel icon={BinanceIcon} value={160934} data={data} ></TreasuryTabel>
          </div>
          <div className={`${activeTab == 4 ? 'w--tab-active' : ''} treasury-tabs_tab-pane w-tab-pane`} role="tabpanel">
            <TreasuryTabel icon={EthIcon} value={160934} data={data} ></TreasuryTabel>
          </div>
        </Box>
      </Container>
    </div>
  );
}

export default Treasury;
