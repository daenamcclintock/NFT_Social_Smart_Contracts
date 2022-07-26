const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../../utils/move-blocks")

const parentId = "0x0000000000000000000000000000000000000000000000000000000000000000"
const contentUri = "https://ipfs.com"
const categoryId = "0x0000000000000000000000000000000000000000000000000000000000000000"

const createComment = async () => {
    const nftSocial = await ethers.getContract("Comments")
    const transaction = await nftSocial.createComment(parentId, contentUri, categoryId)
    await transaction.wait(1)
    console.log("Comment Created !")
    if (network.config.chainId == "31337") {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}


createComment()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })