import React from 'react';
import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings(['Unrecognized WebSocket', 'Single Occurrence'])

import Routes from './routes'

const App = () => <Routes></Routes>;

export default App;
