import * as React from 'react';
import { App } from '../resources';

import './app-logo.less';

type AppLogoProps = {
  app: App
};

const AppLogo = (props: AppLogoProps) => (
  props.app.logo ? (
    <img className='app-logo' src={props.app.logo} />
  ) : (
    <HashedLogo app={props.app}/>
  )
);

export default AppLogo;

const HashedLogo = (props: AppLogoProps) => (
  <div className='app-logo hashed' style={{backgroundColor: getColorForString(props.app.name)}}>
    {props.app.name.charAt(0)}
  </div>
);

const Colors = [
  '#a61d00',
  '#cc0300',
  '#e79138',
  '#f1c231',
  '#6aa84f',
  '#44818e',
  '#3c78d9',
  '#3d85c6',
  '#664da7',
  '#a64d79'
];

var hash = function(str: string): number {
  var hash = 0, i, chr, len;
  if (str.length == 0) return hash; 
  for (i = 0, len = str.length; i < len; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

const getColorForString = function(input: string): string {
  var number = Math.abs(hash(input));
  return Colors[Math.floor(number % Colors.length)];
};
