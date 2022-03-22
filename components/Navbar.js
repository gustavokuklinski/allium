import Link from 'next/link'
import { ethers } from 'ethers'
import Web3Modal from "web3modal"
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'

import {
  nfttokenaddress,
  nftmarketaddress
} from '../config'

import Token from '../artifacts/contracts/BinkToken.sol/BinkToken.json'

const navigation = [
  { name: 'Home', href: '/', current: false },
  { name: 'DKMTs', href: '/dkmt', current: false },
  { name: 'Ganhe 10 ART$', href: 'https://bink.art.br', current: false },
  { name: 'Metaverso', href: 'https://metaverso.binaria.art.br', current: false },
  { name: 'Documentação', href: 'https://metaverso.binaria.art.br', current: false },
]

export default function Navbar() {
    
    function classNames(...classes) {
      return classes.filter(Boolean).join(' ')
    }
    async function MetamaskLoginMobile() {
      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
      });
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
  
      const wallet = await signer.getAddress()
      const erc20contract = new ethers.Contract(nfttokenaddress, Token.abi, signer)
      const erc20balanceOf = await erc20contract.balanceOf(wallet)

      const balanceMobile = document.getElementById("balanceMobile")
      const metamaskloginMobile = document.getElementById("metamaskloginMobile")
      const usrPane = document.getElementById("loggedin")
      usrPane.classList.remove("hidden")
      metamaskloginMobile.innerHTML = wallet
      balanceMobile.innerHTML = "<img src='/art-symbol-32x32.png' style='display: inline; width: 1.4em; height: 1.4em' alt='Token ART$' /> <strong>ART$ </strong>" + erc20balanceOf
    }

    async function MetamaskLogin() {
      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
      });
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
  
      const wallet = await signer.getAddress()
      const btnId = document.getElementById("metamasklogin")
      const usrPane = document.getElementById("loggedin")
      const balance = document.getElementById("balance")

      const connectionWallet = document.getElementById("connectionWallet")
      console.log("Wallet logged in: ", wallet)
    
      const erc20contract = new ethers.Contract(nfttokenaddress, Token.abi, signer)

      const erc20balanceOf = await erc20contract.balanceOf(wallet)
      const erc20formatedBalance = ethers.utils.formatEther(erc20balanceOf);
      console.log(erc20formatedBalance)
      // btnId.innerHTML = wallet.substring(0,8)
      btnId.innerHTML = wallet
      
      balance.innerHTML = "<img src='/art-symbol-32x32.png' style='display: inline; width: 1.4em; height: 1.4em' alt='Token ART$' /> <strong>ART$ </strong>" + erc20formatedBalance
      
      if (usrPane == null) {
      
    } else {
      usrPane.classList.remove("hidden")
    }
      connectionWallet.removeAttribute("fill");
      connectionWallet.setAttribute("fill", "green")

      
      if (typeof(Storage) !== "undefined") {
        if(localStorage.getItem(wallet)) {
          console.log("Approved Wallet");
        } else {
          const erc20approvetransaction = await erc20contract.approve(signer.getAddress(), "5000000000000000000000000");
          console.log("Approve: ", signer.getAddress());
          console.log(erc20approvetransaction);
          console.log(erc20approvetransaction.hash);
          console.log(erc20approvetransaction.data);
          await erc20approvetransaction.wait();
          localStorage.setItem(wallet, erc20approvetransaction.data);
        }
      } else {
        alert("Your web browser wont work with localstorage, please update your web browser")
      }

      return wallet
  };

    return (
      <>
      <div className='font-extrabold' style={{ background: '#ff0000', color: '#ffffff'}}>
        <center>TESTNET</center>
      </div>

<div className="min-h-full">
        <Disclosure as="nav" className="bg-white">
          {({ open }) => (
            <>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                    <p className="text-xl">Bink:<span className='font-extrabold'>DKMTs</span></p>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                          >
                            <a className={classNames(
                              item.current
                                ? 'bg-white text-black'
                                : 'hover:bg-black hover:text-white',
                              'px-3 py-2 rounded-md text-sm font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}>{item.name}</a>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <div className="ml-3 pr-3">
                        <div className="text-sm font-medium leading-none text-black">
                          <span id="metamasklogin"></span>
                        </div>
                        <div className="text-sm text-right font-medium leading-none text-black">
                          <span id="balance"></span>
                        </div>
                      </div>
                      <a id="metamasklogin"></a>
                      
                      <svg id="connectionWallet" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="orange" className="bi bi-check-circle" viewBox="0 0 16 16">
                        <path d="M5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
                      </svg>
                      {/* Profile dropdown */}
                      <Menu as="div" className="ml-3 relative">
                        <div>
                          <Menu.Button className="max-w-xs rounded-full flex items-center text-sm focus:outline-none">
                            <span className="sr-only">Open user menu</span>
                            <img  onClick={() => MetamaskLogin()} className="h-8 w-8 rounded-full" src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="" />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                              
                              <Menu.Item>
                                  <>
                                  <div id="loggedin" className="hidden">
                                  <Link
                                    
                                    href="/mint"
                                  >
                                    <a id="MenuMint" className='px-4 block py-2 text-sm text-gray-700'>Criar DKMT</a>
                                  </Link>
                                  <Link
                                    
                                    href="/minted"
                                  >
                                    <a id="MenuMinted" className='px-4 py-2 block text-sm text-gray-700'>Minhas Produções</a>
                                  </Link>
                                  <Link

                                    
                                    href="/collection"
                                  >
                                    <a id="MenuCollection" className='px-4 py-2 block text-sm text-gray-700'>Minha Coleção</a>
                                  </Link>
                                  </div>
                                  </>
                                
                              </Menu.Item>
                            
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block px-3 py-2 rounded-md text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-700">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium leading-none text-black">
                        <span id="metamaskloginMobile"></span>
                      </div>
                      <div className="text-sm font-medium leading-none text-black">
                        <span id="balanceMobile"></span>
                      </div>
                      
                    </div>
                    
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    <button
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                      onClick={() => MetamaskLoginMobile()}
                    >Login</button>
                    <div id="loggedin" className="hidden">
                    <Link
                      
                      href="/mint"
                    >
                      <a id="MenuMint" className='px-4 block py-2 text-sm text-gray-700'>Criar NFT</a>
                    </Link>
                    <Link
                      
                      href="/minted"
                    >
                      <a id="MenuMinted" className='px-4 py-2 block text-sm text-gray-700'>Minhas Produções</a>
                    </Link>
                    <Link

                      
                      href="/collection"
                    >
                      <a id="MenuCollection" className='px-4 py-2 block text-sm text-gray-700'>Minha Coleção</a>
                    </Link>
                    </div>
                    
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        {/* 
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
        </header>
        */}
      </div>

    </>
     
    )
  }
 