export default {
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testEnvironment: "node",
};

// export default {
//   testEnvironment: "node", // Use Node.js environment for testing
//   transform: {
//     "^.+\\.js$": "babel-jest", // Use Babel for transforming JavaScript files
//   },
//   extensionsToTreatAsEsm: [".js"], // Treat `.js` files as ESM
// };

