const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { idText, convertTypeAcquisitionFromJson } = require("typescript")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Comments Contract Unit Tests", () => {
        let comments, commentsContract
        const parentId = "0x6162636400000000000000000000000000000000000000000000000000000000"
        const contentUri = "https://ipfs.com"
        const categoryId = "0x6162636400000000000000000000000000000000000000000000000000000000"
        const postId = "0x6162636400000000000000000000000000000000000000000000000000000000"
        const reputationAdded = 1
        const reputationTaken = 1

        beforeEach(async () => {
            accounts = await ethers.getSigners()
            deployer = accounts[0]
            await deployments.fixture(["all"])
            commentsContract = await ethers.getContract("Comments")
            comments = await commentsContract.connect(deployer)
        })

        describe("createComment", () => {
            it("emits an event and creates a comment", async () => {
                expect(await comments.createComment(parentId, contentUri, categoryId)).to.emit(
                    "CommentCreated"
                )
                expect(await comments.createComment(parentId, contentUri, categoryId)).to.emit(
                    "CommentAdded"
                )
            })
        })
    })