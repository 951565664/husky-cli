import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import YourPackageName from 'yourPackageName';
import styles from './index.less'


class App extends Component {
    render() {
        const YourPackageNameProps = {};
        return <YourPackageName {...YourPackageNameProps} />;
    }
}
ReactDOM.render(<App />, document.getElementById('root'));