const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../../utils/move-blocks")

const parentId = "0x0000000000000000000000000000000000000000000000000000000000000000"
const contentUri = "https://ipfs.com"
const categoryId = "0x0000000000000000000000000000000000000000000000000000000000000000"

const createPost = async () => {
    const nftSocial = await ethers.getContract("NFTSocial")
    const transaction = await nftSocial.createPost(parentId, contentUri, categoryId)
    await transaction.wait(1)
    console.log("Post Created !")
    if (network.config.chainId == "31337") {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}


createPost()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
