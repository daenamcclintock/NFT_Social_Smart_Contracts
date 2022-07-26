const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { idText, convertTypeAcquisitionFromJson } = require("typescript")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Comments Contract Unit Tests", () => {

    })