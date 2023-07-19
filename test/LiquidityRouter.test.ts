import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs"
import { expect } from 'chai';
import { ethers } from 'hardhat';
//import chai matchers from hardhat


import { LiquidityRouter, Liquidity__factory, SpaceCoin, SpaceCoin__factory, SpaceLP, SpaceLP__factory} from '../typechain-types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { parseEther } from 'ethers/lib/utils';

describe('LiquidityRouter', () => {
    let Liquidity__factory: Liquidity__factory;
    let spaceRouter: LiquidityRouter;
    let SpaceCoin: SpaceCoin__factory;
    let spaceCoin: SpaceCoin;
    let spaceLP: SpaceLP;
    let SpaceLP: SpaceLP__factory;
    let deployer: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress;
    let carol: SignerWithAddress;

    beforeEach(async () => {
        // get signer
        [deployer, alice, bob, carol] = await ethers.getSigners();
        //instation contract factory
        //deploys spacecoin
        SpaceCoin = (await ethers.getContractFactory(
            'SpaceCoin',
            deployer
        )) as SpaceCoin__factory;
        spaceCoin = ( await SpaceCoin.deploy(alice.address,bob.address)) as SpaceCoin;
        const spaceCoinAddress = await spaceCoin.deployed();
        //deploys spaceLP
        SpaceLP = (await ethers.getContractFactory(
            'SpaceLP',
            deployer
        )) as SpaceLP__factory;
        spaceLP = ( await SpaceLP.deploy(spaceCoin.address)) as SpaceLP;
        await spaceLP.deployed();
        //deploys liquidityRouter
        Liquidity__factory = (await ethers.getContractFactory(
            'SpaceRouter',
            deployer
        )) as Liquidity__factory;
        spaceRouter = ( await Liquidity__factory.deploy(spaceLP.address, spaceCoin.address)) as LiquidityRouter;
        await spaceRouter.deployed();
    });

    describe('constructor', () => {
        it('should deploy all the contracts', async () => {
            expect(await spaceRouter.deployed()).to.not.eq(0);
            expect(await spaceRouter.spaceCoin()).to.eq(spaceCoin.address); 
            expect(await spaceRouter.spaceLP()).to.eq(spaceLP.address);    
        });
    })

    describe('addLiquidity', () => {
        it('should add liquidity', async () => {
       
            await spaceCoin.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceLP.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceRouter.connect(alice).addLiquidity(parseEther('1000'),{value: parseEther('1000')});
            expect(await spaceLP.balanceOf(alice.address)).to.eq(parseEther('1000'));

})
        it('should add liquidity twice', async () => {
       
            await spaceCoin.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceLP.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceLP.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceRouter.connect(alice).addLiquidity(parseEther('500'),{value: parseEther('500')});
            await spaceRouter.connect(alice).addLiquidity(parseEther('500'),{value: parseEther('500')});
            expect(await spaceLP.balanceOf(alice.address)).to.eq(parseEther('1000'));

})

        it('should add liquidity twice even if swap is perfomred in between', async () => {
            await spaceCoin.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceLP.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceLP.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceRouter.connect(alice).addLiquidity(parseEther('500'),{value: parseEther('500')});
            await spaceRouter.connect(alice).swapETHForSPC(parseEther('.0000001'),{value: parseEther('5')});
            await spaceRouter.connect(alice).addLiquidity(parseEther('1'),{value: parseEther('1000')});
            expect(await spaceLP.balanceOf(alice.address)).changeTokenBalance(spaceLP, alice.address, parseEther('500'));

})
        it("should show correct balance of spacecoin", async () => {
            await spaceCoin.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceLP.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceRouter.connect(alice).addLiquidity(parseEther('1000'),{value: parseEther('1000')});
            expect(await spaceCoin.balanceOf(spaceLP.address)).to.eq(parseEther('1000'));
        })
        it('should revert if not enough spacecoin', async () => {
            await spaceCoin.connect(carol).approve(spaceRouter.address, parseEther('1000'));
            await expect(spaceRouter.connect(carol).addLiquidity(parseEther('1000'),{value: parseEther('1000')})).to.be.revertedWith('ERC20: transfer amount exceeds balance');
        })
    })
        it('should revert if not enough ether', async () => { 
            await spaceCoin.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await expect(spaceRouter.connect(alice).addLiquidity( parseEther('1000'),{value: parseEther('0')})).to.be.revertedWith;
        })

    describe('removeLiquidity', () => {
        it('should remove liquidity', async () => {
            await spaceCoin.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceLP.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceRouter.connect(alice).addLiquidity(parseEther('1000'),{value: parseEther('1000')});
            await spaceRouter.connect(alice).removeLiquidity(parseEther('1'));
        })
        it('should revert if not enough spaceLP', async () => {
            await spaceCoin.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceLP.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceRouter.connect(alice).addLiquidity(parseEther('1000'),{value: parseEther('1000')});
            await spaceLP.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await expect(spaceRouter.connect(alice).removeLiquidity(1)).to.be.revertedWith;
    })
    })
    describe('swap', () => {
        it('should swap eth for space', async () => {
            await spaceCoin.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceLP.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceLP.connect(alice).approve(spaceRouter.address, parseEther('2000'));
            await spaceRouter.connect(alice).addLiquidity(parseEther('10'),{value: parseEther('10')});
            await spaceRouter.connect(alice).swapETHForSPC(0,{value: parseEther('1')});
           expect(await spaceCoin.balanceOf(alice.address)).to.changeTokenBalance(spaceCoin, alice, parseEther('10'));
        })
        it("should revert if not enough eth", async () => {
            await spaceCoin.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceLP.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceRouter.connect(alice).addLiquidity(parseEther('100'),{value: parseEther('1000')});
            await expect(spaceRouter.connect(alice).swapETHForSPC(10,{value: parseEther('0')})).to.be.revertedWith;
        })
        it('should swap space for eth', async () => {
            await spaceCoin.connect(alice).approve(spaceRouter.address, parseEther('10000000'));
            await spaceLP.connect(alice).approve(spaceRouter.address, parseEther('10000'));
           
        }
        )
        it("should revert if not enough space", async () => {
            await spaceCoin.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceLP.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceRouter.connect(alice).addLiquidity(parseEther('100'),{value: parseEther('1000')});
            await expect(spaceRouter.connect(alice).swapSPCForETH(0,{value: parseEther('100')})).to.be.revertedWith;
        })
        it("should  swap with right amount of slippage", async () => {
            await spaceCoin.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceLP.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceRouter.connect(alice).addLiquidity(parseEther('1'),{value: parseEther('1')});
            await expect(spaceRouter.connect(alice).swapETHForSPC(parseEther('.000001'),{value: parseEther('.0000000001')})).to.be.revertedWith;
        })
        it("should  swap with liquidity being added in between transactions", async () => {
            await spaceCoin.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceLP.connect(alice).approve(spaceRouter.address, parseEther('1000'));
            await spaceRouter.connect(alice).addLiquidity( parseEther('1000'),{value: parseEther('1000')});
            await spaceCoin.connect(alice).approve(spaceRouter.address, parseEther('10000000'));
            await spaceRouter.connect(alice).swapSPCForETH(10,1);
           expect(await spaceCoin.balanceOf(alice.address)).to.changeTokenBalance(spaceCoin, alice, parseEther('10'));
           await spaceRouter.connect(alice).addLiquidity( parseEther('1000'),{value: parseEther('1000')});
           expect(await spaceCoin.balanceOf(alice.address)).to.changeTokenBalance(spaceCoin, alice, parseEther('10'));


        })
    })
    })




