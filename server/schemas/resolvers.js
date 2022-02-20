const { User, Book } = require("../models");
const {signToken} = require('../utils/auth')
const resolvers = {
  Query: {
    users: async () => {
      return await User.find().populate("books");
    },
    user: async (parent, {id}) => {
      return await User.findById(id).populate("books");
    },
    books: async () => {
      return Book.find();
    },
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const profile = await User.findOne({ email });

      if (!profile) {
        throw new AuthenticationError('No profile with this email found!');
      }

      const correctPw = await profile.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }

      // const token = signToken(profile);
      // return { token, profile };
      return {profile}

    },
    addUser: async (parent, { username, email, password }) => {
      return await User.create({ username, email, password });
    },
    saveBook: async (parent,{authors,description, title,bookId,link})=>{
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: parent._id },
          { $addToSet: { savedBooks: authors,description, title,bookId,link } },
          { new: true, runValidators: true }
        );
        return {updatedUser};
      } catch (err) {
        console.log(err);
        return err
      }
    },
    removeBook: async (parent,{id, bookId})=>{
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { savedBooks: { id: bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        return  alert("Couldn't find user with this id!") ;
      }
      return {updatedUser};
    }
  },
};
module.exports = resolvers;
