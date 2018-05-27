import { AppRegistry } from 'react-native'
import Amplify from 'aws-amplify'
import aws_exports from './aws-exports'
import App from './src/App'

Amplify.configure(aws_exports)

AppRegistry.registerComponent('audioStreamingApp', () => App)
