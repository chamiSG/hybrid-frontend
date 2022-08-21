import axios from "axios";

export const BASE_URL = 'https://api.multifarm.fi/jay_flamingo_random_6ix_vegas/auth';
export const AUTH_TOKEN = 'fNGylx4LaV1a6M8TvXmdmtfbi4oyPmab';

export const apiGetRequest = async (url: string) => {
    const { data } = await axios.get(url, {
        headers: {
            'multifarm-api-token': `${AUTH_TOKEN}`,
            'accept': 'application/json'
        }
    });
    return data;
};

export const apiPostRequest = async (url: string, postData: any) => {
    const { data } = await axios.post(url, postData, {
        headers: {
            'multifarm-api-token': `${AUTH_TOKEN}`,
            'accept': 'application/json'
        }
    });
    return data;
};
