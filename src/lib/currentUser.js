import { gql, useQuery } from '@apollo/client';

const CURRENT_USER = gql`
  query {
    me {
      username
      email
      id
    }
  }
`;

function useUser() {
  const { data } = useQuery(CURRENT_USER);
  return data?.me;
}

export { CURRENT_USER, useUser };
