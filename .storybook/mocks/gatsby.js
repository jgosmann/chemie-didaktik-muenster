module.exports = require("gatsby-original")

let nextStaticQueryResult

module.exports.useStaticQuery = () => nextStaticQueryResult

module.exports.decorator = (story, { parameters }) => {
  if (parameters && parameters.staticQuery) {
    nextStaticQueryResult = parameters.staticQuery
  }
  return story()
}
