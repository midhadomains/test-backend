import { gql } from "apollo-server"


const typeDefs = gql`
 type Query{
    users:[User]
    user(_id:ID!):User
    quotes:[QuoteWithName!]
    iquote(by:ID!):[Quote]
    blogs(first: Int!, after: String , category: String): BlogConnection!
    searchBlogs(keyword: String!): [Blog!]!
    searchBlogById(_id:String!):Blog!
    searchBlogBySlug(slug:String!):Blog!

 }

 type BlogConnection {
   edges: [BlogEdge!]!
   pageInfo: PageInfo!
 }

 type BlogEdge {
   cursor: String!
   node: Blog!
 }

 type PageInfo {
   endCursor:String!
   hasNextPage: Boolean!
 }

 type Blog {
   _id: ID!
   title: String!
   author: String!
   reviewer:String!
   meta_description: String!
   keywords: [String!]!
   category: String!
   sub_category: String!
   slug: String!
   createdAt:String!
   data:String
   image:String
 }

 type Chapter {
   _id:ID!
   title: String!
   data: String!
 }
 
 type QuoteWithName{
    name:String!
    by:IDName!
 }

 type IDName{
    _id:ID!
    firstName:String!
 }

 type User{
    _id:ID!
    firstName:String!
    lastName:String!
    email:String!
    password:String!
    quotes:[Quote]
 }


 type Quote{
    name:String!
    by:ID!
 }



 type Token{
    token:String!
 }

 type Mutation{
    signupUser(userNew:UserInput!):User
    signinUser(userSignin:UserSigninInput!):Token
    createQuote(name:String!):String
    createBlog(blogNew:BlogInput!):String
 }

 input UserInput{
    firstName:String!
    lastName:String!
    email:String!
    password:String!
 }

 input UserSigninInput{
    email:String!
    password:String!
 }

 input BlogInput{
   title:String!
   author:String!
   reviewer:String!
   meta_description:String!
   keywords:[String]!
   category:String!
   sub_category:String!
   slug:String!
   data:String!
   image:String!
 }


`
export default typeDefs;