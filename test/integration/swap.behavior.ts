import { expect } from "chai";
import { ethers, artifacts, waffle, network } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

// constructor variables
const SYNTHETIX_PROXY = "0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4"; // ProxyERC20
const SUSD_PROXY = "0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9"; // ProxyERC20sUSD
const VOLUME_REWARDS = ethers.constants.AddressZero;
const AGGREGATION_ROUTER_V3 = "0x11111112542D85B3EF69AE05771c2dCCff4fAa26";
const ADDRESS_RESOLVER = "0x95A6a3f44a70172E7d50a9e28c85Dfd712756B8C"

const TEST_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // Make sure it has ETH
const SETH_PROXY = "0xE405de8F52ba7559f9df3C368500B6E6ae6Cee49";

const TRANSACTION_PAYLOAD_1INCH = 
    "0x7c02520000000000000000000000000027239549dd40e1d60f5b80b0c4196923745b1fd200000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000180000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00000000000000000000000057ab1ec28d129707052df4df418d58a2d46d5f5100000000000000000000000027239549dd40e1d60f5b80b0c4196923745b1fd2000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa000000000000000000000000000000000000000000000000016345785d8a00000000000000000000000000000000000000000000000000148b78263105efae3f00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006200000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000003a0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000004d0e30db000000000000000000000000000000000000000000000000000000000000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000f80758ab42c3b07da84053fd88804bcb6baa4b5c000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a4b757fed6000000000000000000000000f80758ab42c3b07da84053fd88804bcb6baa4b5c000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc200000000000000000000000057ab1ec28d129707052df4df418d58a2d46d5f510000000000000000002dc6c027239549dd40e1d60f5b80b0c4196923745b1fd200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000184b3af37c00000000000000000000000000000000000000000000000000000000000000080800000000000000000000000000000000000000000000000000000000000002400000000000000000000000057ab1ec28d129707052df4df418d58a2d46d5f51000000000000000000000000000000010000000000000000000000000000000100000000000000000000000057ab1ec28d129707052df4df418d58a2d46d5f510000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

const SETH_BYTES32 = "0x7345544800000000000000000000000000000000000000000000000000000000";
const WETH_ADDRESS = "0x4200000000000000000000000000000000000006";

describe("Integration: Test Synthswap.sol", function () {
    before(async () => {
        await network.provider.request({
            method: "hardhat_reset",
            params: [
                {
                    forking: {
                        jsonRpcUrl: process.env.ARCHIVE_NODE_URL,
                        blockNumber: 1025934,
                    },
                },
            ],
        });

        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [TEST_ADDRESS],
        });
        
        await network.provider.request({
            method: "hardhat_setBalance",
            params: [TEST_ADDRESS, ethers.utils.parseEther("10").toHexString()],
        });
    });

    it("Test swap ETH into sETH", async () => {
        // ETH -(1inchAggregator)-> sUSD -(Synthetix)-> sETH
        const SynthSwap = await ethers.getContractFactory("SynthSwap");
        const synthswap = await SynthSwap.deploy(
            SYNTHETIX_PROXY,
            SUSD_PROXY,
            VOLUME_REWARDS,
            AGGREGATION_ROUTER_V3,
            ADDRESS_RESOLVER
        );
        await synthswap.deployed();

        const IERC20ABI = (await artifacts.readArtifact("IERC20")).abi;
        const mockProvider = waffle.provider;
        const signer = await ethers.getSigner(TEST_ADDRESS);

        // pre-swap balance
        const sETH = new ethers.Contract(SETH_PROXY, IERC20ABI, mockProvider);
        const preBalance = await sETH.balanceOf(TEST_ADDRESS);

        // Replace 0xaaa... placeholder from generated payload with deployed SynthSwap address.
        // This is because when generating the 1inch payload we need to specify a destination receiver address,
        // which is our SynthSwap contract, and this is not known ahead of time.
        var TRANSACTION_PAYLOAD_1INCH_WITH_DEST_AS_CONTRACT =
            TRANSACTION_PAYLOAD_1INCH.replace(
                /aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/g,
                synthswap.address.substring(2) // Slice off "0x"
            );

        TRANSACTION_PAYLOAD_1INCH_WITH_DEST_AS_CONTRACT =
            TRANSACTION_PAYLOAD_1INCH_WITH_DEST_AS_CONTRACT.replace(
                /c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/g, // Replace L1 WETH address with L2 WETH address
                WETH_ADDRESS.substring(2) // Slice off "0x"
            );

        TRANSACTION_PAYLOAD_1INCH_WITH_DEST_AS_CONTRACT =
            TRANSACTION_PAYLOAD_1INCH_WITH_DEST_AS_CONTRACT.replace(
                /57ab1ec28d129707052df4df418d58a2d46d5f51/g, // Replace L1 sUSD address with L2 sUSD address
                SUSD_PROXY.substring(2) // Slice off "0x"
            );

        await synthswap
            .connect(signer) // Call swap from TEST_ADDRESS
            .swapInto(
                SETH_BYTES32,
                TRANSACTION_PAYLOAD_1INCH_WITH_DEST_AS_CONTRACT,
                {
                    gasLimit: 1000000, // If tx reverts increase gas limit
                    value: ethers.BigNumber.from("100000000000000000"),
                }
            );
        
        // post-swap balance
        const postBalance = await sETH.balanceOf(TEST_ADDRESS);

        // Check ETH balance increased
        expect(postBalance).to.be.above(preBalance);
        //expect(postBalance.toString()).to.equal("98802617794637161");
    });

    it.skip("Test swap sETH to WETH", async () => { 
        // sETH -(Synthetix)-> sUSD -(1inchAggregator)-> WETH
        const SynthSwap = await ethers.getContractFactory("SynthSwap");
        const synthswap = await SynthSwap.deploy(
            SYNTHETIX_PROXY,
            SUSD_PROXY,
            VOLUME_REWARDS,
            AGGREGATION_ROUTER_V3,
            ADDRESS_RESOLVER
        );
        await synthswap.deployed();

        const IERC20ABI = (await artifacts.readArtifact("IERC20")).abi;
        const mockProvider = waffle.provider;
        const signer = await ethers.getSigner(TEST_ADDRESS);
        
        // pre-swap balance
        const WETH = new ethers.Contract(WETH_ADDRESS, IERC20ABI, mockProvider);
        const preBalance = await WETH.balanceOf(TEST_ADDRESS);

        // Replace 0xaaa... placeholder from generated payload with deployed SynthSwap address.
        // This is because when generating the 1inch payload we need to specify a destination receiver address,
        // which is our SynthSwap contract, and this is not known ahead of time.
        var TRANSACTION_PAYLOAD_1INCH_WITH_DEST_AS_CONTRACT =
            TRANSACTION_PAYLOAD_1INCH.replace(
                /aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/g,
                synthswap.address.substring(2) // Slice off "0x"
            );
        
        // to token address (i.e. sETH (prev was sUSD))
        TRANSACTION_PAYLOAD_1INCH_WITH_DEST_AS_CONTRACT =
            TRANSACTION_PAYLOAD_1INCH.replace(
                /57ab1ec28d129707052df4df418d58a2d46d5f51/g, // L1 sUSD
                SETH_PROXY.substring(2) // Slice off "0x"
            );
        
        // from token address (i.e. sUSD (prev was WETH))
        TRANSACTION_PAYLOAD_1INCH_WITH_DEST_AS_CONTRACT =
            TRANSACTION_PAYLOAD_1INCH.replace(
                /c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/g, // L1 WETH
                SUSD_PROXY.substring(2) // Slice off "0x"
            );

        await synthswap
            .connect(signer) // Call swap from TEST_ADDRESS
            .swapOutOf(
                SETH_BYTES32,
                1,
                TRANSACTION_PAYLOAD_1INCH_WITH_DEST_AS_CONTRACT,
                {
                    gasLimit: 1000000, // If tx reverts increase gas limit
                }
            );
        
        // post-swap balance
        const postBalance = await WETH.balanceOf(TEST_ADDRESS);

        // Check ETH balance increased
        expect(postBalance).to.be.above(preBalance);
        //expect(postBalance.toString()).to.equal("98802617794637161");
    });
});