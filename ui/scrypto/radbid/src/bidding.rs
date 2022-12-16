//resim reset
//resim new-account
//export seller_acc=account_sim1qws69s5m4h5evynapqsv6x8lflyhxaakxc4qtsf4m7esryp4m7
//export seller_pk=8dd1fe7207fd54a7ef06f77addada13bafbbd8ede4b9a1dde2eeace5faf9f06d

//resim new-account
//export bidder1_acc=account_sim1qvxm0rr2swl2pma6d0x4r4r98a7t6ur0fw8d8t5l3lzsk8hf7g
//export bidder1_pk=64d7176f5921a5c6a0db695ac5a118372fa48fafa6cdd44eb8a68f28d5033bbe

//resim new-account
//export bidder2_acc=account_sim1qve2nul4mxw036gfycgegmtwq96l56yepm335gx5apks4qtyw4
//export bidder2_pk=b0ef68af96c6b2a443b8a8df62f64266d95f87070b7c119994bd6037e3462cc4

//resim new-account
//export bidder3_acc=account_sim1qvcasdzzvt8u0duyqk7q7yn99zfft8l28xyst26lnjnssrn3t6
//export bidder3_pk=03b6a34a25195ac7c39476681655e56ae13d38a6641b571cf872e0088398dae9

//resim publish .
//export package=package_sim1q9gnrzk66spfhwyfdsun67zy2jmhj4qq7nqcxta5cukqfqy8xh
//resim call-function $package Bootstrap bootstrap
//export cars_nft=resource_sim1qptf5knv7n9q4w5xj57q976j3q5hy9gk40ank030dajqwf8h6y
//export phones_nft=resource_sim1qp0yllvwxul3xrgr03ll0ave7j9zrclhfpj64n7npklqtcdx6l
//export laptops_nft=resource_sim1qqp8tunn24zun4vyhtx23x6xx5wr62jwty2h2a32ljjslu84ez


use scrypto::prelude::*;

blueprint! {
    struct Bidding {
    
        nft_vaults: HashMap<ResourceAddress, Vault>,
        bid_vaults: HashMap<NonFungibleId, Vault>,
        payment_vault: Vault,
        bidders_badge: ResourceAddress,
        admin_badge: Vault,
        ending_epoch: u64,
        state: AuctionState,
    }

    impl Bidding {
        pub fn instantiate_english_auction(
            non_fungible_tokens: Vec<Bucket>,
            relative_ending_epoch: u64,
        ) -> (ComponentAddress, Bucket) {
            assert!(
                relative_ending_epoch > Runtime::current_epoch(),
                "[Instantiation]: The ending epoch has already passed."
            );
            let mut nft_vaults: HashMap<ResourceAddress, Vault> = HashMap::new();
            for bucket in non_fungible_tokens.into_iter() {
                nft_vaults
                    .entry(bucket.resource_address())
                    .or_insert(Vault::new(bucket.resource_address()))
                    .put(bucket)
            }
            let ownership_badge: Bucket = ResourceBuilder::new_fungible()
                .metadata("name", "Ownership Badge")
                .metadata(
                    "description",
                    "An ownership badge used to authenticate the owner of the NFT(s).",
                )
                .metadata("symbol", "OWNER")
                .initial_supply(1);

        
            let admin_badge: Bucket = ResourceBuilder::new_fungible()
                .divisibility(DIVISIBILITY_NONE)
                .metadata("name", "Internal Admin Badge")
                .metadata("description", "A badge used to manage the bidder badges")
                .metadata("symbol", "IADMIN")
                .initial_supply(1);

            let bidder_badge_resource_address: ResourceAddress =
                ResourceBuilder::new_non_fungible()
                    .metadata("name", "Bidder Badge")
                    .metadata(
                        "description",
                        "A badge provided to bidders to keep track of the amount they've bid",
                    )
                    .metadata("symbol", "BIDDER")
                    .mintable(
                        rule!(require(admin_badge.resource_address())),
                        LOCKED,
                    )
                    .burnable(
                        rule!(require(admin_badge.resource_address())),
                        LOCKED,
                    )
                    .updateable_non_fungible_data(
                        rule!(require(admin_badge.resource_address())),
                        LOCKED,
                    )
                    .no_initial_supply();

          
            let access_rule: AccessRule = rule!(require(ownership_badge.resource_address()));
            let access_rules: AccessRules = AccessRules::new()
                .method("cancel_auction", access_rule.clone())
                .method("withdraw_payment", access_rule.clone())
                .default(rule!(allow_all));

  
            let mut english_auction: BiddingComponent = Self {
                nft_vaults,
                bid_vaults: HashMap::new(),
                bidders_badge: bidder_badge_resource_address,
                admin_badge: Vault::with_bucket(admin_badge),
                ending_epoch: Runtime::current_epoch() + relative_ending_epoch,
                state: AuctionState::Open,
            }
            .instantiate();
            english_auction.add_access_check(access_rules);
            let english_auction: ComponentAddress = english_auction.globalize();

            return (english_auction, ownership_badge);
        }

     
        pub fn cancel_auction(&mut self) -> Vec<Bucket> {
            
            self.ensure_auction_settlement();

            
            assert!(
                matches!(self.state, AuctionState::Open)
                    || matches!(self.state, AuctionState::Canceled),
                "[Cancel Auction]: Can not cancel the auction unless we're still "
            );

        
            self.state = AuctionState::Canceled;

            let resource_addresses: Vec<ResourceAddress> =
                self.nft_vaults.keys().cloned().collect();
            let mut tokens: Vec<Bucket> = Vec::new();
            for resource_address in resource_addresses.into_iter() {
                tokens.push(
                    self.nft_vaults
                        .get_mut(&resource_address)
                        .unwrap()
                        .take_all(),
                )
            }

            return tokens;
        }
        pub fn withdraw_payment(&mut self) -> Bucket {
    
            self.ensure_auction_settlement();

            
            assert!(
                matches!(self.state, AuctionState::Settled),
                "[Withdraw Payment]: The payment can only be withdrawn when the auction is settled"
            );

            // At this point we know that the payment can be withdrawn
            return self.payment_vault.take_all();
        }

      
        pub fn bid(&mut self, funds: Bucket) -> Bucket {
            
            self.ensure_auction_settlement();

           
            assert!(
                matches!(self.state, AuctionState::Open),
                "[Bid]: Bids may only be added while the auction is open."
            );

            let non_fungible_id: NonFungibleId = NonFungibleId::random();

            let bidders_badge: Bucket = self.admin_badge.authorize(|| {
                let bidders_resource_manager: &mut ResourceManager =
                    borrow_resource_manager!(self.bidders_badge);
                bidders_resource_manager.mint_non_fungible(
                    &non_fungible_id.clone(),
                    BidderBadge {
                        bid_amount: funds.amount(),
                        is_winner: false,
                    },
                )
            });

            self.bid_vaults
                .insert(non_fungible_id, Vault::with_bucket(funds));

            return bidders_badge;
        }

        
        pub fn increase_bid(&mut self, funds: Bucket, bidders_badge: Proof) {
            
            self.ensure_auction_settlement();
            assert!(
                matches!(self.state, AuctionState::Open),
                "[Increase Bid]: Bids may only be increased while the auction is open."
            );

            let bidders_badge: ValidatedProof = bidders_badge
                .validate_proof(ProofValidationMode::ValidateContainsAmount(
                    self.bidders_badge,
                    dec!("1"),
                ))
                .expect("[Increase Bid]: Invalid proof provided");

            assert_eq!(
                bidders_badge.resource_address(),
                self.bidders_badge,
                "[Increase Bid]: Badge provided is not a valid bidder's badge"
            );
            assert_eq!(
                bidders_badge.amount(), Decimal::one(),
                "[Increase Bid]: This method requires that exactly one bidder's badge is passed to the method"
            );

            self.admin_badge.authorize(|| {
                let mut bidders_badge_data: BidderBadge = bidders_badge.non_fungible().data();
                bidders_badge_data.bid_amount += funds.amount();
                bidders_badge.non_fungible().update_data(bidders_badge_data);
            });

            // Adding the funds to the vault of the bidder
            self.bid_vaults
                .get_mut(&bidders_badge.non_fungible::<BidderBadge>().id())
                .unwrap()
                .put(funds);
        }

       
        pub fn cancel_bid(&mut self, bidders_badge: Bucket) -> Bucket {

            self.ensure_auction_settlement();
            assert_eq!(
                bidders_badge.resource_address(),
                self.bidders_badge,
                "[Cancel Bid]: Badge provided is not a valid bidder's badge"
            );
            assert_eq!(
                bidders_badge.amount(), Decimal::one(),
                "[Cancel Bid]: This method requires that exactly one bidder's badge is passed to the method"
            );
            assert!(
                !bidders_badge.non_fungible::<BidderBadge>().data().is_winner,
                "[Cancel Bid]: You can not cancel your bid after winning the auction."
            );
            
            let funds: Bucket = self
                .bid_vaults
                .get_mut(&bidders_badge.non_fungible::<BidderBadge>().id())
                .unwrap()
                .take_all();
            
            self.admin_badge.authorize(|| bidders_badge.burn());
            return funds;
        }

       
        pub fn claim_nfts(&mut self, bidders_badge: Bucket) -> Vec<Bucket> {
            self.ensure_auction_settlement();
            assert!(
                matches!(self.state, AuctionState::Settled),
                "[Claim NFTs]: NFTs can only be claimed when the auction has settled."
            );

            assert_eq!(
                bidders_badge.resource_address(),
                self.bidders_badge,
                "[Claim NFTs]: Badge provided is not a valid bidder's badge"
            );
            assert_eq!(
                bidders_badge.amount(), Decimal::one(),
                "[Claim NFTs]: This method requires that exactly one bidder's badge is passed to the method"
            );
            assert!(
                bidders_badge.non_fungible::<BidderBadge>().data().is_winner,
                "[Claim NFTs]: Badge provided is not the winner's badge."
            );
            self.admin_badge.authorize(|| bidders_badge.burn());


            let resource_addresses: Vec<ResourceAddress> =
                self.nft_vaults.keys().cloned().collect();
            let mut tokens: Vec<Bucket> = Vec::new();
            for resource_address in resource_addresses.into_iter() {
                tokens.push(
                    self.nft_vaults
                        .get_mut(&resource_address)
                        .unwrap()
                        .take_all(),
                )
            }

            return tokens;
        }
        pub fn ensure_auction_settlement(&mut self) {
            match self.state {
                AuctionState::Open if Runtime::current_epoch() >= self.ending_epoch => {
                    if self.has_bids() {
                        let non_fungible_id: NonFungibleId = self
                            .bid_vaults
                            .iter()
                            .max_by(|a, b| a.1.amount().cmp(&b.1.amount()))
                            .map(|(k, _v)| k)
                            .unwrap()
                            .clone();
                        self.admin_badge.authorize(|| {
                            let resource_manager: &mut ResourceManager =
                                borrow_resource_manager!(self.bidders_badge);

                    
                            let mut bidders_badge_data: BidderBadge =
                                resource_manager.get_non_fungible_data(&non_fungible_id);
                            bidders_badge_data.is_winner = true;

                            
                            resource_manager
                                .update_non_fungible_data(&non_fungible_id, bidders_badge_data);
                        });

                        
                        self.payment_vault.put(
                            self.bid_vaults
                                .get_mut(&non_fungible_id)
                                .unwrap()
                                .take_all(),
                        );

                        self.state = AuctionState::Settled
                    } else {
                        self.state = AuctionState::Canceled
                    }
                }
                _ => {}
            }
        }

       
        pub fn has_bids(&self) -> bool {
            return self.bid_vaults.len() > 0;
        }
    }
}


#[derive(NonFungibleData)]
struct BidderBadge {
   
    #[scrypto(mutable)]
    bid_amount: Decimal,
    #[scrypto(mutable)]
    is_winner: bool,
}

#[derive(Encode, Decode, TypeId, Describe, Debug)]
enum AuctionState {
    Open,
    Settled,
    Canceled,
}
