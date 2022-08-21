import { prettifySeconds } from "./prettify-seconds";
import { secondsUntilTimestamp } from "./seconds-until-block";

export const prettyTimeRemaining = (finalTime: number) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const seconds = secondsUntilTimestamp(currentTime, finalTime);
    if (seconds < 0) {
        return "-";
    }
    return prettifySeconds(seconds);
};
