require("@nomiclabs/hardhat-waffle")
require("dotenv").config();

module.exports = {
  solidity: "0.8.0",

  networks: {
    sepolia: {
      url: process.env.URL,
      accounts: [process.env.WALLET_PRIVATE_KEY]
    }
  }
};
