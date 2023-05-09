type PaymentInfo = {
  name: string;
  value: string;
};

type PatternObject = {
  name: string;
  pattern: RegExp | string;
  process?: (match: RegExpMatchArray) => string;
};

export type { PaymentInfo, PatternObject };
