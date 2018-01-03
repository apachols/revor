import axios from 'axios'

export const getUsers = async () => {
  const p = await axios({
    method: 'get',
    url: 'api/users',
  });
  return p.data;
}
