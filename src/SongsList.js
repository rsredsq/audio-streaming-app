import React from 'react'
import { ListView, RefreshControl } from 'react-native'
import {
  Container,
  Header,
  Content,
  Button,
  Icon,
  List,
  ListItem,
  Text,
  Right,
  Body,
  Title,
  Left,
  Spinner,
} from 'native-base'
import { Auth } from 'aws-amplify'

export default class SongsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => {
          return true
        },
      }).cloneWithRows(props.music),
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState(prevState => ({
      dataSource: prevState.dataSource.cloneWithRows(newProps.music),
    }))
  }

  render() {
    return (
      <Content refreshControl={<RefreshControl refreshing={false} />}>
        <List
          disableRightSwipe
          dataSource={this.state.dataSource}
          renderRow={song => (
            <ListItem>
              <Body>
                <Text>{song.title}</Text>
              </Body>
              <Right>
                <Button
                  dark
                  bordered
                  onPress={() => {
                    this.props.currentlyPlaying === song
                      ? this.props.onPause(song)
                      : this.props.onPlay(song)
                  }}
                >
                  <Icon name={this.props.currentlyPlaying === song ? 'pause' : 'play'} />
                </Button>
              </Right>
            </ListItem>
          )}
          renderRightHiddenRow={(data, secId, rowId, rowMap) => (
            <Button full danger onPress={_ => this.deleteRow(secId, rowId, rowMap)}>
              <Icon active name="trash" />
            </Button>
          )}
          rightOpenValue={-75}
        />
      </Content>
    )
  }
}
