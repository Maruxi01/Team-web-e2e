// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/**
 * Send login request with email and password
 */
Cypress.Commands.add("login", () => {
	return cy
		.request({
			method: "POST",
			url: `http://3.138.52.135:3000/auth/login`,
			body: {
				email: "m.villagran02@ufromail.cl",
				password: "D1I5biOY",
			},
		})
		.then(({ body }) => {
			const { token, user } = body;

			cy.window().then((win) => {
				win.localStorage.setItem("user", JSON.stringify({ token, user }));
				return token;
			});
		});
});

/**
 * Send request to clubs endpoint with the input token and return the user clubs
 */
Cypress.Commands.add("getClubs", (token) => {
	cy.request({
		url: `http://3.138.52.135:3000/clubs`,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}).then(({ body }) => {
		return body.clubs;
	});
});

/**
 * Command to get members of a club using the provided authentication token
 */
Cypress.Commands.add("getMembers", (token, id) => {
	cy.request({
		url: `http://3.138.52.135:3000/clubs/${id}/members`,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}).then(({ body }) => {
		return body.members;
	});
});


// Cypress.Commands.add("addClub", (name, description, token) => {
// 	cy.request({

// 	})
// });