export const nameToUrl = (str: string) => {
  return str.toLocaleLowerCase().replace(/\s/g, '-')
}

export const urlToName = (str: string) => {
  const words = str.split('-')
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
  })
  return capitalizedWords.join(' ')
}

export const convertStringToColorArray = (string: string) => {
  if (!string) return []

  // Split the string into individual colors using commas as delimiters
  const colorArray = string.split(',')

  // Remove any leading or trailing whitespace from each color
  const trimmedColors = colorArray.map((color) => color.trim())

  // Use a Set to keep track of unique colors
  const uniqueColors = new Set(trimmedColors)

  // Convert the Set back to an array
  const uniqueColorArray = Array.from(uniqueColors)

  return uniqueColorArray
}
