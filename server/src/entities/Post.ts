import { PrimaryKey, Entity, Property } from "@mikro-orm/core";
import { ObjectType, Field, Int } from "type-graphql";


@ObjectType()
@Entity()
export class Post{
    @Field(()=> Int)
    @PrimaryKey({type:'number'})
    id!:number

    @Field(()=> String)
    @Property({type:'date'})
    createdAt=new Date();

    @Field(()=> String)
    @Property({type:'Date',onUpdate:()=> new Date()})
    updatedAt = new Date();

    @Field()  // If you remove the field decorator this cannot be accessed from graphql endpoint
    @Property({type:'string'})
    title!: string;


}


