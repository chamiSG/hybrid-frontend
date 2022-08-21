import HyFiImg from "../assets/tokens/HYFI.png";
import USDCImg from "../assets/tokens/USDC.svg";
import DAIImg from "../assets/tokens/DAI.svg";

function toUrl(tokenPath: string): string {
    const host = window.location.origin;
    return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
    if (name === "v2") {
        return toUrl(HyFiImg);
    } else if (name === "ve") {
        return toUrl(HyFiImg);
    }

    throw Error(`Token url doesn't support: ${name}`);
}
