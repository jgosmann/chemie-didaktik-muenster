const extractVideoId = url => {
  const m1 = url.match(
    /^(https?:\/\/)?(.*\.)?youtube(-nocookie)?\.com\/watch\?.*v=([_a-zA-Z0-9]+)/
  )
  const m2 = url.match(/^(https?:\/\/)?(.*\.)?youtu\.be\/([_a-zA-Z0-9]+)/)
  const videoId = (m1 && m1[4]) || (m2 && m2[3]) || url
  return videoId
}

module.exports = { extractVideoId }
