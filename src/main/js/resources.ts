import axios from 'axios';

export type Id = number | string

export type Organization = {id: number, name: string};

export function getOrganization(id: Id, token: string): Promise<Organization> {
  return axios.get(`/api/organizations/${id}`, {
    headers: { Authorization: token }
  }).then(resp => {
    console.log('got response back: ', resp)
    return resp.data as Organization
  });
}

export type Activity = {
  id: number,
  name: string,
  resourceLinkId: string,
  url: string,
  oauthkey: string,
  oauthSecret: string,
  signatureMechanism: string,
  graded: boolean,
  courseId: number
};

export type ActivityList = { activities: Activity[] }

export function getActivities(orgId: Id, courseId: Id, token: string): Promise<ActivityList> {
  return axios.get(`/api/organizations/${orgId}/courses/${courseId}/activities`, {
    headers: { Authorization: token }
  }).then(resp => {
    console.log('got response back: ', resp)
    return resp.data as ActivityList
  });
}

export type App = {
  id: number,
  name: String,
  logo: String,
  publicKey: String
};

export type AppList = {
  apps: App[]
};

export function getApps(token: string): Promise<AppList> {
  return axios.get(`/api/apps`, {
    headers: { Authorization: token }
  }).then(resp => {
    console.log('got response back: ', resp)
    return resp.data as AppList
  });
}

export function getApp(token: string, appId: number | string): Promise<App> {
  return axios.get(`/api/apps/${appId}`, {
    headers: { Authorization: token }
  }).then(resp => {
    console.log('got app back: ', resp);
    return resp.data as App;
  });
}

type LaunchToken = {
  idToken: string
};

export function getLaunchToken(token: string, appId: number | string): Promise<LaunchToken> {
  return axios.get(`/api/apps/${appId}/launch`, {
    headers: { Authorization: token }
  }).then(resp => {
    console.log('got token back: ', resp.data);
    return resp.data as LaunchToken;
  });
}

// https://d93e5bcb.ngrok.io/lti13/launch.php