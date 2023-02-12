/* eslint-disable */
import Web3 from 'web3'
import { NFT_ABI } from './abi.js'
import summary_input from './WoA_summary.txt'
import { pinJSONToIPFS } from './pinata.js'
import axios from 'axios'

const rinkebynet = 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
const Ropsten = 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
const Goerli = 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
const mainnet = 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';

// const NFT_ADDRESS = process.env.REACT_APP_NFT_ADDRESS
// const NFT_ADDRESS = '0x211DE30c54d8A8C28D73fC3804ed47a96DE4C01c'    // CDC ropsten
const NFT_ADDRESS = '0x624A6f1809096E08DAaA9053d54bc2804DECa56E' // WOA goerli
const PRICE = process.env.REACT_APP_PRICE
const RENAME_PRICE = process.env.REACT_APP_RENAME_PRICE

var HIGH_RES_URIS = []
var METADATA_URIS = []
var RARITY_SCORES = []
const GROUP_PREFIX = ['GPF', 'VIP', 'C', 'G', 'M', 'P']
const GROUP_COUNTS = [100, 100, 13, 497, 11, 6]
const GROUP_STARTS = [1, 101, 201, 214, 711, 722]

// fetch(Rarity_input)
//     .then((r) => r.text())
//     .then(text => {
//         RARITY_SCORES = text.split("\n").map(item => {
//             let rarity = item.replace('\r', '')
//             rarity = rarity.split('_')
//             return rarity[rarity.length - 1]
//         })
//         // console.log(HIGH_RES_URIS)
//     })

// fetch(High_res_input)
//     .then((r) => r.text())
//     .then(text => {
//         HIGH_RES_URIS = text.split("\n").map(item => item.replace('\r', ''))
//         // console.log(HIGH_RES_URIS)
//     })

// fetch(Metadata_input)
//     .then((r) => r.text())
//     .then(text => {
//         var lines = text.split("\n").map(item => item.replace('\r', ''))
//         for (var line = 1; line < lines.length; line++) {
//             if (lines[line]) {
//                 const infuraUrlset = lines[line].split("	");
//                 var element = infuraUrlset[infuraUrlset.length - 1];
//                 METADATA_URIS.push(element);
//             }
//         }
//         // console.log(METADATA_URIS)
//     })

fetch(summary_input)
    .then((r) => r.text())
    .then(text => {
        var lines = text.split("\n").map(item => item.replace('\r', ''))
        for (var line = 1; line < lines.length; line++) {
            if (lines[line]) {
                const infuraUrlset = lines[line].split("	");
                HIGH_RES_URIS.push(infuraUrlset[1])
                RARITY_SCORES.push(infuraUrlset[2])
                METADATA_URIS.push(infuraUrlset[infuraUrlset.length - 1]);
            }
        }
        console.log(HIGH_RES_URIS)
        console.log(RARITY_SCORES)
        console.log(METADATA_URIS)
    })

export const mint = async (account, amount, groupId) => {
    try {

        let abc_contract = new window.web3.eth.Contract(NFT_ABI, NFT_ADDRESS);
        let tokenCounter = await getTotalMinted()
        let mintUris = METADATA_URIS.slice(tokenCounter, tokenCounter + amount);
        console.log('mint tokenUris', mintUris);
        console.log('groupId', groupId)
        let res = await abc_contract.methods.mint(account, mintUris, groupId).send({ from: account, value: window.web3.utils.toWei((PRICE * amount).toString(), "ether") })
        return res.status
    } catch (err) {
        console.log(err.message)
    }
}

export const giveaway = async (account, addresses, groupId) => {
    try {
        let amount = addresses.length
        let abc_contract = new window.web3.eth.Contract(NFT_ABI, NFT_ADDRESS);
        let tokenCounter = await getTotalMinted()
        let mintUris = METADATA_URIS.slice(tokenCounter, tokenCounter + amount);
        console.log('addresses', addresses)
        console.log('mint tokenUris', mintUris);
        console.log('groupId', groupId)
        let res = await abc_contract.methods.giveaway(addresses, mintUris, groupId).send({ from: account })
        return res.status
    } catch (err) {
        console.log(err.message)
    }
}

export const getGroupId = (groupId) => {
    if (!groupId) {
        return 0
    }
    groupId = groupId.toUpperCase()
    for (let i = 0; i < GROUP_PREFIX.length; i++) {
        if (groupId.indexOf(GROUP_PREFIX[i]) === 0 && (Number(groupId.replace(GROUP_PREFIX[i], '')) > 0 && Number(groupId.replace(GROUP_PREFIX[i], '')) <= GROUP_COUNTS[i])) {
            console.log(groupId, Number(groupId.replace(GROUP_PREFIX[i], '')))
            return GROUP_STARTS[i] + Number(groupId.replace(GROUP_PREFIX[i], '')) - 1
        }
    }
    return -1
}


export const getTotalMinted = async () => {
    try {
        let web3 = new Web3(Goerli)
        let abc_contract = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS);
        let tokenCounter = Number(await abc_contract.methods.totalSupply().call());
        console.log('totalminted', tokenCounter)
        return tokenCounter;
    } catch (err) {
        console.log('totalminted', err.message)
    }
}

export const getTokenUris = async (tokenIds) => {
    let web3 = new Web3(Goerli)
    let abc_contract = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS);
    let tokenUris = []
    for (let i = 0; i < tokenIds.length; i++) {
        tokenUris.push((await abc_contract.methods.tokenURI(tokenIds[i]).call()).replace('https://ipfs.infura.io', 'https://gateway.pinata.cloud'))
    }
    return tokenUris
}

export const getHighUris = (tokenIds) => {
    let highURIs = []
    for (let i = 0; i < tokenIds.length; i++) {
        highURIs.push(HIGH_RES_URIS[tokenIds[i]])
    }
    return highURIs
}

export const getRarityScores = (tokenIds) => {
    let rarityScores = []
    for (let i = 0; i < tokenIds.length; i++) {
        rarityScores.push(RARITY_SCORES[tokenIds[i]])
    }
    console.log(rarityScores)
    return rarityScores
}

export const hasEnoughEth = async (account, amount) => {
    try {
        let balance = await window.web3.eth.getBalance(account);
        // console.log(balance, window.web3.utils.toWei((PRICE * amount).toString, "ether"));
        if (isBigger(String(balance), String(window.web3.utils.toWei((PRICE * amount).toString(), "ether"))) >= 0) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err.message);
        return false;
    }
}

export const hasEnoughEthForRename = async (account) => {
    try {
        let balance = await window.web3.eth.getBalance(account);
        // console.log(balance, window.web3.utils.toWei((PRICE * amount).toString, "ether"));
        console.log(balance, RENAME_PRICE)
        if (isBigger(String(balance), String(window.web3.utils.toWei(RENAME_PRICE, "ether"))) >= 0) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err.message);
        return false;
    }
}

export const isBigger = (x, y) => {
    x = x || "0";
    y = y || "0";
    if (x.length > y.length) y = "0".repeat(x.length - y.length) + y;
    else if (y.length > x.length) x = "0".repeat(y.length - x.length) + x;

    for (let i = 0; i < x.length; i++) {
        if (x[i] < y[i]) return -1;
        if (x[i] > y[i]) return 1;
    }
    return 0;
}


export const shortAddress = (address) => {
    if (address !== "" || address !== undefined) {
        let lowCase = address.toLowerCase();
        return "0x" + lowCase.charAt(2).toUpperCase() + lowCase.substr(3, 3) + "..." + lowCase.substr(-4);
    }
    return address;
}

export const getSignatureForMint = async (account, amount, groupId) => {
    if (!account || amount <= 0) {
        return ""
    }
    const web3 = new Web3(Goerli)
    let tokenCounter = await getTotalMinted()
    let mintUris = METADATA_URIS.slice(tokenCounter, tokenCounter + amount);
    console.log('tokenUri', mintUris)
    console.log('groupId', groupId)
    let signature = web3.eth.abi.encodeFunctionCall(
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_to",
                    "type": "address"
                },
                {
                    "internalType": "string[]",
                    "name": "tokenUris",
                    "type": "string[]"
                },
                {
                    "internalType": "uint256",
                    "name": "_groupId",
                    "type": "uint256"
                }
            ],
            "name": "mint",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        [account, mintUris, groupId]
    )
    console.log(`mint signature ${signature}`)
    return signature
}

export const getTokenIdsOf = async (account) => {
    let web3 = new Web3(Goerli)
    let abc_contract = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS);
    let tokenIds = await abc_contract.methods.tokensOfOwner(account).call();

    return tokenIds.map(item => Number(item))
}

export const getNewMetadataURI = async (tokenId, name) => {
    let metadata, metadataURI, tokenURI
    let web3 = new Web3(Goerli)
    let abc_contract = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS);
    try {
        tokenURI = await abc_contract.methods.tokenURI(tokenId).call()
    } catch (err) {
        console.log(err.message)
        return ""
    }

    await axios.get(tokenURI)
        .then(res => {
            metadata = res.data;
        })
        .catch(err => {
            return ""
        })

    metadata.name = name;

    let uploadToIPFS = await pinJSONToIPFS(metadata);
    if (uploadToIPFS.success) {
        metadataURI = 'https://gateway.pinata.cloud/ipfs/' + uploadToIPFS.pinataUrl
        console.log(`rename metadata ${metadataURI}`)
        return metadataURI
    } else {
        return ""
    }
}

export const renameNFT = async (account, tokenId, name) => {
    try {
        let metadataURI = await getNewMetadataURI(tokenId, name)
        if (metadataURI) {
            let abc_contract = new window.web3.eth.Contract(NFT_ABI, NFT_ADDRESS);
            let res = await abc_contract.methods.setTokenUri(account, tokenId, metadataURI).send({ from: account, value: window.web3.utils.toWei(RENAME_PRICE.toString(), "ether") })
            return res.status
        } else {
            return false
        }
    } catch (err) {
        console.log(err.message)
    }
}

export const getSignatureForRename = async (account, tokenId, name) => {
    let metadataURI = await getNewMetadataURI(tokenId, name)
    if (metadataURI) {
        const web3 = new Web3(Goerli)
        let signature = web3.eth.abi.encodeFunctionCall(
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "tokenOwner",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "tokenUri",
                        "type": "string"
                    }
                ],
                "name": "setTokenUri",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            },
            [account, tokenId, metadataURI]
        )
        console.log(`rename signature ${signature}`)
        return signature
    }
    else {
        return ""
    }
}

