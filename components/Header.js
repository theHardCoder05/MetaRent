import { Button, Center, Flex, Text } from "@chakra-ui/react";

export default function Header({isAuthenticated, isAuthenticating, user, authenticate, logout, isLoggingOut}) {
    
    return(
        <header>
            <Flex justifyContent="space-between" bg={'facebook.100'} px={10} py={6}>
                <Center><Text fontSize="xl" fontWeight="bold">MetaRent</Text></Center>
                <Center>
                    {isAuthenticated ? (
                        <>
                        <Text>{user.get("ethAddress")}</Text>
                        <Button ml={4} colorScheme="twitter" onClick={logout} disabled={isLoggingOut}>Logout</Button>
                        </>
                    ) : (
                        <Button colorScheme="twitter" onClick={() => authenticate({
                            signingMessage: "Sign to auth on MetaRent"
                        })} disabled={isAuthenticating}>Login</Button>
                    )}
                </Center>
            </Flex>
        </header>
    )
}