import {ApolloServer, gql} from "apollo-server"
import {ApolloServerPluginLandingPageGraphQLPlayground} from "apollo-server-core"

import typeDefs from "./typeDefs.js"
import mongoose from "mongoose"
import 'dotenv/config'
import jwt from "jsonwebtoken"

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on("connected",()=>{
    console.log("connected to mongodb")
})

mongoose.connection.on("error",(err)=>{
    console.log("error connecting",err)
})

import "./models/User.js"
import "./models/Quote.js"
import "./models/Blog.js"
import resolvers from "./resolver.js"

const server = new ApolloServer({
 typeDefs,
 resolvers,
 context:({req})=>{
  const {authorization} =req.headers;
  if(authorization){
   const {userId} = jwt.verify(authorization,process.env.JWT_SECRET)
    return {userId}
  }
 },
 plugins:[ApolloServerPluginLandingPageGraphQLPlayground()]
})

server.listen().then(({url})=>{
    console.log(`Server ready at ${url.url}`)
})


