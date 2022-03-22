
export default function Footer() {

  return (
    <>
       <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 lg:flex lg:items-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-500 sm:text-4xl">
          <span className="block">Tutorial <span className="text-black"> Rápido</span></span>
        </h2>
      </div>
    </div>
      <div className="bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
      
      <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        <div  className="group relative">
          <div className="w-full min-h-60 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-60 lg:aspect-none">
          <img src="/manual/metamask.png" alt="Login com Metamask" className="w-full h-full object-center object-cover lg:w-full lg:h-full" />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-lg text-gray-700">
                Login com Metamask
              </h3>
              <p className="mt-1 text-sm text-gray-500">Realize login com a sua carteira Metamask configurada na rede Polygon.</p>
            </div>
          </div>
        </div>
        <div  className="group relative">
          <div className="w-full min-h-60 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-60 lg:aspect-none">
            <img src="/manual/sign.png" alt="Permita o uso do token" className="w-full h-full object-center object-cover lg:w-full lg:h-full" />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-lg text-gray-700">
                Permita o uso do token ART$
              </h3>
              <p className="mt-1 text-sm text-gray-500">Habilite o uso do token ART$ (uma pequena taxa de gwei será cobrada).</p>
            </div>
          </div>
        </div>

        <div  className="group relative">
          <div className="w-full min-h-60 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-60 lg:aspect-none">
          <img src="/manual/nft.png" alt="Crie seu DKMT" className="w-full h-full object-center object-cover lg:w-full lg:h-full" />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-lg text-gray-700">
                Crie seu DKMT!
              </h3>
              <p className="mt-1 text-sm text-gray-500">Crie e publique seus DKMTs com a mesma tecnologia dos NFTs.</p>
            </div>
          </div>
        </div>

        <div  className="group relative">
          <div className="w-full min-h-60 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-60 lg:aspect-none">
          <img src="/manual/collect.png" alt="Crie seu DKMT" className="w-full h-full object-center object-cover lg:w-full lg:h-full" />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-lg text-gray-700">
                Colecione e/ou Venda!
              </h3>
              <p className="mt-1 text-sm text-gray-500">Descubra artistas e DKMTs, seja um colecionador ou artista.</p>
            </div>
          </div>
        </div>


      </div>

    </div>
    </div>
      
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-500 sm:text-4xl">
          <span className="block">Ainda tem <span className="text-black">Dúvidas?</span></span>
          <p className="block mt-1 font-normal text-lg text-gray-500">Confira nossa documentação completa sobre como utilizar a Metamask, aprovar o uso do token ART$, colecionar e publicar.</p>
        </h2>
        
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <a href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-black">Documentação</a>
          </div>
        </div>
      </div>
    </div>
    <div className="bg-black">
      
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
      
      <div className="mt-6 mb-12 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8">
        <div  className="group relative">
          
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-lg text-white">
                Bink DKMTs
              </h3>
              <p className="mt-1 text-sm text-white">O que são DKMTs?</p>
              <p className="mt-1 text-sm text-white">Documentação</p>
            </div>
          </div>
        </div>
        <div  className="group relative">
          
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-lg text-white">
                Token ART$
              </h3>
              <p className="mt-1 text-sm text-white"><a href='https://quickswap.exchange/#/swap?inputCurrency=0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270&outputCurrency=0xa267622987b75e1d37ffb8134a1f9ee3435fbb28' target="_blank">Comprar/Vender (Trade)</a></p>
              <p className="mt-1 text-sm text-white"><a href='https://bink.art.br' target="_blank">Informações</a></p>
              <p className="mt-1 text-sm text-white"><a href='https://bink.art.br' target="_blank">Whitepaper</a></p>
            </div>
          </div>
        </div>

        <div  className="group relative">
          
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-lg text-white">
                Documentação
              </h3>
              <p className="mt-1 text-sm text-white">Login com a Metamask</p>
              <p className="mt-1 text-sm text-white">Token ART$</p><br />
              <h3 className="text-sm text-white">Para o colecionador</h3>
              <p className="mt-1 text-sm text-white">Adquirir DKMT (NFT)</p>
              <p className="mt-1 text-sm text-white">Royalties</p><br />
              <h3 className="text-sm text-white">Para o artista</h3>
              <p className="mt-1 text-sm text-white">Criar DKMT (NFT)</p>
            </div>
          </div>
        </div>
        <div  className="group relative">
          
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-lg text-white">
                Smart Contracts
              </h3>
              <p className="mt-1 text-sm text-white"><a href='https://polygonscan.com/token/0xa267622987b75e1d37ffb8134a1f9ee3435fbb28' target="_blank">Token ART$</a></p>
              <p className="mt-1 text-sm text-white"><a href='' target="_blank">Bink DKMTs</a></p>
              <p className="mt-1 text-sm text-white"><a href='' target="_blank">Bink Collection</a></p>
            </div>
          </div>
        </div>
        <div  className="group relative">
          
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-lg text-white">
                Contato
              </h3>
              <p className="mt-1 text-sm text-white"><a href='' target="_blank">Github</a></p>
              <p className="mt-1 text-sm text-white"><a href='https://twitter.com/0x_bink' target='_blank'>Twitter</a></p>
              <p className="mt-1 text-sm text-white"><a href='https://discord.gg/n2n7tGP6kp' target='_blank'>Discord</a></p>
            </div>
          </div>
        </div>
        


      </div>

    </div>
    </div>
    </>
  )
}
