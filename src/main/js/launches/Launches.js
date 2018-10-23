import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Modal } from 'reactstrap';
import classNames from 'classnames';
import _ from 'lodash';
import History from 'material-ui-icons/History';
import Launch from 'material-ui-icons/Launch';
import CallMade from 'material-ui-icons/CallMade';
import Lockr from 'lockr';

import PrevLaunches from './PrevLaunches';
import users from './users/users';
import contexts from './contexts/contexts';
import { LAUNCH_IN_FRAME, UNLAUNCH, OPEN_PREVIOUS, CLOSE_PREVIOUS, ADD_LAUNCH, REMOVE_LAUNCH, UPDATE_LAUNCH_FORM } from './launchReducer';

import './launches.less';

const save = (dispatch) => values => {
  const newWindow = values.newWindow;

  const customParams =
    values.custom ? (values.custom
        .split('\n')
        .filter(s => s !== '')): {};

  values = {
    ...values,
    ...customParams
  };
  // Lockr
  dispatch((d, getState) => {
    console.log(' adding launching...');
    d({
      type: ADD_LAUNCH,
      data: {
        url: values.url,
        key: values.key,
        secret: values.secret
      }
    });
    Lockr.set('launches', getState().launchForm.launches);
  });

  const params = Object.keys(values).map(k => k + "=" + values[k]).join("&");
  if(newWindow){
    window.open('/api/signedLaunch?' + params);
  } else {
    dispatch({
      type: LAUNCH_IN_FRAME,
      data: params
    });
  }
};

const mapStateToProps = state => ({
  user_image: _.get(state, 'form.launches.values.user_image'),
  initialValues: {
    ...users[0],
    ...contexts[0],
    newWindow: false,
    outcomes1: true,
    outcomes2: true,
    ...state.launchForm.values
  },
  launched: state.launchForm ? state.launchForm.launched : false,
  params: state.launchForm ? state.launchForm.params : {},
  previousOpen: state.launchForm.previousOpen,
  launches: state.launchForm.launches
});
const mapDispatchToProps = dispatch => ({
  save: save(dispatch),
  unLaunch: () => dispatch({type: UNLAUNCH}),
  openPrevious: () => dispatch({type: OPEN_PREVIOUS}),
  closePrevious: () => dispatch({type: CLOSE_PREVIOUS}),
  removeLaunch: i => dispatch((d, getState) => {
    d({type: REMOVE_LAUNCH, data: {index: i}});
    Lockr.set('launches', getState().launchForm.launches);
  }),
  dispatch
});

const updateLaunch = (change, dispatch) => newLaunch => {
  changeAll(change, newLaunch);
  dispatch({type: CLOSE_PREVIOUS});
}

const updateUser = change => e => {
  const newUser = users.find(u => u.name === e.target.value);
  changeAll(change, newUser);
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

const Launches = ({save, handleSubmit, launched, change, user_image, params, unLaunch, openPrevious, previousOpen, closePrevious, launches, removeLaunch, dispatch}) => (
  <div className={'launch-container ' + (launched ? 'launched' : '')}>
    <div className='launch-container-inner'>
      <form className="launch-form" onSubmit={handleSubmit(save)}>
        <div className="row launch-btn-container">
          <div className="col-md-12">
            <PrevLaunches isOpen={previousOpen} onClose={closePrevious} launches={launches} removeLaunch={removeLaunch} loadLaunch={updateLaunch(change, dispatch)}/>
            {launches.length > 0 ? (
              <div>
                <button className="btn btn-warning" onClick={openPrevious} type='button'><History className="sm" /></button>
              </div>
            ): null}

            <div className="fill right">
              <button className="btn btn-primary">Launch</button>
              <label className="new-window-label checkbox-wrapper"><Field name="newWindow" component="input" type="checkbox" /><span>New Window</span></label>
            </div>
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
              {/*<button className="btn btn-default">Gradebook <i className="fa fa-calendar"/></button>*/}
            </div>
          </div>
        </div>

        {/* Custom Params */}
        <div className="card quinary">
          <div className="row">
            <div className="col-md-6">
              <h5 className="card-title">Custom Parameters</h5>
              <Field component="textarea" name="custom" rows="4" placeholder="Separate values with an '=', like userclassName=king. Put each parameter on its own line." className="form-control params"/>
            </div>
            <div className="col-md-6">
              <div className="card">
                <h5 className="card-title">Outcomes</h5>
                <div className="checkbox-wrapper"><Field name="outcomes1" component="input" type="checkbox" /><span> 1.1</span></div>
                <div className="checkbox-wrapper"><Field name="outcomes2" component="input" type="checkbox" /><span> 2.0</span></div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="launch-frame">
        <button onClick={unLaunch} className="btn btn-primary">{'⬅'}</button>
        <iframe src={launched ? ('/api/signedLaunch?' + params) : null} />
      </div>
    </div>
  </div>
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
  validate,
  onChange: (values, dispatch) => {
    dispatch({
      type: UPDATE_LAUNCH_FORM,
      data: values
    });
  }
})(Launches);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedForm);
