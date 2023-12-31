import NavBar from "../components/NavBar"
import { useMeQuery, usePostsQuery } from "../generated/graphql"
import {withUrqlClient} from "next-urql"
import { createURQLClient } from "../utils/createURQLClient"


const Index = () =>{
  const [{data}] = usePostsQuery()
  return(
    <>
    <NavBar />
    <div >Hello world</div>
    {!data ? (<div>.... Loading</div>): data.posts.map(post =>
      <div key={post.id} color="white" >{post.title}</div>
    )}
    </>
  )
}

export default withUrqlClient(createURQLClient,{ssr:true})(Index)
