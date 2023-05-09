// These are required and order is important for the correct work of the payment:
// [1] Name
// [2] PersonalAcc
// [3] BankName
// [4] BIC
// [5] CorrespAcc
// These are optional: KPP, PayeeINN, CBC

export const OMSU_PAYMENT_INFO = [
  {
    name: "Name",
    value: "УФК по Омской области", //УФК по Омской области (ФГАОУ ВО «ОмГУ им. Ф.М. Достоевского» л/сч 30526Я15020)
  },
  { name: "PersonalAcc", value: "03214643000000015200" },
  {
    name: "BankName",
    value: "УФК по Омской области",
  },
  { name: "BIC", value: "015209001" },
  { name: "CorrespAcc", value: "40102810245370000044" },
  { name: "KPP", value: "550101001" },
  { name: "PayeeINN", value: "5501003925" },
  { name: "CBC", value: "00000000000000000130" },
];
