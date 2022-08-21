export interface IMetrics {
    price: string;
    treasury: string;
    totalHolders: string;
    infinityPool: string;
    stakedHistorical: IStakedHistorical[];
}

export interface IStakedHistorical {
    date: string;
    value: number;
}
