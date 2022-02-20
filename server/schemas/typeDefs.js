const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String!
    email: String!
    password:String!,
    savedBooks:[Book]
  }
  type Book {
    _id:ID
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }
  type Auth{
    token:String!
    user:User
  }
  type Query {
    
    users: [User]
    user(id: ID!): User
    books: [Book]
  }
  type Mutation {
    # Set the required fields for new schools
    addUser(username: String!, email: String!, password: String!): User
    login(email:String!,password:String!):User
    saveBook(authors:[String]!,description:String!, title:String!,bookId:String!, link:String):User
    removeBook(bookId:ID):User
  }
 
`;

module.exports = typeDefs;
