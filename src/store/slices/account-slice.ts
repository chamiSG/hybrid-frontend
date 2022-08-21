import { BigNumber, ethers } from "ethers";
import { getAddresses } from "../../constants";
import { LockerContract, StableReserveContract, V2Contract, VeHybridContract } from "../../abi/";
import { setAll } from "../../helpers";

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import React from "react";
import { RootState } from "../store";

interface IGetBalances {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IAccountBalances {
    balances: {
        usdc: string;
        usdp: string;
        v2: string;
        veHybrid: string;
    };
    lock_3: {
        ve: string;
        unlockTime: number;
    };
    lock_6: {
        ve: string;
        unlockTime: number;
    };
    lock_12: {
        ve: string;
        unlockTime: number;
    };
}

export const getBalances = createAsyncThunk("account/getBalances", async ({ address, networkID, provider }: IGetBalances): Promise<IAccountBalances> => {
    const addresses = getAddresses(networkID);

    const usdcContract = new ethers.Contract(addresses.USDC_ADDRESS, StableReserveContract, provider);
    const usdcBalance = await usdcContract.balanceOf(address);

    const usdpContract = new ethers.Contract(addresses.USDP_ADDRESS, StableReserveContract, provider);
    const usdpBalance = await usdpContract.balanceOf(address);

    const v2Contract = new ethers.Contract(addresses.V2_ADDRESS, StableReserveContract, provider);
    const v2Balance = await v2Contract.balanceOf(address);

    const veContract = new ethers.Contract(addresses.VEHYBRID_ADDRESS, VeHybridContract, provider);
    const veHybridBalance = await veContract.balanceOf(address);

    const locker3Contract = new ethers.Contract(addresses.LOCKER_3_ADDRESS, LockerContract, provider);
    const locker6Contract = new ethers.Contract(addresses.LOCKER_6_ADDRESS, LockerContract, provider);
    const locker12Contract = new ethers.Contract(addresses.LOCKER_12_ADDRESS, LockerContract, provider);

    let lockedData = await locker3Contract.userLock(address);
    const locker3Ve = lockedData.amount;
    const locker3UnlockTime = Number(lockedData.unlockTime);

    lockedData = await locker6Contract.userLock(address);
    const locker6Ve = lockedData.amount;
    const locker6UnlockTime = Number(lockedData.unlockTime);

    lockedData = await locker12Contract.userLock(address);
    const locker12Ve = lockedData.amount;
    const locker12UnlockTime = Number(lockedData.unlockTime);

    return {
        balances: {
            usdc: ethers.utils.formatUnits(usdcBalance, "mwei"),
            usdp: ethers.utils.formatUnits(usdpBalance, "mwei"),
            v2: ethers.utils.formatUnits(v2Balance, "ether"),
            veHybrid: ethers.utils.formatUnits(veHybridBalance, "ether"),
        },
        lock_3: {
            ve: ethers.utils.formatUnits(locker3Ve, "ether"),
            unlockTime: locker3UnlockTime,
        },
        lock_6: {
            ve: ethers.utils.formatUnits(locker6Ve, "ether"),
            unlockTime: locker6UnlockTime,
        },
        lock_12: {
            ve: ethers.utils.formatUnits(locker12Ve, "ether"),
            unlockTime: locker12UnlockTime,
        },
    };
});

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IUserAccountDetails {
    balances: {
        usdc: string;
        usdp: string;
        v2: string;
        veHybrid: string;
    };
    lock_3: {
        ve: string;
        unlockTime: number;
    };
    lock_6: {
        ve: string;
        unlockTime: number;
    };
    lock_12: {
        ve: string;
        unlockTime: number;
    };
    allowance: {
        usdc: Number;
        usdp: Number;
        v2_pool: Number;
        v2_locker3: Number;
        v2_locker6: Number;
        v2_locker12: Number;
    };
}

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }: ILoadAccountDetails): Promise<IUserAccountDetails> => {
    let usdcBalance = 0;
    let usdpBalance = 0;
    let v2Balance = 0;
    let veHybridBalance = 0;

    let locker3VeBalance = 0;
    let locker3UnlockTime = 0;

    let locker6VeBalance = 0;
    let locker6UnlockTime = 0;

    let locker12VeBalance = 0;
    let locker12UnlockTime = 0;

    let usdcAllowance = 0;
    let usdpAllowance = 0;
    let v2_poolAllowance = 0;
    let v2_locker3Allowance = 0;
    let v2_locker6Allowance = 0;
    let v2_locker12Allowance = 0;

    let lockedData;

    const addresses = getAddresses(networkID);

    if (addresses.USDC_ADDRESS) {
        const usdcContract = new ethers.Contract(addresses.USDC_ADDRESS, StableReserveContract, provider);
        usdcBalance = await usdcContract.balanceOf(address);
        usdcAllowance = await usdcContract.allowance(address, addresses.INFINITY_POOL_ADDRESS);
    }

    if (addresses.USDP_ADDRESS) {
        const usdpContract = new ethers.Contract(addresses.USDP_ADDRESS, StableReserveContract, provider);
        usdpBalance = await usdpContract.balanceOf(address);
        usdpAllowance = await usdpContract.allowance(address, addresses.INFINITY_POOL_ADDRESS);
    }

    if (addresses.V2_ADDRESS) {
        const v2Contract = new ethers.Contract(addresses.V2_ADDRESS, StableReserveContract, provider);
        v2Balance = await v2Contract.balanceOf(address);
        v2_poolAllowance = await v2Contract.allowance(address, addresses.INFINITY_POOL_ADDRESS);
        v2_locker3Allowance = await v2Contract.allowance(address, addresses.LOCKER_3_ADDRESS);
        v2_locker6Allowance = await v2Contract.allowance(address, addresses.LOCKER_6_ADDRESS);
        v2_locker12Allowance = await v2Contract.allowance(address, addresses.LOCKER_12_ADDRESS);
    }

    if (addresses.VEHYBRID_ADDRESS) {
        const veContract = new ethers.Contract(addresses.VEHYBRID_ADDRESS, VeHybridContract, provider);
        veHybridBalance = await veContract.balanceOf(address);
    }

    if (addresses.LOCKER_3_ADDRESS) {
        const locker3Contract = new ethers.Contract(addresses.LOCKER_3_ADDRESS, LockerContract, provider);
        lockedData = await locker3Contract.userLock(address);
        locker3VeBalance = lockedData.amount;
        locker3UnlockTime = Number(lockedData.unlockTime);
    }

    if (addresses.LOCKER_6_ADDRESS) {
        const locker6Contract = new ethers.Contract(addresses.LOCKER_6_ADDRESS, LockerContract, provider);
        lockedData = await locker6Contract.userLock(address);
        locker6VeBalance = lockedData.amount;
        locker6UnlockTime = Number(lockedData.unlockTime);
    }

    if (addresses.LOCKER_12_ADDRESS) {
        const locker12Contract = new ethers.Contract(addresses.LOCKER_12_ADDRESS, LockerContract, provider);
        lockedData = await locker12Contract.userLock(address);
        locker12VeBalance = lockedData.amount;
        locker12UnlockTime = Number(lockedData.unlockTime);
    }

    return {
        balances: {
            usdc: ethers.utils.formatUnits(usdcBalance, "mwei"),
            usdp: ethers.utils.formatUnits(usdpBalance, "mwei"),
            v2: ethers.utils.formatUnits(v2Balance, "ether"),
            veHybrid: ethers.utils.formatUnits(veHybridBalance, "ether"),
        },
        lock_3: {
            ve: ethers.utils.formatUnits(locker3VeBalance, "ether"),
            unlockTime: locker3UnlockTime,
        },
        lock_6: {
            ve: ethers.utils.formatUnits(locker6VeBalance, "ether"),
            unlockTime: locker6UnlockTime,
        },
        lock_12: {
            ve: ethers.utils.formatUnits(locker12VeBalance, "ether"),
            unlockTime: locker12UnlockTime,
        },
        allowance: {
            usdc: Number(usdcAllowance),
            usdp: Number(usdpAllowance),
            v2_pool: Number(v2_poolAllowance),
            v2_locker3: Number(v2_locker3Allowance),
            v2_locker6: Number(v2_locker6Allowance),
            v2_locker12: Number(v2_locker12Allowance),
        },
    };
});

export interface IAccountSlice {
    balances: {
        usdc: string;
        usdp: string;
        v2: string;
        veHybrid: string;
    };
    lock_3: {
        ve: string;
        unlockTime: number;
    };
    lock_6: {
        ve: string;
        unlockTime: number;
    };
    lock_12: {
        ve: string;
        unlockTime: number;
    };
    loading: boolean;
    allowance: {
        usdc: number;
        usdp: number;
        v2_pool: number;
        v2_locker3: number;
        v2_locker6: number;
        v2_locker12: number;
    };
}

const initialState: IAccountSlice = {
    loading: true,
    balances: { usdc: "", usdp: "", v2: "", veHybrid: "" },
    lock_3: { ve: "", unlockTime: 0 },
    lock_6: { ve: "", unlockTime: 0 },
    lock_12: { ve: "", unlockTime: 0 },
    allowance: { usdc: 0, usdp: 0, v2_pool: 0, v2_locker3: 0, v2_locker6: 0, v2_locker12: 0 },
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        fetchAccountSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadAccountDetails.pending, state => {
                state.loading = true;
            })
            .addCase(loadAccountDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadAccountDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            })
            .addCase(getBalances.pending, state => {
                state.loading = true;
            })
            .addCase(getBalances.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(getBalances.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
