/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface SpaceRouterInterface extends utils.Interface {
  functions: {
    "addLiquidity(uint256)": FunctionFragment;
    "removeLiquidity(uint256)": FunctionFragment;
    "spaceCoin()": FunctionFragment;
    "spaceLP()": FunctionFragment;
    "swapETHForSPC(uint256)": FunctionFragment;
    "swapSPCForETH(uint256,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addLiquidity"
      | "removeLiquidity"
      | "spaceCoin"
      | "spaceLP"
      | "swapETHForSPC"
      | "swapSPCForETH"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addLiquidity",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "removeLiquidity",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "spaceCoin", values?: undefined): string;
  encodeFunctionData(functionFragment: "spaceLP", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "swapETHForSPC",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "swapSPCForETH",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "addLiquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeLiquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "spaceCoin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "spaceLP", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "swapETHForSPC",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapSPCForETH",
    data: BytesLike
  ): Result;

  events: {
    "LiquidityAdded(address,uint256,uint256)": EventFragment;
    "LiquidityRemoved(address,uint256)": EventFragment;
    "swapETH(uint256,uint256)": EventFragment;
    "swapSPC(uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "LiquidityAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LiquidityRemoved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "swapETH"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "swapSPC"): EventFragment;
}

export interface LiquidityAddedEventObject {
  from: string;
  amountEth: BigNumber;
  amountSpc: BigNumber;
}
export type LiquidityAddedEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  LiquidityAddedEventObject
>;

export type LiquidityAddedEventFilter = TypedEventFilter<LiquidityAddedEvent>;

export interface LiquidityRemovedEventObject {
  from: string;
  amount: BigNumber;
}
export type LiquidityRemovedEvent = TypedEvent<
  [string, BigNumber],
  LiquidityRemovedEventObject
>;

export type LiquidityRemovedEventFilter =
  TypedEventFilter<LiquidityRemovedEvent>;

export interface swapETHEventObject {
  spcIn: BigNumber;
  ethOutMin: BigNumber;
}
export type swapETHEvent = TypedEvent<
  [BigNumber, BigNumber],
  swapETHEventObject
>;

export type swapETHEventFilter = TypedEventFilter<swapETHEvent>;

export interface swapSPCEventObject {
  spcOutMin: BigNumber;
}
export type swapSPCEvent = TypedEvent<[BigNumber], swapSPCEventObject>;

export type swapSPCEventFilter = TypedEventFilter<swapSPCEvent>;

export interface SpaceRouter extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SpaceRouterInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    addLiquidity(
      spc: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    removeLiquidity(
      lpToken: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    spaceCoin(overrides?: CallOverrides): Promise<[string]>;

    spaceLP(overrides?: CallOverrides): Promise<[string]>;

    swapETHForSPC(
      spcOutMin: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    swapSPCForETH(
      spcIn: PromiseOrValue<BigNumberish>,
      ethOutMin: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  addLiquidity(
    spc: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  removeLiquidity(
    lpToken: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  spaceCoin(overrides?: CallOverrides): Promise<string>;

  spaceLP(overrides?: CallOverrides): Promise<string>;

  swapETHForSPC(
    spcOutMin: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  swapSPCForETH(
    spcIn: PromiseOrValue<BigNumberish>,
    ethOutMin: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addLiquidity(
      spc: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    removeLiquidity(
      lpToken: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    spaceCoin(overrides?: CallOverrides): Promise<string>;

    spaceLP(overrides?: CallOverrides): Promise<string>;

    swapETHForSPC(
      spcOutMin: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    swapSPCForETH(
      spcIn: PromiseOrValue<BigNumberish>,
      ethOutMin: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "LiquidityAdded(address,uint256,uint256)"(
      from?: PromiseOrValue<string> | null,
      amountEth?: null,
      amountSpc?: null
    ): LiquidityAddedEventFilter;
    LiquidityAdded(
      from?: PromiseOrValue<string> | null,
      amountEth?: null,
      amountSpc?: null
    ): LiquidityAddedEventFilter;

    "LiquidityRemoved(address,uint256)"(
      from?: PromiseOrValue<string> | null,
      amount?: null
    ): LiquidityRemovedEventFilter;
    LiquidityRemoved(
      from?: PromiseOrValue<string> | null,
      amount?: null
    ): LiquidityRemovedEventFilter;

    "swapETH(uint256,uint256)"(
      spcIn?: null,
      ethOutMin?: null
    ): swapETHEventFilter;
    swapETH(spcIn?: null, ethOutMin?: null): swapETHEventFilter;

    "swapSPC(uint256)"(spcOutMin?: null): swapSPCEventFilter;
    swapSPC(spcOutMin?: null): swapSPCEventFilter;
  };

  estimateGas: {
    addLiquidity(
      spc: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    removeLiquidity(
      lpToken: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    spaceCoin(overrides?: CallOverrides): Promise<BigNumber>;

    spaceLP(overrides?: CallOverrides): Promise<BigNumber>;

    swapETHForSPC(
      spcOutMin: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    swapSPCForETH(
      spcIn: PromiseOrValue<BigNumberish>,
      ethOutMin: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addLiquidity(
      spc: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    removeLiquidity(
      lpToken: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    spaceCoin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    spaceLP(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    swapETHForSPC(
      spcOutMin: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    swapSPCForETH(
      spcIn: PromiseOrValue<BigNumberish>,
      ethOutMin: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}