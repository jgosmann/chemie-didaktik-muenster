import { BLOCKS, INLINES, Block, Inline } from "@contentful/rich-text-types"
import { Link } from "gatsby"
import {
  ContentfulRichTextGatsbyReference,
  renderRichText,
  RenderRichTextData,
} from "gatsby-source-contentful/rich-text"
import * as React from "react"
import { Breadcrumb } from "../navigation/Breadcrumbs"
import Collapsible from "../controls/Collapsible"
import { DefaultCryptedEmail, DefaultCryptedPhone } from "../crypted"
import { IdHierarchy } from "./toc"
import { ToggleButton } from "../controls/Collapsible/CollapsibleView"
import CryptedEmail from "../crypted/Email"

interface ContentfulAsset extends ContentfulRichTextGatsbyReference {
  title: string
  file: {
    url: string
  }
}

export type RichTextFragment = RenderRichTextData<
  ContentfulRichTextGatsbyReference | ContentfulAsset
>

const replacePlaceholder = (
  text: React.ReactNode,
  placeholder: string,
  componentFactory: (arg?: string) => React.ReactNode
) => {
  if (typeof text === "string") {
    const match = text.match(new RegExp(`<!--${placeholder}(?:\\s+(.*))?-->`))
    if (match) {
      const parts = text.split(new RegExp(`<!--${placeholder}(?:\\s+.*)?-->`))
      return parts
        .filter(part => part !== undefined)
        .flatMap((part, index) => {
          if (index > 0) {
            return [componentFactory(match[1]), part]
          }
          return [part]
        })
    }
  }
  return [text]
}

const removePlaceholders = (text: React.ReactNode) => {
  if (typeof text === "string") {
    return text.replace(/<!--.*?-->/g, "")
  }
  return text
}

const baseRenderers = {
  [BLOCKS.OL_LIST]: (node: Block | Inline, children: React.ReactNode) => (
    <ol>{children}</ol>
  ),
  [BLOCKS.UL_LIST]: (node: Block | Inline, children: React.ReactNode) => (
    <ul>{children}</ul>
  ),
  [BLOCKS.LIST_ITEM]: (node: Block | Inline, children: React.ReactNode) => (
    <li>{children}</li>
  ),
  [BLOCKS.HR]: () => <hr />,
  [BLOCKS.QUOTE]: (node: Block | Inline, children: React.ReactNode) => (
    <blockquote>{children}</blockquote>
  ),
  [BLOCKS.PARAGRAPH]: (node: Block | Inline, children: React.ReactNode) => {
    if (!children) {
      return <p></p>
    }
    const withLineBreaks = React.Children.map(children, child => {
      if (typeof child === "string") {
        return child.split("\n").flatMap((line, index) => {
          if (index > 0) {
            return [<br key={index} />, line]
          }
          return [line]
        })
      }
      return [child]
    }).flat(1)
    const withEmail = React.Children.map(withLineBreaks, child =>
      replacePlaceholder(child, "email", email => {
        if (email) {
          const [name, fullDomain] = email.split("@", 2)
          const domainParts = fullDomain.split(".")
          return (
            <CryptedEmail
              name={name}
              domain={domainParts.slice(0, -1).join(".")}
              tld={domainParts.at(-1)}
            />
          )
        } else {
          return <DefaultCryptedEmail />
        }
      })
    ).flat(1)
    const withPhone = React.Children.map(withEmail, child =>
      replacePlaceholder(child, "telefon", () => <DefaultCryptedPhone />)
    ).flat(1)
    const withoutRemainingPlaceholders = React.Children.map(
      withPhone,
      removePlaceholders
    )
    return <p>{withoutRemainingPlaceholders}</p>
  },
  [INLINES.ASSET_HYPERLINK]: (
    { data }: Block | Inline,
    children: React.ReactNode
  ) => {
    return <a href={data.target.file.url}>{children}</a>
  },
  [INLINES.ENTRY_HYPERLINK]: (
    { data }: Block | Inline,
    children: React.ReactNode
  ) => {
    if (data.target.crumbs) {
      return (
        <Link to={data.target.crumbs.map((c: Breadcrumb) => c.slug).join("/")}>
          {children}
        </Link>
      )
    }
    return (
      <span className="bg-red-100 rounded border border-red-700">
        Entry cannot be linked.
      </span>
    )
  },
  [BLOCKS.EMBEDDED_ASSET]: ({ data }: Block | Inline) => {
    if (
      data.target.file.url.match(/\.(a?png|gif|jfif|jpe?g|pj(pe)?g|svg|webp)$/)
    ) {
      return (
        <img
          src={data.target.file.url}
          alt={data.target.title}
          className="max-w-full"
        />
      )
    } else if (
      data.target.file.url.match(/\.(3gp|mov|mp4|mpe?g|og[gv]|webm)$/)
    ) {
      return <video controls src={data.target.file.url} />
    } else {
      return (
        <div className="bg-red-100 rounded p-2 border border-red-700">
          Embedded asset cannot be displayed.
        </div>
      )
    }
  },
}

interface Renderer {
  render: (content: RichTextFragment) => JSX.Element
}

class DefaultRenderer implements Renderer {
  private idHierarchy = new IdHierarchy()

  public render(content: RichTextFragment): JSX.Element {
    return <>{renderRichText(content, { renderNode: this.renderNode() })}</>
  }

  private renderHeading(
    level: 1 | 2 | 3 | 4 | 5 | 6,
    node: Block | Inline,
    children: React.ReactNode
  ) {
    this.idHierarchy.setLevel(level, node)
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

    return <HeadingTag id={this.idHierarchy.currentId()}>{children}</HeadingTag>
  }

  private renderNode() {
    return {
      ...baseRenderers,
      [BLOCKS.HEADING_1]: (node: Block | Inline, children: React.ReactNode) =>
        this.renderHeading(1, node, children),
      [BLOCKS.HEADING_2]: (node: Block | Inline, children: React.ReactNode) =>
        this.renderHeading(2, node, children),
      [BLOCKS.HEADING_3]: (node: Block | Inline, children: React.ReactNode) =>
        this.renderHeading(3, node, children),
      [BLOCKS.HEADING_4]: (node: Block | Inline, children: React.ReactNode) =>
        this.renderHeading(4, node, children),
      [BLOCKS.HEADING_5]: (node: Block | Inline, children: React.ReactNode) =>
        this.renderHeading(5, node, children),
      [BLOCKS.HEADING_6]: (node: Block | Inline, children: React.ReactNode) =>
        this.renderHeading(6, node, children),
    }
  }
}

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
interface HeadingDef {
  level: HeadingLevel
  id: string
  children: React.ReactNode
}

class CollapseHeadingsRenderer implements Renderer {
  private currentSectionHeading?: HeadingDef
  private currentSection: React.ReactNode[] = []
  private idHierarchy = new IdHierarchy()
  private rendered: React.ReactNode[] = []

  public render(content: RichTextFragment): JSX.Element {
    const head = renderRichText(content, { renderNode: this.renderNode() })
    return (
      <>
        {head}
        {this.finishSection()}
      </>
    )
  }

  private renderHeading(
    level: HeadingLevel,
    node: Block | Inline,
    children: React.ReactNode
  ) {
    this.idHierarchy.setLevel(level, node)

    const heading = {
      level,
      id: this.idHierarchy.currentId(),
      children,
    }

    const rendered =
      this.idHierarchy.currentDepth() <= 2 ? this.finishSection() : null
    if (this.idHierarchy.currentDepth() == 2) {
      this.currentSectionHeading = heading
    } else {
      this.currentSection.push(this.renderNonCollapsibleHeading(heading))
    }
    return rendered
  }

  private renderNonCollapsibleHeading({
    level,
    id,
    children,
  }: HeadingDef): JSX.Element {
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements
    return <HeadingTag id={id}>{children}</HeadingTag>
  }

  private finishSection() {
    const currentSectionHeading = this.currentSectionHeading
    const previousSectionRender = currentSectionHeading ? (
      <Collapsible
        label={currentSectionHeading.children}
        expandOnHash={`#${currentSectionHeading.id}`}
        renderLabel={({ label, isExpanded, onToggle }) => {
          const HeadingTag = `h${currentSectionHeading.level}` as keyof JSX.IntrinsicElements
          return (
            <HeadingTag
              id={currentSectionHeading.id}
              onClick={onToggle}
              className="cursor-pointer"
            >
              <ToggleButton
                isExpanded={isExpanded}
                onToggle={() => undefined}
                className="mr-2"
              />
              {label}
            </HeadingTag>
          )
        }}
      >
        {this.currentSection}
      </Collapsible>
    ) : (
      this.currentSection
    )
    this.rendered.push(previousSectionRender)

    this.currentSectionHeading = undefined
    this.currentSection = []
  }

  private renderNode() {
    const createRenderBlockFunction = (block: BLOCKS) => (
      node: Block | Inline,
      children: React.ReactNode
    ) => {
      React.Children.forEach(children, child => {
        if (typeof child !== "string") {
          this.currentSection.pop()
        }
      })
      this.currentSection.push(baseRenderers[block](node, children))
      return this.currentSection[0]
    }
    const renderers = {
      ...baseRenderers,
      [BLOCKS.DOCUMENT]: () => {
        return this.rendered
      },
      [BLOCKS.PARAGRAPH]: createRenderBlockFunction(BLOCKS.PARAGRAPH),
      [BLOCKS.OL_LIST]: createRenderBlockFunction(BLOCKS.OL_LIST),
      [BLOCKS.UL_LIST]: createRenderBlockFunction(BLOCKS.UL_LIST),
      [BLOCKS.LIST_ITEM]: createRenderBlockFunction(BLOCKS.LIST_ITEM),
      [BLOCKS.HR]: () => {
        this.finishSection()
        this.currentSection.push(baseRenderers[BLOCKS.HR]())
        return null
      },
      [BLOCKS.QUOTE]: createRenderBlockFunction(BLOCKS.QUOTE),
      [BLOCKS.EMBEDDED_ASSET]: createRenderBlockFunction(BLOCKS.EMBEDDED_ASSET),
      [BLOCKS.EMBEDDED_ENTRY]: createRenderBlockFunction(BLOCKS.EMBEDDED_ENTRY),
    }
    for (let i: HeadingLevel = 1; i <= 6; ++i) {
      renderers[BLOCKS[`HEADING_${i}`]] = (
        node: Block | Inline,
        children: React.ReactNode
      ) => this.renderHeading(i, node, children)
    }
    return renderers
  }
}

export interface RichTextRenderOptionsArguments {
  idHierarchy: IdHierarchy
  collapseHeadings?: boolean
}

export interface RichTextProps {
  content: RichTextFragment
  collapseHeadings?: boolean
}

const RichText = ({ content, collapseHeadings }: RichTextProps) => {
  const renderer = collapseHeadings
    ? new CollapseHeadingsRenderer()
    : new DefaultRenderer()
  return renderer.render(content)
}

export default RichText
