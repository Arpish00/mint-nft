require("dotenv").config()
const key = process.env.REACT_APP_PINATA_KEY
const secret = process.env.REACT_APP_PINATA_SECRET


const axios = require("axios")

const contractABI = require("../contract-abi.json")
const contractAddress = "0x4C4a07F737Bf57F6632B6CAB089B78f62385aCaE"

export const pinJSONToIPFS = async(JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`

    return axios.post(url, JSONBody, {
        headers: {
            pinata_api_key: key,
            pinata_secret_key: secret,
        },
    }).then(function (response) {
        return {
            sucess: true,
            pinataURL:"https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash,
        }
    }).catch(function (error) {
        console.log(error)
        return {
          success: false,
          message: error.message,
        }
      })
}