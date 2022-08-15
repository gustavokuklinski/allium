# Allium NFT
Projeto de Marketplace NFT em Polygon (MATIC) e/ou com Token ART$.

Requesitos mínimos:

Node
```
NVM - https://github.com/nvm-sh/nvm
NPM 8.5.0
NODEJS 16.14.1
```

Build Do projeto em etapas:

0. Instalação das dependencias: NPM 8.5.0 - NODEJS 16.14.1
(Localomente foi realizado através do NVM - Nove Virtual Machine - https://github.com/nvm-sh/nvm)
```
npm install
```

Verificar o garbage colector do NodeJS e aumentar o consumo de memória RAM (Recomendável)*:
``` 
export NODE_OPTIONS=--max_old_space_size=20480
```

1. Servidor Hardhat (Blockchain local): 
```
npm run hardhatnode
```

Exemplos padrões de Wallets (Carteiras Ethereum compatíveis com Metamask) geradas pelo comando:
```
Account #0: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

Account #2: 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc (10000 ETH)
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
```

Na sua Wallet do Metamask, utilize o servidor: localhost:8545 como "Carteira local".
Importe apenas a "Private Key" (Chave Privada) gerada na etapa 1.

O output esperado são Carteiras Ethereum (Faucet) para aplicação na Metamask.

2. Deploy (local) 
Os Smart Contracts (Contrados inteligentes na Blockchain) - Marketplace, NFT (Token Não Fungível) e Token (ERC20 - Criptomoeda) 
Encontrados na pasta: ```/contracts```
```
npm run hardhatdeploy
```

3. Incia servidor local
Utilizando NextJS 11.x com acesso via: localhost: ```localhost:30000```
```
npm run dev
```



