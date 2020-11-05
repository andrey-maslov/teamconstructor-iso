export const loadState = (name: string) => {
    try {
        const serializedState = sessionStorage.getItem(name);

        if (serializedState === null) {
            return undefined;
        }
        // console.log(JSON.parse(serializedState));
        return JSON.parse(serializedState);
    } catch (error) {
        return undefined;
    }
};

export const saveState = (name:string, state: any) => {
    try {
        const serializedState = JSON.stringify(state);
        sessionStorage.setItem(name, serializedState);
    } catch (error) {
        // Ignore write errors.
    }
};