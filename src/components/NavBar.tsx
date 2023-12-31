import { Box, Button, Flex, Link } from '@chakra-ui/react';
import React from 'react'
import NextLink from 'next/link'
import { useLoginMutation, useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';


interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({}) => {
        const [{data,fetching}] = useMeQuery({
                pause:isServer()
        })
        const [{fetching:LogoutFetching},logout] = useLogoutMutation()
        let body = null;

        console.log('data:',data) // We can see this being queried twice because of ssr in index page
                                  // and navbar is in index page 

        //data is loading 
        if(fetching){


        //user not logged in
        }else if(!data?.me){
                body = (<Flex
                mr={2}>
                        <NextLink href={'/login'}>
                                <div>Login</div>
                        </NextLink>
                        <NextLink href={'/register'}>
                                <div>Register</div>
                        </NextLink>
                        </Flex>)
        //user logged in        
        }else{
                body = (
                        <Flex>
                                <Box mr={2}>Hello, {data.me.username} </Box>
                                <Button variant='link' color={'black'} 
                                onClick={()=>{
                                        logout();

                                }}
                                isLoading={LogoutFetching}
                                >Logout</Button>
                        </Flex>
                )
        } 
        return (
                <Flex bg='#e2e5e9' color='black' p={4}>
                        <Box ml={'auto'}>
                                {body}
                        </Box>
                </Flex>
        );
}

export default NavBar