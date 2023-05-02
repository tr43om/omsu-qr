const express = require("express");
const cors = require("cors");
const upload = require("./scripts/uploadDocument");
const parseDocument = require("./scripts/parseDocument");
const generateQR = require("./scripts/generateQR");
const puppeteer = require("puppeteer");
const htmlToDocx = require("html-to-docx");

const mammoth = require("mammoth");
const { JSDOM } = require("jsdom");

const app = express();
app.use(cors());

app.post("/upload", upload.single("document"), async (req, res) => {
  try {
    const { paymentInfo } = await parseDocument(req.file.buffer);
    const { svg, png } = await generateQR(paymentInfo);

    const data = await mammoth.convertToHtml(
      { buffer: req.file.buffer },
      { includeDefaultStyles: true }
    );

    const content = await mammoth.extractRawText(
      { buffer: req.file.buffer },
      { includeDefaultStyles: true }
    );

    const dom = new JSDOM(data.value);
    const htmlDoc = dom.window.document;
    const img = htmlDoc.createElement("img");
    img.style.cssText = "float: right; margin: 10px;";
    img.src = png;
    htmlDoc.body.appendChild(img);

    const modifiedHtml = htmlDoc.documentElement.outerHTML;
    const modifiedDocxBuffer = await htmlToDocx(modifiedHtml); // Convert the modified HTML document back to the original format

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 595, height: 842 });

    const style = htmlDoc.createElement("style");
    style.textContent = data.styles;
    htmlDoc.head.appendChild(style);

    await page.setContent(htmlDoc.documentElement.outerHTML);
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    res.json({
      qr: { svg, png },
      paymentInfo,
      html: htmlDoc.documentElement.outerHTML,
      pdf: pdfBuffer.toString("base64"),
      modifiedDocx: modifiedDocxBuffer.toString("base64"),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to parse document" });
  }
});

app.listen(3001, () => {
  console.log("Server started on port 3001");
});
