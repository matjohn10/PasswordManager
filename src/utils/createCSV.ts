const JSONtoArray = (info: { [key: string]: any }[]): string[][] => {
  const refined = [];
  const keys: string[] = Object.keys(info[0]);
  refined.push(keys);
  info.forEach((obj) => {
    refined.push(Object.values(obj));
  });

  return refined;
};

const createCSV = (info: { [key: string]: any }[]): string => {
  let content = "";
  const refinedData = JSONtoArray(info);
  refinedData.forEach((row) => {
    content += row.join(",") + "\n";
  });
  const blob = new Blob([content], { type: "text/csv;charset=utf-8," });
  const objUrl = URL.createObjectURL(blob);

  return objUrl;
};

module.exports = createCSV;
