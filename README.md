# How to use tool

##### 1. Export master public key
- Use this tool to get master public key and chain code. With mater public key and chain code, we can create many child address follow BIP32, BIP39 and BIP44
- How to use tool:
    ```
    npm run export_pubkey
    ```
##### 2. Export child private key
- Use this tool to get child private key by index and passphrase
- How to use tool:
    ```
    npm run export_privkey
    ```
##### 3. Export child address
- Use this tool to get child address by index and master public key
- How to use tool:
    ```
    npm run export_address
    ```
    
# Implementation
1. The BIP39 generates a seed from passphrase and password. The password is optional.
2. The BIP32 generates master private key, chain code from seed. The private key created relevant master public key.
3. From master private key and master public key, child keys can be created and they can have more children by themselve.
4. The BIP44 creates a standard HD path to generate child keys from their parents key (master keys)
5. An address of child is created by prarent public key and chain code. ***Follow this way, security issue should be faced that is leak child private key and chain code can help hacker to revert parents keys and sibling keys on the chain. Solution is used harden child keys. However, harden child address is created by private parents key.***

# References
1. https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
2. https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
3. https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
