const makeUpdateObj = (body: Object, exceptions: string[] | null): Object => {
  let newObj: { [key: string]: any } = {};
  for (const [key, value] of Object.entries(body)) {
    if (exceptions) {
      if (!exceptions.includes(key)) newObj[key] = value;
    } else {
      newObj[key] = value;
    }
  }
  return newObj;
};

module.exports = makeUpdateObj;
