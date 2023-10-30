export type SimpleValue = number | string | [string|number, string|number];
export type Block = {
    A?: SimpleValue[],
    B?: string,
    C?: Block[]
};
