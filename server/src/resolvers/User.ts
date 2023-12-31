import { Resolver, Query, Mutation, Arg, InputType, Field, Ctx, ObjectType } from "type-graphql";
import { User } from "../entities/User";
import { Mycontext } from "src/types";
import argon2 from 'argon2'
import { COOKIE_NAME } from "../constants";

@ObjectType()
class FieldError{

    @Field()
    field:string

    @Field()
    message:string;
}

 
@ObjectType() //Object types can be returned in mutations and queries
class UserResponse{

    @Field(()=>[FieldError],{nullable:true}) // Explicitly setting the type as null values can be invovled
    errors?:FieldError[]

    @Field(()=>User,{nullable:true})
    user?:User //Adding the ? makes it undefined so if user exists user is returned else error is returned

}

@Resolver()
export class UserResolver{ // Inside this class we can add Queries or mutating functions to interact with API

    @Mutation(()=>UserResponse)
    async forgotPassword(
        @Arg('email')Email:string,
        @Ctx(){req,em}:Mycontext

    ){

    }


    @Query(()=>User,{nullable:true})// checking to see if cookies are working
    async me(
        @Ctx(){req,em}:Mycontext
        ){
        console.log(req.session)
        if(req.session.userId){
            const user = await em.findOne(User,{id:(req.session.userId as number)})
            return user
        }
        console.log("User is not logged in")
        return null;
    }



    @Mutation(()=>UserResponse)
    async register(
        @Arg('username')username:string,
        @Arg('password')password:string,
        @Ctx() {em,req}:Mycontext 
    ) :Promise<UserResponse> {

        const customer = await em.findOne(User,{username:username})

        
        if(username.length <=2)
        {
            return {
                errors:[{
                    field:'username',
                    message:'Are you retarded or something ? Your name should be longer than 2 letters '
                }]
            }
        }
        
        if(password.length<=5){
            return{
                errors:[{
                    field:'password',
                    message:"Your dick is already short we dont need your password to be short too 6 is average"
                }]
            }
        }
        
        if(customer){
            return{
                errors:[{
                    field:'username',
                    message:`We already have one ${username} we dont need another one`
                }]
            }
        }
        const hashedPassword = await argon2.hash(password) //hashing the password; function returns a promise 
                                                                   //so awaiting that
        const user = await em.create(User,{
            username:username,
            password:hashedPassword
        })
        await em.persistAndFlush(user); 

        req.session.userId = user.id // logging in the user post registration
        return {user};
    }



    @Mutation(()=>UserResponse)
    async login(
        @Arg('username')username:string,
        @Arg('password')password:string,
        @Ctx() {em, req}:Mycontext //Accessing req to create sessions
    ): Promise<UserResponse>{

        const user = await em.findOne(User,{username:username})
        if(!user){
            return{
                errors:[{
                    field:'username',
                    message:`hmm ${username} isn't one of us :(`
                }]
            }
        }
        const valid = await argon2.verify(user.password,password)
        // console.log(valid)
        if(!valid){
            return{
                errors:[{
                    field:'password',
                    message:`Identity theft is not a joke`
                }]
            } 
        }
        req.session.userId = user.id
        console.log(req.session.userId)

        return {
            user
        };   
    }

    @Mutation(()=>Boolean)
    logout(
        @Ctx(){req,res}: Mycontext
    ){  

        // This will clear the session in redis
        return new Promise (resolver =>req.session.destroy((error)=>{
            
        // For deleting the cookie
        res.clearCookie(COOKIE_NAME)
            if(error){
                console.log(error)
                resolver(false);
                return
            }else{
                resolver(true)
            }
        }))


    }

}