import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react'

// This is to create a generic input field to use for all input types

type InputFieldProps =  InputHTMLAttributes<HTMLInputElement> &{
  name:string
  label:string
  placeholder:string
}; // This makes the inputfield component to take props which a regular input field would take

export const InputField: React.FC<InputFieldProps> = ({label,size:_,...props}) => { // destructuring label from props
                                                                          //so we can pass props to input field
        const [field,{error}] = useField(props)
        return (
            <FormControl marginBottom='8px' isInvalid={!!error}> {/*!! will cast an empty string to boolean value false */}
                <FormLabel htmlFor={field.name}>{label}</FormLabel> {/* htmlfor matches the id in input*/}
                <Input {...field} {...props} id={field.name} placeholder={props.placeholder} />
                {error?<FormErrorMessage>{error}</FormErrorMessage>:null}
              </FormControl>
        );
}