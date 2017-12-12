export default `
  type User {
    id: Int
    name: String
    posts(limit: Int): [Post]
  }

  type Post {
    id: Int
    title: String
    views: Int
    author: User
  }

  type Query {
    aString: String
    aBoolean: Boolean
    anInt: Int
    author(id: Int): User
    topPosts(limit: Int): [Post]
  }
`;
