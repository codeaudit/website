### What is 0x?
0x is an open protocol that facilitates trustless, low friction exchange of Ethereum-based assets.

### How is 0x different from an exchange like Poloniex or ShapeShift?
- 0x is a protocol for exchange, not a user-facing exchange application.
- 0x is decentralized and trustless; there is no central party which can be hacked, run away with customer funds or be subjected to government regulations. Hacks of Mt. Gox, Shapeshift and Bitfinex have demonstrated that these types of systemic risks are palpable.

### How is a protocol for exchange different from an exchange application?
0x protocol is based upon a set of Ethereum smart contracts that are open, publicly accessible and free to use. Rather than a proprietary system that exists to extract rent for its owners, 0x is public infrastructure that is funded by a globally distributed community of stakeholders. And while the protocol is free to use, it enables for-profit user-facing exchange applications to be built on top of the protocol.

### What problem does 0x solve?
In the two years that have passed since the Ethereum blockchain’s genesis block, numerous decentralized applications (dApps) have created Ethereum smart contracts for peer-to-peer exchange. Rapid iteration and a lack of best practices have left the blockchain scattered with proprietary and application-specific implementations. As a result, end users are exposed to numerous smart contracts of varying quality and security, with unique configuration processes and learning curves, all of which implement the same functionality. This approach imposes unnecessary costs on the network by fragmenting end users according to the particular dApp each user happens to be using, destroying valuable network effects around liquidity. We believe that smart contracts should act as modular, unopinionated building blocks that may be assembled and reconfigured.

### What are the differences between 0x protocol and state channels?
Participants in a state channel pass cryptographically signed messages back and forth, accumulating intermediate state changes without publishing them to the canonical chain until the channel is closed. State channels are ideal for “bar tab” applications where numerous intermediate state changes may be accumulated off-chain before being settled by a final on-chain transaction (i.e. day trading, poker, turn-based games).

- While state channels drastically reduce the number of on-chain transactions for specific use cases, numerous on-chain transactions and a security deposit are required to open and safely close a state channel making them less efficient than 0x for executing one-time trades.
- State channels are isolated from the Ethereum blockchain meaning that they cannot interact with smart contracts. 0x is designed to be integrated directly into smart contracts so trades can be executed programmatically in a single line of Solidity code.

### What types of digital assets are supported by 0x?
0x supports all Ethereum-based assets that adhere to the [ERC20](https://github.com/ethereum/EIPs/issues/20) token standard. There are [many](https://etherscan.io/tokens) ERC20 tokens, worth a combined $300M, and more are [being created](https://www.icoalert.com/) each month. We believe that, by 2020, thousands of assets will be tokenized and moved onto the Ethereum blockchain including traditional securities such as equities, bonds and derivatives, fiat currencies and scarce digital goods such as video game items. In the future, cross-blockchain solutions such as [Cosmos](https://cosmos.network/) and [Polkadot](http://polkadot.io/) will allow cryptocurrencies to freely move between blockchains and, naturally, currencies such as Bitcoin will end up being represented as ERC20 tokens on the Ethereum blockchain.

### If 0x protocol is free to use, where do transaction fees come in?
0x protocol uses off-chain order books to massively reduce friction costs for market makers and ensure that the blockchain is only used for trade settlement. Hosting and maintaining an off-chain order book is a service; to incent “Relayers” to provide this service they must be able to charge transaction fees on trading activity. Relayers are free to set their transaction fees to any value they desire. Generally, we expect Relayers to be highly competitive and transaction fees to approach an efficient economic equilibrium over time.

### Why does 0x protocol need a token?
0x is inherently a cryptoeconomic protocol implemented within a system of Ethereum smart contracts. 0x protocol token (ZRX) will solve the [coordination problem](https://en.wikipedia.org/wiki/Coordination_game), drive network effects around liquidity and create a feedback loop where early adopters and proponents of the protocol benefit from wider adoption.

- ZRX tokens are used by Makers and Takers (market participants that generate and consume orders, respectively) to pay transaction fees to Relayers (entities that host and maintain public order books).
- ZRX tokens are used for decentralized governance over 0x protocol’s update mechanism which allows its underlying smart contracts to be replaced and improved over time. An update mechanism is needed because 0x is built upon Ethereum’s rapidly evolving technology stack, decentralized governance is needed because 0x protocol’s smart contracts will have access to user funds and numerous dApps will need to plug into 0x smart contracts. Decentralized governance ensures that this update process is secure and minimizes disruption to the network.

### Why must transaction fees be denominated in 0x token (ZRX) rather than ETH?
0x protocol’s decentralized update mechanism is somewhat analogous to proof-of-stake. To maximize the alignment of stakeholder and end user incentives, the staked asset must provide utility within the protocol.

### 0x is open source: what prevents someone from forking the protocol?
Ethereum and Bitcoin are both open source protocols. Each protocol has been forked, but the resulting clone networks have seen little adoption (as measured by transaction count or market cap). This is because users have little to no incentive to switch over to a clone network if the original has initial network effects and a talented developer team behind it.

An exception is in the case that a protocol includes a controversial feature such as a method of rent extraction or a monetary policy that favors one group of users over another (Zcash developer subsidy - for better or worse - resulted in Zclassic). Perceived inequality can provide a strong enough incentive that users will fork the original protocol’s codebase and spin up a new network that eliminates the controversial feature. In the case of 0x, there is no rent extraction and no users are given special permissions.

### What if a forked version of 0x adds a new feature or makes an improvement to the original protocol?
0x protocol is upgradable. Cutting-edge technical capabilities can be integrated into 0x via decentralized governance, eliminating incentives to fork off of the original protocol and sacrifice the network effects surrounding liquidity that result from the shared protocol and settlement layer.

### Can’t someone fork the protocol and remove transaction fees?
If Relayers are willing to host and maintain an order book for free they can already volunteer their free services using 0x. If they are not willing to offer their services for free then a fork that removes transaction fees will have zero liquidity (because there will be no Relayers).

### There are already so many tokens in the Ethereum ecosystem, what if I don’t want to deal with yet another token?
We understand your frustration, there are many application-specific tokens in the Ethereum ecosystem and it can be undesirable to hold small amounts of each one. 0x will make it possible for dApp developers to eliminate the burden of acquiring/holding many tokens through a capability we call “token abstraction.” Essentially, token abstraction allows dApps to obfuscate smart contract interactions with application-specific tokens so that end users appear to only be paying transaction fees denominated in ETH (or even local fiat currency, assuming there are fiat-pegged tokens on the Ethereum blockchain). Token abstraction works by chaining multiple orders together and executing them sequentially and synchronously in a single transaction.

### What is the total supply of ZRX tokens?
100,000,000 fixed supply.

### Will there be a token sale? When?
Yes, our target for the crowd sale is late Q3 or early Q4.

### What will the crowd sale proceeds be used for?
100% of the proceeds raised in the crowdsale will be used to fund the development of open source software, tools and infrastructure that support the protocol and surrounding ecosystem. Check out our [development roadmap](https://docs.google.com/document/d/1_RVa-_bkU92fWRsC8eNy4vYjcTt-WC8GtqyyjbTd-oY/edit?usp=sharing).

### What will be the initial distribution of ZRX tokens?
Approximate values:

<img src="/images/zrx_distribution.png" width="280px" />

### Why does the Foundation plan to retain a significant portion of ZRX tokens?
As a nonprofit foundation, we need to be able to sustain operations over a long time horizon and will retain some ZRX tokens for future fundraising. Foundation ZRX tokens will also be used to incentivize new employees and hire top talent.

### Can I mine ZRX tokens?
No, the total supply of ZRX tokens is fixed and there is no continuous issuance model. Users that facilitate trading over 0x protocol by operating a Relayer earn transaction fees denominated in ZRX; as more trading activity is generated, more transaction fees are earned.

### Will there be a lockup period for tokens allocated to the founding team?
Yes. ZRX tokens allocated to founders, advisors and staff members will be released over a 3 year vesting schedule with a 25% cliff upon completion of a successful crowdsale and 25% released each subsequent year in monthly installments. Staff members hired after the crowdsale will have a 4 year vesting schedule with a one year cliff.

### Will 0x Foundation keep all of the crowdsale proceeds as ETH?
No. 0x Foundation’s priority is to build and sustain operations needed to successfully execute our [development roadmap](https://docs.google.com/document/d/1_RVa-_bkU92fWRsC8eNy4vYjcTt-WC8GtqyyjbTd-oY/edit#heading=h.t4wxmss17cg0 ). By keeping 100% of the crowdsale proceeds as ETH, we are exposing our future operations and employees to currency risk. A significant percentage of crowdsale proceeds will be exchanged for fiat currency. Governance over the movement and expenditure of crowdsale proceeds will be shared by founders, advisors and 0x Foundation’s legal counsel.

### Will there be a lockup period for ZRX tokens sold in the crowd sale?
No, ZRX tokens sold in the crowd sale will immediately be liquid.

### Who can participate in the crowd sale? Will it be open to US citizens?
We are currently analyzing the legal and regulatory implications of the ZRX token and expect to have compliance guidance prior to the crowdsale.

### Which cryptocurrencies will be accepted in the crowdsale?
ETH.

### When will 0x be live?
An alpha version of 0x has been live on our private test network since January 2017. Version 1.0 of 0x protocol will be deployed to the canonical Ethereum blockchain after a round of security audits and prior to the public crowdsale.

### Where can I find a project roadmap?
Check it out [here](https://docs.google.com/document/d/1_RVa-_bkU92fWRsC8eNy4vYjcTt-WC8GtqyyjbTd-oY/edit#heading=h.t4wxmss17cg0).

### How will decentralized governance work?
Decentralized governance is an ongoing focus of research; it will involve token voting with ZRX. Ultimately the solution will maximize security while also maximizing the protocol’s ability to absorb new innovations. Until the governance structure is formalized and encoded within 0x DAO, a multi-sig will be used as a placeholder.

### What is the legal structure of the 0x Foundation?
0x Foundation is structured in the same way the Ethereum Foundation is: as a nonprofit organization based in the Swiss Canton of Zug, also known as crypto-valley.

### Where is 0x based?
0x was founded in SF and is driven by a diverse group of contributors.

### How can I get involved?
Join our [Slack](https://slack.0xproject.com/)! As an open source project, 0x will rely on a worldwide community of passionate developers to contribute proposals, ideas and code.

### Why the name 0x?
0x is the prefix for hexadecimal numeric constants including Ethereum addresses. In a more abstract context, as the first open protocol for exchange 0x represents the beginning of the end for the exchange industry’s rent seeking oligopoly: zero exchange.

### How do you pronounce 0x?
We pronounce 0x as “zero-ex,” but you are free to pronounce it however you please.
