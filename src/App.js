import React from 'react'
import { ActivityIndicator, ProgressViewIOS, StyleSheet, View } from 'react-native'
import { Auth, Storage } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react-native'
import SongsList from './SongsList'
import TrackPlayer from 'react-native-track-player'
import { Body, Button, Container, Footer, Header, Icon, Left, Right, Title } from 'native-base'
import TextTicker from 'react-native-text-ticker'

const MUSIC_FOLDER = 'music/'

Storage.configure({ level: 'private' })

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
})

class App extends React.Component {
  state = {
    loading: true,
    music: [],
    currentlyPlaying: null,
  }

  async componentDidMount() {
    await Promise.all([TrackPlayer.setupPlayer(), this.buildPlaylist()])
    this.setState({ loading: false })
  }

  async buildPlaylist() {
    const musicPaths = await Storage.list(MUSIC_FOLDER)
    const musicUrls = await Promise.all(musicPaths.map(it => Storage.get(it.key)))

    const tracks = musicPaths.map((it, index) => ({
      id: it.key,
      title: it.key.substring(MUSIC_FOLDER.length),
      artist: 'asd',
      url: musicUrls[index],
    }))

    await TrackPlayer.add(tracks)

    this.setState({
      music: tracks,
    })
  }

  playSong = song => {
    TrackPlayer.skip(song.id)
    TrackPlayer.play()
    this.setState({ currentlyPlaying: song })
  }

  pauseSong = song => {
    TrackPlayer.pause()
    this.setState({ currentlyPlaying: null })
  }

  deleteSong = song => {
    Storage.remove(MUSIC_FOLDER + song.title).then(res => {
      this.buildPlaylist()
    })
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      )
    }
    return (
      <Container>
        <Header>
          <Body>
            <Title>AudioPlayer AWS Demo</Title>
          </Body>
          <Right>
            <Button transparent dark onPress={() => Auth.signOut()}>
              <Icon name="sign-out" type="FontAwesome" />
            </Button>
          </Right>
        </Header>

        <SongsList
          music={this.state.music}
          onPlay={this.playSong}
          onPause={this.pauseSong}
          currentlyPlaying={this.state.currentlyPlaying}
        />
        <Footer>
          <Left>
            <Button transparent dark>
              <Icon name="ios-skip-backward" />
            </Button>
          </Left>
          <Body style={{ flex: 4 }}>
            <TextTicker
              style={{ fontSize: 24 }}
              duration={7000}
              loop
              bounce
              repeatSpacer={50}
              marqueeDelay={1000}
            >
              {this.state.currentlyPlaying && this.state.currentlyPlaying.title}
            </TextTicker>
            {/*<MyPlayerBar />*/}
          </Body>
          <Right>
            <Button transparent dark>
              <Icon name="ios-skip-forward" />
            </Button>
          </Right>
        </Footer>
      </Container>
    )
  }
}

class MyPlayerBar extends TrackPlayer.ProgressComponent {
  render() {
    return (
      <View style={{ flex: 1 }}>
        {/*<Text>{formatTime(this.state.position)}</Text>*/}
        <ProgressViewIOS progress={this.getProgress()}>
          <ProgressViewIOS progress={this.getBufferedProgress()} progressTintColor="#ff00ff" />
        </ProgressViewIOS>
      </View>
    )
  }
}

export default withAuthenticator(App)
