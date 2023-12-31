import { Resolver, Query } from "type-graphql";

@Resolver()
export class HelloResolver{ // Inside this class we can add Queries or mutating functions to interact with API

    @Query(()=> String) // We need to declare what the function returns
    hello(){
        return "hello world";
    }

}