import { ZodError } from "zod";
import { StringMap } from "./types/FormState";

export const convertZodErrors = (error: ZodError): StringMap => {
  return error.errors.reduce((acc: StringMap, issue) => {
    acc[issue.path[0]] = issue.message;
    return acc;
  }, {});
};
