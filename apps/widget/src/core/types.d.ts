// eslint-disable-next-line
export type TODO = any;

export type AgientFunctions<TArgs = TODO, TReturn = TODO> = Record<string, (...args: TArgs[]) => TReturn>;

type AgientInstance<TFunctions extends AgientFunctions = TODO> = {
  on: <TKey extends keyof TFunctions>(event: string, fn: TFunctions[TKey]) => void;
};

type AgientProvider = {
  chat: (message: string) => void;
  on: (event: string, fn: TODO) => void;
  registeredInstanceListeners: Map<string, AgientFunctions[number]>;
};

export type { AgientInstance, AgientProvider };
