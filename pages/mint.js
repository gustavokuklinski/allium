import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import web3 from 'web3'
import Router from 'next/router'



console.log()
const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_KEY
const projectSecret = process.env.NEXT_PUBLIC_INFURA_PRIVATE_KEY
const devEndpointIPFS = process.env.NEXT_PUBLIC_INFURA_ENDPOINT
const auth = 'Basic '+Buffer.from(projectId+':'+projectSecret).toString('base64')

const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
})


import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/AlliumCollection.sol/AlliumCollection.json'
import Market from '../artifacts/contracts/AlliumMarket.sol/AlliumMarket.json'

export default function Mint() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '', comission: '', categorie: '' })
  

  async function createSale(url) {
    
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });

    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)

    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
    const price = web3.utils.toWei(formInput.price, 'ether')
    const comission = web3.utils.toWei(formInput.comission, 'ether')
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    transaction = await contract.createMarketItem(nftaddress, tokenId, price, comission,{ value: listingPrice })

    await transaction.wait()

    Router.push('/')
  }

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(
        file,
        { progress: (prog) => console.log(`received: ${prog}`) }
      )
      const url = `${devEndpointIPFS}${added.path}`
      setFileUrl(url)

    } catch (error) {
      console.log('Error uploading file: ', error);
    }  
  }

  async function createMarket() {
    
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const wallet = await signer.getAddress()
    const { name, description, price, comission, categorie } = formInput
    if (!name || !description || !price || !fileUrl || !comission || !categorie) return
    // first, upload to IPFS
    const data = JSON.stringify({
      name: name, 
      description: description, 
      image: fileUrl, 
      origin: wallet, 
      price: price,
      comission: comission, 
      categorie: categorie
    })
    try {
      const added = await client.add(data)
      const url = `${devEndpointIPFS}${added.path}`
      console.log(url);
      
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  return (
    <>
     <div>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="mt-5 md:mt-0 md:col-span-2">
          <h1 className="px-4 py-5 text-lg leading-6 text-gray-900">Criar nft</h1>
            <p className="px-4 text-sm text-gray-600">nfts são os NFTs do Allium Marketplace!</p>
            <div className="sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6">
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="categorie" className="block text-sm font-medium text-gray-700">Categoria</label>
                  <select className="p-2 shadow-sm focus:ring-black focus:border-black mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" id="categorie" onChange={e => updateFormInput({ ...formInput, categorie: e.target.value })}>
                    <option value="PT">Pintura</option>
                    <option value="EO">Esculturas e Objetos</option>
                    <option value="FT">Fotografias</option>
                    <option value="DG">Digitais</option>
                  </select>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Título</label>
                  <input type="text" name="name" id="name" autoComplete="given-name" className="p-2 shadow-sm focus:ring-black focus:border-black mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" onChange={e => updateFormInput({ ...formInput, name: e.target.value })}/>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço (em ART$)</label>
                  <input type="number" name="price" id="price" autoComplete="family-name" className="p-2 shadow-sm focus:ring-black focus:border-black mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" onChange={e => updateFormInput({ ...formInput, price: e.target.value })}/>
                </div>
                <div>
                  <label htmlFor="royalties" className="block text-sm font-medium text-gray-700">Comissão</label>
                  <input type="number" name="royalties" id="last-name" autoComplete="family-name" className="p-2 shadow-sm focus:ring-black focus:border-black mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" onChange={e => updateFormInput({ ...formInput, comission: e.target.value })}/>
                </div>
                
                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700"> Descrição </label>
                  <div className="mt-1">
                    <textarea id="about" name="about" rows="3" className="p-2 shadow-sm focus:ring-black focus:border-black mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" onChange={e => updateFormInput({ ...formInput, description: e.target.value })}></textarea>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700"> Mídia </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-black focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-black">
                          <p className="justify-center">Upload de mídia</p>
                          <input id="file-upload" name="file-upload" type="file" accept="image/gif, image/jpeg, image/jpg, image/png" className="sr-only" onChange={onChange}/>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                    </div>
                  </div>
                </div>
                
              </div>
              <div className="px-4 py-3 sm:px-6">
                <button onClick={createMarket} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-blue-700">Publicar nft!</button>
                <p className="text-xs text-gray-500 pt-2">Custo médio de publicação: ~0.050 + 0.0001 MATIC de taxa de publicação</p>
              </div>
            </div>
        </div>
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <label><small>Prévia do nft:</small></label>
            {
              fileUrl && (
                <img className="rounded mt-4" src={fileUrl} />
              )
            }
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
