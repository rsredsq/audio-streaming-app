import { Hub } from 'aws-amplify'

export function PlayerController(playSong, pauseSong, playPrevSong, playNextSong, onTrackChange) {
  return {
    onHubCapsule(capsule) {
      const { payload } = capsule
      switch (payload.type) {
        case 'remote-play':
          playSong()
          break
        case 'remote-pause':
          pauseSong()
          break
        case 'remote-previous':
          playPrevSong()
          break
        case 'remote-next':
          playNextSong()
          break
        case 'playback-track-changed':
          console.log(payload)
          onTrackChange(payload.nextTrack)
          break
        default:
          console.log('UNKNOWN EVENT:', payload)
          break
      }
    },
  }
}

export default async data => {
  Hub.dispatch(`player`, data)
}
