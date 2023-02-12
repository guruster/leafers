import { SET_WALLET } from './types'
import axios from 'axios'
import { getHighUris, getTokenUris, getRarityScores } from '../lib/mint';



export const setWallet = (wallet) => dispatch => {
    dispatch({
        type: SET_WALLET,
        payload: wallet
    })
}

export const getNFTsWithHighResImage = async (nftIds) => {
    // try {
      if (nftIds.length === 0) {
        return []
      }
      let tokenURIs = await getTokenUris(nftIds)
      let highURIs = getHighUris(nftIds)
      let rarityScores = getRarityScores(nftIds)
      console.log(tokenURIs, highURIs)
      let nfts = []
      for (let i = 0; i < tokenURIs.length; i++) {
        try {
          let nft = (await axios.get(tokenURIs[i])).data
          nfts.push({ ...nft, metadataUri:tokenURIs[i], tokenId: nftIds[i], highUri: highURIs[i], rarityScore:rarityScores[i] })
        } catch (err) {
  
        }
      }
      console.log('nfts', nfts)
      return nfts
    // } catch (err) {
    //   console.log(err.message)
    //   return []
    // }
  }