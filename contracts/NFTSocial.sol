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

    mapping (address => mapping (bytes32 => uint80)) reputationRegistry; // mapping user address to a mapping of categoryId to category name (categoryRegistry)
    mapping (bytes32 => string) categoryRegistry; // mapping categoryId to the category name
    mapping (bytes32 => string) contentRegistry; // mapping the contentId to the url in IPFS
    mapping (bytes32 => post) postRegistry; // mapping the postId to the post data structure
    mapping (address => mapping (bytes32 => bool)) voteRegistry; // mapping user address to a mapping of voteId to a boolean (like/dislike => true/false)

    
}