import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { StableReserveContract, InfinityPoolContract } from "../../abi";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./account-slice";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { warning, success, info, error } from "./messages-slice";
import { messages } from "../../constants/messages";
import { getGasPrice } from "../../helpers/get-gas-price";

interface IChangeApproval {
    token: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const changeApproval = createAsyncThunk("pool/changeApproval", async ({ token, provider, address, networkID }: IChangeApproval, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);

    const signer = provider.getSigner();
    const usdcContract = new ethers.Contract(addresses.USDC_ADDRESS, StableReserveContract, signer);
    const usdpContract = new ethers.Contract(addresses.USDP_ADDRESS, StableReserveContract, signer);
    const v2Contract = new ethers.Contract(addresses.V2_ADDRESS, StableReserveContract, signer);

    let approveTx;
    try {
        const gasPrice = await getGasPrice(provider);

        if (token === "usdc") {
            approveTx = await usdcContract.approve(addresses.INFINITY_POOL_ADDRESS, ethers.constants.MaxUint256, { gasPrice });
        } else if (token === "usdp") {
            approveTx = await usdpContract.approve(addresses.INFINITY_POOL_ADDRESS, ethers.constants.MaxUint256, { gasPrice });
        } else if (token === "v2_pool") {
            approveTx = await v2Contract.approve(addresses.INFINITY_POOL_ADDRESS, ethers.constants.MaxUint256, { gasPrice });
        } else if (token === "v2_locker_3") {
            approveTx = await v2Contract.approve(addresses.LOCKER_3_ADDRESS, ethers.constants.MaxUint256, { gasPrice });
        } else if (token === "v2_locker_6") {
            approveTx = await v2Contract.approve(addresses.LOCKER_6_ADDRESS, ethers.constants.MaxUint256, { gasPrice });
        } else if (token === "v2_locker_12") {
            approveTx = await v2Contract.approve(addresses.LOCKER_12_ADDRESS, ethers.constants.MaxUint256, { gasPrice });
        }

        const tokenStr = token.startsWith("v2_locker") ? "v2_lock" : token;
        const text = "Approve " + tokenStr.toUpperCase();
        const pendingTxnType = "approve_" + tokenStr;

        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
        dispatch(success({ text: messages.tx_successfully_send }));
        await approveTx.wait();
    } catch (err: any) {
        dispatch(error({ text: messages.something_wrong, error: err.message }));
        return;
    } finally {
        if (approveTx) {
            dispatch(clearPendingTxn(approveTx.hash));
        }
    }

    const usdcAllowance = await usdcContract.allowance(address, addresses.INFINITY_POOL_ADDRESS);
    const usdpAllowance = await usdpContract.allowance(address, addresses.INFINITY_POOL_ADDRESS);
    const v2_poolAllowance = await v2Contract.allowance(address, addresses.INFINITY_POOL_ADDRESS);
    const v2_locker3Allowance = await v2Contract.allowance(address, addresses.LOCKER_3_ADDRESS);
    const v2_locker6Allowance = await v2Contract.allowance(address, addresses.LOCKER_6_ADDRESS);
    const v2_locker12Allowance = await v2Contract.allowance(address, addresses.LOCKER_12_ADDRESS);

    return dispatch(
        fetchAccountSuccess({
            allowance: {
                usdc: Number(usdcAllowance),
                usdp: Number(usdpAllowance),
                v2_pool: Number(v2_poolAllowance),
                v2_locker3: Number(v2_locker3Allowance),
                v2_locker6: Number(v2_locker6Allowance),
                v2_locker12: Number(v2_locker12Allowance),
            },
        }),
    );
});

interface IBuySell {
    action: string;
    value: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const buy = createAsyncThunk("pool/buy", async ({ action, value, provider, address, networkID }: IBuySell, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const infinityPoolContract = new ethers.Contract(addresses.INFINITY_POOL_ADDRESS, InfinityPoolContract, signer);

    let stakeTx;

    try {
        const gasPrice = await getGasPrice(provider);
        const amount = ethers.utils.parseUnits(value, "mwei");
        if (action === "usdc") {
            stakeTx = await infinityPoolContract.buy(addresses.USDC_ADDRESS, amount, { gasPrice });
        } else if (action === "usdp") {
            stakeTx = await infinityPoolContract.buy(addresses.USDP_ADDRESS, amount, { gasPrice });
        } else {
            dispatch(warning({ text: "Wrong token. Fix it" }));
            return;
        }
        const pendingTxnType = "buy_" + action;
        dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: action, type: pendingTxnType }));
        dispatch(success({ text: messages.tx_successfully_send }));
        await stakeTx.wait();
    } catch (err: any) {
        if (err.code === -32603 && err.message.indexOf("ds-math-sub-underflow") >= 0) {
            dispatch(error({ text: "Sorry. Error code: 32603. Message: ds-math-sub-underflow", error: err }));
        } else {
            dispatch(error({ text: messages.something_wrong, error: err }));
        }
        return;
    } finally {
        if (stakeTx) {
            dispatch(clearPendingTxn(stakeTx.hash));
        }
    }
    dispatch(getBalances({ address, networkID, provider }));
    dispatch(info({ text: messages.your_balance_updated }));
    return;
});

export const sell = createAsyncThunk("pool/sell", async ({ action, value, provider, address, networkID }: IBuySell, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const infinityPoolContract = new ethers.Contract(addresses.INFINITY_POOL_ADDRESS, InfinityPoolContract, signer);

    let stakeTx;

    try {
        const gasPrice = await getGasPrice(provider);
        const amount = ethers.utils.parseUnits(value, "ether");
        if (action === "usdc") {
            stakeTx = await infinityPoolContract.sell(amount, { gasPrice });
        } else if (action === "usdp") {
            stakeTx = await infinityPoolContract.sell(amount, { gasPrice });
        } else {
            dispatch(warning({ text: "Wrong action. Fix it" }));
            return;
        }
        const pendingTxnType = "sell_" + action;
        dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: action, type: pendingTxnType }));
        dispatch(success({ text: messages.tx_successfully_send }));
        await stakeTx.wait();
    } catch (err: any) {
        if (err.code === -32603 && err.message.indexOf("ds-math-sub-underflow") >= 0) {
            dispatch(error({ text: "Sorry. Error code: 32603. Message: ds-math-sub-underflow", error: err }));
        } else {
            dispatch(error({ text: messages.something_wrong, error: err }));
        }
        return;
    } finally {
        if (stakeTx) {
            dispatch(clearPendingTxn(stakeTx.hash));
        }
    }
    dispatch(getBalances({ address, networkID, provider }));
    dispatch(info({ text: messages.your_balance_updated }));
    return;
});
