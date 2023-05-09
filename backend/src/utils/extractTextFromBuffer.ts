import mammoth from "mammoth";

export const extractTextFromBuffer = async (
  buffer: Buffer
): Promise<string> => {
  const { value: content } = await mammoth.extractRawText({ buffer });
  return content;
};
