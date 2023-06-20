import mammoth from "mammoth";
import { DocumentTypes } from "../types/index.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const parsePdf = require("pdf-parse");

export const extractTextFromBuffer = async (
  buffer: Buffer,
  type: string
): Promise<string> => {
  if (type === DocumentTypes.doc || type === DocumentTypes.docx) {
    const { value: content } = await mammoth.extractRawText({ buffer });
    return content;
  } else if (type === DocumentTypes.pdf) {
    const { text } = await parsePdf(buffer);
    return text;
  } else {
    return "";
  }
};
