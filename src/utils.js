export function formatSongTitle(path, folderPathLength) {
  const noPrefix = path.substring(folderPathLength)
  const dotIndex = noPrefix.lastIndexOf('.')
  return noPrefix.substring(0, dotIndex)
}
