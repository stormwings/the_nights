const Land = artifacts.require("Land");

module.exports = async (deployer) => {
  const NAME = "The Nights";
  const SYMBOL = "NIGHT";
  const COST = web3.utils.toWei("1", "ether");

  await deployer.deploy(Land, NAME, SYMBOL, COST);
};
