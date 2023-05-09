import { MONTH_NAMES } from "../constants/index.js";

export const monthNameToNumber = (monthName: string) => {
  return MONTH_NAMES.get(monthName) || "";
};
