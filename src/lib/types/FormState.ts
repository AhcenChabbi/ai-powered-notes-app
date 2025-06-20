export type StringMap = {
  [key: string]: string;
};
export type FormState<T> = {
  successMessage?: string;
  data?: T;
  errors?: StringMap;
};
