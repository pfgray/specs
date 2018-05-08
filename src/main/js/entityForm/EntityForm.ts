import { Formik, FormikValues } from 'formik';
import { fromRenderProp, withPromise, ChainableComponent } from 'chainable-components';
import axios from 'axios';
import withLoading from '../util/Loadable';

const chainableFormik = fromRenderProp(Formik);

type EntityFormConfig = {
  auth: string,
  edit: boolean,
  baseUrl: string,
  id?: number,
  values: {[name: string]: string},
  ignore: string[],
  afterSuccess: () => void
};

export default (config: EntityFormConfig) => {
  const opts = {headers: {Authorization:config.auth}};

  // if we're editing... fetch the resource first
  const initialEntity = getEntity(config);
  
  return initialEntity.chain(values => {
      console.log('got more values: ', values);
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
      })
  });
}

function getEntity(config: EntityFormConfig): ChainableComponent<FormikValues> {
  const opts = {headers: {Authorization:config.auth}};
  if(config.edit) {
    return withPromise({
      get: () => axios.get(`${config.baseUrl}/${config.id}`, opts).then(resp => {
        console.log('got resp: ', resp);
        return resp.data;
      })
    })
    .chain(entityResp =>
      withLoading(entityResp).map(ent => {
        console.log('hmmmmm', ent);
        return ent;
      })
    )
  } else {
    return ChainableComponent.of(config.values)
  }
}