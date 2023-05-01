const mammoth = require("mammoth");
const { JSDOM } = require("jsdom");

async function parseDocument(buffer) {
  const data = await mammoth.convertToHtml({ buffer });
  const dom = new JSDOM(data.value);
  const htmlDoc = dom.window.document;
  const body = htmlDoc.querySelector("body").innerHTML;
  const table = htmlDoc.querySelector("table");
  const paymentInfo = table
    ?.querySelectorAll("tr")[1]
    .querySelectorAll("td")[0].innerHTML;

  const requiredPaymentFields = [
    "Name",
    "PersonalAcc",
    "BankName",
    "BIC",
    "CorrespAcc",
    "PayeeINN",
    "KPP",
    "Contract",
  ];

  const requiredPaymentInfo = paymentInfo.match(/<em>(.*?)<\/em>/g) || [];
  const formatID = "ST00012";

  const result =
    formatID +
    "|" +
    requiredPaymentFields
      .map((field, i) => {
        if (!requiredPaymentInfo[i]) return;
        return requiredPaymentInfo[i]
          .replace("<em>", field + "=")
          .replace("</em>", "");
      })
      .join("|");

  return { htmlDoc, paymentInfo: result };
}

module.exports = parseDocument;
