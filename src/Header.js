import React from 'react'
import { Body, Button, Header, Icon, Right, Title } from 'native-base'

export default ({ onSignOut }) => (
  <Header>
    <Body>
      <Title>AudioPlayer AWS Demo</Title>
    </Body>
    <Right>
      <Button transparent dark onPress={onSignOut}>
        <Icon name="sign-out" type="FontAwesome" />
      </Button>
    </Right>
  </Header>
)
