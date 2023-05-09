import puppeteer from "puppeteer";

export const generatePDF = async (html: Document) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 595, height: 842 });

  await page.setContent(html.documentElement.outerHTML);
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();
  return { pdfBuffer };
};
