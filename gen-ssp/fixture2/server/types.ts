export interface RequestFn {
  (id: number, method: string, message: string): void;
}
