import { ethers } from "hardhat";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const [deployer, alice, bob] = await ethers.getSigners();

  const lockedAmount = ethers.utils.parseEther("0.001");

  const ICO = await ethers.getContractFactory("ICO");
  const ico = await ICO.deploy("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  ]);

  await ico.deployed();
  await ico.advancePhase();
  await ico.advancePhase();
  console.log("ICO deployed to:", ico.address);

  // NOTE: You may need to pass arguments to the `deploy` function, if your
  //       SpaceCoin contract's constructor has input parameters
  const SpaceCoin = await ethers.getContractFactory("SpaceCoin");
  const spaceCoin = await SpaceCoin.deploy(
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    ico.address
  );
  await spaceCoin.deployed();
  console.log("SpaceCoin deployed to:", spaceCoin.address);
  // deploy router
/// deploy LP contract
ico.address
const SpaceLP = await ethers.getContractFactory("SpaceLP");
const spaceLP = await SpaceLP.deploy(
    spaceCoin.address
);
await spaceLP.deployed();
console.log("SpaceLP deployed to:", spaceLP.address);

// deploy router
const LiquidityRouter = await ethers.getContractFactory("SpaceRouter");
const liquidityRouter = await LiquidityRouter.deploy(
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    ico.address
);
await liquidityRouter.deployed();
console.log("LiquidityRouter deployed to:", liquidityRouter.address);
}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
