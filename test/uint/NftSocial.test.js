const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NFT Social Contract Unit Tests", () => {
        let nftSocial, nftSocialContract
        const parentId = "0x6162636400000000000000000000000000000000000000000000000000000000"
        const contentUri = "https://ipfs.com"
        const categoryId = "0x6162636400000000000000000000000000000000000000000000000000000000"

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
            await nftSocial.createPost(parentId, contentUri, categoryId)

        })

        describe("createPost", () => {
            it("emits an event after creating a post", async () => {
                let createPost = await nftSocial.createPost(parentId, contentUri, categoryId)
                console.log(createPost)
                expect(await nftSocial.createPost(parentId, contentUri, categoryId).to.emit(
                    "ContentAdded"
                ))
                // expect(await nftSocial.createPost(parentId, contentUri, categoryId).to.emit(
                //     "PostCreated"
                // ))
            })
        })
    })