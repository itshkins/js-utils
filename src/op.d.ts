export type OpState = {
    name: string;
    isDefault?: boolean;
    isPending?: boolean;
    isOk?: boolean;
    isError?: boolean;
    isResolved?: boolean;
};
export declare const OpStates: Record<string, OpState>;
export declare const findOpStateByName: (name: string, defaultOp?: OpState) => OpState;
export declare const runOp: <TResult>(state: {
    value: OpState;
}, callback: () => Promise<TResult>) => Promise<TResult | undefined>;
