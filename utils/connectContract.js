import abiJSON from "./Memory.json";
import { ethers } from "ethers";

function connectContract() {
    const contractAddress = "0x40D9a2AeC835CfB201b8D0Ed590759609693490A";
    const contractABI = abiJSON.abi;
    let memoryContract;
    try {
        const { ethereum } = window;
  
        if (ethereum.chainId === "0x13881") {
          //checking for eth object in the window, see if they have wallet connected to Polygon Mumbai network
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          memoryContract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          ); // instantiating new connection to the contract
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log("ERROR:", error);
      }
      return memoryContract;
  }
  
  export default connectContract;