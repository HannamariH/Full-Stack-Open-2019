describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset")
    const user = {
      name: "Maija Meikäläinen",
      username: "maija",
      password: "salasana",
    }
    cy.request("POST", "http://localhost:3001/api/users/", user)
    cy.visit("http://localhost:3000")
  })

  it("Login from is shown", function () {
    cy.contains("log in to application")
  })

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("input:first").type("maija")
      cy.get("input:last").type("salasana")
      cy.contains("login").click()
      cy.contains("logged in")
    })

    it("fails with wrong credentials", function () {
      cy.get("input:first").type("kissa")
      cy.get("input:last").type("koira")
      cy.contains("login").click()
      cy.get(".error").contains("wrong username or password")
    })
  })

  describe("When logged in", function () {
    beforeEach(function () {
      cy.get("input:first").type("maija")
      cy.get("input:last").type("salasana")
      cy.contains("login").click()
    })

    it("A blog can be created", function () {
      cy.contains("new blog").click()
      cy.get("#title").type("testiblogi")
      cy.get("#author").type("Maija")
      cy.get("#url").type("testiblogi.fi")
      cy.get("#create-blog").click()
      cy.contains("testiblogi Maija")
    })

    it("A blog can be liked", function () {
      cy.contains("new blog").click()
      cy.get("#title").type("testiblogi")
      cy.get("#author").type("Maija")
      cy.get("#url").type("testiblogi.fi")
      cy.get("#create-blog").click()
      cy.contains("view").click()
      cy.contains("0")
      cy.contains("like").click()
      cy.contains("1")
    })

    it.only("A user who added a blog can also delete it", function () {
      cy.contains("new blog").click()
      cy.get("#title").type("testiblogi")
      cy.get("#author").type("Maija")
      cy.get("#url").type("testiblogi.fi")
      cy.get("#create-blog").click()
      cy.contains("testiblogi Maija")
      cy.contains("view").click()
      cy.contains("remove blog") //.click()
      //cy.get("html").should("not.contain", "testiblogi")
    })

  })
})
