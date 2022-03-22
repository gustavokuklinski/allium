// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";
contract BinkToken is ERC20 {
    constructor() ERC20("Bink", "ART$") {
        _mint(msg.sender,5000000000000000000000000);
    }
}