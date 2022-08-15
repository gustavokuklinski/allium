import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import web3 from 'web3'
import axios from 'axios'
import Web3Modal from "web3modal"
import Link from 'next/link'

import {
  nftmarketaddress, nftaddress
} from '../config'

import NFT from '../artifacts/contracts/AlliumCollection.sol/AlliumCollection.json'
import Market from '../artifacts/contracts/AlliumMarket.sol/AlliumMarket.json'

export default function Collection() {
  const [nfts, setNfts] = useState([])
  const [loaded, setLoaded] = useState('not-loaded')
  const [formInput, updateFormInput] = useState({ price: '' });

  async function resellOwnedItem(id) {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    let listingPrice = await marketContract.getListingPrice()
    listingPrice = listingPrice.toString()

    const tx = await marketContract.putItemToResell(
      nftaddress,
      id,
      ethers.utils.parseUnits(formInput.price, "ether"),
      { value: listingPrice }
    );
    await tx.wait();
  }
  

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
      
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchMyNFTs()
    
    
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
        contract: i.nftContract,
        image: meta.data.image,
        tokenUri: tokenUri,
        origin: meta.data.origin,
        comission: meta.data.comission,
        creator: i.creator
      }
      
      return item
    }))
    console.log('items: ', items)  

    setNfts(items)
    setLoaded('loaded') 
  }


  if (loaded === 'loaded' && !nfts.length) return (<h1 className="p-20 text-4xl">Você ainda não tem uma coleção :(</h1>)
  if (loaded === 'not-loaded' && !nfts.length) return (<button onClick={loadNFTs} className="rounded bg-blue-600 py-2 px-12 text-white m-16">Carregar minha coleção</button>)
  return (
    <>
    <div>
      
<div className="flex flex-col">
<h2 className="text-4xl pb-5">Minha coleção</h2>
  <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
      <div className="overflow-hidden border-b border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artista</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comissão</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenda</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {
            nfts.map((nft, i) => {
             
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
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold text-black"> {nft.comission}% </span>
              </td>
              <td>
              <input
                      placeholder="Preço em ART$"
                      className="border rounded p-1"
                      onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                    /> 
                    <button className="bg-green-600 text-white p-1 rounded" onClick={() => resellOwnedItem(nft.tokenId)}>Re-vender</button>
                </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              
              <Link href={nft.image} className="text-indigo-600 hover:text-indigo-900">
                Ver NFT  
              </Link>
              </td>
            </tr>
            </>
              )
            })
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
