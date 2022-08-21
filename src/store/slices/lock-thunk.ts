import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { StableReserveContract, InfinityPoolContract, VeHybridContract, LockerContract } from "../../abi";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./account-slice";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { warning, success, info, error } from "./messages-slice";
import { messages } from "../../constants/messages";
import { getGasPrice } from "../../helpers/get-gas-price";

interface ILock {
    value: string;
    months: number;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const lock = createAsyncThunk("lock/lock", async ({ value, months, provider, address, networkID }: ILock, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    let contractAddress;
    if (months == 3) {
        contractAddress = addresses.LOCKER_3_ADDRESS;
    } else if (months == 6) {
        contractAddress = addresses.LOCKER_6_ADDRESS;
    } else if (months == 12) {
        contractAddress = addresses.LOCKER_12_ADDRESS;
    } else {
        dispatch(warning({ text: "Wrong months." }));
        return;
    }
    const lockerContract = new ethers.Contract(contractAddress, LockerContract, signer);

    let stakeTx;

    try {
        const gasPrice = await getGasPrice(provider);
        const amount = ethers.utils.parseUnits(value, "ether");
        stakeTx = await lockerContract.lock(amount, { gasPrice });
        const pendingTxnType = "lock";
        dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: pendingTxnType, type: pendingTxnType }));
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

// interface IIncreaseTime {
//     months: number;
//     provider: StaticJsonRpcProvider | JsonRpcProvider;
//     address: string;
//     networkID: Networks;
// }

// export const increaseTime = createAsyncThunk("lock/increaseTime", async ({ months, provider, address, networkID }: IIncreaseTime, { dispatch }) => {
//     if (!provider) {
//         dispatch(warning({ text: messages.please_connect_wallet }));
//         return;
//     }
//     const addresses = getAddresses(networkID);
//     const signer = provider.getSigner();
//     const veHybridContract = new ethers.Contract(addresses.VEHYBRID_ADDRESS, VeHybridContract, signer);

//     let stakeTx;

//     try {
//         const gasPrice = await getGasPrice(provider);
//         stakeTx = await veHybridContract.increaseLockTime(months, { gasPrice });
//         const pendingTxnType = "increase_time";
//         dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: pendingTxnType, type: pendingTxnType }));
//         dispatch(success({ text: messages.tx_successfully_send }));
//         await stakeTx.wait();
//     } catch (err: any) {
//         if (err.code === -32603 && err.message.indexOf("ds-math-sub-underflow") >= 0) {
//             dispatch(error({ text: "Sorry. Error code: 32603. Message: ds-math-sub-underflow", error: err }));
//         } else {
//             dispatch(error({ text: messages.something_wrong, error: err }));
//         }
//         return;
//     } finally {
//         if (stakeTx) {
//             dispatch(clearPendingTxn(stakeTx.hash));
//         }
//     }
//     dispatch(getBalances({ address, networkID, provider }));
//     dispatch(info({ text: messages.your_balance_updated }));
//     return;
// });

interface IIncreaseAmount {
    value: string;
    months: number;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const increaseAmount = createAsyncThunk("lock/increaseAmount", async ({ value, months, provider, address, networkID }: IIncreaseAmount, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    let contractAddress;
    if (months == 3) {
        contractAddress = addresses.LOCKER_3_ADDRESS;
    } else if (months == 6) {
        contractAddress = addresses.LOCKER_6_ADDRESS;
    } else if (months == 12) {
        contractAddress = addresses.LOCKER_12_ADDRESS;
    } else {
        dispatch(warning({ text: "Wrong months." }));
        return;
    }
    const lockerContract = new ethers.Contract(contractAddress, LockerContract, signer);

    let stakeTx;

    try {
        const gasPrice = await getGasPrice(provider);
        const amount = ethers.utils.parseUnits(value, "ether");
        stakeTx = await lockerContract.increaseLockAmount(amount, { gasPrice });
        const pendingTxnType = "increase_amount";
        dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: pendingTxnType, type: pendingTxnType }));
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

interface IUnlock {
    months: number;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    address: string;
    networkID: Networks;
}

export const unlock = createAsyncThunk("lock/unlock", async ({ months, provider, address, networkID }: IUnlock, { dispatch }) => {
    if (!provider) {
        dispatch(warning({ text: messages.please_connect_wallet }));
        return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    let contractAddress;
    if (months == 3) {
        contractAddress = addresses.LOCKER_3_ADDRESS;
    } else if (months == 6) {
        contractAddress = addresses.LOCKER_6_ADDRESS;
    } else if (months == 12) {
        contractAddress = addresses.LOCKER_12_ADDRESS;
    } else {
        dispatch(warning({ text: "Wrong months." }));
        return;
    }
    const lockerContract = new ethers.Contract(contractAddress, LockerContract, signer);

    let stakeTx;

    try {
        const gasPrice = await getGasPrice(provider);
        stakeTx = await lockerContract.unlock({ gasPrice });
        const pendingTxnType = "unlock";
        dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: pendingTxnType, type: pendingTxnType }));
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
