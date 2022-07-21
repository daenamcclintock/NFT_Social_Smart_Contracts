// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./NFTSocial.sol";

contract Comments is NFTSocial {

    event CommentCreated (bytes32 indexed commentId, address indexed commentOwner, bytes32 indexed parentId, bytes32 contentId, bytes32 categoryId);
    event ContentAdded (bytes32 indexed contentId, string contentUri);
    event Voted (bytes32 indexed commentId, address indexed commentOwner, address indexed voter, uint80 reputationCommentOwner, uint80 reputationVoter, int40 commentVotes, bool up, uint8 reputationAmount);

    // Data structure for each comment
    struct comment {
        address commentOwner;
        bytes32 parentPost;
        bytes32 contentId;
        int40 votes;
        bytes32 categoryId;
    }

    mapping (address => mapping (bytes32 => uint80)) reputationRegistry; // mapping user address to a mapping of categoryId to category name (categoryRegistry)
    mapping (bytes32 => string) categoryRegistry; // mapping categoryId to the category name
    mapping (bytes32 => string) contentRegistry; // mapping the contentId to the url in IPFS
    mapping (bytes32 => comment) commentRegistry; // mapping the commentId to the comment data structure
    mapping (address => mapping (bytes32 => bool)) voteRegistry; // mapping user address to a mapping of voteId to a boolean (like/dislike => true/false)

    // Function to create a comment based on the comment data structure defined above
    function createComment(bytes32 _parentId, string calldata _contentUri, bytes32 _categoryId) external { // content URI is where the comment data is stored in IPFS
        address _owner = msg.sender;
        bytes32 _contentId = keccak256(abi.encode(_contentUri)); // create contentId by hashing the _contentUri
        bytes32 _commentId = keccak256(abi.encodePacked(_owner, _parentId, _contentId)); // commentId comprised of the hash of owner, parentId, contentId
        contentRegistry[_contentId] = _contentUri; // save the contentUri to the contentRegistry mapping
        commentRegistry[_commentId].commentOwner = _owner;
        commentRegistry[_commentId].parentComment = _parentId;
        commentRegistry[_commentId].contentId = _contentId;
        commentRegistry[_commentId].categoryId = _categoryId;
        // commentRegistry[_commentId].votes = 0; (Not needed bc Solidity auto initialized ints to 0)
        emit ContentAdded(_contentId, _contentUri); // event to notify that the content was IPFS, used to fetch data on front end
        emit CommentCreated (_commentId, _owner,_parentId,_contentId,_categoryId); // fire event that the comment was created
    }
}