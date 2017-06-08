import harry from 'file-loader!./harry.jpg';
import hermoine from 'file-loader!./hermoine.jpg';
import ron from 'file-loader!./ron.jpg';
import severus from 'file-loader!./severus.jpg';
import albus from 'file-loader!./albus.jpg';

const asset = a => `${window.web_origin}/assets/${a}`;

export default [{
  label: 'Harry Potter',
  name: 'harry',
  user_image: asset(harry),
  lis_person_name_full: 'Harry Potter',
  roles: 'Learner',
  user_id: 'ccbd7af7-8777-412e-8844-7255fd3bbc7f',
  lis_person_contact_email_primary: 'hpotter@hogwarts.edu',
  lis_person_name_given: 'Harry',
  lis_person_name_family: 'Potter'
},{
  label: 'Hermoine Granger',
  name: 'hermoine',
  user_image: asset(hermoine),
  lis_person_name_full: 'Hermoine Granger',
  roles: 'Learner',
  user_id: '6acba3eb-0706-4f5e-aff2-704afa3cd4ce',
  lis_person_contact_email_primary: 'hgranger@hogwarts.edu',
  lis_person_name_given: 'Hermoine',
  lis_person_name_family: 'Granger'
},{
  label: 'Ron Weasley',
  name: 'ron',
  user_image: asset(ron),
  lis_person_name_full: 'Ron Weasley',
  roles: 'Learner',
  user_id: 'acdafe48-1d86-4cd6-accf-8e0c781df79d',
  lis_person_contact_email_primary: 'rweasley@hogwarts.edu',
  lis_person_name_given: 'Ron',
  lis_person_name_family: 'Weasley'
},{
  label: 'Severus Snape',
  name: 'severus',
  user_image: asset(severus),
  lis_person_name_full: 'Severus Snape',
  roles: 'Instructor',
  user_id: '620b291d-7041-4864-abbf-c6f8564f7752',
  lis_person_contact_email_primary: 'ssnape@hogwarts.edu',
  lis_person_name_given: 'Severus',
  lis_person_name_family: 'Snape'
},{
  label: 'Albus Dumbledore',
  name: 'albus',
  user_image: asset(albus),
  lis_person_name_full: 'Albus Dumbledore',
  roles: 'urn:lti:sysrole:ims/lis/Administrator',
  user_id: '87056e9a-9ba0-463e-b2d8-1576ea7cd467',
  lis_person_contact_email_primary: 'adumbledore@hogwarts.edu',
  lis_person_name_given: 'Albus',
  lis_person_name_family: 'Albus Dumbledore'
}];
