## Zuniswap
This repo is a implementation of an AMM based on the Uniswap core contracts.

## Quick start

The first things you need to do are cloning this repository and installing its
dependencies:

```sh
git clone https://github.com/NomicFoundation/hardhat-boilerplate.git
npm install
```

Once installed, let's run Hardhat's testing network:


```sh
npx hardhat test
```

## Code Coverage Report

--------------------|----------|----------|----------|----------|----------------|
File                |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------|----------|----------|----------|----------|----------------|
 contracts/         |     57.8 |    21.11 |       56 |    53.06 |                |
  Ico.sol           |        0 |        0 |        0 |        0 |... 192,193,194 |
  LiquidityPool.sol |      100 |      100 |      100 |      100 |                |
  Router.sol        |      100 |      100 |      100 |      100 |                |
  SpaceCoin.sol     |    54.55 |    16.67 |    66.67 |    57.14 |... 44,45,46,47 |
  SpaceLP.sol       |    92.31 |       70 |      100 |    90.91 |       43,44,45 |
  SpaceRouter.sol   |    86.84 |    42.31 |      100 |    88.89 | 35,45,46,47,48 |
--------------------|----------|----------|----------|----------|----------------|
All files           |     57.8 |    21.11 |       56 |    53.06 |                |
--------------------|----------|----------|----------|----------|----------------|


## Testnet Deploy Information

| Contract  | Address Etherscan Link |
| --------- | ---------------------- |
| SpaceCoin | `https://sepolia.etherscan.io/address/0x27c8c02700951A3de9a122f5662AfFC4F4c64d43`           |
| ICO       | `https://sepolia.etherscan.io/address/0xF3a7c9424aD604f8A5d8a0Ab463A1E6F09C8C729`           |
| Router    | `https://sepolia.etherscan.io/address/0x5C847c7b98218a5B68829e9D1908860b8dDb1236`           |
| Pool      | `https://sepolia.etherscan.io/address/0x618B406D090e8271d7f994eC404b84353B77fD98`           |

