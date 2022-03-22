import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import web3 from 'web3'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'

import {
  nftaddress, nftmarketaddress
} from '../../config'


import NFT from '../../artifacts/contracts/BinkCollection.sol/BinkCollection.json'
import Market from '../../artifacts/contracts/BinkMarket.sol/BinkMarket.json'

export default function SingleNFT() {
  const [nfts, setNfts] = useState([])
  const [loaded, setLoaded] = useState('not-loaded')
  const router = useRouter()

  let wallet = router.query.wallet

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
        creator: i.creator,
        owner: i.owner,
        image: meta.data.image,
        origin: meta.data.origin,
        contract: meta.data.nftContract,
      }
      return item
    }))
    console.log('items: ', items)
    setNfts(items)
    setLoaded('loaded')
    
  }
  
  if (loaded === 'loaded' && !nfts.length) return (<h1 className="p-20 text-4xl">Carteira Vazia</h1>)
  return (
    <>
    <div>
      <div className="">
      <div className="relative bg-white overflow-hidden">
      <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:static">
          <div className="sm:max-w-lg">
            <h1 className="text-4xl font font-extrabold tracking-tight text-gray-900 sm:text-6xl truncate">
            {wallet}
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              PolygonScan
            </p>
          </div>
          <div>
            <div className="mt-10">
              {/* Decorative image grid */}
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:max-w-7xl lg:mx-auto lg:w-full"
              >
                <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex-shrink-0 grid grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="w-1000 h-1000 rounded-lg overflow-hidden sm:opacity-0 lg:opacity-100">
                      {
                        nfts.map((nft, i) => {
                          if((nft.creator == wallet)) {      
                          return (
                            <>
                            <img
                              src={nft.image}
                              alt=""
                              key={i}
                              className="w-full h-full object-center object-cover"
                            />
                            </>
                          )
                        }})
                      }
                      </div>
                    </div>
                   
                  </div>
                </div>
              </div>
              <a
                href="/dkmt"
                className="inline-block text-center bg-black border border-transparent rounded-md py-3 px-8 font-medium text-white hover:bg-black"
              >
                DKMTs
              </a> 
              <a
                href="/dkmt"
                className="inline-block text-center bg-black border border-transparent rounded-md py-3 px-8 font-medium text-white hover:bg-black"
              >
                Coleção
              </a>
              
            </div>
          </div>
        </div>
      </div>
    </div>
      <p className="text-4xl pt-4 truncate"></p>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {
            nfts.map((nft, i) => {
              if((nft.creator == wallet)) {      
              return (
              <>
              <div key={i} className="group relative">
              <div className="w-full min-h-60 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-60 lg:aspect-none">                  
                <Link href={{ pathname: '/dkmt/[id]', query: {id: nft.tokenId }}}>
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
                      <Link href={{ pathname: '/dkmt/[id]', query: {id: nft.tokenId }}}>
                        
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
            }})
          }
        </div>
      </div>
    </div>

  </>
  )
}
