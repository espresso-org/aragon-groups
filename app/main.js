import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import Aragon, { providers as aragonProviders } from '@aragon/client'
import { Provider } from 'mobx-react'
import { App } from './App'
import { MainStore } from './stores/main-store'
import { Groups } from './groups'

/**
 * Injected stores and objects in the App
 */
function initProvidedObjects() {
  const aragonApp = new Aragon(new aragonProviders.WindowMessage(window.parent))
  const groups = new Groups(aragonApp)
  const mainStore = new MainStore(groups)
  return { aragonApp, mainStore }
}

class ConnectedApp extends React.Component {
  state = {
    app: null,
    observable: null,
    userAccount: '',
  }

  constructor(props) {
    super(props)

    this.stores = initProvidedObjects()
    this.state.app = this.stores.aragonApp
  }

  componentDidMount() {
    window.addEventListener('message', this.handleWrapperMessage)
    window.app1 = this.state.app

    // If using Parcel, reload instead of using HMR.
    // HMR makes the app disconnect from the wrapper and the state is empty until a reload
    // See: https://github.com/parcel-bundler/parcel/issues/289
    if (module.hot) {
      module.hot.dispose(() => {
        window.location.reload();
      })
    }
    window.groups = new Groups(this.state.app)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleWrapperMessage)
  }

  // handshake between Aragon Core and the iframe,
  // since iframes can lose messages that were sent before they were ready
  handleWrapperMessage = ({ data }) => {
    if (data.from !== 'wrapper') {
      return
    }
    if (data.name === 'ready') {
      const { app } = this.state
      this.sendMessageToWrapper('ready', true)
      this.setState({
        observable: app.state(),
      })
      app.accounts().subscribe(accounts => {
        this.setState({
          userAccount: accounts[0],
        })
      })
    }
  }

  sendMessageToWrapper = (name, value) => {
    window.parent.postMessage({ from: 'app', name, value }, '*')
  }

  render() {
    return (
      <Provider {...this.stores}>
        <App {...this.state} />
      </Provider>
    )
  }
}
ReactDOM.render(
  <ConnectedApp />,
  document.getElementById('root')
)
