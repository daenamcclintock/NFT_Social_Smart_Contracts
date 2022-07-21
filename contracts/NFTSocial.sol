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

    // Function to create a post based on the post struct data structure defined above
    function createPost(bytes32 _parentId, string calldata _contentUri, bytes32 _categoryId) external { // content URI is where the post data is stored in IPFS
        address _owner = msg.sender;
        bytes32 _contentId = keccak256(abi.encode(_contentUri)); // create contentId by hashing the _contentUri
        bytes32 _postId = keccak256(abi.encodePacked(_owner, _parentId, _contentId)); // postId comprised of the hash of owner, parentId, contentId
        contentRegistry[_contentId] = _contentUri; // save the contentUri to the contentRegistry mapping
        postRegistry[_postId].postOwner = _owner;
        postRegistry[_postId].parentPost = _parentId;
        postRegistry[_postId].contentId = _contentId;
        postRegistry[_postId].categoryId = _categoryId;
        // postRegistry[_postId].votes = 0; (Not needed bc Solidity auto initialized ints to 0)
        emit ContentAdded(_contentId, _contentUri); // event to notify that the content was IPFS, used to fetch data on front end
        emit PostCreated (_postId, _owner,_parentId,_contentId,_categoryId); // fire event that post was created
    }
}