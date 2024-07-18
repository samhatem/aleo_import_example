// The 'aleo_take_home' program.
import credits.aleo;
program aleo_devrel_take_home.aleo {

    mapping account: address => u64;
    record token {
        owner: address;
        amount: u64;
    }

    transition mint(a: u64) -> token {
        return token{
            owner: self.caller,
            amount: a
        };
    }

    async transition mint_public(a: u64) -> Future {
        return finalize_mint_public(self.caller,a);
    }

    async function finalize_mint_public(receiver:address,a: u64) {
        Mapping::set(account,receiver,a);
    }

    async transition transfer_credits_to_private(receiver:address,a:u64)->(credits.aleo/credits, Future){
        let (c,f): (credits.aleo/credits,Future) = credits.aleo/transfer_public_to_private(receiver,a);
        return (c,finalize_transfer_credits(f));
    }

    async function finalize_transfer_credits(f:Future){
        f.await();
    }
}
