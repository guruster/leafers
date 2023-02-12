import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Container, Card, Button, Row, Col, Spinner } from 'react-bootstrap'
import {
    Link
} from "react-router-dom";
import { BsFillLockFill } from 'react-icons/bs'
import '../index.css';
import { getNFTsWithHighResImage } from '../actions/manager';
import { getTokenIdsOf } from '../lib/mint'

const NFT_ADDRESS = process.env.REACT_APP_NFT_ADDRESS

const NftItem = ({ nft }) => {
    return (
        <Card >
            {/* <a href={nft.metadataUri} target='_blank'> */}
            <Card.Img variant="top" src={nft.image} />
            {/* </a> */}
            <Card.Body>
                <Card.Title style={{ display: 'flex', color: 'black', justifyContent: 'space-between', alignItems: 'center', fontSize: '16px' }}>
                    <div>
                        <span style={{ fontSize: '12px', color: 'black' }}>Token Name: </span> {nft.name}
                    </div>
                    <a href={nft.metadataUri} target='_blank' style={{ textDecoration: 'none', fontSize: '12px' }}>
                        Metadata
                    </a>
                </Card.Title>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: 'black' }}>{`Rarity Score:${nft.rarityScore}`}</span>
                    <span style={{ fontSize: '12px', color: 'black' }}>{`Token ID:${nft.tokenId}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <a href={nft.highUri} download target='_blank' style={{ textDecoration: 'none', width: '70%' }}>
                        <Button variant="primary" className='buy_btn'>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <BsFillLockFill />Unlockable content

                            </div>
                        </Button>
                    </a>
                    <a href={`https://opensea.io/assets/${NFT_ADDRESS}/${nft.tokenId}`} target='_blank'>
                        <img src='/opensea.png' width='30px' height='30px' />
                    </a>

                </div>
            </Card.Body>
        </Card>
    )
}

export default function MyCollection() {
    const wallet = useSelector(state => state.manager.wallet)
    const [nfts, setNfts] = useState([])
    const [loadingAssets, setLoadingAssets] = useState(false)

    const getNftsOf = async (wallet) => {
        setLoadingAssets(true)
        console.log(wallet)
        let nftIds = await getTokenIdsOf(wallet)
        console.log('nftIds', nftIds)
        setNfts(await getNFTsWithHighResImage(nftIds))
        setLoadingAssets(false)
    }

    useEffect(() => {
        if (wallet) {
            getNftsOf(wallet)
        } else if (window.localStorage.getItem('wallet')) {
            getNftsOf(window.localStorage.getItem('wallet'))
        }
    }, [])

    return (
        <div className='d-flex flex-column justify-content-center mt-5'>
            <div className='d-flex justify-content-center align-items-center' style={{position:'relative'}}>
                <h3 style={{ textDecoration: 'none', color: 'grey' }}>
                    <span >My Collection</span>
                </h3>
                <div style={{ position:'absolute', right:'10px' }}>
                    <a href="/" style={{}}> - Back - </a>
                </div>
            </div>

            {
                loadingAssets ?
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Spinner animation="border" role="status">
                        </Spinner>
                        <span style={{ fontSize: '24px', margin: '10px' }}>Loading collections...</span>
                    </div>
                    : nfts?.length === 0 &&
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span style={{ fontSize: '24px', margin: '10px' }}>There is no collection.</span>
                    </div>
            }
            <Row className='g-4 mx-auto'>
                {
                    nfts?.map((nft, index) =>
                        <Col key={index} sm={6} md={4}>
                            <NftItem nft={nft} />
                        </Col>
                    )
                }
            </Row>
        </div>
    )
}