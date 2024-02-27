const { decrypt } = require("../controllers/encryptionController");

const JSONtoArray = (info: { [key: string]: any }[]): string[][] => {
  const refined = [];
  let keys = [];
  for (const [key, value] of Object.entries(info[0]._doc)) {
    keys.push(key);
  }
  refined.push(keys);
  info.forEach((obj) => {
    let values = [];
    for (const [key, value] of Object.entries(obj._doc)) {
      if (key === "password") {
        let decrypted = decrypt({ iv: obj._doc.iv, password: value });
        decrypted = cleanUpCSV(decrypted, key);
        values.push(decrypted);
      } else {
        const cleanValue = cleanUpCSV(value, key);
        values.push(cleanValue);
      }
    }
    refined.push(values);
  });

  return refined;
};

const createCSV = (info: { [key: string]: any }[]) => {
  let content = "";
  const refinedData = JSONtoArray(info);

  refinedData.forEach((row) => {
    content += row.join(",") + "\n";
  });

  return content;
};

const cleanUpCSV = (value: any, id: string): string => {
  if (id !== "iv" && typeof value === "string") {
    value = value.replace(/"/g, '""');
    // Wrap in quotes if it contains commas or newlines
    value = /[\n,]/.test(value) ? `"${value}"` : value;
  }
  return value;
};

module.exports = createCSV;
