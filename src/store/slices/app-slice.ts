import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { prettyTimeRemaining, setAll } from "../../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider } from "@ethersproject/providers";
import { RootState } from "../store";
import { InfinityPoolContract, V2Contract, VeHybridContract } from "src/abi";

interface ILoadAppDetails {
    networkID: number;
    provider: JsonRpcProvider;
}

export const loadAppDetails = createAsyncThunk(
    "app/loadAppDetails",
    //@ts-ignore
    async ({ networkID, provider }: ILoadAppDetails) => {
        const addresses = getAddresses(networkID);
        const v2Contract = new ethers.Contract(addresses.V2_ADDRESS, V2Contract, provider);
        const infinityPoolContract = new ethers.Contract(addresses.INFINITY_POOL_ADDRESS, InfinityPoolContract, provider);
        const price = await infinityPoolContract.getPrice();
        const totalValue = await infinityPoolContract.getTotalValue();
        const totalSupply = await v2Contract.totalSupply();

        return {
            price: ethers.utils.formatUnits(price, "mwei"),
            totalValue: ethers.utils.formatUnits(totalValue, "mwei"),
            totalSupply: ethers.utils.formatUnits(totalSupply, "ether"),
        };
    },
);

const initialState = {
    loading: false,
};

export interface IAppSlice {
    loading: boolean;
    price: string;
    totalValue: string;
    totalSupply: string;
    veRatio: string;
    isLocked: boolean;
    nextTime: string;
    networkID: number;
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        fetchAppSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAppDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(loadAppDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAppDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
