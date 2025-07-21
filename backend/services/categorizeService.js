const map = {
  restaurant: "Food",
  cafe: "Food",
  pharmacy: "Medical",
  gas_station: "Transport",
  supermarket: "Groceries",
};
exports.categorize = (types = []) => {
  for (let t of types) {
    if (map[t]) return map[t];
  }
  return "Other";
};
