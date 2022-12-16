<div align="center">
<!--   <p>
    <a href="https://github.com/Debitable/Radix-Debitable"><img src="https://i.imgur.com/9q4gLid.png" width="500" alt="Debitable" /></a>
    <h1>Debitable - Radix</h1>
  </p> -->

<a href="https://github.com/Debitable/Radix-Debitable/issues"><img src="https://camo.githubusercontent.com/f5054ffcd4245c10d3ec85ef059e07aacf787b560f83ad4aec2236364437d097/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f636f6e747269627574696f6e732d77656c636f6d652d627269676874677265656e2e7376673f7374796c653d666c6174" alt="Contributions" /></a>
<a href="https://github.com/Debitable/Radix-Debitable/actions"><img src="https://github.com/Debitable/Radix-Debitable/actions/workflows/npm-grunt.yml/badge.svg" alt="Node Application Test" /></a>
<a href="https://github.com/Debitable/Radix-Debitable"><img src="https://img.shields.io/github/languages/count/Debitable/Radix-Debitable" alt="Languages" /></a>
<a href="https://github.com/Debitable/Radix-Debitable/LICENSE"><img alt="LICENSE" src="https://img.shields.io/github/license/Debitable/Radix-Debitable" /></a>

  Auction Application - <b>RadBid</b> using Radix
</div>

<h2>Features:</h2>

- Authorization mechanism
- Add users to system as admin
- Add items for auction
- Conduct English style open bid auction sysstem

**Future work**:
- [ ] Bulk import of contacts
- [ ] Efficient implementation with Betanet for avoiding testing via resim
- [ ] User Profile page for Admin and Participants
- [ ] Auction Item Page for detailed description of item
- [ ] Detailed testing and bug-fixes

## Pre-requisites
1. Node >= 12.17.0
2. The Alphanet wallet installed. Instructions [here](https://docs.radixdlt.com/main/scrypto/alphanet/wallet-extension.html)
3. Scrypto v0.6.0. Instructions to install [here](https://docs.radixdlt.com/main/scrypto/getting-started/install-scrypto.html) and update [here](https://docs.radixdlt.com/main/scrypto/getting-started/updating-scrypto.html)

## Building the Scrypto code
1. Enter the scrypto directory in a terminal: `cd scrypto`
1. Build the code: `scrypto build`
1. Two important files (`debitable.abi` and `debitable.wasm`) will be generated in `scrypto/target/wasm32-unknown-unknown/release/`

## Deploy the package to Alphanet
1. Go to the [package deployer website](https://alphanet-deployer.radixdlt.com/)
2. Upload both `debitable.abi` and `debitable.wasm`
3. Click on "publish package"
4. The wallet should open up and ask you to submit the transaction
5. On the wallet click on "submit"
6. The deployed package address should get displayed. **You will need it for the next step**.

## Interacting with our package
1. Open `src/index.ts` in the editor of your choice and set the value of the variable `packageAddress` to the previously obtained package address.
2. In a terminal go to the root of this project (Radix-Debitable)
3. Install the npm dependencies: `npm install`
4. Start the local server with `npm start`
5. Open up your browser at the provided URL if it doesn't open automatically.
6. Make sure that you have created an account on the wallet extension.
7. Use the Wallet Extension and Identification Address to interact with the system.
