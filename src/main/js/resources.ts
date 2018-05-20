import axios from 'axios';

export type Organization = {id: number, name: string};

export function getOrganization(id: string | number, token: string): Promise<Organization> {
  return axios.get(`/api/organizations/${id}`, {
    headers: { Authorization: token }
  }).then(resp => {
    console.log('got response back: ', resp)
    return resp.data as Organization
  });
}