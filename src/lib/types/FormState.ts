export type FormErrors<T> = Partial<Record<keyof T, string>> & {
  root?: string;
};
export type FormState<T> = {
  successMessage?: string;
  data?: T;
  errors?: FormErrors<T>;
};
