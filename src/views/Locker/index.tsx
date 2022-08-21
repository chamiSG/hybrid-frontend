import * as React from "react";
import "./lock.scss";
import { ethers } from "ethers";
import { useWeb3Context } from "../../hooks";
import { messages } from "../../constants/messages";
import { success, info, error } from "../../store/slices/messages-slice";
import { useDispatch, useSelector } from "react-redux";
import { getGasPrice } from "src/helpers/get-gas-price";
import { IReduxState } from "src/store/slices/state.interface";
import { changeApproval } from "src/store/slices/pool-thunk";
import { lock, increaseAmount, unlock } from "src/store/slices/lock-thunk";
import { useState, useCallback, useEffect } from "react";
import { Grid, InputAdornment, OutlinedInput, Zoom, SvgIcon, Button, Box, Card, CardContent, Typography, Link, Select, MenuItem } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { getTokenPrice, prettyTimeRemaining, trim } from "../../helpers";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import { Skeleton } from "@material-ui/lab";
import { warning } from "../../store/slices/messages-slice";
import { ReactComponent as TelescopeImg } from "../../assets/icons/telescope.svg";
import { getAddresses, Networks } from "src/constants";
import { current } from "@reduxjs/toolkit";
import classnames from "classnames";
import { LockerContract } from "src/abi";

function Locker() {
    const dispatch = useDispatch();
    const { provider, address, connect, chainID, checkWrongNetwork } = useWeb3Context();
    const addresses = getAddresses(Networks.ETH);

    const [view, setView] = useState(3); // View used for months
    const [quantity, setQuantity] = useState<string>("");
    const [risk, setRisk] = useState<string>("");

    const [locker3VeRatio, setLocker3VeRatio] = useState<string>("");
    const [locker3IsLocked, setLocker3IsLocked] = useState<boolean>(true);
    const [locker3NextTime, setLocker3NextTime] = useState<string>("");

    const [locker6VeRatio, setLocker6VeRatio] = useState<string>("");
    const [locker6IsLocked, setLocker6IsLocked] = useState<boolean>(true);
    const [locker6NextTime, setLocker6NextTime] = useState<string>("");

    const [locker12VeRatio, setLocker12VeRatio] = useState<string>("");
    const [locker12IsLocked, setLocker12IsLocked] = useState<boolean>(true);
    const [locker12NextTime, setLocker12NextTime] = useState<string>("");

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const v2Balance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.v2;
    });
    const veHybridBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.veHybrid;
    });

    const veLocker3 = useSelector<IReduxState, string>(state => {
        return state.account.lock_3 && state.account.lock_3.ve;
    });
    const locker3UnlockTime = useSelector<IReduxState, number>(state => {
        return state.account.lock_3 && state.account.lock_3.unlockTime;
    });

    const veLocker6 = useSelector<IReduxState, string>(state => {
        return state.account.lock_6 && state.account.lock_6.ve;
    });
    const locker6UnlockTime = useSelector<IReduxState, number>(state => {
        return state.account.lock_6 && state.account.lock_6.unlockTime;
    });

    const veLocker12 = useSelector<IReduxState, string>(state => {
        return state.account.lock_12 && state.account.lock_12.ve;
    });
    const locker12UnlockTime = useSelector<IReduxState, number>(state => {
        return state.account.lock_12 && state.account.lock_12.unlockTime;
    });

    const locker3V2Allowance = useSelector<IReduxState, number>(state => {
        return state.account.allowance && state.account.allowance.v2_locker3;
    });
    const locker6V2Allowance = useSelector<IReduxState, number>(state => {
        return state.account.allowance && state.account.allowance.v2_locker6;
    });
    const locker12V2Allowance = useSelector<IReduxState, number>(state => {
        return state.account.allowance && state.account.allowance.v2_locker12;
    });
    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const changeView = (newView: number) => () => {
        setView(newView);
        setQuantity("");
    };

    const setMax = () => {
        setQuantity(v2Balance);
    };

    const onSeekApproval = async () => {
        if (await checkWrongNetwork()) return;
        let token = "";
        if (view === 3) {
            token = "v2_locker_3";
        } else if (view === 6) {
            token = "v2_locker_6";
        } else if (view === 12) {
            token = "v2_locker_12";
        }
        await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
    };

    const onLock = async () => {
        if (await checkWrongNetwork()) return;
        await dispatch(lock({ address, months: view, value: String(quantity), provider, networkID: chainID }));
        setQuantity("");
    };

    const onIncreaseAmount = async () => {
        if (await checkWrongNetwork()) return;
        await dispatch(increaseAmount({ address, value: String(quantity), months: view, provider, networkID: chainID }));
        setQuantity("");
    };

    const onUnlock = async () => {
        if (await checkWrongNetwork()) return;
        await dispatch(unlock({ address, months: view, provider, networkID: chainID }));
    };

    const hasAllowance = useCallback(
        token => {
            if (token === "v2") {
                if (view === 3) return locker3V2Allowance > 0;
                else if (view === 6) return locker6V2Allowance > 0;
                else if (view === 12) return locker12V2Allowance > 0;
            }
            return 0;
        },
        [locker3V2Allowance, locker6V2Allowance, locker12V2Allowance, view],
    );

    const userAlreadyLocked = (): boolean => {
        if (view === 3) return Number(veLocker3) > 0;
        else if (view === 6) return Number(veLocker6) > 0;
        else if (view === 12) return Number(veLocker12) > 0;
        return false;
    };

    useEffect(() => {
        const getLockerData = async () => {
            const locker3Contract = new ethers.Contract(addresses.LOCKER_3_ADDRESS, LockerContract, provider);
            const locker6Contract = new ethers.Contract(addresses.LOCKER_6_ADDRESS, LockerContract, provider);
            const locker12Contract = new ethers.Contract(addresses.LOCKER_12_ADDRESS, LockerContract, provider);

            const veRatio3 = await locker3Contract.getCurrentRatio();
            const veRatio6 = await locker6Contract.getCurrentRatio();
            const veRatio12 = await locker12Contract.getCurrentRatio();
            setLocker3VeRatio(ethers.utils.formatUnits(veRatio3, "ether"));
            setLocker6VeRatio(ethers.utils.formatUnits(veRatio6, "ether"));
            setLocker12VeRatio(ethers.utils.formatUnits(veRatio12, "ether"));

            const timeData3 = await locker3Contract.getNextTime();
            const timeData6 = await locker6Contract.getNextTime();
            const timeData12 = await locker12Contract.getNextTime();

            setLocker3IsLocked(timeData3.isLocked);
            setLocker6IsLocked(timeData6.isLocked);
            setLocker12IsLocked(timeData12.isLocked);

            setLocker3NextTime(prettyTimeRemaining(timeData3.nextTimestamp));
            setLocker6NextTime(prettyTimeRemaining(timeData6.nextTimestamp));
            setLocker12NextTime(prettyTimeRemaining(timeData12.nextTimestamp));
        };
        if (address) {
            getLockerData();
        }
    }, []);

    return (
        <div className="stake-view">
            <Zoom in={true}>
                <div className="stake-card mb-3">
                    <Grid className="stake-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="stake-card-header">
                                <p className="stake-card-header-title">Locker</p>
                            </div>
                        </Grid>

                        <Grid item>
                            <div className="stake-card-metrics">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={3} md={3} lg={3}>
                                        <div className="stake-card-index">
                                            <p className="stake-card-metrics-title">Current Ratio</p>
                                            <p className="stake-card-metrics-value">
                                                {view === 3 && <>{locker3VeRatio ? <>{trim(Number(locker3VeRatio), 2)}</> : <Skeleton width="150px" />}</>}
                                                {view === 6 && <>{locker6VeRatio ? <>{trim(Number(locker6VeRatio), 2)}</> : <Skeleton width="150px" />}</>}
                                                {view === 12 && <>{locker12VeRatio ? <>{trim(Number(locker12VeRatio), 2)}</> : <Skeleton width="150px" />}</>}
                                            </p>
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} sm={3} md={3} lg={3}>
                                        <div className="stake-card-index">
                                            <p className="stake-card-metrics-title">Protocol Status</p>
                                            <p className="stake-card-metrics-value">
                                                {view === 3 && <>{locker3IsLocked ? "Locked" : "Unlocked"}</>}
                                                {view === 6 && <>{locker6IsLocked ? "Locked" : "Unlocked"}</>}
                                                {view === 12 && <>{locker12IsLocked ? "Locked" : "Unlocked"}</>}
                                            </p>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <div className="stake-card-apy">
                                            <p className="stake-card-metrics-title">
                                                {view === 3 && <>{locker3IsLocked ? "Unlocks in" : "Locks in"}</>}
                                                {view === 6 && <>{locker6IsLocked ? "Unlocks in" : "Locks in"}</>}
                                                {view === 12 && <>{locker12IsLocked ? "Unlocks in" : "Locks in"}</>}
                                            </p>
                                            <p className="stake-card-metrics-value">
                                                {view === 3 && <>{locker3NextTime ? <>{locker3NextTime}</> : <Skeleton width="150px" />}</>}
                                                {view === 6 && <>{locker6NextTime ? <>{locker6NextTime}</> : <Skeleton width="150px" />}</>}
                                                {view === 12 && <>{locker12NextTime ? <>{locker12NextTime}</> : <Skeleton width="150px" />}</>}
                                            </p>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>

                        <div className="stake-card-area">
                            {!address && (
                                <div className="stake-card-wallet-notification">
                                    <div className="stake-card-wallet-connect-btn" onClick={connect}>
                                        <p>Connect Wallet</p>
                                    </div>
                                    <p className="stake-card-wallet-desc-text">Connect your wallet to lock V2 tokens!</p>
                                </div>
                            )}
                            {address && (
                                <div>
                                    <div className="stake-card-action-area">
                                        <div className="stake-card-action-stage-btns-wrap">
                                            <div onClick={changeView(3)} className={classnames("stake-card-action-stage-btn", { active: view == 3 })}>
                                                <p>3 Months</p>
                                            </div>
                                            <div onClick={changeView(6)} className={classnames("stake-card-action-stage-btn", { active: view == 6 })}>
                                                <p>6 Months</p>
                                            </div>
                                            <div onClick={changeView(12)} className={classnames("stake-card-action-stage-btn", { active: view == 12 })}>
                                                <p>12 Months</p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="stake-card-action-row">
                                                <OutlinedInput
                                                    type="number"
                                                    placeholder="V2 Amount"
                                                    className="stake-card-action-input"
                                                    value={quantity}
                                                    onChange={e => setQuantity(e.target.value)}
                                                    labelWidth={0}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <div onClick={setMax} className="stake-card-action-input-btn">
                                                                <p>Max</p>
                                                            </div>
                                                        </InputAdornment>
                                                    }
                                                />

                                                <div className="stake-card-tab-panel">
                                                    {address && hasAllowance("v2") ? (
                                                        <>
                                                            {userAlreadyLocked() ? (
                                                                <div
                                                                    className="stake-card-tab-panel-btn"
                                                                    onClick={() => {
                                                                        if (isPendingTxn(pendingTransactions, "increase_amount")) return;
                                                                        onIncreaseAmount();
                                                                    }}
                                                                >
                                                                    <p>{txnButtonText(pendingTransactions, "increase_amount", "Increase")}</p>
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    className="stake-card-tab-panel-btn"
                                                                    onClick={() => {
                                                                        if (isPendingTxn(pendingTransactions, "lock")) return;
                                                                        onLock();
                                                                    }}
                                                                >
                                                                    <p>{txnButtonText(pendingTransactions, "lock", "Lock")}</p>
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div
                                                            className="stake-card-tab-panel-btn"
                                                            onClick={() => {
                                                                if (isPendingTxn(pendingTransactions, "approve_v2_lock")) return;
                                                                onSeekApproval();
                                                            }}
                                                        >
                                                            <p>{txnButtonText(pendingTransactions, "approve_v2_lock", "Approve")}</p>
                                                        </div>
                                                    )}
                                                    {userAlreadyLocked() && (
                                                        <div className="stake-card-tab-panel">
                                                            <div
                                                                className="stake-card-tab-panel-btn"
                                                                onClick={() => {
                                                                    if (isPendingTxn(pendingTransactions, "unlock")) return;
                                                                    onUnlock();
                                                                }}
                                                            >
                                                                <p>{txnButtonText(pendingTransactions, "unlock", "Unlock")}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="stake-card-action-help-text">
                                            {address && !hasAllowance("v2") && <p>Note: The "Approve" transaction is only needed for the first time.</p>}
                                        </div>
                                    </div>

                                    <div className="stake-user-data">
                                        <div className="data-row">
                                            <p className="data-row-name">HFI Balance</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(v2Balance), 2)} HFI</>}</p>
                                        </div>
                                        <div className="data-row">
                                            <p className="data-row-name">veHFI Balance</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(veHybridBalance), 2)} veHFI</>}</p>
                                        </div>
                                        <div className="data-row">
                                            <p className="data-row-name">veHFI Obtained</p>
                                            <p className="data-row-value">
                                                {isAppLoading ? (
                                                    <Skeleton width="80px" />
                                                ) : (
                                                    <>
                                                        {view === 3 && trim(Number(veLocker3), 2)}
                                                        {view === 6 && trim(Number(veLocker6), 2)}
                                                        {view === 12 && trim(Number(veLocker12), 2)}
                                                        veHFI
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                        {userAlreadyLocked() && (
                                            <div className="data-row">
                                                <p className="data-row-name">Unlocks in</p>
                                                <p className="data-row-value">
                                                    {isAppLoading ? (
                                                        <Skeleton width="80px" />
                                                    ) : (
                                                        <>
                                                            {view === 3 && prettyTimeRemaining(locker3UnlockTime)}
                                                            {view === 6 && prettyTimeRemaining(locker6UnlockTime)}
                                                            {view === 12 && prettyTimeRemaining(locker12UnlockTime)}
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Grid>
                </div>
            </Zoom>
        </div>
    );
}
export default Locker;
