import React from 'react'
import { Body, Button, Footer, Icon, Left } from 'native-base'
import TrackPlayer from 'react-native-track-player'
import { ProgressViewIOS, Text, View } from 'react-native'
import TextTicker from 'react-native-text-ticker'

class MyPlayerBar extends TrackPlayer.ProgressComponent {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text>Current progress:</Text>
        <ProgressViewIOS progress={this.getProgress()} />
        <Text>Buffered:</Text>
        <ProgressViewIOS progress={this.getBufferedProgress()} progressTintColor="#00ff00" />
      </View>
    )
  }
}

export const FooterInfo = () => (
  <Footer>
    <Left style={{ flexDirection: 'row' }}>
      <MyPlayerBar />
    </Left>
  </Footer>
)

export const FooterController = ({ onPlay, onPause, onPrev, onNext, currentSong, isPlaying }) => (
  <Footer>
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
  </Footer>
)
