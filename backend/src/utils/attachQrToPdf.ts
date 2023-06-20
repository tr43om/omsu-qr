import { PDFDocument } from "pdf-lib";

export async function addImageToPdf(
  pdfBytes: Buffer,
  imgBase64: string,
  xPos: number,
  yPos: number,
  newWidth: number
) {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const image = await pdfDoc.embedPng(imgBase64);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const lastPage = pages[pages.length - 1];
    const originalWidth = image.width;
    const originalHeight = image.height;
    const aspectRatio = originalHeight / originalWidth;
    const newHeight = newWidth * aspectRatio;
    const { width: firstPageWidth, height: firstPageHeight } =
      firstPage.getSize();
    const { width: lastPageWidth, height: lastPageHeight } =
      firstPage.getSize();
    const firstPageXPos = firstPageWidth - newWidth;
    const firstPageYPos = firstPageHeight - newHeight;

    const lastPageXPos = lastPageWidth - newWidth;
    const lastPageYPos = 0;

    firstPage.setHeight(firstPageHeight + 100);
    lastPage.setHeight(lastPageHeight + 100);
    lastPage.translateContent(0, 100);

    console.log("firstPageYPos", firstPageYPos);

    firstPage.drawImage(image, {
      x: firstPageXPos,
      y: firstPageYPos + 70,
      width: newWidth,
      height: newHeight,
    });
    lastPage.drawImage(image, {
      x: lastPageXPos,
      y: lastPageYPos - 70,
      width: newWidth,
      height: newHeight,
    });

    return pdfDoc.save();
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
}
