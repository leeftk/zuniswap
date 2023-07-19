/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  SpaceRouter,
  SpaceRouterInterface,
} from "../../contracts/SpaceRouter";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract SpaceLP",
        name: "_spaceLP",
        type: "address",
      },
      {
        internalType: "contract SpaceCoin",
        name: "_spaceCoin",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AmountLessThanDesired",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientLiquidity",
    type: "error",
  },
  {
    inputs: [],
    name: "SendMoreETH",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountEth",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountSpc",
        type: "uint256",
      },
    ],
    name: "LiquidityAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "LiquidityRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "spcIn",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ethOutMin",
        type: "uint256",
      },
    ],
    name: "swapETH",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "spcOutMin",
        type: "uint256",
      },
    ],
    name: "swapSPC",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "spc",
        type: "uint256",
      },
    ],
    name: "addLiquidity",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "lpToken",
        type: "uint256",
      },
    ],
    name: "removeLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "spaceCoin",
    outputs: [
      {
        internalType: "contract SpaceCoin",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "spaceLP",
    outputs: [
      {
        internalType: "contract SpaceLP",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "spcOutMin",
        type: "uint256",
      },
    ],
    name: "swapETHForSPC",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "spcIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "ethOutMin",
        type: "uint256",
      },
    ],
    name: "swapSPCForETH",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051610deb380380610deb83398101604081905261002f91610078565b600080546001600160a01b039384166001600160a01b031991821617909155600180549290931691161790556100b2565b6001600160a01b038116811461007557600080fd5b50565b6000806040838503121561008b57600080fd5b825161009681610060565b60208401519092506100a781610060565b809150509250929050565b610d2a806100c16000396000f3fe6080604052600436106100655760003560e01c80639c8f9f23116100435780639c8f9f23146100f5578063c293e99114610115578063e48575d41461012857600080fd5b80631a90a90d1461006a57806351c6590a1461008c5780637d72eb831461009f575b600080fd5b34801561007657600080fd5b5061008a610085366004610b95565b610155565b005b61008a61009a366004610bb7565b61032f565b3480156100ab57600080fd5b506000546100cc9073ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200160405180910390f35b34801561010157600080fd5b5061008a610110366004610bb7565b610851565b61008a610123366004610bb7565b610a72565b34801561013457600080fd5b506001546100cc9073ffffffffffffffffffffffffffffffffffffffff1681565b6001546000546040517f23b872dd00000000000000000000000000000000000000000000000000000000815233600482015273ffffffffffffffffffffffffffffffffffffffff9182166024820152604481018590529116906323b872dd90606401602060405180830381600087803b1580156101d157600080fd5b505af11580156101e5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102099190610bd0565b50600080546040517fa278d0360000000000000000000000000000000000000000000000000000000081523360048201526024810183905273ffffffffffffffffffffffffffffffffffffffff9091169063a278d03690604401602060405180830381600087803b15801561027d57600080fd5b505af1158015610291573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102b59190610bf9565b9050818110156102f1576040517f75cb2be800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60408051848152602081018390527f78dd6b0f5ef597525c2ac7dfef8138bcfb91732d217e0099d8d262830b835ed0910160405180910390a1505050565b34610366576040517fc130bdf500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008054604080517f0902f1ac0000000000000000000000000000000000000000000000000000000081528151849373ffffffffffffffffffffffffffffffffffffffff1692630902f1ac9260048082019391829003018186803b1580156103cd57600080fd5b505afa1580156103e1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104059190610c12565b9150915060008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b15801561047257600080fd5b505afa158015610486573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104aa9190610bf9565b6105ed576001546000546040517f23b872dd00000000000000000000000000000000000000000000000000000000815233600482015273ffffffffffffffffffffffffffffffffffffffff9182166024820152604481018790529116906323b872dd90606401602060405180830381600087803b15801561052a57600080fd5b505af115801561053e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105629190610bd0565b506000546040517ff340fa0100000000000000000000000000000000000000000000000000000000815233600482015273ffffffffffffffffffffffffffffffffffffffff9091169063f340fa019034906024016000604051808303818588803b1580156105cf57600080fd5b505af11580156105e3573d6000803e3d6000fd5b5050505050610811565b6000836105fa8487610c65565b6106049190610ca2565b90508034101561062e5760008361061b8634610c65565b6106259190610ca2565b92506106d59050565b803411156106d15760006106428234610cdd565b604051909150600090339083908381818185875af1925050503d8060008114610687576040519150601f19603f3d011682016040523d82523d6000602084013e61068c565b606091505b50509050806106c7576040517f75cb2be800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b86935050506106d5565b8491505b6001546000546040517f23b872dd00000000000000000000000000000000000000000000000000000000815233600482015273ffffffffffffffffffffffffffffffffffffffff9182166024820152604481018590529116906323b872dd90606401602060405180830381600087803b15801561075157600080fd5b505af1158015610765573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107899190610bd0565b506000546040517ff340fa0100000000000000000000000000000000000000000000000000000000815233600482015273ffffffffffffffffffffffffffffffffffffffff9091169063f340fa019083906024016000604051808303818588803b1580156107f657600080fd5b505af115801561080a573d6000803e3d6000fd5b5050505050505b6040805182815234602082015233917fac1d76749e5447b7b16f5ab61447e1bd502f3bb4807af3b28e620d1700a6ee45910160405180910390a250505050565b60008054604080517f0902f1ac0000000000000000000000000000000000000000000000000000000081528151849373ffffffffffffffffffffffffffffffffffffffff1692630902f1ac9260048082019391829003018186803b1580156108b857600080fd5b505afa1580156108cc573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108f09190610c12565b915091508160001480610901575080155b15610938576040517fbb55fd2700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000546040517f23b872dd00000000000000000000000000000000000000000000000000000000815233600482015273ffffffffffffffffffffffffffffffffffffffff9091166024820181905260448201859052906323b872dd90606401602060405180830381600087803b1580156109b157600080fd5b505af11580156109c5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109e99190610bd0565b506000546040517f51cff8d900000000000000000000000000000000000000000000000000000000815233600482015273ffffffffffffffffffffffffffffffffffffffff909116906351cff8d990602401600060405180830381600087803b158015610a5557600080fd5b505af1158015610a69573d6000803e3d6000fd5b50505050505050565b34610aa9576040517fc130bdf500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600080546040517fa278d0360000000000000000000000000000000000000000000000000000000081523360048201526001602482015273ffffffffffffffffffffffffffffffffffffffff9091169063a278d0369034906044016020604051808303818588803b158015610b1d57600080fd5b505af1158015610b31573d6000803e3d6000fd5b50505050506040513d601f19601f82011682018060405250810190610b569190610bf9565b9050818111610b91576040517f75cb2be800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5050565b60008060408385031215610ba857600080fd5b50508035926020909101359150565b600060208284031215610bc957600080fd5b5035919050565b600060208284031215610be257600080fd5b81518015158114610bf257600080fd5b9392505050565b600060208284031215610c0b57600080fd5b5051919050565b60008060408385031215610c2557600080fd5b505080516020909101519092909150565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615610c9d57610c9d610c36565b500290565b600082610cd8577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b500490565b600082821015610cef57610cef610c36565b50039056fea2646970667358221220f9a0b037b1c31b8c870b5119f2de73d7a35b3d38564a6301a86809097fc6fd5164736f6c63430008090033";

type SpaceRouterConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SpaceRouterConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SpaceRouter__factory extends ContractFactory {
  constructor(...args: SpaceRouterConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _spaceLP: PromiseOrValue<string>,
    _spaceCoin: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<SpaceRouter> {
    return super.deploy(
      _spaceLP,
      _spaceCoin,
      overrides || {}
    ) as Promise<SpaceRouter>;
  }
  override getDeployTransaction(
    _spaceLP: PromiseOrValue<string>,
    _spaceCoin: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_spaceLP, _spaceCoin, overrides || {});
  }
  override attach(address: string): SpaceRouter {
    return super.attach(address) as SpaceRouter;
  }
  override connect(signer: Signer): SpaceRouter__factory {
    return super.connect(signer) as SpaceRouter__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SpaceRouterInterface {
    return new utils.Interface(_abi) as SpaceRouterInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SpaceRouter {
    return new Contract(address, _abi, signerOrProvider) as SpaceRouter;
  }
}