const express = require("express");
const cors = require("cors");
const upload = require("./scripts/uploadDocument");
const parseDocument = require("./scripts/parseDocument");
const generateQR = require("./scripts/generateQR");
const puppeteer = require("puppeteer");

const app = express();
app.use(cors());

app.post("/upload", upload.single("document"), async (req, res) => {
  try {
    const { paymentInfo, htmlDoc } = await parseDocument(req.file.buffer);
    const { svg, png } = await generateQR(paymentInfo);

    // Append QR code to the document
    // Convert modified HTML document to PDF
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();
    // await page.setContent(htmlDoc.documentElement.outerHTML);
    // const pdfBuffer = await page.pdf({ format: "A4" });
    // await browser.close();
    res.json({
      // html: result,
      qr: { svg, png },
      paymentInfo,
      // pdf: pdfBuffer.toString("base64"),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to parse document" });
  }
});

app.listen(3001, () => {
  console.log("Server started on port 3001");
});
