import { ZodError } from "zod";
import { FormErrors } from "./types/FormState";

export const convertZodErrors = <T>(error: ZodError<T>): FormErrors<T> => {
  const fieldErrors: FormErrors<T> = {};

  for (const issue of error.errors) {
    const field = issue.path[0];
    if (typeof field === "string") {
      fieldErrors[field as keyof T] = issue.message as FormErrors<T>[keyof T];
    }
  }
  return fieldErrors;
};
