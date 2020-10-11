import * as React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import { Home, ShoeMap } from './pages'

function App(): JSX.Element {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/map">ShoeMap</Link>
          </li>
        </ul>
      </nav>

      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/map">
          <ShoeMap />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
