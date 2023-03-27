
solidity
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DIDRegistry {
    event DIDAttributeChanged(
        address indexed identity,
        bytes32 indexed name,
        bytes value,
        uint256 validTo,
        uint256 previousChange
    );

    mapping(address => mapping(bytes32 => DIDAttribute)) private data;

    struct DIDAttribute {
        bytes value;
        uint256 validTo;
        uint256 previousChange;
    }

    function setAttribute(
        bytes32 _name,
        bytes memory _value,
        uint256 _validTo
    ) public {
        DIDAttribute storage attr = data[msg.sender][_name];
        attr.value = _value;
        attr.validTo = _validTo;
        attr.previousChange = block.number;
        emit DIDAttributeChanged(msg.sender, _name, _value, _validTo, block.number);
    }

    function getAttribute(address _identity, bytes32 _name)
        public
        view
        returns (
            bytes memory value,
            uint256 validTo,
            uint256 previousChange
        )
    {
        DIDAttribute storage attr = data[_identity][_name];
        value = attr.value;
        validTo = attr.validTo;
        previousChange = attr.previousChange;
    }
}
