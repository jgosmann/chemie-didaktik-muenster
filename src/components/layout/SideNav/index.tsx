import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { graphql, navigate, useStaticQuery, withPrefix } from "gatsby"
import { IGatsbyImageData } from "gatsby-plugin-image"
import * as React from "react"
import Collapsible from "../../controls/Collapsible"
import ConceptTitle from "../../ConceptTitle"
import CrumbLink from "../../navigation/CrumbLink"
import Faq, { FaqProps } from "./Faq"
import { RichTextFragment } from "../../RichText/RichText"
import SearchInput from "../../search/SearchInput"

interface TopLinkProps {
  crumbs: {
    slug: string
  }[]
  children: React.ReactNode
}

const TopLink = ({ crumbs, children }: TopLinkProps): JSX.Element => (
  <CrumbLink crumbs={crumbs} className="text-primary visited:text-primary">
    {children}
  </CrumbLink>
)

interface TopItemProps {
  children: React.ReactNode
}

const TopItem = ({ children }: TopItemProps): JSX.Element => (
  <li className="p-2">{children}</li>
)

export interface SideNavProps {
  isOpen: boolean
  onClose: () => void
}

export interface SideNavQuery extends FaqProps {
  allContentfulStartseite: {
    nodes: Array<{
      title: string
      crumbs: Array<{ slug: string }>
      conceptPages: Array<{
        id: string
        title: string
        titleImage?: { gatsbyImageData: IGatsbyImageData }
        crumbs: Array<{ slug: string }>
        linkedContent: Array<{
          id: string
          title: string
          crumbs: Array<{ slug: string }>
        }>
        studentPresentations?: RichTextFragment
        additionalBackground?: RichTextFragment
      }>
    }>
  }
}

export interface SideNavViewProps extends SideNavProps {
  query: SideNavQuery
}

export const SideNavView = ({
  isOpen,
  onClose,
  query: {
    allContentfulStartseite: { nodes },
    faq,
  },
}: SideNavViewProps): JSX.Element => {
  const [query, setQuery] = React.useState("")
  const startPage = nodes[0]
  return (
    <div
      className={`fixed top-0 z-50 lg:z-30 flex flex-col h-screen w-11/12 lg:w-max lg:max-w-sm lg:pt-16 bg-gray-100 lg:shadow-lg transform transition-transform ${
        isOpen ? "translate-x-0 shadow-lg" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <form
        action={withPrefix("/search")}
        method="get"
        onSubmit={ev => {
          const searchParams = new URLSearchParams()
          searchParams.set("q", query)
          navigate("/search?" + searchParams.toString())
          ev.preventDefault()
        }}
        className="p-8 pb-0"
      >
        <label htmlFor="q" className="sr-only">
          Suchbegriff:
        </label>
        <SearchInput
          placeholder="Suche"
          value={query}
          onQueryChange={setQuery}
        />
      </form>
      <nav className={`text-lg lg:text-base lg:pb-40 p-8 overflow-scroll`}>
        <ul className="divide-y divide-gray-400">
          <TopItem>
            <TopLink crumbs={startPage.crumbs}>{startPage.title}</TopLink>
          </TopItem>
          {startPage.conceptPages.map(conceptPage => (
            <TopItem key={conceptPage.id}>
              <Collapsible
                label={
                  <TopLink crumbs={conceptPage.crumbs}>
                    <ConceptTitle
                      title={conceptPage.title}
                      titleImage={conceptPage.titleImage}
                    />
                  </TopLink>
                }
              >
                {conceptPage.linkedContent && (
                  <ul className="pl-4 divide-y divide-gray-400">
                    {conceptPage.linkedContent.map(linkedContent => (
                      <li key={linkedContent.id} className="py-1">
                        <CrumbLink crumbs={linkedContent.crumbs}>
                          {linkedContent.title}
                        </CrumbLink>
                      </li>
                    ))}
                    {!!conceptPage.studentPresentations && (
                      <li className="py-1">
                        <CrumbLink
                          crumbs={[
                            ...conceptPage.crumbs,
                            { slug: "weitere-schuelervorstellungen" },
                          ]}
                        >
                          Weitere Schülervorstellungen
                        </CrumbLink>
                      </li>
                    )}
                    {!!conceptPage.additionalBackground && (
                      <li className="py-1">
                        <CrumbLink
                          crumbs={[
                            ...conceptPage.crumbs,
                            { slug: "weitere-hintergruende" },
                          ]}
                        >
                          Weitere Hintergründe
                        </CrumbLink>
                      </li>
                    )}
                  </ul>
                )}
              </Collapsible>
            </TopItem>
          ))}
          <TopItem>
            <Collapsible
              label={
                <TopLink crumbs={[{ slug: "" }, { slug: "faq" }]}>FAQ</TopLink>
              }
            >
              <Faq faq={faq} />
            </Collapsible>
          </TopItem>
        </ul>
        <button
          onClick={onClose}
          className="fixed text-2xl bg-gray-600 text-gray-100 top-2 right-2 lg:hidden rounded-full border border-gray-100 border-4 shadow-lg"
        >
          <FontAwesomeIcon icon={faTimes} fixedWidth />
        </button>
      </nav>
    </div>
  )
}

const SideNav = ({ isOpen, onClose }: SideNavProps): JSX.Element => {
  const query = useStaticQuery<SideNavQuery>(graphql`
    {
      allContentfulStartseite(limit: 1) {
        nodes {
          title
          crumbs {
            slug
          }
          conceptPages {
            id
            title
            titleImage {
              gatsbyImageData(layout: CONSTRAINED, height: 24)
            }
            crumbs {
              slug
            }
            linkedContent {
              id
              title
              crumbs {
                slug
              }
            }
            studentPresentations {
              ...RichTextFragment
            }
            additionalBackground {
              ...RichTextFragment
            }
          }
        }
      }
      ...FaqFragment
    }
  `)

  return <SideNavView isOpen={isOpen} onClose={onClose} query={query} />
}

export default SideNav
