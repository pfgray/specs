import harry from 'file-loader!./harry.jpg';
import hermoine from 'file-loader!./hermoine.jpg';
import ron from 'file-loader!./ron.jpg';
import severus from 'file-loader!./severus.jpg';
import albus from 'file-loader!./albus.jpg';

export default [{
  label: 'Harry Potter',
  name: 'harry',
  image: harry,
  fullName: 'Harry Potter',
  roles: 'Learner',
  id: 'ccbd7af7-8777-412e-8844-7255fd3bbc7f',
  email: 'hpotter@hogwarts.edu',
  givenName: 'Harry',
  familyName: 'Potter'
},{
  label: 'Hermoine Granger',
  name: 'hermoine',
  image: hermoine,
  fullName: 'Hermoine Granger',
  roles: 'Learner',
  id: '6acba3eb-0706-4f5e-aff2-704afa3cd4ce',
  email: 'hgranger@hogwarts.edu',
  givenName: 'Hermoine',
  familyName: 'Granger'
},{
  label: 'Ron Weasley',
  name: 'ron',
  image: ron,
  fullName: 'Ron Weasley',
  roles: 'Learner',
  id: 'acdafe48-1d86-4cd6-accf-8e0c781df79d',
  email: 'rweasley@hogwarts.edu',
  givenName: 'Ron',
  familyName: 'Weasley'
},{
  label: 'Severus Snape',
  name: 'severus',
  image: severus,
  fullName: 'Severus Snape',
  roles: 'Instructor',
  id: '620b291d-7041-4864-abbf-c6f8564f7752',
  email: 'ssnape@hogwarts.edu',
  givenName: 'Severus',
  familyName: 'Snape'
},{
  label: 'Albus Dumbledore',
  name: 'albus',
  image: albus,
  fullName: 'Albus DUmbledore',
  roles: 'urn:lti:sysrole:ims/lis/Administrator',
  id: '87056e9a-9ba0-463e-b2d8-1576ea7cd467',
  email: 'adumbledore@hogwarts.edu',
  givenName: 'Albus',
  familyName: 'Albus Dumbledore'
}];
