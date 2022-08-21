import * as React from "react";
import "./sell.scss";
import { ethers } from "ethers";
import { useWeb3Context } from "../../hooks";
import { messages } from "../../constants/messages";
import { success, info, error } from "../../store/slices/messages-slice";
import { useDispatch, useSelector } from "react-redux";
import { getGasPrice } from "src/helpers/get-gas-price";
import { IReduxState } from "src/store/slices/state.interface";
import { changeApproval, sell } from "src/store/slices/pool-thunk";
import { useState, useCallback, useEffect } from "react";
import { Grid, InputAdornment, OutlinedInput, Zoom, SvgIcon, Button, Box, Card, CardContent, Typography, Link } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { getTokenPrice, trim } from "../../helpers";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import { Skeleton } from "@material-ui/lab";
import { warning } from "../../store/slices/messages-slice";
import { ReactComponent as TelescopeImg } from "../../assets/icons/telescope.svg";
import { getAddresses, Networks } from "src/constants";
import { current } from "@reduxjs/toolkit";
import classnames from "classnames";

function Sell() {
    const dispatch = useDispatch();
    const { provider, address, connect, chainID, checkWrongNetwork } = useWeb3Context();
    const addresses = getAddresses(Networks.ETH);

    const [view, setView] = useState(0);
    const [quantity, setQuantity] = useState<string>("");

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const totalValue = useSelector<IReduxState, string>(state => {
        return state.app && state.app.totalValue;
    });
    const totalSupply = useSelector<IReduxState, string>(state => {
        return state.app && state.app.totalSupply;
    });
    const price = useSelector<IReduxState, string>(state => {
        return state.app && state.app.price;
    });
    const usdcBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.usdc;
    });
    const usdpBalance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.usdp;
    });
    const v2Balance = useSelector<IReduxState, string>(state => {
        return state.account.balances && state.account.balances.v2;
    });

    const v2Allowance = useSelector<IReduxState, number>(state => {
        return state.account.allowance && state.account.allowance.v2_pool;
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

    const onSeekApproval = async (token: string) => {
        if (await checkWrongNetwork()) return;

        await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
    };

    const onSell = async (action: string) => {
        if (await checkWrongNetwork()) return;
        await dispatch(sell({ address, action, value: String(quantity), provider, networkID: chainID }));
        setQuantity("");
    };

    const hasAllowance = useCallback(
        token => {
            if (token === "v2_pool") return v2Allowance > 0;
            return 0;
        },
        [v2Allowance],
    );

    return (
        <div className="stake-view">
            <Zoom in={true}>
                <div className="stake-card mb-3">
                    <Grid className="stake-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="stake-card-header">
                                <p className="stake-card-header-title">Sell</p>
                            </div>
                        </Grid>

                        <Grid item>
                            <div className="stake-card-metrics">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                        <div className="stake-card-apy">
                                            <p className="stake-card-metrics-title">Total Value</p>
                                            <p className="stake-card-metrics-value">
                                                {totalValue ? <>$ {new Intl.NumberFormat("en-US").format(Number(trim(Number(totalValue), 0)))}</> : <Skeleton width="150px" />}
                                            </p>
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                        <div className="stake-card-apy">
                                            <p className="stake-card-metrics-title">Total Supply</p>
                                            <p className="stake-card-metrics-value">
                                                {totalSupply ? <>{new Intl.NumberFormat("en-US").format(Number(trim(Number(totalSupply), 0)))}</> : <Skeleton width="150px" />}
                                            </p>
                                        </div>
                                    </Grid>

                                    <Grid item xs={12} sm={4} md={4} lg={4}>
                                        <div className="stake-card-index">
                                            <p className="stake-card-metrics-title">Price</p>
                                            <p className="stake-card-metrics-value">{price ? <>$ {trim(Number(price), 2)}</> : <Skeleton width="150px" />}</p>
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
                                    <p className="stake-card-wallet-desc-text">Connect your wallet to sell V2 tokens!</p>
                                </div>
                            )}
                            {address && (
                                <div>
                                    <div className="stake-card-action-area">
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
                                                {address && hasAllowance("v2_pool") ? (
                                                    <div
                                                        className="stake-card-tab-panel-btn"
                                                        onClick={() => {
                                                            if (isPendingTxn(pendingTransactions, "sell_usdc")) return;
                                                            onSell("usdc");
                                                        }}
                                                    >
                                                        <p>{txnButtonText(pendingTransactions, "sell_usdc", "Sell")}</p>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="stake-card-tab-panel-btn"
                                                        onClick={() => {
                                                            if (isPendingTxn(pendingTransactions, "approve_v2_pool")) return;
                                                            onSeekApproval("v2_pool");
                                                        }}
                                                    >
                                                        <p>{txnButtonText(pendingTransactions, "approve_v2_pool", "Approve")}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="stake-card-action-help-text">
                                            {address && !hasAllowance("v2") && <p>Note: The "Approve" transaction is only needed for the first time.</p>}
                                        </div>
                                    </div>

                                    <div className="stake-user-data">
                                        {quantity && (
                                            <div className="data-row">
                                                <p className="data-row-name">Expected USDC</p>
                                                <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(quantity) * Number(price), 2)} USDC</>}</p>
                                            </div>
                                        )}
                                        <div className="data-row">
                                            <p className="data-row-name">V2 Balance</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(v2Balance), 2)} V2</>}</p>
                                        </div>
                                        <div className="data-row">
                                            <p className="data-row-name">USDC Balance</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(usdcBalance), 2)} USDC</>}</p>
                                        </div>
                                        <div className="data-row">
                                            <p className="data-row-name">USD+ Balance</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(usdpBalance), 2)} USD+</>}</p>
                                        </div>
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
export default Sell;
