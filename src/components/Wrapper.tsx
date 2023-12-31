import { Box } from '@chakra-ui/react';
import React from 'react'

interface WrapperProps{

    children: React.ReactNode,
    variant?:'small'|'regular' //this is the props for the react function by adding ? we are making it a optional prop
    
}

export const Wrapper: React.FC<WrapperProps> = ({children,variant='regular'}) => {
        return (
            <Box mt={8} mx='auto' maxW={variant==='regular'?'800px':'400px'} w="100%"> 
                {/* <div>hello</div> */}
                {/* Box is like div in chakra ui */}
                {children}
            </Box>
        ); 
}