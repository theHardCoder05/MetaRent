import { Flex, Text, Button, Tabs, TabList, Tab, TabPanels, TabPanel, Box, Link } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import Header from "../components/Header";


export default function Home() {
  const {isAuthenticated, user, isAuthenticating, authenticate, logout, isLoggingOut} = useMoralis()
 

 useEffect(()=>{
  console.log('hello from here...')
  
  
 },[])

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Login | Dashboard3</title>
        </Head>
        <Flex direction="column" justifyContent="center" alignItems="center" width="100vw" height="100vh">
          <Text fontSize="5xl" fontWeight="bold" color="navy">Welcome to MetaRent</Text>
          
          <Button colorScheme="twitter" size="lg" mt="6" onClick={() => authenticate({
            signingMessage: "Require your signature for MetaRent"
          })} disabled={isAuthenticating}>Login with Metamask</Button>
        </Flex>
      </>
    )
  }
  return (
    <>
    <Head>
      <title>MetaRent</title>
    </Head>
    <Flex direction="column" width="100vw" height="100vh">
      <Header isAuthenticated={isAuthenticated} isAuthenticating={isAuthenticating} user={user} authenticate={authenticate} logout={logout} isLoggingOut={isLoggingOut} />
      <Box flex="1" px="52" py="20">
      loadimages()
      <h1>asdfasdfsd</h1>
      
      </Box>
    </Flex>
   </>
  )
}