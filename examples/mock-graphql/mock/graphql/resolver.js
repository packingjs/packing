import { name } from 'casual';

export default {
  User: (_, { id }) => {
    return {
      id,
      name
    };
  }
};
