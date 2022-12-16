import Sdk, { ManifestBuilder } from '@radixdlt/alphanet-walletextension-sdk';
import { KeyValueStoreEntrySubstateFromJSON, TransactionApi, VaultSubstateFromJSON } from '@radixdlt/alphanet-gateway-api-v0-sdk'

//package_tdx_a_1qxnlsy8ld4n0drr4swfsy2y9f2vefkdgqkc66e5cumnqspts72  PACKAGE ADDRESS


// Initialize the SDK
const sdk = Sdk()
const transactionApi = new TransactionApi()

let accountAddress = "" // User account address
let componentAddress = ""  // Component address
// let packageAddress = "" // Package address



let packageAddress = "package_tdx_a_1qxnlsy8ld4n0drr4swfsy2y9f2vefkdgqkc66e5cumnqspts72"
let firstName = "John";   //front-end
let lastName = "Doe";

const result = await sdk.request({
  accountAddresses: {},
})

if (result.isErr()) {
  throw result.error
}

const { accountAddresses } = result.value
const acc_address = accountAddresses[0].address  //THIS IS THE ACCOUNT ADDRESS HARDCODED


let manifest = new ManifestBuilder()
.callMethod(accountAddress, "lock_fee", ['Decimal("100")'])
.callFunction(packageAddress, "UserData", "instantiate_user")
.build()
.toString();

const hash = await sdk
.sendTransaction(manifest)
.map((response) => response.transactionHash)

if (hash.isErr()) throw hash.error

// Fetch the receipt from the Gateway SDK
const receipt = await transactionApi.transactionReceiptPost({   //if the tx is successfull or not
v0CommittedTransactionRequest: { intent_hash: hash.value },
})


componentAddress = receipt.committed.receipt.state_updates.new_global_entities[1].global_address //after this we can access other methods


let manifest_1 = new ManifestBuilder()
.callMethod(accountAddress, "lock_fee", ['Decimal("100")'])
.callMethod(componentAddress, "create_user", [firstName, lastName])
.callMethod(accountAddress, "deposit_batch", ['Expression("ENTIRE_WORKTOP")'])    //VACCUMS EVERYTHING FROM WORKTOP AND DEPOSITS
.build()
.toString();


const hash1 = await sdk
.sendTransaction(manifest_1)
.map((response) => response.transactionHash)

const receipt1 = await transactionApi.transactionReceiptPost({   //if the tx is successfull or not
  v0CommittedTransactionRequest: { intent_hash: hash1.value },
  })

console.log("checking receipt", receipt1);



let manifest_2 = new ManifestBuilder()
.callMethod(accountAddress, "lock_fee", ['Decimal("100")'])
.callMethod(componentAddress, "list_users_all")
.build()
.toString();

const hash2 = await sdk
.sendTransaction(manifest_2)
.map((response) => response.transactionHash)

const receipt2 = await transactionApi.transactionReceiptPost({   //if the tx is successfull or not
  v0CommittedTransactionRequest: { intent_hash: hash2.value },
  })

console.log("checking receipt", receipt2);
// {
//   "userName": "John Doe",
//   "userAddress": "dfe"
// }