export type IHandleChangeFn<T> = (queries: Partial<T>) => void;
export type HandleChange<T> = (field: keyof T) => (value: any) => void;