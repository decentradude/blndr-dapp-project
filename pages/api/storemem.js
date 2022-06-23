import { Web3Storage, File, getFilesFromPath } from "web3.storage";
const { resolve } = require("path");


export default async function handler(req, res) {
    console.log("inside the handler");
    if (req.method === "POST") {
        console.log("recieved the request, sending to storeEventData");
      return await storeEventData(req, res);
    } else {
      return res
        .status(405)
        .json({ message: "Method not allowed", success: false });
    }
  }

  async function storeEventData(req, res) {
    const body = req.body;
    console.log("this is what's in the body", body);
    try {
      console.log("inside the tru of storeEventData");
      const files = await makeFileObjects(body);
      console.log("after makeFileObjects");
      const cid = await storeFiles(files);
      console.log("after storeFiles");
      console.log(res.status(200).json({ success: true, cid: cid }));
      return res.status(200).json({ success: true, cid: cid });
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Error creating event", success: false });
    }
  }

  async function makeFileObjects(body) {
    const buffer = Buffer.from(JSON.stringify(body));
  
    const imageDirectory = resolve(process.cwd(), body.image);
    const files = await getFilesFromPath(imageDirectory);
  
    files.push(new File([buffer], "data.json"));
    return files;
  }

  function makeStorageClient() {
    return new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN });
  }
  
  async function storeFiles(files) {
    const client = makeStorageClient();
    const cid = await client.put(files);
    return cid;
  }