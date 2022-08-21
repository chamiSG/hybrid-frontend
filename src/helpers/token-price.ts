import axios from "axios";
import { ethers } from "ethers";
import { getAddresses, Networks } from "src/constants";
import { useWeb3Context } from "src/hooks";

const cache: { [key: string]: number } = {};

export const loadTokenPrices = async () => {
    // coingecko api
    // cache["USDC"] = data["usd-coin"].usd;
};

export const getTokenPrice = (symbol: string): number => {
    return Number(cache[symbol]);
};
