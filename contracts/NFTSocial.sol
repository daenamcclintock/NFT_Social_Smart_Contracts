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

    // Function to add a "like" or "upvote" to another user's post
    function voteUp(bytes32 _postId, uint8 _reputationAdded) external { // _reputationAdded adds to the reputation of the _voter in specific category
        address _voter = msg.sender;
        bytes32 _category = postRegistry[_postId].categoryId;
        address _contributor = postRegistry[_postId].postOwner;
        require (postRegistry[_postId].postOwner != _voter, "User cannot vote their own posts");
        require (voteRegistry[_voter][_postId] == false, "User already voted on this post");
        require (validateReputationChange(_voter,_category,_reputationAdded) == true, "This address cannot add this amount of reputation points");
        postRegistry[_postId].votes += 1; // increments the vote count of the specific post voted on
        reputationRegistry[_contributor][_category] += _reputationAdded; // increments to reputation of the user
        voteRegistry[_voter][_postId] = true; // saves voteRegistry as state and changes to true so the user can't vote twice
        emit Voted(_postId, _contributor, _voter, reputationRegistry[_contributor][_category], reputationRegistry[_voter][_category], postRegistry[_postId].votes, true, _reputationAdded); // collects all voting data to be used to update UI
    }
}