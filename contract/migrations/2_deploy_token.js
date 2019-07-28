const TestToken = artifacts.require("TestToken");

module.exports = function(deployer) {
  const name = "TestToken";
  const symbol = "TST";
  const decimals = 18;
  const totalSupply = 1000000;
  
  deployer.deploy(TestToken, name, symbol, decimals, totalSupply);
};
