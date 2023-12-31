import { FieldError } from "../generated/graphql";

export const toErrorMap = (errors:FieldError[])=>{ // type of error is fielderror and its an array

    const errorMap:Record<string,string> = {}
    errors.forEach(({field,message})=>{

        errorMap[field]=message // converting every error to a object

    });

    return errorMap
}