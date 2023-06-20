type PaymentInfo = {
  name: string;
  value: string;
};

type PatternObject = {
  name: string;
  pattern: RegExp | string;
  process?: (match: RegExpMatchArray) => string;
};

export enum DocumentTypes {
  pdf = "application/pdf",
  doc = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  docx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

export type { PaymentInfo, PatternObject };
