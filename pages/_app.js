import '../styles/globals.css'
import {ChakraProvider} from '@chakra-ui/react'
import {MoralisProvider} from 'react-moralis'
function MyApp({ Component, pageProps }) {

  return (
  <ChakraProvider>
  <MoralisProvider appId={'sF9ad59V31WeuJnYgYqkvavV9phrFPRWRNWS8QxR'} serverUrl={'https://teigpa1klisx.grandmoralis.com:2053/server'}>
  <Component {...pageProps} />
  </MoralisProvider>
  </ChakraProvider>
  )
}

export default MyApp
