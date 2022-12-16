use scrypto::prelude::*;

#[derive(NonFungibleData)]
pub struct Item {
    item_name: String,
    item_description: String,
    item_tag: String,
    price_point: String,
    last_bid_price: String,
}


blueprint! {
    struct AuctionDataItems {
        // Define what resources and data will be managed by Hello components
        nft_badge_vault: Vault,
        item_nft_address: ResourceAddress,
        item_database: BTreeSet<NonFungibleId>,
    }

    impl AuctionDataItems {
        // Implement the functions and methods which will manage those resources and data
        pub fn instantiate_item() -> ComponentAddress {

            let nft_minting_badge: Bucket = ResourceBuilder::new_fungible()
                .metadata("name", "Minting Badge")
                .metadata("symbol", "MB")
                .initial_supply(1);

            let item_nft_address: ResourceAddress = ResourceBuilder::new_non_fungible()
                .metadata("name", "Item NFT Address")
                .metadata("symbol", "itemNFT")
                .mintable(rule!(require(nft_minting_badge.resource_address())), LOCKED)
                .no_initial_supply();

            Self {
                nft_badge_vault: Vault::with_bucket(nft_minting_badge),
                item_nft_address: item_nft_address,
                item_database: BTreeSet::new(),
            }
            .instantiate()
            .globalize()
        }
   
        pub fn create_item(&mut self, item_name: String, item_description: String, 
                                        item_tag: String, price_point: String,
                                        last_bid_price: String) -> Bucket {

            let item_nft: Bucket = self.nft_badge_vault.authorize(|| {
                let resource_manager = borrow_resource_manager!(self.item_nft_address);
                resource_manager.mint_non_fungible(
                    // The NFT ID
                    &NonFungibleId::random(),
                    // The NFT Data
                    Item {
                        item_name: item_name,
                        item_description: item_description,
                        item_tag: item_tag,
                        price_point: price_point,
                        last_bid_price: last_bid_price,
                    },
                )
            });

            self.item_database.insert(item_nft.non_fungible::<Item>().id());
            return item_nft
        }



        pub fn list_items(&self) -> BTreeSet<NonFungibleId> {
            let list_of_items: BTreeSet<NonFungibleId> = self.item_database.clone();
            return list_of_items
            }


        pub fn list_items_all(&self) -> Vec<(String, String)> {
                let list_of_items = self.item_database.iter();
    
                let mut string_of_items: Vec<(String, String)> = Vec::new();
    
                for non_fungible_id in list_of_items {
                    let resource_manager = borrow_resource_manager!(self.item_nft_address);
                    let item_data: item = resource_manager.get_non_fungible_data(non_fungible_id);
    
                    let item_name: String = item_data.item_name;
                    let item_description: String = item_data.item_description;
                    let item_tag: String = item_data.item_tag;
                    let price_point: String = item_data.price_point;
                    let last_bid_price: String = item_data.last_bid_price;
    
                    string_of_items.push((item_name,item_description,item_tag,price_point,last_bid_price));
                }
                
                return string_of_items
            }
    }
}
