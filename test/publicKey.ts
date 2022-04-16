import { expect } from "chai";
import { ethers } from "hardhat";

describe("PublicKeyChallenge", function () {
  before(async () => {
    this.ctx.player = (await ethers.getSigners())[0];
    this.ctx.challengeContract = await ethers.getContractAt(
      "PublicKeyChallenge",
      "0x62ddC5d406Fd4c33C46A35448BE0A8C364c2984f"
    );
  });
  it("exploit", async function () {
    const owner = "0x92b28647ae1f3264661f72fb2eb9625a89d88a31";
    const txHash =
      "0xabc467bedd1d17462fcc7942d0af7874d6f8bdefee2b299c9168a216d3ff0edb"; // txhash that the `owner` address sent

    const tx = await ethers.provider.getTransaction(txHash);

    const signature = ethers.utils.joinSignature({
      r: String(tx.r),
      s: String(tx.s),
      v: tx.v,
    });

    const txData = {
      gasPrice: tx.gasPrice,
      gasLimit: tx.gasLimit,
      value: tx.value,
      nonce: tx.nonce,
      data: tx.data,
      chainId: tx.chainId,
      to: tx.to,
    };

    const raw = ethers.utils.serializeTransaction(txData);

    const digest = ethers.utils.keccak256(raw);
    const digestBytes = ethers.utils.arrayify(digest);
    const recoveredAddress = ethers.utils.recoverAddress(
      digestBytes,
      signature
    );

    expect(owner).to.be.hexEqual(recoveredAddress);
    const recoveredPublicKey = ethers.utils.recoverPublicKey(
      digestBytes,
      signature
    );

    await this.challengeContract.authenticate(
      "0x" + recoveredPublicKey.slice(4)
    );
  });

  after(async () => {
    expect(await this.ctx.challengeContract.isComplete()).to.be.true;
  });
});
