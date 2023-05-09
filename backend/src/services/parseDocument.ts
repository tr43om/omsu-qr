import { OMSU_PAYMENT_INFO } from "../constants/index.js";
import {
  formatPaymentInfo,
  extractPaymentInfo,
  extractTextFromBuffer,
} from "../utils/index.js";

//  ▶ [OMSU_PAYMENT_INFO]  - required information (goes first, order matters. see constants/.omsuPaymentInfo.ts)
//  ▶ [extractedData]      - optional information (goes second, order don't matter)
//  ▶ [content]            - the whole document

export const parseDocument = async (buffer: Buffer) => {
  const content = await extractTextFromBuffer(buffer);
  const extractedData = extractPaymentInfo(content);

  const paymentInformation = [...OMSU_PAYMENT_INFO, ...extractedData];

  const paymentInfo = formatPaymentInfo(paymentInformation);
  return { paymentInfo, content };
};
