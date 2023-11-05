export type SimpleValue = number | string | boolean | [string|number|boolean, string|number|boolean];
export type Block = {
    A?: SimpleValue[],
    B?: string,
    C?: Block[]
};
