
## DMarket Blockchain Explorer JS client

Creating instance and functions.
```
Instance creation:

client = new DMBCClient("https://dmarket.com", keypair)

keyPair is optional parameter, have next structure:

{publicKey: string, secretKey: string}.

If you not define this parmeter DMBCClient generate new keyPair.

```

DMBCClient functions:
```
createWallet() - create wallet and generate 100 DMC coins

addAssets (assets) - add assets

assets it's array of asset, asset have next structure:
{hash_id: string, amount: number}

TradeAsset(buyer, seller, assets, price) - trade assets

buyer - buyer`s wallet hash,
seller - seller`s wallet hash,
assets - see above
price - string,

Transfer(from, to, amount, assets) transfer assets

from: wallet hash,
to: wallet hash,
amount: number,
assets: see above

Exchange(sender, senderAssets, senderValue, recipient, recipientAssets, recipientValue)
sender: wallet hash,
senderAssets: see above,
senderValue: number,
recipient: wallet hash,
recipientAssets: see above,
recipientValue: number,

Mining()
```