/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Link, useParams, useNavigate
} from "react-router-dom";

import { toast } from 'react-toastify';

import Web3 from 'web3'
import WertWidget from '@wert-io/widget-initializer';
import { signSmartContractData } from '@wert-io/widget-sc-signer';
import { v4 as uuidv4 } from 'uuid';
import Torus from '@toruslabs/torus-embed'
import { BsClipboard } from 'react-icons/bs'

import { setWallet } from '../actions/manager';
import { hasEnoughEth, mint, getTotalMinted, getSignatureForMint, shortAddress, renameNFT, hasEnoughEthForRename, getSignatureForRename, getGroupId } from '../lib/mint';

const PRICE = 1
const RENAME_PRICE = process.env.REACT_APP_RENAME_PRICE

const NETWORK = 'Polygon testnet';
const CHAIN_ID = 80001
// const NFT_ADDRESS = process.env.REACT_APP_NFT_ADDRESS
// const NFT_ADDRESS = '0x211DE30c54d8A8C28D73fC3804ed47a96DE4C01c'  //CDC ropsten
const NFT_ADDRESS = '0xD806A18999E3CC834c737d0Ab934E86C19b1b8E1' //LEAFER mubai
const PARTNER_ID = '01GSA44AKP00EFF4X2SP2DRM0E'
const PRIVATE_KEY = '0x57466afb5491ee372b3b30d82ef7e7a0583c9e36aef0f02435bd164fe172b1d3'


function Container8() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const wallet = useSelector(state => state.manager.wallet)
  const [initWeb3, setInitWeb3] = useState(false);
  const [minting, setMinting] = useState(false);
  const [buying, setBuying] = useState(false)
  const [totalMinted, setTotalMinted] = useState(0);
  const [quantity, setQuantity] = useState(1)
  const [showRename, setShowRename] = useState(false)
  const [tokenId, setTokenId] = useState(-1)
  const [name, setName] = useState("")
  const [renaming, setRenaming] = useState(false)

  useEffect(() => {
    if (getGroupId(id) === -1) {
      navigate('/', { replace: true })
    }
    if (window.ethereum && !initWeb3) {
      setInitWeb3(true);
      window.web3 = new Web3(window.ethereum);
      window.ethereum.on('accountsChanged', function (accounts) {
        // if (accounts[0] !== account) {
        console.log("change", accounts[0]);
        conMetamask();
        // }
      });
      window.ethereum.on('networkChanged', function (networkId) {
        if (Number(networkId) !== CHAIN_ID) {
          toast.warn(`Connect to ${NETWORK} network.`, {
            position: "top-right",
            autoClose: 3000,
            closeOnClick: true,
            hideProgressBar: true,
          });
          return;
        }
        conMetamask();
      });
      conMetamask();
    }
    setTotal()
  }, []);

  /// window.ethereum used to get addrss
  const conMetamask = async (e) => {
    // console.log(e);
    if (window.ethereum) {
      try {
        // const addressArray = await window.ethereum.request({
        //   method: "eth_requestAccounts",
        // });
        // window.web3 = new Web3(window.ethereum);
        //   console.log("account",addressArray[0]);
        const chainId = await window.ethereum.request({
          method: "eth_chainId"
        });
        if (Number(chainId) !== CHAIN_ID) {
          console.log(chainId)
          toast.warn(`Connect to ${NETWORK} network.`, {
            position: "top-right",
            autoClose: 3000,
            closeOnClick: true,
            hideProgressBar: true,
          });

          return;
        }
        const accounts = await window.ethereum.enable();
        console.log(accounts);
        dispatch(setWallet(accounts[0]))
        window.localStorage.setItem('wallet', accounts[0])
        // console.log(await window.web3.eth.getBalance(accounts[0]));
        if (getGroupId(id) >= 0) {
          if (accounts[0] && e) {
            setMinting(true);
            if (await hasEnoughEth(accounts[0], quantity)) {
              if (await mint(accounts[0], quantity, getGroupId(id))) {
                toast.success(`${quantity} NFT Minted Successfully.`, {
                  position: "top-right",
                  autoClose: 3000,
                  closeOnClick: true,
                  hideProgressBar: true,
                });
                setTotal();
              }
            } else {
              toast.warn(`Insufficient funds. Check your wallet balance.`, {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                hideProgressBar: true,
              });
            }
            setMinting(false);
          }
        }
      } catch (err) {
        setMinting(false);
      }
    } else {
      toast.warn('Please install MetaMask extension in your browser', {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        hideProgressBar: true,
      });
    }
  }

  const login = async () => {
    try {
      const torus = new Torus();
      await torus.init();
      await torus.login(); // await torus.ethereum.enable()
      const web3 = new Web3(torus.provider);
      torus.provider.on('accountsChanged', function (accounts) {
        // if (accounts[0] !== account) {
        dispatch(setWallet(accounts[0]))
        window.localStorage.setItem('wallet', accounts[0])
        console.log("change", accounts[0]);
        // }
      });
      torus.provider.on('networkChanged', function (networkId) {
        if (Number(networkId) !== CHAIN_ID) {
          toast.warn(`Connect to ${NETWORK} network.`, {
            position: "top-right",
            autoClose: 3000,
            closeOnClick: true,
            hideProgressBar: true,
          });
          return;
        }
      });
      const address = (await web3.eth.getAccounts())[0];
      dispatch(setWallet(address))
      window.localStorage.setItem('wallet', address)
      const balance = await web3.eth.getBalance(address);
      // console.log(await web3auth.getUserInfo())
      console.log(address, balance)
    } catch (err) {
      // console.log(err.message)
    }
  };

  const setTotal = async () => {
    let total = await getTotalMinted();
    setTotalMinted(total);
  }

  const changeTokenId = (e) => {
    if (e.target.value >= 0 && e.target.value <= 10000) {
      setTokenId(Number(e.target.value))
    } else {
      toast.warn('please input correct token ID', {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        hideProgressBar: true,
      });
    }
  }

  const changeName = (e) => {
    let name = e.target.value.trim();
    setName(name)
  }

  const handleBuy = async () => {
    if (wallet) {
      buy()
    } else {
      login()
    }
  }

  const buy = async () => {
    setBuying(true)
    let groupId = getGroupId(id)
    if (groupId >= 0) {
      let signature = await getSignatureForMint(wallet, quantity, groupId)
      const signedData = signSmartContractData({
        address: wallet, //user wallet
        commodity: 'MATIC',
        commodity_amount: (PRICE * quantity).toString(),
        pk_id: 'key1',
        sc_address: NFT_ADDRESS,//ropsten abc contract
        sc_id: uuidv4(), // must be unique for any request
        sc_input_data: signature,
      }, PRIVATE_KEY);

      const otherWidgetOptions = {
        partner_id: PARTNER_ID,
        commodity: 'MATIC',
        container_id: 'wert-widget',
        click_id: uuidv4(), // unique id of purhase in your system
        origin: 'https://sandbox.wert.io', // this option needed only for this example to work
        // origin: 'https://widget.wert.io', // this option needed only for this example to work
        width: 400,
        height: 600,
      };

      const wertWidget = new WertWidget({
        ...signedData,
        ...otherWidgetOptions,
      });

      window.open(wertWidget.getRedirectUrl())
    }
    setBuying(false)
  }

  const reduce_Number = () => {
    if (quantity > 1) {
      setQuantity(parseInt(quantity) - 1);
    }
  }

  const increase_Number = () => {
    if (quantity < 30) {
      setQuantity(parseInt(quantity) + 1);
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(wallet)
    toast.info(`address copied.`, {
      position: "top-right",
      autoClose: 3000,
      closeOnClick: true,
      hideProgressBar: true,
    });
  }

  const rename = async () => {
    if (tokenId < 0 || tokenId > 9999) {
      toast.warn(`Please input correct token ID`, {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        hideProgressBar: true,
      });
      return
    }
    if (name.length < 3 || name.length > 20) {
      toast.warn(`Please input 3~20 characters for name`, {
        position: "top-right",
        autoClose: 3000,
        closeOnClick: true,
        hideProgressBar: true,
      });

      return
    }
    try {
      setRenaming(true)

      if (initWeb3 && wallet) {
        if (await hasEnoughEthForRename(wallet)) {
          if (await renameNFT(wallet, tokenId, name)) {
            toast.warn(`Your NFT name was changed to "${name}"`, {
              position: "top-right",
              autoClose: 3000,
              closeOnClick: true,
              hideProgressBar: true,
            });
          } else {
            toast.warn(`You can't rename now. Please check whether there is NFT with token ID or network connection`, {
              position: "top-right",
              autoClose: 3000,
              closeOnClick: true,
              hideProgressBar: true,
            });
          }
        } else {
          toast.warn(`Your ETH balance is not enough for renaming`, {
            position: "top-right",
            autoClose: 3000,
            closeOnClick: true,
            hideProgressBar: true,
          });
        }
      } else if (wallet) {
        const privateKey = process.env.REACT_APP_PRIVATE_KEY;
        let signature = await getSignatureForRename(wallet, tokenId, name)
        if (signature) {
          const signedData = signSmartContractData({
            address: wallet, //user wallet
            commodity: 'ETH',
            commodity_amount: RENAME_PRICE,
            pk_id: 'key1',
            sc_address: NFT_ADDRESS,//ropsten abc contract
            sc_id: uuidv4(), // must be unique for any request
            sc_input_data: signature,
          }, privateKey);

          const otherWidgetOptions = {
            partner_id: process.env.REACT_APP_PARTNER_ID,
            container_id: 'wert-widget',
            click_id: uuidv4(), // unique id of purhase in your system
            // origin: 'https://sandbox.wert.io', // this option needed only for this example to work
            origin: 'https://widget.wert.io', // this option needed only for this example to work
            width: 400,
            height: 600,
          };

          const wertWidget = new WertWidget({
            ...signedData,
            ...otherWidgetOptions,
          });

          window.open(wertWidget.getRedirectUrl())
        } else {
          toast.warn(`You can't rename ABC now. Please try later.`, {
            position: "top-right",
            autoClose: 3000,
            closeOnClick: true,
            hideProgressBar: true,
          });
        }
      }

      setRenaming(false)
    } catch (err) {
      console.log(err.message)
    }
    setRenaming(false)
  }

  const onShowRename = () => {
    setShowRename(!showRename)
  }

  return <div className='d-flex justify-content-center m-5 nft'>
    <div className="mint_section d-flex flex-column align-items-center">
      <div className='w-100 d-flex flex-column mb-5'>
        <div className='w-100 d-flex justify-content-between text-white'>
          <p>Total Minted :</p> <p>{`${totalMinted}`} / 10000</p>
        </div>
        <div className='w-100 d-flex justify-content-between text-white'>
          <p>Price :</p> <p>{`${PRICE} ETH + Gas Fee`}</p>
        </div>
        <div className='w-100 d-flex justify-content-between text-white'>
          <p>Contract :</p>  <p>{`${shortAddress(NFT_ADDRESS)}`}</p>
        </div>
        <div className="w-100 d-flex justify-content-between mt-5">
          <div className="counter_form" >
            <button className="mint_counter_btn1" onClick={reduce_Number}> - </button>
            <span className='mint_quantity text-white'> {quantity} </span>
            <button className="mint_counter_btn1" onClick={increase_Number}> + </button>
          </div >
          <div className="counter_form" >
            <button className="mint_counter_btn" value={5} onClick={(e) => setQuantity(Number(e.target.value))} > 5 </button>
            <button value={10} onClick={(e) => setQuantity(e.target.value)} className="mint_counter_btn"> 10 </button>
            <button value={30} onClick={(e) => setQuantity(e.target.value)} className="mint_counter_btn" > 30 </button>
          </div>
        </div>
      </div>
      {
        initWeb3 ?
          <>
            <button className='mint_button'  disabled={minting} onClick={conMetamask} >
              Mint
            </button>
            {
              minting && < p style={{ textAlign: 'center', color: 'white' }}>
                Processing - Please Wait
              </p>
            }
          </>
          :
          <>
            <h4 style={{ textAlign: 'center', margin: '0px', marginTop: '10px', marginBottom: '10px', color: 'yellow', display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap:'10px' }}>
              {
                wallet ? `${shortAddress(wallet)}` : `No Wallet Detected`
              }
              {
                wallet &&
                <div onClick={copy} >
                  <BsClipboard />
                </div>
              }
            </h4>
            <button className="mint_button" disabled={buying} onClick={handleBuy} >
              {wallet ? `Mint using Credit Card / Fiat` : `Create Wallet Using Email Address`}
            </button>

          </>
      }
      {
        wallet &&
        // <div className='header container'>
        // <button>
        <div className='d-flex justify-content-center'>
          <a href='collection' style={{ textDecoration: 'none', color: 'white', fontSize: '19px', marginTop: '10px' }}>
            My Collection
          </a>
        </div>
      }
    </div>
  </div>
}

export default Container8;
