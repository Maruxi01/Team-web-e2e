describe("Login", () => {
	it("[SUCCESS L-1] login", () => {
		cy.visit("/login",{
			failOnStatusCode: false,
		});

		cy.login().then(() => {
			cy.visit("/");
		});
	});

	it("[Error L-2] invalid credentials", () => {
		cy.visit("/login", {
			failOnStatusCode: false,
		});
		cy.get('input[id="login-email"').type("correo@incorrecto.cl");
		cy.get('input[id="login-password"').type("correo");
		cy.get("button").click();

		cy.get(".text-negative").should("text", "invalid credentials");
	});
});
