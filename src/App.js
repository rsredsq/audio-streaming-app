import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { Auth, Hub, Storage } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react-native'
import SongsList from './SongsList'
import TrackPlayer from 'react-native-track-player'
import { Container } from 'native-base'
import Header from './Header'
import { FooterController } from './Footer'
import { PlayerController } from './AudioNotifications'
import { formatSongTitle } from './utils'

const MUSIC_FOLDER = 'music/'

Storage.configure({ level: 'private' })

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
})

class App extends React.Component {
  state = {
    loading: true,
    refreshing: false,
    music: [],
    currentSong: null,
    isPlaying: false,
  }

  playerController = PlayerController(
    () => this.playSong(this.state.currentSong),
    () => this.pauseSong(),
    () => this.playPrevSong(),
    () => this.playNextSong(),
    track => this.onTrackChange(track)
  )

  async componentDidMount() {
    await Promise.all([TrackPlayer.setupPlayer({}), this.buildPlaylist()])
    Hub.listen('player', this.playerController)
    this.setState({ loading: false })
  }

  componentWillUnmount() {
    TrackPlayer.reset()
    delete Hub.listeners.player
  }

  async buildPlaylist() {
    this.setState({ refreshing: true })
    const musicPaths = await Storage.list(MUSIC_FOLDER)
    const musicUrls = await Promise.all(musicPaths.map(it => Storage.get(it.key)))

    const tracks = musicPaths.map((it, index) => ({
      id: it.key,
      title: formatSongTitle(it.key, MUSIC_FOLDER.length),
      artist: '',
      url: musicUrls[index],
    }))

    TrackPlayer.reset()

    await TrackPlayer.add(tracks)

    this.setState({
      music: tracks,
      currentSong: tracks[0],
      refreshing: false,
    })
  }

  playSong = song => {
    if (this.state.currentSong !== song) TrackPlayer.skip(song.id)
    TrackPlayer.play()
    this.setState({ currentSong: song, isPlaying: true })
  }

  playPrevSong = () => {
    TrackPlayer.skipToPrevious().catch(() => TrackPlayer.play())
  }

  playNextSong = () => {
    TrackPlayer.skipToNext().catch(() => TrackPlayer.play())
  }

  pauseSong = () => {
    TrackPlayer.pause()
    this.setState({ isPlaying: false })
  }

  deleteSong = song => {
    Storage.remove(song.id).then(res => {
      this.buildPlaylist()
    })
  }

  onTrackChange = trackName => {
    if (!trackName) TrackPlayer.play()
    const song = this.state.music.find(val => val.id === trackName)
    if (song) {
      this.setState({ currentSong: song })
    }
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
        <Header onSignOut={() => Auth.signOut()} />
        <SongsList
          music={this.state.music}
          onPlay={this.playSong}
          onPause={this.pauseSong}
          currentSong={this.state.currentSong}
          isPlaying={this.state.isPlaying}
          onDelete={id => this.deleteSong(this.state.music[id])}
          onRefresh={() => this.buildPlaylist()}
          refreshing={this.state.refreshing}
        />
        <FooterController
          onPlay={this.playSong}
          onPause={this.pauseSong}
          onPrev={this.playPrevSong}
          onNext={this.playNextSong}
          currentSong={this.state.currentSong}
          isPlaying={this.state.isPlaying}
        />
      </Container>
    )
  }
}

export default withAuthenticator(App)
