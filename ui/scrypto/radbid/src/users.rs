use scrypto::prelude::*;

#[derive(NonFungibleData)]
pub struct User {
    user_name: String,
    user_address: String,
    user_state: String,
    user_postcode: String,
    user_country: String,
    user_mobilephone: String,
    user_email: String
}


blueprint! {
    struct UserData {
        // Define what resources and data will be managed by Hello components
        nft_badge_vault: Vault,
        user_nft_address: ResourceAddress,
        user_database: BTreeSet<NonFungibleId>,
    }

    impl UserData {
        // Implement the functions and methods which will manage those resources and data
        pub fn instantiate_user() -> ComponentAddress {

            let nft_minting_badge: Bucket = ResourceBuilder::new_fungible()
                .metadata("name", "Minting Badge")
                .metadata("symbol", "MB")
                .initial_supply(1);

            let user_nft_address: ResourceAddress = ResourceBuilder::new_non_fungible()
                .metadata("name", "UserNFTAddr")
                .metadata("symbol", "UNFT")
                .mintable(rule!(require(nft_minting_badge.resource_address())), LOCKED)
                .no_initial_supply();

            Self {
                nft_badge_vault: Vault::with_bucket(nft_minting_badge),
                user_nft_address: user_nft_address,
                user_database: BTreeSet::new(),
            }
            .instantiate()
            .globalize()
        }
   
        pub fn create_user(&mut self, user_name: String, user_address: String, 
                                        user_state: String, user_postcode: String,
                                        user_country: String, user_mobilephone: String,
                                        user_email: String) -> Bucket {

            let user_nft: Bucket = self.nft_badge_vault.authorize(|| {
                let resource_manager = borrow_resource_manager!(self.user_nft_address);
                resource_manager.mint_non_fungible(
                    // The NFT ID
                    &NonFungibleId::random(),
                    // The NFT Data
                    User {
                        user_name: user_name,
                        user_address: user_address,
                        user_state: user_state,
                        user_postcode: user_postcode,
                        user_country: user_country,
                        user_mobilephone: user_mobilephone,
                        user_email: user_email
                    },
                )
            });

            self.user_database.insert(user_nft.non_fungible::<User>().id());

            return user_nft
        }

        pub fn verify_user(&self, user_nft: Bucket) -> Bucket {

            assert_eq!(
                user_nft.resource_address(), 
                self.user_nft_address,
                "User does not belong to this protocol!"
            );

            let user_data: User = user_nft.non_fungible().data();

            info!("Your first name is: {:?} and your last name is: {:?}", user_data.first_name, user_data.last_name);

            return user_nft
        } 

        pub fn show_user(&self, user_nft: Bucket) -> (String, String, Bucket) {
            
            assert_eq!(
                user_nft.resource_address(), 
                self.user_nft_address,
                "User does not belong to this protocol!"
            );

            let user_data: User = user_nft.non_fungible().data();

            let first_name: String = user_data.first_name;
            let last_name: String = user_data.last_name;
            (first_name, last_name, user_nft)
        }
        
        //get user by email id
        // pub fun get_user(&self, email: String)



        pub fn list_users(&self) -> BTreeSet<NonFungibleId> {
            let list_of_users: BTreeSet<NonFungibleId> = self.user_database.clone();
            return list_of_users
            }


        pub fn list_users_all(&self) -> Vec<(String, String)> {
                let list_of_users = self.user_database.iter();
    
                let mut string_of_users: Vec<(String, String)> = Vec::new();
    
                for non_fungible_id in list_of_users {
                    let resource_manager = borrow_resource_manager!(self.user_nft_address);
                    let user_data: User = resource_manager.get_non_fungible_data(non_fungible_id);
    
                    let first_name: String = user_data.first_name;
                    let last_name: String = user_data.last_name;
    
                    string_of_users.push((first_name, last_name));
                }
                
                return string_of_users
            }
    }
}
