import axios from 'axios';

export type Id = number | string

export type User = {
  id: number,
  username: string,
  givenName: string,
  familyName: string,
  fullName: string,
  contactEmail: string,
  sourcedid: string,
  image: string,
  organizationId: number
};
export type Organization = { id: number, name: string, description: string, guid: string, contactEmail: string, url: string };
export type OrganizationAggregate = { usersCount: number, coursesCount: number };
export type OrganizationWithAggregate = { org: Organization, aggregates: OrganizationAggregate };
export type EnrollmentInfo = {
  user: User,
  enrollment: Enrollment
};

export type Enrollment = {
  id: number,
  userId: number,
  courseId: number,
  role: string
};

export function getUsersNotInCourse(organizationId: Id, courseId: Id, token: string): Promise<User[]> {
  return axios.get(`/api/organizations/${organizationId}/courses/${courseId}/usersNotInCourse`, {
    headers: { Authorization: token }
  }).then(resp => resp.data as User[]);
}

export function getEnrollments(organizationId: Id, courseId: Id, token: string): Promise<EnrollmentInfo[]> {
  return axios.get(`/api/organizations/${organizationId}/courses/${courseId}/enrollments`, {
    headers: { Authorization: token }
  }).then(resp => resp.data as EnrollmentInfo[]);
}

export type Placement = { launchType: string, url: string, name: string, customParameters: { [key: string]: string } }

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

export function getActivity(orgId: Id, courseId: Id, activityId: Id, token: string): Promise<Activity> {
  return axios.get(`/api/organizations/${orgId}/courses/${courseId}/activities/${activityId}`, {
    headers: { Authorization: token }
  }).then(resp => {
    console.log('got response back: ', resp)
    return resp.data as Activity
  });
}

export type App = {
  id?: number,
  name: string,
  description: string,
  logo?: string,
  publicKey?: string,
  placements: { placements: Placement[] }
};

export type AppList = {
  apps: App[]
};

export type OrganizationList = {
  organizations: OrganizationWithAggregate[]
};

function fetchEntity<A>(url: string): (token: string) => Promise<A> {
  return token =>
    axios.get(url, {
      headers: { Authorization: token }
    }).then(resp => resp.data as A);
}

export const getOrganizations = fetchEntity<OrganizationList>('/api/organizations')

export function getApps(token: string): Promise<AppList> {
  return axios.get(`/api/apps`, {
    headers: { Authorization: token }
  }).then(resp => {
    return resp.data as AppList
  });
}

export function getApp(token: string, appId: number | string): Promise<App> {
  return axios.get(`/api/apps/${appId}`, {
    headers: { Authorization: token }
  }).then(resp => {
    return resp.data as App;
  });
}

type LaunchToken = {
  idToken: string
};

export function getLaunchToken(token: string, launchAppRequest: any): Promise<LaunchToken> {
  return axios.post(`/api/apps/launch`, launchAppRequest, {
    headers: { Authorization: token }
  }).then(resp => {
    console.log('got token back: ', resp.data);
    return resp.data as LaunchToken;
  });
}

// https://d93e5bcb.ngrok.io/lti13/launch.php