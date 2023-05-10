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

  // Initially, we thought to include OMSU payment information as constants, but data can change, so we decided to retrieve all the neccessary data with regExp
  // const paymentInformation = [...OMSU_PAYMENT_INFO, ...extractedData];
  const paymentInformation = [...extractedData];

  const paymentInfo = formatPaymentInfo(paymentInformation);
  return { paymentInfo, content };
};
