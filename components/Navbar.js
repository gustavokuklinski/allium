import Link from 'next/link'
import { ethers } from 'ethers'
import Web3Modal from "web3modal"
import { Disclosure, Menu } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'

import {
  nfttokenaddress,
  networkMap,
  nftmarketaddress
} from '../config'

import Token from '../artifacts/contracts/BinkToken.sol/BinkToken.json'

const navigation = [
  { name: 'Home', href: '/', current: false },
  { name: 'Explorar', href: '/explore', current: false },
  { name: 'Documentação', href: '#', current: false },
]



export default function Navbar() {
    
    function classNames(...classes) {
      return classes.filter(Boolean).join(' ')
    }

    async function MetamaskLogin() {

      const web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
        providerOptions
      });

      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection, 'any')
      const signer = provider.getSigner()

      

      const wallet = await signer.getAddress()
      const btnId = document.getElementById("metamasklogin")
      const addDkmt = document.getElementById("addDkmt")
      const settingsDkmt = document.getElementById("settingsDkmt")
      const balance = document.getElementById("balance")
  
      // const chainId = networkMap.POLYGON_MAINNET.chainId
      // const chainId = networkMap.POLYGON_TESTNET.chainId
      const chainId = networkMap.LOCALHOST_HARDHAT.chainId
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{chainId:chainId}]
        });


      } catch (switchError) {
        if(switchError.code === 4902) {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              // params: [networkMap.POLYGON_MAINNET],
              // params: [networkMap.POLYGON_TESTNET],
              params: [networkMap.LOCALHOST_HARDHAT]
            });
        }
      } 
      
      userLoggedIn()
     
      async function userLoggedIn() {
        console.log("Wallet logged in: ", wallet)
      
        

        const blockchainBalance = await provider.getBalance(wallet);
        const blockchainFormatBalance = ethers.utils.formatEther(blockchainBalance)
        console.log(blockchainFormatBalance);


        const erc20contract = new ethers.Contract(nfttokenaddress, Token.abi, signer)
        console.log(erc20contract)
        const erc20balanceOf = await erc20contract.balanceOf(wallet)
        const erc20formatedBalance = ethers.utils.formatEther(erc20balanceOf);
        console.log(erc20formatedBalance)

        
        
        // btnId.innerHTML = wallet.substring(0,8)
        btnId.innerHTML = wallet.substring(0,9)
        
        balance.innerHTML = "<img src='/art-symbol-32x32.png' style='display: inline; width: 1.4em; height: 1.4em' alt='Token ART$' /> " + erc20formatedBalance.substring(0,6) + " | <img src='/matic-symbol-32x32.png' style='display: inline; width: 1.4em; height: 1.4em' alt='MATIC' /> " + blockchainFormatBalance.substring(0,6);
        addDkmt.classList.remove("hidden");
        settingsDkmt.classList.remove("hidden");
        return wallet
      }
  };

    return (
      <>
      <div className="min-h-full">
      <Disclosure as="nav" className="bg-white">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <img
                    className="block lg:hidden h-8 w-auto"
                    src="/logo-allium-icon.png"
                    alt="Workflow"
                  />
                  <img
                    className="hidden lg:block h-8 w-auto"
                    src="/logo-allium-icon.png"
                    alt="Workflow"
                  />
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <div key={item.name} className={classNames(
                        item.current ? 'text-gray-900' : 'text-gray-900 hover:bg-blue-700 hover:text-white',
                        'px-3 py-2 rounded-md text-sm font-medium'
                      )}>
                      <Link
                        href={item.href}                        
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="ml-3 pr-3 text-right">
                <div className="text-sm font-medium leading-none text-black">
                  <span id="metamasklogin"></span>
                </div>
                <div className="text-sm text-right font-medium leading-none text-black">
                  <span id="balance"></span>
                </div>
              </div>

              <div id="addDkmt" className="hidden">
                <Link href="/mint" >
                <img
                        className="h-8 w-8 rounded-full"
                        src="/adddkmt.png"
                        alt=""
                      />
                </Link>
              </div>

              <a id="metamasklogin"></a>
                <img
                  onClick={() => MetamaskLogin()}
                  className="h-8 w-8 rounded-full"
                  src="/wallet.png"
                  alt=""
                />

                <div id="settingsDkmt" className="hidden">
                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="flex text-sm rounded-full">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="/settings.png"
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                           <div className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                            <Link href="/collection">
                              Minha coleção
                            </Link>
                          </div>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <div className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                            <Link href="/minted">
                              Meus DKMTs
                            </Link>
                          </div>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <div className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>
                            <a href="/">Sair</a>
                          </div>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                 
                </Menu>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
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
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>

        
        
      </div>

    </>
     
    )
  }
 