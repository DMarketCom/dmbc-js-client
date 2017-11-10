import * as Exonum from 'exonum-client';

export class DMBCClient {

    private keypair: any;
    private apiUrl: string;

    constructor(client: string, keypair?: KeyPair) {
        if (keypair) {
            this.keypair = keypair;
        } else {
            this.keypair = Exonum.keyPair();
        }
        this.apiUrl = client;
    }

    public getKeyPair() {
        return this.keypair;
    }

    public getClient() {
        return this. apiUrl;
    }

    public createWallet() {
        let data: CreateWallet = {
            body: {
                pub_key: this.keypair.publicKey,
            },
            network_id: 0,
            protocol_version: 0,
            service_id: 2,
            message_id: 1,
            signature: "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
        };
        data.signature = this.createSignature(data, this.keypair);
        return this.createSomething(data);
    }

    public addAssets(assets: Array<Asset>) {
        let data: AddAsset = {
            body: {
                pub_key: this.keypair.publicKey,
                assets: assets,
                seed: Exonum.randomUint64()
            },
            network_id: 0,
            protocol_version: 0,
            service_id: 2,
            message_id: 3,
            signature: "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
        };
        data.signature = this.createSignature(data, this.keypair);
        return this.createSomething(data);
    }

    public tradeAsset(buyer: KeyPair, seller: KeyPair, assets: Array<Asset>, price: string) {
        let data: TradeAsset = {
            body: {
                buyer: buyer.publicKey,
                offer: {
                    seller: seller.publicKey,
                    assets: assets,
                    price: price
                },
                seed: Exonum.randomUint64(),
                seller_signature: "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
            },
            network_id: 0,
            protocol_version: 0,
            service_id: 2,
            message_id: 5,
            signature: "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
        };
        data.body.seller_signature = this.createSignature(data, seller, true);
        data.signature = this.createSignature(data, buyer);
        return this.createSomething(data);
    }

    public transfer(from: KeyPair, to: KeyPair, amount: string, assets: Array<Asset>) {
        let data: Transfer = {
            body: {
                from: from.publicKey,
                to: to.publicKey,
                amount: amount,
                assets: assets,
                seed: Exonum.randomUint64()
            },
            network_id: 0,
            protocol_version: 0,
            service_id: 2,
            message_id: 2,
            signature: "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
        };
        data.signature = this.createSignature(data, this.keypair);
        return this.createSomething(data);
    }

    public exchange(sender: KeyPair, senderAssets: Array<Asset>, senderValue: string, recipient: KeyPair, recipientAssets: Array<Asset>, recipientValue: string) {
        let data: Exchange = {
            body: {
                offer: {
                    sender: sender.publicKey,
                    sender_assets: senderAssets,
                    sender_value: senderValue,
                    recipient: recipient.publicKey,
                    recipient_assets: recipientAssets,
                    recipient_value: recipientValue,
                    fee_strategy: 1,
                },
                seed: Exonum.randomUint64(),
                sender_signature: "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            },
            network_id: 0,
            protocol_version: 0,
            service_id: 2,
            message_id: 6,
            signature: "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
        };
        data.body.sender_signature = this.createSignature(data, sender, true);
        data.signature = this.createSignature(data, recipient);
        return this.createSomething(data);
    }

    public mining() {
        let data: Mining = {
            body: {
                pub_key: this.keypair.publicKey,
                seed: Exonum.randomUint64()
            },
            network_id: 0,
            protocol_version: 0,
            service_id: 2,
            message_id: 7,
            signature: "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
        };
        data.signature = this.createSignature(data, this.keypair);
        return this.createSomething(data);
    }

    private hexToBin(str: string): Uint8Array {
        if (typeof str !== 'string') {
            throw new TypeError('Wrong data type passed to convertor. Hexadecimal string is expected');
        }
        const uInt8arr = new Uint8Array(str.length / 2);
        for (let i = 0, j = 0; i < str.length; i += 2, j++) {
            uInt8arr[j] = parseInt(str.substr(i, 2), 16);
        }
        return uInt8arr;
    }

    private getHashInBytes(body: any, offer) {
        let url = '/api/services/cryptocurrency/v1/hash';
        offer ? url += '/offer' : false;
        let hash = this.sendRequest("POST", url, body);
        return this.hexToBin(hash.hash);
    }

    private createSomething(body: any) {
        return this.sendRequest("POST", '/api/services/cryptocurrency/v1/wallets/transaction', body);
    }

    private createSignature(data, keyPair, offer?) {
        let bytes = this.getHashInBytes(data, offer = false);
        return Exonum.sign(keyPair.secretKey, bytes);
    }

    private sendRequest(method: string, url: string, body?: any) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, `${this.apiUrl}${url}`, false);
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        xhr.send([JSON.stringify(body)]);
        if (xhr.status != 200) {
            console.log(xhr.status + ': ' + xhr.responseText);
            return false;
        } else {
            console.log('RESPONSE: ', xhr.response);
            return JSON.parse(xhr.response)
        }
    }
}



export interface KeyPair {
    publicKey: string;
    secretKey: string;
}


export interface Asset {
    hash_id: string;
    amount: number;
}

interface Basic {
    network_id: 0;
    protocol_version: 0;
    service_id: 2;
    signature: string;
}

export interface CreateWallet extends Basic {
    body: {
        pub_key: string;
    };
    message_id: 1;
}

export interface AddAsset extends Basic {
    body: {
        pub_key: string;
        assets: Array<Asset>;
        seed: string;
    };
    message_id: 3;
}

export interface TradeAsset extends Basic {
    body: {
        buyer: string;
        offer: {
            seller: string;
            assets: Array<Asset>;
            price: string;
        };
        seed: string;
        seller_signature: string;
    };
    message_id: 5;
}

export interface Transfer extends Basic {
    body: {
        from: string;
        to: string;
        amount: string;
        assets: Array<Asset>;
        seed: string;
    };
    message_id: 2;
}

export interface Exchange extends Basic {
    body: {
        offer: {
            sender: string;
            sender_assets: Array<Asset>;
            sender_value: string;
            recipient: string;
            recipient_assets: Array<Asset>;
            recipient_value: string;
            fee_strategy: 1;
        };
        seed: string;
        sender_signature: string;
    };
    message_id: 6;
}

export interface Mining extends Basic {
    body: {
        pub_key: string;
        seed: string;
    };
    message_id: 7;
}
