const express = require("express");
const cors = require("cors");
const upload = require("./scripts/uploadDocument");
const parseDocument = require("./scripts/parseDocument");
const generateQR = require("./scripts/generateQR");
const puppeteer = require("puppeteer");

const mammoth = require("mammoth");
const { JSDOM } = require("jsdom");

const app = express();
app.use(cors());

const documentStyles = `
  strong {
    text-align: center;
    display: block;
  }

  table, td {
    border: 1px solid black;
    border-collapse: collapse;
  }
`;

app.post("/upload", upload.single("document"), async (req, res) => {
  try {
    const { paymentInfo } = await parseDocument(req.file.buffer);
    const { svg, png } = await generateQR(paymentInfo);

    const data = await mammoth.convertToHtml(
      { buffer: req.file.buffer },
      { includeDefaultStyles: true }
    );

    const dom = new JSDOM(data.value);
    const htmlDoc = dom.window.document;

    // Attach QR code at the end of the document
    const img = htmlDoc.createElement("img");
    img.style.cssText = "float: right; margin: 10px;";
    img.src = png;
    htmlDoc.body.appendChild(img);

    // Attach styles to the document
    const style = htmlDoc.createElement("style");
    style.textContent = documentStyles;
    htmlDoc.head.appendChild(style);

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 595, height: 842 });

    await page.setContent(htmlDoc.documentElement.outerHTML);
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    res.json({
      qr: { svg, png },
      pdf: pdfBuffer.toString("base64"),
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.listen(3001, () => {
  console.log("Server started on port 3001");
});
