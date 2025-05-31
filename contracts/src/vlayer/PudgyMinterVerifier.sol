// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {OGMinterBadgeNFT} from "./OGMinterBadge.sol";
import {PudgyMinter} from "./PudgyMinter.sol";

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";

contract PudgyMinterVerifier is Verifier {
    address public prover;
    mapping(address => bool) public claimed;
    OGMinterBadgeNFT public reward;

    constructor(address _prover) {
        prover = _prover;
        reward = new OGMinterBadgeNFT();
    }

    function claim(
        Proof calldata,
        address claimer,
        uint256 maxBalance
    ) public onlyVerified(prover, PudgyMinter.maxBalanceOf.selector) {
        if (maxBalance >= 1) {
            claimed[claimer] = true;
            reward.mint(claimer);
        }
    }
}
