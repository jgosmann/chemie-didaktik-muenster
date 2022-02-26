import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import AdminArea from "../components/controls/admin"
import AuthController from "../components/controls/admin/AuthController"

const AdminPage = () => {
  return (
    <Layout crumbs={[{ title: "Administration", slug: "admin" }]}>
      <Seo title="Startseite" />
      <AuthController
        render={(username, logout) => (
          <AdminArea loggedInUser={username} logout={logout} />
        )}
      />
    </Layout>
  )
}

export default AdminPage
