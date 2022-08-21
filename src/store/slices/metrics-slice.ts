import { TOKEN_NAME } from "../../constants";
import { setAll, apiGetRequest, BASE_URL } from "../../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IMetrics } from "../types";

export const loadMetricsDetails = createAsyncThunk(
    "app/loadMetricsDetails",
    //@ts-ignore
    async () => {
        const getProtocolMetrics = await apiGetRequest(`${BASE_URL}/protocols/get_protocol_metrics?token=${TOKEN_NAME}`);
        
        console.log(getProtocolMetrics)

        const metrics: IMetrics = {
            price: getProtocolMetrics.data[0].price_usd,
            treasury: Number(getProtocolMetrics.data[0].treasury_value.toFixed(2)).toLocaleString(),
            totalHolders: Number(getProtocolMetrics.data[0].total_holders).toLocaleString(),
            infinityPool: Number(getProtocolMetrics.data[0].infinity_pool_value.toFixed(2)).toLocaleString(),
            stakedHistorical: getProtocolMetrics.data[0].staked_historical
        }
        return {
            metrics: metrics,
        };
    },
);

const initialState = {
    loading: false,
    metrics: {}
};

export interface IMetricsSlice {
    loading: boolean;
    metrics: IMetrics;
}

const metricsSlice = createSlice({
    name: "metrics",
    initialState,
    reducers: {
        fetchAppSuccess(state, action) {
            setAll(state, action.payload);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadMetricsDetails.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(loadMetricsDetails.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadMetricsDetails.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

const baseInfo = (state: RootState) => state.metrics;

export default metricsSlice.reducer;

export const { fetchAppSuccess } = metricsSlice.actions;

export const getMetricsState = createSelector(baseInfo, metrics => metrics);
