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



import NFT from '../../artifacts/contracts/AlliumCollection.sol/AlliumCollection.json'
import Market from '../../artifacts/contracts/AlliumMarket.sol/AlliumMarket.json'
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
      let comission = web3.utils.fromWei(i.comission.toString(), 'ether');
      let item = {
        name: meta.data.name,
        description: meta.data.description,
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        creator: i.creator,
        owner: i.owner,
        image: meta.data.image,
        origin: meta.data.origin,
        comission,
        contract: i.nftContract
      }
      return item
    }))
  
    console.log('items: ', items)

    setNfts(items)
    setLoaded('loaded')
  }


  async function buyNft(nft) {

    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });

    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    
    const erc20contract = new ethers.Contract(nfttokenaddress, Token.abi, signer)

    const price = web3.utils.toWei(nft.price.toString(), 'ether');
    console.log('price: ', price);

    const erc20approvetransaction = await erc20contract.approve(nftmarketaddress, price);
    console.log("Approve: ", nftmarketaddress);
    await erc20approvetransaction.wait();

    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {value: 0})
    console.log("Transaction NFT: ", transaction);

    await transaction.wait()

    location.replace("/collection")

  }

  async function secondaryBuyNft(nft) {

    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });

    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    
    const erc20contract = new ethers.Contract(nfttokenaddress, Token.abi, signer)

    const price = web3.utils.toWei(nft.price.toString(), 'ether');
    console.log('price: ', price);

    const erc20approvetransaction = await erc20contract.approve(nftmarketaddress, price);
    console.log("Approve: ", nftmarketaddress);
    await erc20approvetransaction.wait();

    const transaction = await contract.secondaryCreateMarketSale(nftaddress, nft.tokenId, {value: 0})
    console.log("Transaction NFT: ", transaction);

    await transaction.wait()

    location.replace("/collection")

  }
  
  if (loaded === 'loaded' && !nfts.length) return (<h1 className="p-20 text-4xl">Obra não existe</h1>)
  return (

    <>

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
