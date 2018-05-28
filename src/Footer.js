import React from 'react'
import { ProgressViewIOS, View } from 'react-native'
import { Body, Button, Footer, Icon, Left } from 'native-base'
import TrackPlayer from 'react-native-track-player'
import TextTicker from 'react-native-text-ticker'

class PlayerInfoBar extends TrackPlayer.ProgressComponent {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <ProgressViewIOS
          progress={this.getBufferedProgress()}
          progressTintColor="#888888"
          progressViewStyle="bar"
        >
          <ProgressViewIOS
            progress={this.getProgress()}
            progressTintColor="#eeeeee"
            progressViewStyle="bar"
          />
        </ProgressViewIOS>
      </View>
    )
  }
}

export const FooterController = ({ onPlay, onPause, onPrev, onNext, currentSong, isPlaying }) => (
  <Footer style={{ flexDirection: 'column' }}>
    <PlayerInfoBar />
    <View style={{ flexDirection: 'row' }}>
      <Left style={{ flexDirection: 'row' }}>
        <Button transparent dark onPress={onPrev}>
          <Icon name="backward" type="FontAwesome" />
        </Button>
        <Button
          transparent
          dark
          onPress={() => (isPlaying ? onPause(currentSong) : onPlay(currentSong))}
        >
          <Icon name={isPlaying ? 'pause' : 'play'} type="FontAwesome" />
        </Button>
        <Button transparent dark onPress={onNext}>
          <Icon name="forward" type="FontAwesome" />
        </Button>
      </Left>
      <Body style={{ flex: 1.7 }}>
        <TextTicker
          style={{ fontSize: 16 }}
          duration={7000}
          loop
          bounce
          repeatSpacer={50}
          marqueeDelay={1000}
        >
          {currentSong && currentSong.title}
        </TextTicker>
      </Body>
    </View>
  </Footer>
)
