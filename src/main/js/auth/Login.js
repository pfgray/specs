import React from 'react';
import {connect} from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import classNames from 'classnames';

import './login.less';

const TextInput = ({placeholder, input, meta}) => {
  return (
    <input type="text" placeholder={placeholder} {...input} className={classNames('form-control', {'error': meta.submitFailed && meta.error && !meta.dirty})}/>
  );
};

const Login = () => (
  <div className="fill">
      <div className="row fill login-container">
        <div className="col-md-4">
          <Field name="username" placeholder="username" component={TextInput} />
          <Field name="password" placeholder="password" component={TextInput} />
        </div>
      </div>
  </div>
);

const WrappedForm = reduxForm({
  form: 'login'
})(Login);

const mapStateToProps = state => ({});
const mapDispatchToProps = d => ({dispatch: d});

export default connect(mapStateToProps, mapDispatchToProps)(WrappedForm);
