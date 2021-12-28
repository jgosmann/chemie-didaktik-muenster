module.exports = function (migration) {
  migration.transformEntries({
    contentType: "detailsPage",
    from: ["video"],
    to: ["video0"],
    transformEntryForLocale: async (from, locale) => ({
      video0: from.video ? from.video[locale] : undefined,
    }),
  })
}
