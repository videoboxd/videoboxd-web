export type ElementType<T> = T extends Array<infer U> ? U : never;
