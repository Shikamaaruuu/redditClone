import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
import { Post } from "../entities/Post";
import { Mycontext } from "src/types";


@Resolver()
export class PostResolver{ // Inside this class we can add Queries or mutating functions to interact with API


    // find all the posts 
    @Query(()=> [Post]) // We need to declare what the function returns
    posts(
        @Ctx() {em}: Mycontext): Promise<Post[]> 
    {
        return em.find(Post,{});  // -> returns an array of posts 
    }

    // find specific post

    @Query(()=> Post,{nullable:true}) // keeping null as a return type when specified id doesn't exist
    post(
        @Arg('id') id:number,
        @Ctx() {em}: Mycontext): Promise<Post | null> 
    {
        return em.findOne(Post,{id});  // -> returns post with specified id 
    }

    //create a Post

    @Mutation(()=>Post)
    async createPost(
    @Arg('title') title:string, //for types int and string type-graphql can infer the types from Ts

    @Ctx() {em}: Mycontext): Promise<Post> 
    {
        const post = em.create(Post,{title})
        await em.persistAndFlush(post)
        return post// -> returns created post 
    }

    //Update a post

    @Mutation(()=>Post)
    async updatePost(
    @Arg('title',()=>String, {nullable:true}) title:string, 
    @Arg('id') id:number, 

    @Ctx() {em}: Mycontext): Promise<Post |null> 
    {

        const post = await em.findOne(Post,{id})

        if(!post){
            return null;
        }
        if(typeof title!=='undefined'){
            post.title = title;
            await em.persistAndFlush(post);
        }
        return post// -> returns created post 
    }

    // Delete a post 

    @Mutation(()=>Boolean)
    async deletePost(
    @Arg('id') id:number, 

    @Ctx() {em}: Mycontext): Promise<boolean>
    {

        await em.nativeDelete(Post,{id});
        return true// -> returns boolean value
    }

}