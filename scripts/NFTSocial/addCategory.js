const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../../utils/move-blocks")

const newCategory = "newCategory"

const addCategory = async () => {
    const nftSocial = await ethers.getContract("NFTSocial")
    const transaction = await nftSocial.addCategory(newCategory)
    await transaction.wait(1)
    console.log("New Category Created !")
    if (network.config.chainId == "31337") {
        await moveBlocks(2, (sleepAmount = 1000))
    }
}


addCategory()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })