import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import web3 from 'web3'
import axios from 'axios'
import { useRouter } from 'next/router'
import Link from 'next/link'

import {
  nftaddress, nftmarketaddress
} from '../config'


import NFT from '../artifacts/contracts/AlliumCollection.sol/AlliumCollection.json'
import Market from '../artifacts/contracts/AlliumMarket.sol/AlliumMarket.json'

export default function SingleNFT() {
  const [nfts, setNfts] = useState([])
  const [loaded, setLoaded] = useState('not-loaded')
  const router = useRouter()

  let wallet = document.getElementById("metamasklogin").innerHTML;

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
  
  if (loaded === 'loaded' && !nfts.length) return (<h1 className="p-20 text-4xl">Você ainda não publicou nenhum NFT</h1>)
  return (
    <>
<div>
<h2 className="text-4xl pb-5">Meus DKMTs</h2>
<div className="flex flex-col">
  <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
      <div className="overflow-hidden border-b border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artista</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {
            nfts.map((nft, i) => {
              if((nft.creator == wallet)) {
              return (
              <>
            <tr key={i}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img className="h-10 w-10 rounded" src={nft.image} alt={nft.name}/>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm text-gray-500">{nft.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">Artista: {nft.creator}</div>
                <div className="text-sm text-gray-500">
                  { (nft.seller == nft.creator) ? ("Mercado primário") : (`Marchand: ${nft.owner}`) }
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"> {nft.price} ART$ </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              
              <Link href={{ pathname: '/dkmt/[id]', query: { id: nft.tokenId }}} className="text-indigo-600 hover:text-indigo-900">
                Ver NFT
              </Link>
              </td>
            </tr>
            </>
              )
            }})
          }

          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
</div>


  </>
  )
}
