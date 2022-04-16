// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  const challengeAddress = "0xFCC59760cdfF4fe74941bD2B05618458252660CE";

  const [player] = await ethers.getSigners();
  const GuessTheNewNumberAttacker = await ethers.getContractFactory(
    "GuessTheNewNumberAttacker",
    player
  );

  const contractAttacker = await GuessTheNewNumberAttacker.deploy();
  await contractAttacker.deployed();
  console.log(`contract deployed at ${contractAttacker.address}`);

  let tx = await contractAttacker.guess(challengeAddress);

  await tx.wait();

  tx = await contractAttacker.withdraw();

  await tx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
