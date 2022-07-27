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
        const postId = "0x6162636400000000000000000000000000000000000000000000000000000000"
        const reputationAdded = 1
        const reputationTaken = 1

        beforeEach(async () => {
            accounts = await ethers.getSigners()
            // console.log("accounts", accounts)
            deployer = accounts[0]
            // console.log("deployer", deployer)
            await deployments.fixture(["all"])
            nftSocialContract = await ethers.getContract("NFTSocial")
            // console.log("nftSocialContract", nftSocialContract)
            nftSocial = await nftSocialContract.connect(deployer)
        })

        describe("createPost", () => {
            it("emits an event and creates a post", async () => {
                expect(await nftSocial.createPost(parentId, contentUri, categoryId)).to.emit(
                    "PostCreated"
                )
                expect(await nftSocial.createPost(parentId, contentUri, categoryId)).to.emit(
                    "ContentAdded"
                )
            })
        })

        describe("voteUp", () => {
            it("reverts if the user tries to vote on their own post", async () => {
                const voter = "0x0000000000000000000000000000000000000000"

                const error = "User cannot vote their own posts"
                await nftSocial.createPost(parentId, contentUri, categoryId)
                await expect(
                    nftSocial.voteUp(postId, reputationAdded)
                ).to.be.revertedWith(error)
            })
            
            it("reverts if the user tries to vote on a post more than once", async () => {
                const error = "User already voted on this post"
                await nftSocial.createPost(parentId, contentUri, categoryId)
                await nftSocial.voteUp(postId, reputationAdded)
                await expect(
                    nftSocial.voteUp(postId, reputationAdded)
                ).to.be.revertedWith(error)
            })

            it("reverts if address tries to add too many repuation points", async () => {
                const error = "This address cannot add this amount of reputation points"
                const reputationPoints = 5
                await nftSocial.createPost(parentId, contentUri, categoryId)
                await expect(
                    nftSocial.voteUp(postId, reputationPoints)
                ).to.be.revertedWith(error)
            })

            it("emits an event and adds a like to the post", async () => {
                await nftSocial.createPost(parentId, contentUri, categoryId)
                expect(await nftSocial.voteUp(postId, reputationAdded)).to.emit(
                    "Voted"
                )
            })
        })

        describe("voteDown", () => {
            it("reverts if the user tries to vote on a post more than once", async () => {
                const error = "User cannot vote their own posts"
                await nftSocial.createPost(parentId, contentUri, categoryId)
                await nftSocial.voteDown(postId, reputationTaken)
                await expect(
                    nftSocial.voteDown(postId, reputationTaken)
                ).to.be.revertedWith(error)
            })
        })
    })