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
  { name: 'Explorar', href: '/explorar', current: false },
  { name: 'DKMTs', href: '/dkmt', current: false },
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
      });
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
  
      const wallet = await signer.getAddress()
      const btnId = document.getElementById("metamasklogin")
      const addDkmt = document.getElementById("addDkmt")
      const balance = document.getElementById("balance")

      console.log("Wallet logged in: ", wallet)
    
      const erc20contract = new ethers.Contract(nfttokenaddress, Token.abi, signer)

      const erc20balanceOf = await erc20contract.balanceOf(wallet)
      const erc20formatedBalance = ethers.utils.formatEther(erc20balanceOf);
      console.log(erc20formatedBalance)
      // btnId.innerHTML = wallet.substring(0,8)
      btnId.innerHTML = wallet.substring(0,8)
      
      balance.innerHTML = "<img src='/art-symbol-32x32.png' style='display: inline; width: 1.4em; height: 1.4em' alt='Token ART$' /> <strong>ART$ </strong>" + erc20formatedBalance     
      addDkmt.classList.remove("hidden");
      return wallet
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
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? 'text-gray-900' : 'text-gray-900 hover:bg-blue-700 hover:text-white',
                          'px-3 py-2 rounded-md text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="ml-3 pr-3 text-right">
                <div className="text-sm font-medium leading-none text-black">
                  <span id="metamasklogin"></span>...
                </div>
                <div className="text-sm text-right font-medium leading-none text-black">
                  <span id="balance"></span>
                </div>
              </div>
              <a href="/mint" id="addDkmt" className="hidden inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 mx-5">+ Criar DKMT</a>

              <a id="metamasklogin"></a>
                <img
                  onClick={() => MetamaskLogin()}
                  className="h-8 w-8 rounded-full"
                  src="/wallet.png"
                  alt=""
                />
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
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Meu perfil
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/collection"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Minha coleção
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/minted"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Meus DKMTs
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Sair
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
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
 