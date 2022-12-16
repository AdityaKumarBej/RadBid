use scrypto::prelude::*;


//resim new-account
//export acc1=account_sim1qwx064edt0qlkahmvc79u7w6n0a4hnuwp9ttvck8fwlsztlcdy
//export pk1=5c2c03c7a21ca98e4786cc98979ce367345b8048697e3375fe20a88399a9b20e

//resim publish . = returns a package address (already published so skipping this step)
//export package=package_sim1q8t2vgqpjdw6f9zc8uf58my6quhdpg034j0qmr4233tsrm64eg  (equivalent to the .abi and wasm file in alphanet)

//resim call-function $package UserAuth instantiate_user_auth - gives component address and 4 resources are generated and approved users vault will have users badge
//export component=component_sim1qfphr7h98mk33fpwqn6nsrv9sxnaj9n3f6kmz0ydtness3yxg8 //now we can access other methods in this contract

//resim show $acc1
//the first created account has admin badge
//create a new account to assign some other badge

//resim new-account
//export acc2=account_sim1qwx064edt0qlkahmvc79u7w6n0a4hnuwp9ttvck8fwlsztlcdy
//export pk2=4f45bcdb4c6ad3c174276f3f4a78d00675a11d7ffe1a5e2xe093fd56dd86a71a7
//resim set-default-account $acc2 $pk2
//resim call-method $component request_user JohnDoe         //this mints a temporary badge NFT
//resim show $acc2      - John has a temp badge now
//resim call-method $component approve_user JohnDoe  - remember that the default account has been set as John

//resim set-default-account $acc1 $pk1
//resim show $acc1 - to get the resource address of admin badge
//export admin=resource_sim1qpdse85227m956hjzcstjjwx6q3tjdgj4zwxq43ctrkq993fkp
//resim call-method $component approve_user JohnDoe --proofs 1,$admin --manifest approve_user.rtm
//resim run approve_user.rtm - this runs the generated rtm file     

// Creates the proof of your admin badge
// Locks the transaction fees required for the transaction
// Calls the method
// Deposits any resources put on the transaction layer

//now shifting back to acc2 to claim the user using temp badge
//resim set-default-account $acc2 $pk2
//resim show $acc2
//export temporary_badge=resource_sim1qzzzjxqgw6thvkv27t3cf7xfwlc65d3k3z36j2k6k3nq6f06gp
//resim call-method $component claim_user 1,$temporary_badge        
//resim show $acc2 - this now has the userbadge 

#[derive(NonFungibleData)]
pub struct TemporaryBadge {
    username: String
}


#[derive(NonFungibleData)]
pub struct UserBadge {
    username: String
}

// This defines our blueprint design that defines the logic of our component. 
blueprint! {
 
    struct UserAuth {
        admin_badge_address: ResourceAddress,
        temporary_badge_address: ResourceAddress,
        component_badge_vault: Vault,
        pending_users: HashMap<String, NonFungibleId>,
        approved_users: HashMap<NonFungibleId, NonFungibleId>,
        user_badge_address: ResourceAddress,
        approved_users_vault: Vault,
    }

    impl UserAuth {

        pub fn instantiate_user_auth() -> (ComponentAddress, Bucket) {
            let admin_badge: Bucket = ResourceBuilder::new_fungible()
                .metadata("name", "Admin Badge")
                .metadata("symbol", "AB")
                .initial_supply(1);
            let component_badge: Bucket = ResourceBuilder::new_fungible()
                .metadata("name", "Component Badge")
                .metadata("symbol", "CB")
                .initial_supply(1);
            
            let temporary_badge: ResourceAddress = ResourceBuilder::new_non_fungible()
                .metadata("name", "Temporary Badge")
                .metadata("symbol", "TB")
                // Mint rule authorized to owner of the component badge.
                .mintable(rule!(require(component_badge.resource_address())), LOCKED)
                // Burn rule authorized to owner of the component badge.
                .burnable(rule!(require(component_badge.resource_address())), LOCKED)
                // No initial supply. Will be minted when "request_user" method is called.
                .no_initial_supply();

            let user_badge: ResourceAddress = ResourceBuilder::new_non_fungible()
                .metadata("name", "User Badge")
                .metadata("symbol", "UB")
                // Mint rule authorized to owner of the component badge.
                .mintable(rule!(require(component_badge.resource_address())), LOCKED)
                // Burn rule authorized to owner of the component badge.
                .burnable(rule!(require(component_badge.resource_address())), LOCKED)
                // No initial supply. Will be minted when "request_user" method is called.
                .no_initial_supply();

            // Access Rule to require admin badge to access the "approve_user" method call.
            let access_rule: AccessRules = AccessRules::new()
                .method("approve_user", rule!(require(admin_badge.resource_address())))
                // All other methods are defaulted to be callable by anyone.
                .default(rule!(allow_all));

            let mut user_auth: UserAuthComponent = Self {
                admin_badge_address: admin_badge.resource_address(),
                temporary_badge_address:temporary_badge,
                component_badge_vault: Vault::with_bucket(component_badge),
                pending_users: HashMap::new(),
                approved_users: HashMap::new(),
                user_badge_address: user_badge,
                approved_users_vault: Vault::new(user_badge),
            }
            .instantiate();
            user_auth.add_access_check(access_rule);
            let user_auth_address: ComponentAddress = user_auth.globalize();

            (user_auth_address, admin_badge)
        }

        /// This method returns a TemporaryBadge NFT in a Bucket.
        pub fn request_user(&mut self, username: String) -> Bucket {
            
            // This will mint us a temporary badge given to users.
            let temporary_badge: Bucket = self.component_badge_vault.authorize(|| {
                let resource_manager: &mut ResourceManager = borrow_resource_manager!(self.temporary_badge_address);
                resource_manager.mint_non_fungible(
                    // The User id
                    &NonFungibleId::random(),
                    // The User data
                    TemporaryBadge {
                        username: username.clone(),
                    },
                )
            });

            // Inserts a record in our `pending_user` data field.
            self.pending_users.insert(username, temporary_badge.non_fungible_id());

            // Returns the TemporaryBadge NFT.
            temporary_badge
        }
        pub fn approve_user(&mut self, username: String) {
            
            let temporary_badge_id: &NonFungibleId = self.pending_users.get(&username).unwrap();

            let user_badge: Bucket = self.component_badge_vault.authorize(|| {
                let resource_manager: &mut ResourceManager = borrow_resource_manager!(self.user_badge_address);
                resource_manager.mint_non_fungible(
                    // The User id
                    &NonFungibleId::random(),
                    // The User data
                    UserBadge {
                        username: username.clone(),
                    },
                )
            });

            self.approved_users.insert(temporary_badge_id.clone(), user_badge.non_fungible_id());

            self.approved_users_vault.put(user_badge);

            self.pending_users.remove_entry(&username);

        }

        /// Approved members will call this method to claim ther UserBadge NFT. To do so, they will need to deposit
        /// their TemporaryBadge NFT. The UserBadge NFT will be returned in a Bucket.
        pub fn claim_user(&mut self, temporary_badge: Bucket) -> Bucket {

            // This asserts that the TemporaryBadge NFT deposited was the TemporaryBadge NFT deposited into this
            // component. This prevents a random person depositing an NFT that is not allowed in this protocol.
            assert_eq!(
                temporary_badge.resource_address(), self.temporary_badge_address,
                "Badge does not belong to this protocol!"
            );

            // This retrieves the UserBadge NFT based on the TemporaryBadge NFT ID assocaited with it.
            let user_badge_id: &NonFungibleId = self.approved_users.get(&temporary_badge.non_fungible_id()).unwrap();

            // This takes the UserBadge NFT from the component's approved_user_vault and puts it in a Bucket.
            let user_badge: Bucket = self.approved_users_vault.take_non_fungible(user_badge_id);
            
            self.approved_users.remove_entry(&temporary_badge.non_fungible_id());

            // This authorizes the burn of the TemporaryBadge NFT deposited.
            self.component_badge_vault.authorize(|| temporary_badge.burn());

            // Returns the UserBadge NFT.
            user_badge
        }

        /// This is an example method of what it would look like how members with the UserBadge NFT can access 
        /// permissioned method calls. They will need to provide a Proof of the UserBadge NFT. Unlike the "claim_user"
        /// method call where the user would have to deposit the TemporaryBadge NFT, the Proof is a copy of the 
        /// UserBadge NFT that will drop at the end of the transaction. This is so the user does not have to physically
        /// send the UserBadge NFT itself, only the Proof that they own the UserBadge NFT. 
        pub fn create_auction(&mut self, user_badge: Proof) {
            
            // This validates the Proof that the UserBadge NFT belongs to this protocol, similar to assertion in the 
            // "claim_user" method. 
            user_badge.validate_proof(ProofValidationMode::ValidateResourceAddress(self.user_badge_address))
            .expect("Incorrect User Badge!");

        }
    }
}