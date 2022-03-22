import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import web3 from 'web3'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/BinkCollection.sol/BinkCollection.json'
import Market from '../artifacts/contracts/BinkMarket.sol/BinkMarket.json'

export default function Mint() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '', comission: '', width: '', height: '' })
  

  async function createSale(url) {
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

    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)

    createDkmtToken.style.display = "block";
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
    const price = web3.utils.toWei(formInput.price, 'ether')

    createDkmtSale.style.display = "block";
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })

    await transaction.wait()
    
    transactionModal.style.display = "none";
    location.replace("/")
  }

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(
        file,
        { progress: (prog) => console.log(`received: ${prog}`) }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
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
    const { name, description, price, comission, width, height } = formInput
    if (!name || !description || !price || !fileUrl || !comission|| !width || !height) return
    // first, upload to IPFS
    const data = JSON.stringify({
      name: name, 
      description: description, 
      image: fileUrl, 
      origin: wallet, 
      comission: comission, 
      width: width, 
      height: height, 
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      console.log(url);
      
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

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
                  <p className="text-sm text-gray-500" id="createDkmtToken" style={{ display:"none" }}>1/2 - Criando DKMT.</p>
                  <p className="text-sm text-gray-500" id="createDkmtSale" style={{ display:"none" }}>2/2 - Disponibilizando DKMT para venda.</p><br />
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
        <div className="mt-5 md:mt-0 md:col-span-2">
          <h3 className="px-4 py-5 text-lg font-medium leading-6 text-gray-900">Criar DKMT</h3>
            <p className="px-4 text-sm text-gray-600">Publique seu DKMT (NFT)</p>
            <div className="sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6">
                <div className="col-span-6 sm:col-span-3">
                  <label for="first-name" className="block text-sm font-medium text-gray-700">Título</label>
                  <input type="text" name="first-name" id="first-name" autoComplete="given-name" className="p-2 shadow-sm focus:ring-black focus:border-black mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" onChange={e => updateFormInput({ ...formInput, name: e.target.value })}/>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label for="last-name" className="block text-sm font-medium text-gray-700">Preço (em ART$)</label>
                  <input type="number" name="last-name" id="last-name" autoComplete="family-name" className="p-2 shadow-sm focus:ring-black focus:border-black mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" onChange={e => updateFormInput({ ...formInput, price: e.target.value })}/>
                </div>
                <div>
                  <label for="about" className="block text-sm font-medium text-gray-700"> Descrição </label>
                  <div className="mt-1">
                    <textarea id="about" name="about" rows="3" className="p-2 shadow-sm focus:ring-black focus:border-black mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" onChange={e => updateFormInput({ ...formInput, description: e.target.value })}></textarea>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700"> Mídia </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label for="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-black focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-black">
                          <p className="justify-center">Upload de mídia</p>
                          <input id="file-upload" name="file-upload" type="file" accept="image/gif, image/jpeg, image/jpg, image/png" className="sr-only" onChange={onChange}/>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label for="last-name" className="block text-sm font-medium text-gray-700">Comissão</label>
                  <input type="number" name="last-name" id="last-name" autoComplete="family-name" className="p-2 shadow-sm focus:ring-black focus:border-black mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" onChange={e => updateFormInput({ ...formInput, comission: e.target.value })}/>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label for="last-name" className="block text-sm font-medium text-gray-700">Largura (px)</label>
                  <input type="number" name="last-name" id="last-name" autoComplete="family-name" className="p-2 shadow-sm focus:ring-black focus:border-black mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" onChange={e => updateFormInput({ ...formInput, width: e.target.value })}/>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label for="last-name" className="block text-sm font-medium text-gray-700">Altura (px)</label>
                  <input type="number" name="last-name" id="last-name" autoComplete="family-name" className="p-2 shadow-sm focus:ring-black focus:border-black mt-1 block w-full sm:text-sm border border-gray-300 rounded-md" onChange={e => updateFormInput({ ...formInput, height: e.target.value })}/>
                </div>
              </div>
              <div className="px-4 py-3 sm:px-6">
                <button onClick={createMarket} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">Publicar NFT</button>
                <p className="text-xs text-gray-500 pt-2">Custo médio de publicação: ~0.050 gás (gwei) ~R$ 0.50 (~USD 0.10)</p>
              </div>
            </div>
        </div>
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <label><small>Prévia do NFT:</small></label>
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
