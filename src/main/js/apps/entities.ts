

export type User = {
  full_name: string,
  given_name: string,
  family_name: string,
  guid: string,
  email: string,
  roles: string,
  picture: string
}
export const
  Users = [{
    full_name: 'Harry Potter',
    given_name: 'Harry',
    family_name: 'Potter',
    guid: 'ccbd7af7-8777-412e-8844-7255fd3bbc7f',
    email: 'hpotter@hogwarts.edu',
    roles: 'Learner',
    picture: 'http://lti.paulgray.net/assets/scripts/sampleData/images/harry.jpg'
  }, {
    full_name: 'Hermoine Granger',
    given_name: 'Hermoine',
    family_name: 'Granger',
    guid: '6acba3eb-0706-4f5e-aff2-704afa3cd4ce',
    email: 'hgranger@hogwarts.edu',
    roles: 'Learner',
    picture: 'http://lti.paulgray.net/assets/scripts/sampleData/images/hermoine.jpg'
  }, {
    full_name: 'Ron Weasley',
    given_name: 'Ron',
    family_name: 'Weasley',
    guid: 'acdafe48-1d86-4cd6-accf-8e0c781df79d',
    email: 'rweasley@hogwarts.edu',
    roles: 'Learner',
    picture: 'http://lti.paulgray.net/assets/scripts/sampleData/images/ron.jpg'
  }, {
    full_name: 'Severus Snape',
    given_name: 'Severus',
    family_name: 'Snape',
    guid: '620b291d-7041-4864-abbf-c6f8564f7752',
    email: 'ssnape@hogwarts.edu',
    roles: 'Instructor',
    picture: 'http://lti.paulgray.net/assets/scripts/sampleData/images/severus.jpg'
  }, {
    full_name: 'Albus Dumbledore',
    given_name: 'Albus',
    family_name: 'Dumbledore',
    guid: '87056e9a-9ba0-463e-b2d8-1576ea7cd467',
    email: 'dumbledore@hogwarts.edu',
    roles: 'urn:lti:sysroles:ims/lis/Administrator',
    picture: 'http://lti.paulgray.net/assets/scripts/sampleData/images/albus.jpg'
  }]


export type Context = {
  label: string,
  context_id: string,
  context_label: string,
  context_title: string,
  context_type: string[],
  resource_link_id: string,
  resource_link_title: string,
  resource_link_description: string
}

export const Contexts = [{
  label: 'Potions 101',
  context_id: '534145987',
  context_label: 'ptns101',
  context_title: 'Potions 101',
  context_type: ['CourseSection'],
  resource_link_id: '98742534',
  resource_link_title: 'Stew Chemistry',
  resource_link_description: 'Learn about the chemistry makeup of various stews.',
},{
  label: 'Defense against the Dark Arts 105',
  context_id: '329875034',
  context_label: 'dfda105',
  context_title: 'Defense against the Dark Arts 105',
  context_type: ['CourseSection'],
  resource_link_id: '54329874',
  resource_link_title: 'Perfecting a Patronus charm',
  resource_link_description: 'Learn the technique of casting a perfect patronus charm.'
},{
  label: 'Transfiguration 110',
  context_id: '234509702',
  context_label: 'tfgr110',
  context_title: 'Transfiguration 110',
  context_type: ['CourseSection'],
  resource_link_id: '98742534',
  resource_link_title: 'Forms',
  resource_link_description: 'Learn about the various forms one can assume'
}];