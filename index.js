import { AppRegistry } from 'react-native'
import Amplify from 'aws-amplify'
import aws_exports from './aws-exports'
import App from './src/App'
import TrackPlayer from 'react-native-track-player'
import AudioController from './src/AudioNotifications'

Amplify.configure(aws_exports)

AppRegistry.registerComponent('audioStreamingApp', () => App)

TrackPlayer.registerEventHandler(AudioController)
TrackPlayer.updateOptions({
  capabilities: [
    TrackPlayer.CAPABILITY_PLAY,
    TrackPlayer.CAPABILITY_PAUSE,
    TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
    TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
  ],
})
