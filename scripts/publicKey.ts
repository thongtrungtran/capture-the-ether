import { ethers } from "hardhat";

const solve = async () => {
  const challengeAddress = "0x62ddC5d406Fd4c33C46A35448BE0A8C364c2984f";
  const [player] = await ethers.getSigners();

  const challengeContract = await ethers.getContractAt(
    "PublicKeyChallenge",
    challengeAddress,
    player
  );

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

  const raw = ethers.utils.serializeTransaction(
    await ethers.utils.resolveProperties(txData)
  );

  const digest = ethers.utils.keccak256(raw);

  const recoveredPublicKey = ethers.utils.recoverPublicKey(digest, signature);

  const trx = await challengeContract.authenticate(
    "0x" + recoveredPublicKey.slice(4),
    {
      gasLimit: 1e6,
    }
  );
  console.log(await trx.wait());
};

solve().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
