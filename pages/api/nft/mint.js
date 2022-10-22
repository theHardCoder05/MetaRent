
import Moralis from 'moralis';
export default async  function handler(req, res) {
  await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
  console.log(Moralis)
    res.status(200).json({ MORALIS_API_KEY: process.env.MORALIS_API_KEY })
  }
  