exports.pick = function* pick(items) {
  let i = 0;
  while (true) {
    yield items[i % items.length];
    i++;
  }
};
exports.required = function required(param = "") {
  throw new Error(`Param "${param}" is required`);
};
