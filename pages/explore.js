import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import web3 from 'web3'
import axios from 'axios'
import Link from 'next/link'

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/AlliumCollection.sol/AlliumCollection.json'
import Market from '../artifacts/contracts/AlliumMarket.sol/AlliumMarket.json'

export default function Home() {
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
      const meta = await axios.get(tokenUri)
      let price = web3.utils.fromWei(i.price.toString(), 'ether');
      let item = {
        name: meta.data.name,
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        creator: i.creator,
        image: meta.data.image,
        tokenUri: tokenUri,
        origin: meta.data.origin,
        comission: meta.data.comission,
        contract: i.nftContract,
      }
      return item
    }))
    console.log('items: ', items)
    setNfts(items)
    setLoaded('loaded') 
  }

  if (loaded === 'loaded' && !nfts.length) return (<h1 className="p-20 text-4xl">Mercado vazio :(</h1>)
  return (
    <>
    <div>
      <div className="">
      
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {
            nfts.map((nft, i) => {
              return (
              <>
              
              <div key={i} className="group relative">
              <div className="w-full min-h-60 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-60 lg:aspect-none">                  
                <Link href={{ pathname: '/nft/[id]', query: {id: nft.tokenId }}}>
                  <img
                    src={nft.image} 
                    alt={nft.name}
                    className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                  />
                  </Link>
                </div>
                
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link href={{ pathname: '/nft/[id]', query: {id: nft.tokenId }}}>
                        
                        {nft.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500"><Link href={{ pathname: '/[wallet]', query: {wallet: nft.creator }}}>{nft.creator.substring(0,9)}</Link>...</p>
                    <p className="mt-1 text-sm text-gray-500">{ (nft.seller == nft.creator) ? ("Mercado primário") : (`Marchand: ${nft.seller.substring(0,9)}`) } </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{nft.price} ART$</p>
                </div>
              </div>
              
              </>
              )
            })
          }
        </div>
        
      </div>
      
    </div>
    
    </>
  )
}
