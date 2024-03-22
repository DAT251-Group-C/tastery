// eslint-disable-next-line
export type TODO = any;

export type AgientFunctions<TArgs = TODO, TReturn = TODO> = Record<string, (...args: TArgs[]) => TReturn>;

export type AgientInstance<TFunctions extends AgientFunctions = TODO> = {
  on: <TKey extends keyof TFunctions>(event: string, fn: TFunctions[TKey]) => void;
};

export type AgientProvider = {
  chat: (message: string) => void;
  on: (event: string, fn: TODO) => void;
};
