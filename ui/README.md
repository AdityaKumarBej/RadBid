<div align="center">
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
2. Upload both `radbid.abi` and `radbid.wasm`
3. Click on "publish package"
4. The wallet should open up and ask you to submit the transaction
5. On the wallet click on "submit"
6. The deployed package address should get displayed. **You will need it for the next step**.

## Interacting with our package
1. Navigate to the ui and api folder
2. "npm install" to install the dependencies
3. npm run dev in both ui and api to start their own servers
4. default ui port - 3000 , default api port - 9086

## Testing via Resim for Smart Contract Functionality
1. resim new-account
2. export acc1=<account-component-address>
3. export pk1=<private-key>

4. resim publish . 
5. export package=<package-id from step 4>          //(equivalent to the .abi and wasm file in alphanet)

6. resim call-function $package UserAuth instantiate_user_auth - gives component address and 4 resources are generated and approved users vault will have users badge
7. export component=<component-address from step 6> //now we can access other methods in this contract

8. resim show $acc1   - Shows Admin Account
//the first created account has admin badge
//create a new account to assign some other badge

9. resim new-account  - Create New Account
10. export acc2=<account-component-address>
11. export pk2=<private-key>
12. resim set-default-account $acc2 $pk2    //set new account as default account
13. resim call-method $component request_user JohnDoe         //this mints a temporary badge NFT ; JohnDoe-username
14. resim show $acc2      - John has a temp badge now
15. resim call-method $component approve_user JohnDoe  - John cannot access "approve_user" as he does not have an Admin Badge

16. resim set-default-account $acc1 $pk1  - switch back to admin account
17. resim show $acc1 - to get the resource address of admin badge
18. export admin=<admin-badge-resource-address>
19. resim call-method $component approve_user JohnDoe --proofs 1,$admin --manifest approve_user.rtm
20. resim run approve_user.rtm - this runs the generated rtm file     

//The RTM files contains the following:
// Creates the proof of your admin badge
// Locks the transaction fees required for the transaction
// Calls the method
// Deposits any resources put on the transaction layer

//now shifting back to acc2 to claim the user using temp badge
21. resim set-default-account $acc2 $pk2    //switch back to JohnDoe
22. resim show $acc2
23. export temporary_badge=<temp-badge-address>
24. resim call-method $component claim_user 1,$temporary_badge        //JohnDoe has tempbadge and is authorized to call function "claim_user"
25. resim show $acc2 - JohnDoe now has the userbadge 
