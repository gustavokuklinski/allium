import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import web3 from 'web3'
import axios from 'axios'
import Web3Modal from "web3modal"
import { useRouter } from 'next/router'
import Link from 'next/link'

import {
  nftaddress, nftmarketaddress, nfttokenaddress
} from '../../config'



import NFT from '../../artifacts/contracts/BinkCollection.sol/BinkCollection.json'
import Market from '../../artifacts/contracts/BinkMarket.sol/BinkMarket.json'
import Token from '../../artifacts/contracts/BinkToken.sol/BinkToken.json'

export default function SingleNFT() {
  const router = useRouter()
  let ssnftid = router.query.id

  const [nfts, setNfts] = useState([])
  const [loaded, setLoaded] = useState('not-loaded')
  
  useEffect(() => {
    loadNFTs()
  }, [])


  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    
    const data = await marketContract.fetchMarketItems()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      console.log(tokenUri);
      const meta = await axios.get(tokenUri)
      let price = web3.utils.fromWei(i.price.toString(), 'ether');
      let item = {
        name: meta.data.name,
        description: meta.data.description,
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        creator: i.creator,
        width: meta.data.width,
        height: meta.data.height,
        owner: i.owner,
        image: meta.data.image,
        origin: meta.data.origin,
        comission: meta.data.comission,
        contract: i.nftContract
      }
      return item
    }))
  
    console.log('items: ', items)

    setNfts(items)
    setLoaded('loaded') 
  }


  async function buyNft(nft) {
    if (typeof window !== "undefined") {
      transactionModal = document.getElementById("transactionModal");
      createDkmtToken = document.getElementById("createDkmtToken");
      createDkmtSale = document.getElementById("createDkmtSale");
    }

    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    transactionModal.style.display = "block";

    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    
    const erc20contract = new ethers.Contract(nfttokenaddress, Token.abi, signer)

    const price = web3.utils.toWei(nft.price.toString(), 'ether');
    console.log('price: ', price);

    createDkmtToken.style.display = "block";
    const erc20transfertransaction = await erc20contract.transferFrom(signer.getAddress(), nft.creator, price)
    console.log("Transaction ART$: ", erc20transfertransaction);
    
    createDkmtSale.style.display = "block";
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {value: 0})
    console.log("Transaction NFT: ", transaction);

    
    await erc20transfertransaction.wait()
    await transaction.wait()

    transactionModal.style.display = "none";
    location.replace("/collection")

  }

  async function secondaryBuyNft(nft) {
    if (typeof window !== "undefined") {
      transactionModal = document.getElementById("transactionModal");
      createDkmtSecondaryArtist = document.getElementById("createDkmtSecondaryArtist");
      createDkmtSecondaryToken = document.getElementById("createDkmtSecondaryToken");
      createDkmtSecondarySale = document.getElementById("createDkmtSecondarySale");
    }

    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    transactionModal.style.display = "block";

    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const erc20contract = new ethers.Contract(nfttokenaddress, Token.abi, signer)

    const price = web3.utils.toWei(nft.price.toString(), 'ether');
    console.log('price: ', price);

    createDkmtSecondaryArtist.style.display = "block";
    const creatorPercentage = (price * nft.comission) / 100;
    console.log('creator percentage: ', creatorPercentage);
    const erc20transfertransactionCreator = await erc20contract.transferFrom(signer.getAddress(), nft.creator, creatorPercentage.toLocaleString('fullwide', {useGrouping:false}).toString());
    

    createDkmtSecondaryToken.style.display = "block";
    const priceSellerCalc = (price - creatorPercentage);
    console.log('seller liquid', priceSellerCalc);
    const erc20transfertransactionSeller = await erc20contract.transferFrom(signer.getAddress(), nft.seller, priceSellerCalc.toLocaleString('fullwide', {useGrouping:false}).toString())
    
    
    createDkmtSecondarySale.style.display = "block";
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {value: 0})
    

    await erc20transfertransactionCreator.wait()
    await erc20transfertransactionSeller.wait()
    await transaction.wait()

    location.replace("/collection")

  }
  
  if (loaded === 'loaded' && !nfts.length) return (<h1 className="p-20 text-4xl">Obra não existe</h1>)
  return (

    <>
    <div className="fixed z-10 inset-0 overflow-y-auto" id="transactionModal" aria-labelledby="modal-title" role="dialog" aria-modal="true" style={{ display:"none" }}>
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Transações em andamento...</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Confirme as transações na sua carteira Metamask.<br /></p><br />

                  <p className="text-sm text-gray-500" id="createDkmtToken" style={{ display:"none" }}>1/2 - Transferindo ART$</p>
                  <p className="text-sm text-gray-500" id="createDkmtSale" style={{ display:"none" }}>2/2 - Transferindo DKMT</p>

                  <p className="text-sm text-gray-500" id="createDkmtSecondaryArtist" style={{ display:"none" }}>1/3 - Transferindo comissão ao artista</p>
                  <p className="text-sm text-gray-500" id="createDkmtSecondaryToken" style={{ display:"none" }}>2/3 - Transferindo ART$</p>
                  <p className="text-sm text-gray-500" id="createDkmtSecondarySale" style={{ display:"none" }}>3/3 - Transferindo DKMT</p>
                  
                  <br />
                  <p className="text-sm text-gray-500" id="createDkmtSale">* caso alguma operação demore ou fique pendente recomendamos que aguarde.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
<div>
  <div className="md:grid md:grid-cols-3 md:gap-6">

  {
    nfts.map((nft, i) => {
      if((nft.tokenId == ssnftid)) {             
           
        return (
    <>
    <div key={i} className="md:col-span-2">
      <div className="px-10 sm:px-0">
        <img className="rounded mt-4" src={nft.image} />
      </div>
    </div>
    <div key={i} className="mt-5 md:mt-0 md:col-span-1">
      <div className="sm:rounded-md sm:overflow-hidden">
        <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
          <div className="col-span-6 sm:col-span-3">
            <h1 for="first-name" className="block text-xl font-medium text-gray-700">{nft.name}</h1>
            <label className="block text-lg font-medium text-gray-700">{nft.price} ART$</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700"> {nft.description} </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dimensões: {nft.width} x {nft.height} px</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 truncate">Artista:<br />
              <Link href={{ pathname: '/[wallet]', query: {wallet: nft.origin }}}>{nft.origin}</Link>
              <label className="block text-sm font-medium text-gray-700">Comissão do mercado secundário: {nft.comission}%</label>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700"> { (nft.seller == nft.creator) ? ("Mercado primário") : (`Marchand: ${nft.seller}`) } </label>
          </div>
        </div>
        <div className="px-4 py-3 sm:px-6">
          { (nft.seller == nft.creator) ? (
            <button onClick={() => buyNft(nft)} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">Comprar DKMT</button>
          ) : (
            <button onClick={() => secondaryBuyNft(nft)} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">Comprar DKMT</button>
          ) }
        </div>
      </div>
    </div>
    </>
    )
      } else {}
    })
    }
  </div>
</div>

  </>
  )
}
