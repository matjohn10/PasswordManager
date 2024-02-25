type updateObj = { [key: string]: any };

const makeUpdateObj = (body: Object): Object => {
  let newObj: { [key: string]: any } = {};
  for (const [key, value] of Object.entries(body)) {
    newObj[key] = value;
  }
  return newObj;
};

module.exports = makeUpdateObj;
