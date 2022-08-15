// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./AlliumCollection.sol";

import "hardhat/console.sol";

contract AlliumMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemsIds;
    Counters.Counter private _itemsSold;
    Counters.Counter private _itemsDeleted;

    // price for putting something to sale in the Marketplace
    uint256 listingPrice = 0.001 ether;

    // owner of the marketplace
    address payable owner;

    IERC20 public _token20Contract;
    constructor(address token20Address) {
        _token20Contract = IERC20(token20Address);
        owner = payable(msg.sender);
    }

    function updateListingPrice(uint _listingPrice) public payable {
      require(owner == msg.sender, "Only marketplace owner can update listing price.");
      listingPrice = _listingPrice;
    }

    function getListingPrice() public view returns (uint256) {
       return listingPrice;
    }

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable creator;
        address payable seller;
        address payable owner;
        uint256 price;
        uint256 comission;
        bool sold;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address creator,
        address seller,
        address owner,
        uint256 price,
        uint256 comission
    );

    event ProductUpdated(
      uint256 indexed itemId,
      uint256 indexed oldPrice,
      uint256 indexed newPrice
    );

    event MarketItemDeleted(uint256 itemId);

    event ProductSold(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address creator,
        address seller,
        address owner,
        uint256 price,
        uint256 comission
    );

     event ProductListed(
        uint256 indexed itemId
    );

    modifier onlyProductOrMarketPlaceOwner(uint256 id) {
        if (idToMarketItem[id].owner != address(0)) {
            require(idToMarketItem[id].owner == msg.sender);
        } else {
            require(
                idToMarketItem[id].seller == msg.sender || msg.sender == owner
            );
        }
        _;
    }

    modifier onlyProductSeller(uint256 id) {
        require(
            idToMarketItem[id].owner == address(0) &&
                idToMarketItem[id].seller == msg.sender, "Only the product can do this operation"
        );
        _;
    }

    modifier onlyItemOwner(uint256 id) {
        require(
            idToMarketItem[id].owner == msg.sender,
            "Only product owner can do this operation"
        );
        _;
    }


    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price,
        uint256 comission
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");

        require(msg.value == listingPrice, "Listing fee required");

        _itemsIds.increment();
        uint256 itemId = _itemsIds.current();

        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(msg.sender),
            payable(address(0)),
            price,
            comission,
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        
        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            msg.sender,
            address(0),
            price,
            comission
        );
    }

    function updateMarketItemPrice(uint256 id, uint256 newPrice)
        public 
        payable
        onlyProductSeller(id)
    {
        MarketItem storage item = idToMarketItem[id];
        uint256 oldPrice = item.price;
        item.price = newPrice;

        emit ProductUpdated(id, oldPrice, newPrice);
    } 

    // Primary market
    function createMarketSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;

        idToMarketItem[itemId].seller.transfer(msg.value);
        _token20Contract.transferFrom(msg.sender, address(idToMarketItem[itemId].seller), price);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;
        _itemsSold.increment();

        emit ProductSold(
            idToMarketItem[itemId].itemId,
            idToMarketItem[itemId].nftContract,
            idToMarketItem[itemId].tokenId,
            idToMarketItem[itemId].creator,
            idToMarketItem[itemId].seller,
            payable(msg.sender),
            idToMarketItem[itemId].price,
            idToMarketItem[itemId].comission
        );
    }

    // Secondary market
    function royaltiesCreator(uint256 p, uint256 c) pure public returns (uint256) {
        unchecked { return (p * c)/100; }
    }

    function secondaryCreateMarketSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        uint256 comission = idToMarketItem[itemId].comission;

        idToMarketItem[itemId].seller.transfer(msg.value);
        
        _token20Contract.transferFrom(msg.sender, address(idToMarketItem[itemId].seller), (price - royaltiesCreator(price, comission)));
        _token20Contract.transferFrom(msg.sender, address(idToMarketItem[itemId].creator), royaltiesCreator(price, comission));

        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;
        _itemsSold.increment();

        emit ProductSold(
            idToMarketItem[itemId].itemId,
            idToMarketItem[itemId].nftContract,
            idToMarketItem[itemId].tokenId,
            idToMarketItem[itemId].creator,
            idToMarketItem[itemId].seller,
            payable(msg.sender),
            idToMarketItem[itemId].price,
            idToMarketItem[itemId].comission
        );
    }

    function putItemToResell(address nftContract, uint256 itemId, uint256 newPrice)
        public
        payable
        nonReentrant
        onlyItemOwner(itemId)
    {
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        require(newPrice > 0, "Price must be at least 1 wei");
        require(msg.value == listingPrice, "Price must be equal to listing price");

        AlliumCollection tokenContract = AlliumCollection(nftContract);

        tokenContract.transferToken(msg.sender, address(this), tokenId);
        
        address payable oldOwner = idToMarketItem[itemId].owner;
        idToMarketItem[itemId].owner = payable(address(0));
        idToMarketItem[itemId].seller = oldOwner;
        idToMarketItem[itemId].price = newPrice;
        idToMarketItem[itemId].sold = false;
        _itemsSold.decrement();

        emit ProductListed(itemId);
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemsIds.current();
        uint256 unsoldItemCount = _itemsIds.current() - _itemsSold.current() - _itemsDeleted.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (
                idToMarketItem[i + 1].owner == address(0) &&
                idToMarketItem[i + 1].sold == false &&
                idToMarketItem[i + 1].tokenId != 0
            ) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchSingleItem(uint256 id)
        public
        view
        returns (MarketItem memory)
    {
        return idToMarketItem[id];
    }

    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemsIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchAuthorsCreations(address author) public view returns (MarketItem[] memory){
        uint256 totalItemCount = _itemsIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].creator == author && !idToMarketItem[i + 1].sold) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].creator == author && !idToMarketItem[i + 1].sold) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    
}
