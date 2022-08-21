import { IPendingTxn } from "./pending-txns-slice";
import { IAccountSlice } from "./account-slice";
import { IAppSlice } from "./app-slice";
import { MessagesState } from "./messages-slice";
import { IMetricsSlice } from "./metrics-slice";

export interface IReduxState {
    metrics: IMetricsSlice;
    pendingTransactions: IPendingTxn[];
    account: IAccountSlice;
    app: IAppSlice;
    messages: MessagesState;
}
