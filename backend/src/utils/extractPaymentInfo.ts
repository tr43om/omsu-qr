import { PatternObject, PaymentInfo } from "../types/index.js";
import { monthNameToNumber } from "./monthNameToNumber.js";
import { createPrefixedRegex } from "./createPrefixedRegex.js";

export const extractPaymentInfo = (content: string): PaymentInfo[] => {
  const regexPatterns = [
    // ⬇️ ПОЛУЧАТЕЛЬ СРЕДСТВ
    createPrefixedRegex("Name", "Получатель средств", ".*"),
    // ⬇️ КАЗНАЧЕЙСКИЙ СЧЕТ
    {
      name: "PersonalAcc",
      pattern: /Казначейский сч[ёе]т.*\s*\:\s*(\d{20})/i,
    },
    // ⬇️ БАНК ПОЛУЧАТЕЛЯ
    createPrefixedRegex("BankName", "Банк получателя", ".*"),
    // ⬇️ БИК
    createPrefixedRegex("BIC", "БИК", ".*"),
    // ⬇️ КДИНЫЙ КАЗНАЧЕЙСКИЙ СЧЕТ
    {
      name: "CorrespAcc",
      pattern: /Единый казначейский сч[ёе]т.*\s*\:\s*(\d{20})/i,
    },
    // ⬇️ КПП
    createPrefixedRegex("KPP", "КПП", ".*"),
    // ⬇️ ИНН
    createPrefixedRegex("PayerINN", "ИНН", ".*"),
    // ⬇️ КБК
    // createPrefixedRegex("CBC", "КБК", ".*"),
    // ⬇️ ДАТА ЗАКЛЮЧЕНИЯ ДОГОВОРА
    {
      name: "DocDate",
      pattern: /«(\d{1,2})»\s(\p{L}+)\s(\d{4})/u,
      process: (match: RegExpMatchArray) => {
        if (!match) return "";
        const day = match[1];
        const month = monthNameToNumber(match[2]);
        const year = match[3];
        return `${day}.${month.toString().padStart(2, "0")}.${year}`;
      },
    },
    // ⬇️ НОМЕР ДОГОВОРА
    { name: "Contract", pattern: /(?<=договор)[\s\S]*№\s*(\d+)/i },
    // ⬇️ СУММА ОПЛАТЫ
    {
      name: "Sum",
      pattern: /(?<=составляет)\s+(\d+(\.\d{2})?)/i,
    },

    createPrefixedRegex("LastName", "Фамилия", ".*"),
    createPrefixedRegex("FirstName", "Имя", ".*"),
    createPrefixedRegex("PayerAddress", "Адрес", ".*"),
    createPrefixedRegex("PensAcc", "СНИЛС", ".*"),
    createPrefixedRegex("PayerIdNum", "Номер", ".*"),
    createPrefixedRegex("BirthDate", "Дата рождения", ".*"),
    createPrefixedRegex("Phone", "Телефон", ".*"),
  ];

  return regexPatterns.map(({ name, pattern, process }: PatternObject) => {
    const match = content.match(
      pattern instanceof RegExp ? pattern : new RegExp(pattern)
    );
    if (!match) return { name, value: "" };
    const value = process ? process(match) : match ? match[1] : "";
    return { name, value };
  });
};
