// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Land is ERC721 {

  uint256 public initialCost = 1 ether;
  uint256 public maxSupply = 5;
  uint256 public totalSupply = 0;

  struct Building {
    string name;
    address owner;

    int256 posX;
    int256 posY;
    int256 posZ;

    int256 sizeX;
    int256 sizeY;
    int256 sizeZ;
  }

  Building[] public buildings;

  constructor(string memory _name, string memory _symbol, uint256 _cost) ERC721(_name, _symbol) {
    initialCost = _cost;

    buildings.push(
      Building(
        "Village", 
        address(0x0),
        0, 0, 0,
        10, 10, 10
      )
    );

    buildings.push(
      Building(
        "Park", 
        address(0x0),
        0, 10, 0,
        10, 5, 3
      )
    );

    buildings.push(
      Building(
        "City", 
        address(0x0),
        0, -10, 0,
        10, 5, 3
      )
    );

    buildings.push(
      Building(
        "Events Plaza", 
        address(0x0),
        10, 0, 0,
        5, 25, 5
      )
    );

    buildings.push(
      Building(
        "Campus", 
        address(0x0),
        -10, 0, 0,
        5, 25, 5
      )
    );
  }

  function mint(uint256 _id) public payable {
    uint256 supply = totalSupply;

    require(supply <= maxSupply);

    // nobody owns the building to mint
    require(buildings[_id - 1].owner == address(0x0));

    // verify correct price
    require(msg.value >= 1 ether);

    // mint process
    buildings[_id - 1].owner = msg.sender;
    totalSupply = totalSupply + 1;
    _safeMint(msg.sender, _id);
  }

  function transferFrom(
    address from,
    address to,
    uint256 tokenId
  ) public override {
    // if owner approve this transaction or this is actual owner of nft we want to send
    require(
      _isApprovedOrOwner(_msgSender(), tokenId),
      "ERC721: transfer caller is not owner not approved"
    );

    buildings[tokenId - 1].owner = to;
    _transfer(from, to, tokenId);
  }

  function getBuildings() public view returns(Building[] memory) {
    return buildings;
  }

  function getBuilding(uint256 _buildingId) public view returns (Building memory) {
    return buildings[_buildingId - 1];
  }
}