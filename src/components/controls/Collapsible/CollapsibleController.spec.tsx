import React from "react"
import { act, render, screen } from "@testing-library/react"
import CollapsibleController from "./CollapsibleController"

describe("Collapsible", () => {
  describe("with defaults", () => {
    beforeEach(() => {
      render(
        <CollapsibleController
          render={({ onToggle, isExpanded }) => {
            return (
              <div>
                <label id="isExpanded">Is expanded?</label>
                <div aria-labelledby="isExpanded">
                  {isExpanded ? "true" : "false"}
                </div>
                <button id="toggle" onClick={onToggle}>
                  Toggle
                </button>
              </div>
            )
          }}
        />
      )
    })

    it("starts collapsed", () => {
      expect(screen.getByLabelText("Is expanded?")).toHaveTextContent("false")
    })

    describe("when expand button is clicked", () => {
      beforeEach(() => {
        act(() => screen.getByText("Toggle").click())
      })

      it("it expands", () => {
        expect(screen.getByLabelText("Is expanded?")).toHaveTextContent("true")
      })

      describe("when expand button is clicked again", () => {
        beforeEach(() => {
          act(() => screen.getByText("Toggle").click())
        })

        it("it collapses", () => {
          expect(screen.getByLabelText("Is expanded?")).toHaveTextContent(
            "false"
          )
        })
      })
    })
  })

  describe("with initExpanded prop", () => {
    beforeEach(() => {
      render(
        <CollapsibleController
          initExpanded
          render={({ onToggle, isExpanded }) => {
            return (
              <div>
                <label id="isExpanded">Is expanded?</label>
                <div aria-labelledby="isExpanded">
                  {isExpanded ? "true" : "false"}
                </div>
                <button id="toggle" onClick={onToggle}>
                  Toggle
                </button>
              </div>
            )
          }}
        />
      )
    })

    it("starts expanded", () => {
      expect(screen.getByLabelText("Is expanded?")).toHaveTextContent("true")
    })
  })
})
