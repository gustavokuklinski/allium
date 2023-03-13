export const nfttokenaddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
export const nftmarketaddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
export const nftaddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"

export const networkMap = {
  POLYGON_MAINNET: {
    chainId: "0x89", // 137
    chainName: "Matic(Polygon) Mainnet",
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://www.polygonscan.com/"],
  },
  POLYGON_TESTNET: {
    chainId: "0x13881", // 80001
    chainName: "Matic(Polygon) Mumbai Testnet",
    nativeCurrency: { name: "tMATIC", symbol: "tMATIC", decimals: 18 },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  },

  LOCALHOST_HARDHAT: {
    chainId: "0x539", // 31337
    chainName: "localhost",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: ["http://localhost:8545/"],
  }
};