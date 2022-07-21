const { network } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const waitBlockConfirmations = developmentChains.includes(network.name)
    ? 1
    : VERIFICATION_BLOCK_CONFIRMATIONS

    log("_____________________________________________________________")
    const arguments = []
    // Deploy the contract
    const nftSocial = await deploy("NFTSocial", {
      from: deployer,
      args: arguments,
      logs: true,
      waitConfirmations: waitBlockConfirmations,
    })

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
      log("Verifying...")
      await verify(nftSocial.address, arguments)
    }
    log("______________________________________________________________")
}

module.exports.tags = ["all", "nftsocial"]