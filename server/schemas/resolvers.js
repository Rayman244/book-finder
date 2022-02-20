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
    me: async (parent, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('thoughts');
      }
      throw new AuthenticationError('You need to be logged in!');
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
      return profile

    },
    addUser: async (parent, { username, email, password }) => {
      return await User.create({ username, email, password });
    },
    saveBook: async (parent,{authors,description, title,bookId,link},context)=>{
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.User._id },
          { $addToSet: { savedBooks: authors,description, title,bookId,link } },
          { new: true, runValidators: true }
        );
        return {updatedUser};
      } catch (err) {
        console.log(err);
        return err
      }
    },
    removeBook: async (parent,{bookId},context)=>{
      if (context.user) {
        const book = await Book.findOneAndDelete({
          bookId: bookId,
          user: context.User.username,
        });

        await User.findOneAndUpdate(
          { _id: context.User._id },
          { $pull: { savedBooks: book.bookId } }
        );

        return book;
    }
  },
}
}
module.exports = resolvers;
