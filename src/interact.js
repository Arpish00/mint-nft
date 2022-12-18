
import { pinJSONToIPFS } from './utils/pinata';

require("dotenv").config()
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY
const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(alchemyKey)

const contractABI = require("./contract-abi.json")
const contractAddress = "0x4C4a07F737Bf57F6632B6CAB089B78f62385aCaE"

export const connectWallet = async() => {
    if (window.ethereum) {
        try {
            const address = await window.ethereum.request({
                method: "eth_requestAccounts",
            })
            const objNav = {
                status: "👆🏽 Write a message in the text-field above.",
                address: address[0],
            }
            return objNav
        }
        catch (error){
            return {
                address: "",
                status: "😥 " + error.message,
             }
        }
    }

    else {
        return {
            address: "",
            status: (
                <span> 
                <p>
                {" "}
            🦊 <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install MetaMask, a virtual Ethereum wallet, in your
              browser.
            </a>
                </p>
                
                </span>
            )
            }
    }
}


export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        })
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            status: "👆🏽 Write a message in the text-field above.",
          }
        } else {
          return {
            address: "",
            status: "🦊 Connect to MetaMask using the top right button.",
          }
        }
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        }
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊 <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install MetaMask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      }
    }
  }

  
  export const mintNFT = async (url, name, description) => {
    //error handling
    if (url.trim() == "" || name.trim() == "" || description.trim() == "") {
      return {
        success: false,
        status: "❗Please make sure all fields are completed before minting.",
      }
    }
  

  const metadata = new Object()
  metadata.name = name
  metadata.url = url
  metadata.description = description

  const pinataResponse = await pinJSONToIPFS(metadata)
  if (!pinataResponse) {
    return {
      success: false,
      status: "😢 Something went wrong while uploading your tokenURI.",
    }

  }

  const tokenURI = pinataResponse.pinataUrl

  window.contract = await new web3.eth.Contract(contractABI, contractAddress)

  const transactionParameters = {
    to: contractAddress,
    from: window.ethereum.selectAddress,
    data: window.contract.methods.mintNFT(window.ethereum.selectAddress, tokenURI).encodeABI()
  }

  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    })

    return {
      success: true,
      status:
        "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
        txHash,
    }} catch (error) {
      return {
        success: false,
        status: "😥 Something went wrong: " + error.message,
      }
    }
  }