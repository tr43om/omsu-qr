export const createPrefixedRegex = (
  name: string,
  prefix: string,
  pattern: string
) => {
  return { name, pattern: new RegExp(`^${prefix}:\\s*(${pattern})$`, "m") };
};
