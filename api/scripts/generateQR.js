const QRCode = require("qrcode");

async function generateQRCode(text) {
  try {
    const qrCodeSvg = await QRCode.toString(text, { type: "svg" });
    const qrCodePng = await QRCode.toDataURL(text, { type: "png" });
    return { svg: qrCodeSvg, png: qrCodePng };
  } catch (error) {
    console.error("Failed to generate QR code:", error);
    return null;
  }
}

module.exports = generateQRCode;
