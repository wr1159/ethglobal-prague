// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Prover} from "vlayer-0.1.0/Prover.sol";
import {IERC721} from "openzeppelin-contracts/token/ERC721/IERC721.sol";

contract PudgyMinter is Prover {
    IERC721 public immutable TOKEN;
    uint256 public immutable STARTING_BLOCK;
    uint256 public immutable ENDING_BLOCK;
    uint256 public immutable STEP;

    constructor(
        IERC721 _token,
        uint256 _startBlockNo,
        uint256 _endingBlockNo,
        uint256 _step
    ) {
        TOKEN = _token;
        STARTING_BLOCK = _startBlockNo;
        ENDING_BLOCK = _endingBlockNo;
        STEP = _step;
    }

    function maxBalanceOf(
        address _owner
    ) public returns (Proof memory, address, uint256) {
        uint256 maxBalance = 0;

        for (
            uint256 blockNo = STARTING_BLOCK;
            blockNo <= ENDING_BLOCK;
            blockNo += STEP
        ) {
            setBlock(blockNo);
            uint256 balance = TOKEN.balanceOf(_owner);
            if (balance > maxBalance) {
                maxBalance = balance;
            }
        }
        return (proof(), _owner, maxBalance);
    }
}
