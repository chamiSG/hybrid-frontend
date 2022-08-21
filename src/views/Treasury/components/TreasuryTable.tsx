import { useState } from "react";
import { 
  Container, 
  Box,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { LogoIcon, BinanceIcon, AvaxIcon, EthIcon, PolyIcon } from "src/helpers/icons"


function TreasuryTable(props: any) {

  const { icon, value, data } = props;

  const isEven = (i: number) => {
    return i % 2 != 0 ? true : false;
  }
  const isLast = (length: number, i: number) => {
    return length == i ? true : false;
  }

  return (
    <div className="treasury-table">
      <Box
        display={'flex'}
        justifyContent={"flex-start"}
        flexDirection={"column"}
        alignItems={"center"}
        gridRowGap={"1rem"}
        gridColumnGap={"2rem"}
      >
        <img loading="lazy" width="65" src={icon} alt=""></img>
        <div className="metric">${value}</div>
        
        <div className="treasury_chain-table-info">
          <div className="w-layout-grid treasury-table">
            <div className="table-row header">
              <div>Asset</div>
              <div className="text-align-center">Category</div>
              <div className="text-align-center">Value</div>
              <div className="text-align-center">APY</div>
            </div>
            {data.map((_data: any, i: any) => (
              <div className={`table-row ${isEven(i) ? "alt" : ""} ${isLast(_data.length, i) ? "last" : ""}`} >
                <div>{_data.asset}</div>
                <div className="text-align-center">{_data.category}</div>
                <div className="text-align-center">${_data.value}</div>
                <div className="text-align-center">{_data.apy}%</div>
              </div>
            ))}
          </div>
        </div>
      </Box>
    </div>
  );
}

export default TreasuryTable;
