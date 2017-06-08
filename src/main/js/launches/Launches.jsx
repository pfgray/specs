import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import classNames from 'classnames';
import _ from 'lodash';

import users from './users/users';
import contexts from './contexts/contexts';
import { UPDATE_FORM } from './launchReducer';

import './launches.less';

const save = dispatch => values => {
  console.log('submiting, got values: ', values);
  const newWindow = values['newWindow'];

  const params = Object.keys(values).map(k => k + "=" + values[k]).join("&")
  window.open('/api/signedLaunch?' + params);
  //
};

const mapStateToProps = state => ({
  user_image: _.get(state, 'form.launches.values.user_image'),
  initialValues: {
    ...state.launchForm,
    newWindow: true,
    outcomes1: true,
    outcomes2: true
  }
});
const mapDispatchToProps = dispatch => ({
  save: save(dispatch),
  dispatch
});

const updateUser = dispatch => e => {
  const newUser = users.find(u => u.name === e.target.value);
  changeAll(dispatch, newUser);
}

const changeAll = (change, obj) => {
  Object.keys(obj).forEach(function(key){
    change(key, obj[key]);
  });
}

const updateContext = change => e => {
  const newContext = contexts.find(u => u.name === e.target.value);
  changeAll(change, newContext);
}

const TextInput = ({placeholder, input, meta}) => {
  return (
    <input type="text" placeholder={placeholder} {...input} className={classNames('form-control', {'error': meta.submitFailed && meta.error && !meta.dirty})}/>
  );
};

const Launches = ({save, handleSubmit, dispatch, change, user_image}) => (
  <form className="launch-form" onSubmit={handleSubmit(save)}>
    <div className="row launch-btn-container">
      <div className="col-md-12">
        <button className="btn btn-primary">Launch</button>
        <label className="new-window-label checkbox-wrapper"><Field name="newWindow" component="input" type="checkbox" /><span> New Window</span></label>
      </div>
    </div>

    {/* Tool */}
    <div className="card">
      <h5 className="card-title">Tool</h5>
      <div className="row">
        <div className="col-md-6">
          <Field name="url" placeholder="Url" component={TextInput} />
        </div>
        <div className="col-md-6">
          <Field name="key" placeholder="Key" component={TextInput} />
          <Field name="secret" placeholder="Secret" component={TextInput} />
        </div>
      </div>
    </div>

    {/* User */}
    <div className="card tertiary">
      <h5 className="card-title">
        <span>User</span>
        <select onChange={updateUser(change)}>
          {users.map(u => (
            <option key={u.name} value={u.name}>{u.label}</option>
          ))}
        </select>
      </h5>
      <div className="row">
        <div className="col-md-6">
          <div className="user-image-container">
            <img src={user_image} />
            <Field name="user_image" component="input" type="text" placeholder="Image" className="form-control" />
          </div>
          <Field name="lis_person_name_full" component="input" type="text" placeholder="Full Name" className="form-control" />
          <Field name="roles" component="input" type="text" placeholder="Roles" className="form-control" />
          <Field name="user_id" component="input" type="text" placeholder="Id" className="form-control" />
        </div>
        <div className="col-md-6">
          <Field name="lis_person_contact_email_primary" component="input" type="text" placeholder="email" className="form-control" />
          <Field name="lis_person_name_given" component="input" type="text" placeholder="Given Name" className="form-control" />
          <Field name="lis_person_name_family" component="input" type="text" placeholder="Family Name" className="form-control" />
        </div>
      </div>
    </div>

    {/* Course */}
    <div className="card quarternary">
      <h5 className="card-title">
        <span>Context</span>
        <select onChange={updateContext(change)}>
          {contexts.map(c => (
            <option key={c.name} value={c.name}>{c.context_title}</option>
          ))}
        </select>
      </h5>
      <div className="row">
        <div className="col-md-6">
          <Field name="context_id" component="input" type="text" placeholder="Id" className="form-control" />
          <Field name="context_title" component="input" type="text" placeholder="Title" className="form-control" />
          <Field name="context_label" component="input" type="text" placeholder="Label (short name)" className="form-control" />
        </div>
        <div className="col-md-6">
          <Field name="resource_link_id" component="input" type="text" placeholder="Resource Id" className="form-control" />
          <Field name="resource_link_title" component="input" type="text" placeholder="Resource Title" className="form-control" />
          <button className="btn btn-default">Gradebook <i className="fa fa-calendar"/></button>
        </div>
      </div>
    </div>

    {/* Custom Params */}
    <div className="card quinary">
      <div className="row">
        <div className="col-md-6">
          <h5 className="card-title">Custom Parameters</h5>
          <textarea rows="3" placeholder="Separate values with an '=', like userclassName=king. Put each parameter on its own line." className="form-control params"/>
        </div>
        <div className="col-md-6">
          <h5 className="card-title">Extension Parameters</h5>
          <textarea rows="3" placeholder="Separate values with an '=', like userclassName=king. Put each parameter on its own line." className="form-control params"/>
        </div>
      </div>
    </div>

    {/* Outcomes */}
    <div className="row">
      <div className="col-md-6">
        <div className="card">
          <h5 className="card-title">Outcomes</h5>
          <div className="checkbox-wrapper"><Field name="outcomes1" component="input" type="checkbox" /><span> 1.1</span></div>
          <div className="checkbox-wrapper"><Field name="outcomes2" component="input" type="checkbox" /><span> 2.0</span></div>
        </div>
      </div>
    </div>
  </form>
);

const validate = values => {
  const errors = {};
  if (!values.url) {
    errors.url = 'REQUIRED_FIELD';
  }
  if (!values.key) {
    errors.key = 'REQUIRED_FIELD';
  }
  if (!values.secret) {
    errors.secret = 'REQUIRED_FIELD';
  }
  return errors;
}

const WrappedForm = reduxForm({
  form: 'launches',
  validate
})(Launches);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedForm);
