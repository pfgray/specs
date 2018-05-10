import * as React from 'react';
import { Formik, FormikValues } from 'formik';
import { fromRenderProp, withPromise, ChainableComponent } from 'chainable-components';
import axios from 'axios';
import withLoading from '../util/Loadable';
import { List, Icon, Row, Col, Input, Button, Form } from 'antd';

const chainableFormik = fromRenderProp(Formik);

export type FormValue = {
  name: string,
  intialValue: string,
  required?: boolean
  label: string
};

type EntityFormConfig = {
  auth: string,
  edit: boolean,
  baseUrl: string,
  id?: number,
  values: FormValue[],
  ignore: string[],
  afterSuccess: () => void
};

export default (config: EntityFormConfig) => {
  const opts = {headers: {Authorization:config.auth}};

  // if we're editing... fetch the resource first
  const initialEntity = getEntity(config);
  
  return initialEntity.chain(values => {
      config.ignore.forEach(k => delete values[k]);
      return chainableFormik({
        initialValues: values,
        onSubmit: (v, actions) => {
          const req = config.edit ? axios.put(config.baseUrl + '/' + config.id, v, opts) : axios.post(config.baseUrl, v, opts);
          
          req.then(resp => {
            actions.setSubmitting(false);
            config.afterSuccess();
          });
        }
      }).map(formik => ([formik, config]));
  });
}

function getEntity(config: EntityFormConfig): ChainableComponent<FormikValues> {
  const opts = {headers: {Authorization:config.auth}};
  if(config.edit) {
    return withPromise({
      get: () => axios.get(`${config.baseUrl}/${config.id}`, opts).then(resp => {
        return resp.data;
      })
    })
    .chain(withLoading)
  } else {
    const initialValues = config.values.reduce((acc, i) => ({
      ...acc,
      [i.name]: i.intialValue 
    }), {});
    return ChainableComponent.of(initialValues);
  }
}

export const GenericForm = ([formik, config]) => (
  <form onSubmit={formik.handleSubmit} style={{marginTop: '3rem'}}>
    <Row gutter={16}>
      <Col className='gutter-row' span={14} offset={5}>
        {Object.keys(formik.values).map(key => (
          <Form.Item label={findLabel(key, config)}>
              <Input key={key} name={key} placeholder={key} value={formik.values[key]} onChange={formik.handleChange} />
          </Form.Item>
        ))}
      </Col>
    </Row>

    <Row gutter={16}>
      <Col className='gutter-row' span={14} offset={5}>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Col>
    </Row>
  </form>
);

function findLabel(key: string, config: EntityFormConfig): string {
  console.log('searching: ', config);
  const value = config.values.find(value => value.name === key);
  return value ? value.label : ''; 
}