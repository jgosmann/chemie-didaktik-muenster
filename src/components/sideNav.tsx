import { faTimesCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { graphql, useStaticQuery } from "gatsby"
import * as React from "react"
import Collapsible from "./collapsible"
import ConceptTitle from "./conceptTitle"
import CrumbLink from "./crumbLink"

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

const SideNav = ({ isOpen, onClose }: SideNavProps): JSX.Element => {
  const {
    allContentfulStartseite: { nodes },
  } = useStaticQuery(graphql`
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
          }
        }
      }
    }
  `)
  const startPage = nodes[0]

  return (
    <nav
      className={`fixed lg:static top-0 bg-gray-100 text-lg lg:text-base h-screen lg:h-full w-11/12 lg:w-max z-50 lg:z-auto lg:shadow-lg p-8 overflow-scroll transform transition-transform ${
        isOpen ? "translate-x-0 shadow-lg" : "-translate-x-full"
      } lg:translate-x-0`}
    >
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
                <ul className="px-4 divide-y divide-gray-400">
                  {conceptPage.linkedContent.map(linkedContent => (
                    <li key={linkedContent.id} className="py-1">
                      <CrumbLink crumbs={linkedContent.crumbs}>
                        {linkedContent.title}
                      </CrumbLink>
                    </li>
                  ))}
                </ul>
              )}
            </Collapsible>
          </TopItem>
        ))}
        <TopItem>
          <TopLink crumbs={[{ slug: "" }, { slug: "faq" }]}>FAQ</TopLink>
        </TopItem>
      </ul>
      <button
        onClick={onClose}
        className="absolute text-2xl text-gray-600 top-2 right-4 lg:hidden"
      >
        <FontAwesomeIcon icon={faTimesCircle} />
      </button>
    </nav>
  )
}

export default SideNav