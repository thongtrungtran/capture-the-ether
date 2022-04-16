import { expect } from "chai";
import { ethers } from "hardhat";

describe("Fuzzy Identity", function () {
  before(async () => {
    this.ctx.player = (await ethers.getSigners())[0];
    this.ctx.challengeContract = await ethers.getContractAt(
      "FuzzyIdentityChallenge",
      "0xBdd1CE89211e7D38740C7C72952C57e234e34A92"
    );
  });
  it("exploit", async function () {
    const FuzzyIdentityAttacker = await ethers.getContractFactory(
      "FuzzyIdentityAttacker"
    );

    const hashedBytecode = ethers.utils.keccak256(
      FuzzyIdentityAttacker.bytecode
    );
    const FuzzyDeployer = await ethers.getContractFactory(
      "FuzzyDeployer",
      this.player
    );

    this.deployer = await FuzzyDeployer.deploy();
    await this.deployer.deployed();
    for (
      let i = ethers.BigNumber.from(0);
      i.lte(ethers.BigNumber.from(2).pow(32).sub(1));
      i = i.add(1)
    ) {
      const addr = ethers.utils.getCreate2Address(
        this.deployer.address,
        ethers.utils.hexZeroPad(i.toHexString(), 32),
        hashedBytecode
      );
      if (addr.includes("badc0de")) {
        console.log(
          `${addr} with salt ${ethers.utils.hexZeroPad(i.toHexString(), 32)}`
        );
        break;
      }
    }
  });

  after(async () => {
    expect(await this.ctx.challengeContract.isComplete()).to.be.true;
  });
});
