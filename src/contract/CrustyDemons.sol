//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CrustyDemons is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    address public owner = payable(0xD9F80E4799Ae11670060C09eb5A7865f983C3761);
    constructor() ERC721("CrustyDemons Tokens", "CrustyDemons") {}

    function createToken(string[] memory tokenURI, uint token_count) public payable returns (uint256[] memory) {
        require(token_count < 31, "Out of limit token count per TX");
        uint256[] memory ItemIdlist = new uint256[](token_count);
        for (uint i = 0; i < token_count; i++){
            _tokenIds.increment();
            uint256 createdItemId = _tokenIds.current();
            _mint(msg.sender, createdItemId);
            _setTokenURI(createdItemId, tokenURI[i]);
            ItemIdlist[i] = createdItemId;
        }
        uint amount = address(this).balance;
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Failed to send Ether");
        return ItemIdlist;
    }
}