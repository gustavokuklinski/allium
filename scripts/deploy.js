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

  const AlliumMarket = await hre.ethers.getContractFactory("AlliumMarket");
  const alliumMarket = await AlliumMarket.deploy(binkToken.address);
  await alliumMarket.deployed();
  console.log("Allium nftMarket deployed to:", alliumMarket.address);

  const AlliumNFT = await hre.ethers.getContractFactory("AlliumCollection");
  const alliumNft = await AlliumNFT.deploy(alliumMarket.address);
  await alliumNft.deployed();
  console.log("Allium nft deployed to:", alliumNft.address);
}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
