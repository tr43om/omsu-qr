export const attachQrToDocument = (htmlDoc: Document, qr: string) => {
  function createImgElement(
    src: string,
    float: string,
    margin: string,
    width: string,
    height: string
  ) {
    const img = htmlDoc.createElement("img");
    img.src = src;
    img.style.float = float;
    img.style.margin = margin;
    img.style.width = width;
    img.style.height = height;
    return img;
  }

  // Create img elements for bottom and top
  const imgBottom = createImgElement(qr, "right", "10px", "130px", "130px");
  const imgTop = createImgElement(qr, "none", "10px", "130px", "130px");

  // Add img elements to the HTML document
  htmlDoc.body.appendChild(imgBottom);
  htmlDoc.body.prepend(imgTop);
};
