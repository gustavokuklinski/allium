// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account: ' + deployer.address + '\n');

  const BinkToken = await hre.ethers.getContractFactory("BinkToken");
  const binkToken = await BinkToken.deploy();
  await binkToken.deployed();
  console.log("token deployed to:", binkToken.address);

  const BinkMarket = await hre.ethers.getContractFactory("BinkMarket");
  const binkMarket = await BinkMarket.deploy(binkToken.address);
  await binkMarket.deployed();
  console.log("nftMarket deployed to:", binkMarket.address);

  const BinkNFT = await hre.ethers.getContractFactory("BinkCollection");
  const binkNft = await BinkNFT.deploy(binkMarket.address);
  await binkNft.deployed();
  console.log("nft deployed to:", binkNft.address);
}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
