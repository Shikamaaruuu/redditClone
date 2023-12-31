import React from 'react'
import { Wrapper } from '../components/Wrapper';

import { Form, Formik } from "formik"
import { FormControl, FormLabel, Input, FormErrorMessage, Button ,Box} from '@chakra-ui/react';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import {useRouter} from 'next/router'
import { InputField } from '../components/InputField';
import { withUrqlClient } from 'next-urql';
import { createURQLClient } from '../utils/createURQLClient';


interface loginProps {

}

const Login: React.FC<loginProps> = ({}) => {

        const [,login] = useLoginMutation()
        const router = useRouter()
        return (
            <Wrapper variant='small'>
                <Formik
                    initialValues={{username:'',password:''}}
                    onSubmit={ async (values,{setErrors})=>{
                    
                        const response = await login({username:values.username,password:values.password})
                        console.log(response.data)
                        if( response.data.login.errors){
                            setErrors(toErrorMap(response.data.login.errors))
                        }
                        else{
                            router.push('/')
                        }
                    }}    
                >
                
                    {({ isSubmitting }) => (
                    <Form>
                        <InputField name='username' label='Username' placeholder='username' />
                        <InputField name='password' label='Password' placeholder='password' type='password' />
                        <Box mt={4} >
                            <Button type='submit' isLoading={isSubmitting} >Login!!</Button>
                            <Button type='button' ml={4} onClick={()=>{router.push('/register')}}>Newbie? Join the gangs</Button>
                        </Box>
                    </Form>
                    )}

                </Formik>
            </Wrapper>
        );
}
//Now that we dont have a provider client in app.tsx we provide a client for every page and 
// control whether it should be ssr or csr
export default withUrqlClient(createURQLClient)(Login);