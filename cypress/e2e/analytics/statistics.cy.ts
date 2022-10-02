const login = (username: string, password: string) => {
  window.sessionStorage.clear()

  cy.visit("/admin")
  cy.get("#username").type(username)
  cy.get("#password").type(password)
  cy.get(".login").click()

  cy.get(".logout").should("exist")
}

const saveForm = (childSelector: string) => {
  cy.get(childSelector).parents("form").submit()
  cy.get(childSelector).parents("form").should("contain", "Gespeichert")
}

describe("Analytics", () => {
  beforeEach(() => {
    login("admin", "chemie-didaktik-münster")
  })

  it("it tracks page clicks", () => {
    cy.get("#tracked-domains").clear()
    cy.get("#tracked-domains").type("localhost")
    saveForm("#tracked-domains")

    cy.get(".clicks-total")
      .first()
      .invoke("text")
      .then(baseValue => {
        cy.visit("http://localhost:9000/")
        cy.visit("http://localhost:9000/admin")
        cy.get(".clicks-total")
          .first()
          .invoke("text")
          .then(updatedValue => {
            assert.isAbove(
              Number.parseInt(updatedValue),
              Number.parseInt(baseValue)
            )
          })
      })
  })

  it("allows to create and delete users", () => {
    const username = "new-user"
    const password = "password"
    cy.get("#username").type(username)
    cy.get("#password").type(password)
    cy.get("#password-confirmation").type(password)
    saveForm("#username")

    cy.contains("Benutzermanagement")
      .siblings()
      .contains(username)
      .should("exist")

    cy.contains(username).siblings('button[title="Löschen"]').click()
    cy.contains("Benutzermanagement")
      .siblings()
      .contains(username)
      .should("not.exist")
  })

  it("allows to change the password", () => {
    cy.get("#old-password").type("chemie-didaktik-münster")
    cy.get("#new-password").type("new-password")
    cy.get("#new-password-confirmation").type("new-password")
    saveForm("#old-password")

    login("admin", "new-password")

    cy.get(".logout").should("exist")

    cy.get("#old-password").type("new-password")
    cy.get("#new-password").type("chemie-didaktik-münster")
    cy.get("#new-password-confirmation").type("chemie-didaktik-münster")
    saveForm("#old-password")
  })
})
