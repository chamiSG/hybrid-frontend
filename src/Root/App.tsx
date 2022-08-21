import { useEffect, useState, useCallback } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAddress, useWeb3Context } from "../hooks";
import { loadAppDetails } from "../store/slices/app-slice";
import { loadAccountDetails } from "../store/slices/account-slice";
import { IReduxState } from "../store/slices/state.interface";
import Loading from "../components/Loader";
import ViewBase from "../components/ViewBase";
import { Dashboard, Invest, MyInvestment, Treasury, Buy, Sell, Locker, NotFound } from "../views";
import "./style.scss";
import Home from "src/views/Home";

function App() {
    const dispatch = useDispatch();

    const { connect, provider, hasCachedProvider, chainID, connected } = useWeb3Context();
    const address = useAddress();

    const [walletChecked, setWalletChecked] = useState(false);

    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const isAppLoaded = true;

    async function loadDetails(whichDetails: string) {
        let loadProvider = provider;

        if (whichDetails === "app") {
            loadApp(loadProvider);
        }

        if (whichDetails === "account" && address && connected) {
            loadAccount(loadProvider);
            if (isAppLoaded) return;

            loadApp(loadProvider);
        }
    }

    const loadApp = useCallback(
        loadProvider => {
            dispatch(loadAppDetails({ networkID: chainID, provider: loadProvider }));
        },
        [connected],
    );

    const loadAccount = useCallback(
        loadProvider => {
            dispatch(loadAccountDetails({ networkID: chainID, address, provider: loadProvider }));
        },
        [connected],
    );

    useEffect(() => {
        if (hasCachedProvider()) {
            connect().then(() => {
                setWalletChecked(true);
            });
        } else {
            setWalletChecked(true);
        }
    }, []);

    useEffect(() => {
        if (walletChecked) {
            loadDetails("app");
            loadDetails("account");
        }
    }, [walletChecked]);

    useEffect(() => {
        if (connected) {
            loadDetails("app");
            loadDetails("account");
        }
    }, [connected]);

    if (isAppLoading) return <Loading />;

    return (
        <ViewBase>
            <Switch>
                <Route exact path="/">
                    <Redirect to="/dashboard" />
                </Route>
                <Route path="/dashboard">
                    <Dashboard />
                </Route>
                <Route path="/invest">
                    <Invest />
                </Route>
                <Route path="/my-investment">
                    <MyInvestment />
                </Route>
                <Route path="/treasury">
                    <Treasury />
                </Route>
                <Route path="/home">
                    <Home />
                </Route>
                <Route path="/buy">
                    <Buy />
                </Route>

                <Route path="/sell">
                    <Sell />
                </Route>

                <Route path="/locker">
                    <Locker />
                </Route>

                <Route component={NotFound} />
            </Switch>
        </ViewBase>
    );
}

export default App;
