const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const postId = "0x0000000000000000000000000000000000000000000000000000000000000000"
const reputationAdded = 1

const voteUp = async () => {
    const nftSocial = await ethers.getContract("NFTSocial")
    const transaction = await nftSocial.voteUp(postId, reputationAdded)
    await transaction.wait(1)
    console.log("Post Liked !")
    if (network.config.chainId == "31337") {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}


voteUp()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })