module.exports = {
  client: {
    includes: ['./src/**/*.tsx'],
    tagName: 'gql',
    service: {
      name: 'joinmate-backend',
      url: 'http://localhost:4000/graphql',
    },
  },
};
