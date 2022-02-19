import * as React from "react"
import { Auth0Provider } from "@auth0/auth0-react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import AdminArea from "../components/controls/admin"

const AdminPage = () => {
  return (
    <Layout crumbs={[{ title: "Administration", slug: "admin" }]}>
      <Seo title="Startseite" />
      <Auth0Provider
        domain="jgosmann.eu.auth0.com"
        clientId="Cs0hjyL8yXGGDwLjqxmS0GOrlkjvlAfp"
        redirectUri={window?.location.toString()}
        audience="cdm-analytics"
        scope="read:tracked-domains read:statistics"
      >
        <h1 className="text-2xl mb-4">Administration</h1>
        <AdminArea />
      </Auth0Provider>
    </Layout>
  )
}

export default AdminPage
