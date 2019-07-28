pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";

contract TestToken is ERC20, ERC20Detailed {
    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint _initialSupply)
        ERC20Detailed(_name, _symbol, _decimals)
        public {
            require(_initialSupply > 0, "Amount has to be greater then 0");
            uint256 initialSupply = _initialSupply.mul(10 ** uint256(_decimals));
            _mint(msg.sender, initialSupply);
        }
}