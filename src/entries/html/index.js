import React from 'react';
import { entry } from '../../containers/Entry/Entry';
import '../../test.less';

const component = <h1>Hello, world!</h1>;
const store = (state = { name: 'Joe' }) => state;
const rootElement = document.getElementById('app');

entry(component, store, rootElement);
