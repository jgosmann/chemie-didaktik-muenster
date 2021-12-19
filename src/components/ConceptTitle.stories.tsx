import React from "react"
import { ComponentStory } from "@storybook/react"
import ConceptTitle, { ConceptTitleProps } from "./ConceptTitle"
import { fixedImage } from "../test-fixtures/images"

export default {
  title: "Concept Title",
  component: ConceptTitle,
}

const Template: ComponentStory<typeof ConceptTitle> = (
  args: ConceptTitleProps
) => <ConceptTitle {...args} />

export const Text = Template.bind({})
Text.args = {
  title: "Title",
}

export const Image = Template.bind({})
Image.args = {
  ...Text.args,
  titleImage: fixedImage({ url: "/chemlevel.png", width: 289, height: 41 }),
}
