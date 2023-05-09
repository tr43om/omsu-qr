import mammoth from "mammoth";
import { JSDOM } from "jsdom";

export const convertDocxToHtml = async (buffer: Buffer) => {
  const data = await mammoth.convertToHtml({ buffer });
  const dom = new JSDOM(data.value);
  const html = dom.window.document;

  return { html };
};
