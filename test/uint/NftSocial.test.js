const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { idText, convertTypeAcquisitionFromJson } = require("typescript")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NFT Social Unit Tests", () => {
        let nftSocial, nftSocialContract

        beforeEach(async () => {
            accounts = await ethers.getSigners()
            // console.log("accounts", accounts)
            deployer = accounts[0]
            // console.log("deployer", deployer)
            await deployments.fixture(["all"])
            nftSocialContract = await ethers.getContract("NFTSocial")
            // console.log("nftSocialContract", nftSocialContract)
            nftSocial = await nftSocialContract.connect(deployer)
            // console.log("nftSocial", nftSocial)
        })

        describe("createPost", () => {
            it("emits an event after creating a post", async () => {
                let parentId = 0x626c756500000000000000000000000000000000000000000000000000000000
                let contentUri = "https://ipfs.com"
                let categoryId = 0x626c756500000000000000000000000000000000000000000000000000000000
                expect(await nftSocial.createPost(parentId, contentUri, categoryId).to.emit(
                    "ContentAdded"
                ))
                expect(await nftSocial.createPost(parentId, contentUri, categoryId).to.emit(
                    "PostCreated"
                ))
            })
        })
    })