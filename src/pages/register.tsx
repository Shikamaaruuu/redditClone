import React from 'react'
import { Form, Formik } from "formik"
import { FormControl, FormLabel, Input, FormErrorMessage, Button ,Box} from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useMutation } from 'urql';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createURQLClient } from '../utils/createURQLClient';


interface registerProps {

}




const Register: React.FC<registerProps> = ({ }) => {
    const router = useRouter()
    const [,register] = useRegisterMutation() // Using these so response type wouldn't be any 
    return (
        <Wrapper variant='small'>
            <Formik initialValues={{ username: "", password: "" }}
                    onSubmit={async(values,{setErrors}) => {
                    console.log(values);
               const response = await register({username:values.username,password:values.password}) // when u return a promise spinner stops
                if(response.data?.register.errors){
                    setErrors(toErrorMap(response.data.register.errors))
                }
                else if(response.data?.register.user){
                    //worked
                    router.push('/')
                }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField name='username' label='Username' placeholder='username' />
                        <InputField name='password' label='Password' placeholder='password' type='password' />
                        <Box mt={4}>
                        <Button type='submit'  isLoading={isSubmitting} >Register!!</Button>
                        <Button type='button' ml={4} onClick={()=>{router.push('/login')}}>I am one of you</Button>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
}

export default withUrqlClient(createURQLClient)(Register)