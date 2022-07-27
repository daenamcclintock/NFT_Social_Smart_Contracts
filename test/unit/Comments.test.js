const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { idText, convertTypeAcquisitionFromJson } = require("typescript")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Comments Contract Unit Tests", () => {
        let comments, commentsContract
        const parentId = "0x0000000000000000000000000000000000000000000000000000000000000000"
        const contentUri = "https://ipfs.com"
        const categoryId = "0x0000000000000000000000000000000000000000000000000000000000000000"
        const commentId = "0x0000000000000000000000000000000000000000000000000000000000000000"
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

        describe("voteUp", () => {
        //     it("reverts if the user tries to vote on their own comment", async () => {
        //         const voter = "0x0000000000000000000000000000000000000000"
        //         const error = "User cannot vote their own comments"
        //         const createComment = await comments.createComment(parentId, contentUri, categoryId)
        //         console.log('THIS IS COMMENT', createComment)
        //         const getComment = await comments.getComment(createComment.hash)
        //         console.log(getComment)
        //         createdCommentId = getComment[0]
        //         console.log(createdCommentId)
        //         await expect(
        //             comments.voteUp(createComment.r, reputationAdded)
        //         ).to.be.revertedWith(error)
        //     })

            it("reverts if the user tries to vote on a comment more than once", async () => {
                const error = "User already voted on this comment"
                await comments.createComment(parentId, contentUri, categoryId)
                const upVote = await comments.voteUp(commentId, reputationAdded)
                await expect(
                    comments.voteUp(commentId, reputationAdded)
                ).to.be.revertedWith(error)
            })

            it("reverts if address tries to add too many repuation points", async () => {
                const error = "This address cannot add this amount of reputation points"
                const reputationPointsAdded = 5
                await comments.createComment(parentId, contentUri, categoryId)
                await expect(
                    comments.voteUp(commentId, reputationPointsAdded)
                ).to.be.revertedWith(error)
            })

            it("emits an event and adds a like to the post", async () => {
                await comments.createComment(parentId, contentUri, categoryId)
                expect(await comments.voteUp(commentId, reputationAdded)).to.emit(
                    "Voted"
                )
            })
        })

        describe("voteDown", () => {
            it("reverts if the user tries to vote on a comment more than once", async () => {
                const error = "User already voted in this comment"
                await comments.createComment(parentId, contentUri, categoryId)
                await comments.voteDown(commentId, reputationTaken)
                await expect(
                    comments.voteDown(commentId, reputationTaken)
                ).to.be.revertedWith(error)
            })

            it("reverts if address tries to take too many repuation points", async () => {
                const error = "This address cannot take this amount of reputation points"
                const reputationPointsTaken = 5
                await comments.createComment(parentId, contentUri, categoryId)
                await expect(
                    comments.voteDown(commentId, reputationPointsTaken)
                ).to.be.revertedWith(error)
            })

            it("emits an event and adds a dislike to the post", async () => {
                expect(await comments.voteDown(commentId, reputationTaken)).to.emit(
                    "Voted"
                )
            })
        })
    })