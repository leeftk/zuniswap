// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

const path = require("path");

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer, alice, bob] = await ethers.getSigners();

  //deploy spacecoin
  const SpaceCoin = await ethers.getContractFactory("SpaceCoin");
  const spacecoin = await SpaceCoin.deploy(alice.address,bob.address);
  await spacecoin.deployed();
  
  //deploy spacelp
  const SpaceLP = await ethers.getContractFactory("SpaceLP");
  const spacelp = await SpaceLP.deploy(spacecoin.address);
  await spacelp.deployed();
  
  //deploy spacerouter
  const SpaceRouter = await ethers.getContractFactory("SpaceRouter");
  const spacerouter = await SpaceRouter.deploy(spacelp.address,spacecoin.address);
  await spacerouter.deployed();

  //save frontend files
  console.log("router")
  saveFrontendFiles(spacerouter,"SpaceRouter");
  console.log("router")
  saveFrontendFiles(spacelp,"SpaceLP");
  saveFrontendFiles(spacecoin,"SpaceCoin");
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress(),
    "SpaceCoin address:",
    await spacecoin.address,
    "SpaceLP address:",
    await spacelp.address,
    "SpaceRouter address:",
    await spacerouter.address
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

}

function saveFrontendFiles(token, name) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");
  const contractAddressPath = path.join(contractsDir, "contract-address.json");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  let contractAddresses = {};
  if (fs.existsSync(contractAddressPath)) {
    const existingData = fs.readFileSync(contractAddressPath);
    contractAddresses = JSON.parse(existingData);
  }

  contractAddresses[name] = token.address;

  fs.writeFileSync(
    contractAddressPath,
    JSON.stringify(contractAddresses, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    path.join(contractsDir, name + ".json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


