import { PaymentInfo } from "../types";

export const formatPaymentInfo = (paymentInformation: PaymentInfo[]) => {
  const formatName = "ST00012";
  return (
    `${formatName}|` +
    paymentInformation.map(({ name, value }) => `${name}=${value}`).join("|")
  );
};
