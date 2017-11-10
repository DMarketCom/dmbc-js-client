"use strict";
exports.__esModule = true;
var Exonum = require("exonum-client");
var DmBlockchainExplorerClient = (function () {
    function DmBlockchainExplorerClient(commonService) {
        this.commonService = commonService;
    }
    DmBlockchainExplorerClient.prototype.makeKeyPair = function () {
        this.keypair = Exonum.keyPair();
    };
    DmBlockchainExplorerClient.prototype.setApiUrl = function (apiUrl) {
        this.apiUrl = apiUrl;
    };
    DmBlockchainExplorerClient.prototype.createWallet = function () {
        var _this = this;
        var data = {
            body: {
                pub_key: this.keypair.publicKey,
                seed: '123'
            },
            network_id: 0,
            protocol_version: 0,
            service_id: 2,
            message_id: 1,
            signature: ''
        };
        var bytes;
        var txHash;
        this.commonService.getHash(this.apiUrl, data).subscribe(function (response) {
            bytes = _this.hexToBytes(response);
            data.signature = Exonum.sign(_this.keypair.secretKey, bytes);
            _this.commonService.createWallet(_this.apiUrl, data).subscribe(function (hash) {
                txHash = hash;
            });
        });
        return txHash;
    };
    DmBlockchainExplorerClient.prototype.hexToBytes = function (hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
    };
    return DmBlockchainExplorerClient;
}());
//# sourceMappingURL=dmbc-js-client.js.map