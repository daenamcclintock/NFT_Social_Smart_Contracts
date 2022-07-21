// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract NFTSocial {

    

    // Data structure for each post
    struct post {
        address postOwner;
        bytes32 parentPost; // used to implement comments as a child of each post
        bytes32 contentId;
        int40 votes;
        bytes32 categoryId;
    }
}