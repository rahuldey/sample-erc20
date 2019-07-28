pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract TestToken is ERC20, ERC20Detailed {
    constructor(string memory name, string memory symbol, uint8 decimals, uint initialSupply)
        ERC20Detailed(name, symbol, decimals)
        public {
            // _mint(msg.sender, initialSupply * (10 ** uint256(decimals())));
            _mint(msg.sender, initialSupply);
        }
}