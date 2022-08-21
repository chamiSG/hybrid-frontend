export const setAll = (state: any, properties: any) => {
    const props = Object.keys(properties);
    props.forEach(key => {
        if (typeof properties[key] === "object") {
            const nestedProps = Object.keys(properties[key]);
            nestedProps.forEach(nestedKey => {
                state[key][nestedKey] = properties[key][nestedKey];
            });
        } else {
            state[key] = properties[key];
        }
    });
};
