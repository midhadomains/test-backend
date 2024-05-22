import { gql } from "apollo-server"


const typeDefs = gql`
 type Query{
    users:[User]
    user(_id:ID!):User
    quotes:[QuoteWithName!]
    iquote(by:ID!):[Quote]
    blogs(first: Int!, after: String , category: String): BlogConnection!
    searchBlogs(keyword: String!): [Blog!]!
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
   meta_data: String!
   meta_description: String!
   keywords: [String!]!
   category: String!
   sub_category: String!
   slug: String!
   open_graph_tags: [String]!
   data:String
   chapters:[Chapter!]
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
   meta_data:String!
   meta_description:String!
   keywords:[String]!
   open_graph_tags:[String]!
   category:String!
   sub_category:String!
   date_created:String!
   slug:String!
   chapters:[ChapterInput]
 }

input ChapterInput{
   title:String!
   data:String!
 }
`
export default typeDefs;