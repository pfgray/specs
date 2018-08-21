import * as React from 'react';
import { Formik, FormikValues, FormikProps, FormikConfig } from 'formik';
import { fromRenderProp, withPromise, ChainableComponent } from 'chainable-components';
import axios from 'axios';
import withLoading from '../util/Loadable';
import { List, Icon, Row, Col, Input, Button, Form } from 'antd';

const chainableFormik = (props: FormikConfig<FormikValues>) => fromRenderProp(Formik as any, props);

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
  afterSuccess: (a?: any) => void
};

export default (config: EntityFormConfig) => {
  const opts = { headers: { Authorization: config.auth } };

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
          config.afterSuccess(resp);
        });
      }
    }).map(formik => ([formik, config]));
  });
}

function getEntity(config: EntityFormConfig): ChainableComponent<FormikValues> {
  const opts = { headers: { Authorization: config.auth } };
  if (config.edit) {
    return withPromise(() => axios.get(`${config.baseUrl}/${config.id}`, opts).then(resp => {
        return resp.data;
      })
    ).chain(withLoading)
  } else {
    const initialValues = config.values.reduce((acc, i) => ({
      ...acc,
      [i.name]: i.intialValue
    }), {});
    return ChainableComponent.of(initialValues);
  }
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

export const GenericForm = ([formik, config]: [FormikProps<any>, EntityFormConfig]) => (
  <form onSubmit={formik.handleSubmit} style={{ marginTop: '3rem' }}>
    <Row gutter={16}>
      <Col className='gutter-row' span={16} offset={3}>
        {Object.keys(formik.values).map(key => (
          <Form.Item label={findLabel(key, config)} {...formItemLayout}>
            <Input key={key} name={key} placeholder={key} value={formik.values[key]} onChange={formik.handleChange} />
          </Form.Item>
        ))}

        <Col className='gutter-row' span={16} offset={8}>
          <Form.Item {...formItemLayout}>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form.Item>
        </Col>
      </Col>
    </Row>
  </form>
);

function findLabel(key: string, config: EntityFormConfig): string {
  const value = config.values.find(value => value.name === key);
  return value ? value.label : '';
}