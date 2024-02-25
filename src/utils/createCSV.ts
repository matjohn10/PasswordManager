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
      values.push(value);
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

module.exports = createCSV;
