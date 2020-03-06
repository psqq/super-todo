import * as React from 'react';

interface AppProps {
  color: string;
}

class App extends React.Component<AppProps, {}> {
  render() {
    return (<div>
      <h1>Welcome to React with Typescript</h1>
      <p>The color of this page is: {this.props.color}</p>
    </div>
    );
  }
}

export default App;
