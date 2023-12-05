describe("Club", () => {
	it("[SUCCESS C-1] club details", () => {
		cy.login().then((token) => {
			cy.getClubs(token).then((clubes) => {
				cy.visit("/", {
					failOnStatusCode: false,
				});
				cy.get(`div[id=${clubes[0]._id}]`).click();
				cy.get('span[class="text-h3"]').contains(clubes[0].name);
			});
		});
	});

	it("[Error C-2] Do not reach the website by token", () => {
		// Intenta visitar la página de clubes sin proporcionar un token
		cy.visit("/club", { failOnStatusCode: false });

		// Verifica que la aplicación redirige al usuario a la página de inicio de sesión
		cy.url().should("eq", "http://pruebas-soft.s3-website.us-east-2.amazonaws.com/login");

		// Verifica que el formulario esté presente
		cy.get('.q-card.q-card--bordered.q-pa-md.shadow-2.my_card').should('exist');
	});


	it("[SUCCESS C-3] Add member", () => {
		cy.login().then((token) => {
			cy.getClubs(token).then((clubes) => {
				cy.visit("/", {
					failOnStatusCode: false,
				});

				cy.get(`div[id=${clubes[0]._id}]`).click();
				cy.get('span[class="text-h3"]').contains(clubes[0].name);

				cy.getMembers(token, clubes[0]._id).then((initialMembers) => {
					// Obtener el número inicial de miembros del club
					let initialMembersCount = initialMembers.length;

					// Hacer clic en el botón "New member"
					cy.get('div.q-card__section:contains("Members") button:contains("New member")').click();

					// Llenar el formulario del modal
					cy.get('input[name="member-name"]').type(`Nombre${initialMembersCount + 1}`);
					cy.get('input[name="member-lastname"]').type(`Apellido${initialMembersCount + 1}`);
					cy.get('input[name="member-email"]').type(`correo${initialMembersCount + 1}@ejemplo.com`);
					cy.get('input[name="member-dni"]').type("123456789");
					cy.get('input[name="member-nickname"]').type(`Nickname${initialMembersCount + 1}`);

					// Hacer clic en el botón "Add Member"
					cy.get('button:contains("Add Member")').click();

					// Verificar que el modal se ha cerrado
					cy.get('div.text-h6:contains("Add member")').should("not.exist");

					// Esperar a que la notificación aparezca y contenga el mensaje específico
					cy.contains('.q-notification', 'Member added successfully').should('exist');

					// Verificar que se agregó un nuevo miembro
					cy.getMembers(token, clubes[0]._id).then((finalMembers) => {
						expect(finalMembers.length).to.eq(initialMembersCount + 1);
					});

					// Verificar que la tabla contiene la cantidad total de miembros
					cy.get('table.q-table tbody tr').should('have.length', initialMembersCount + 1);
				});
			});
		});
	});


	it("[Error C-4] Failed to add member due to missing email", () => {
		cy.login().then((token) => {
			cy.getClubs(token).then((clubes) => {
				cy.visit("/", {
					failOnStatusCode: false,
				});

				cy.get(`div[id=${clubes[0]._id}]`).click();
				cy.get('span[class="text-h3"]').contains(clubes[0].name);

				cy.getMembers(token, clubes[0]._id).then((initialMembers) => {
					// Obtener el número inicial de miembros del club
					let initialMembersCount = initialMembers.length;
					// Hacer clic en el botón "New member"
					cy.get('div.q-card__section:contains("Members") button:contains("New member")').click();

					// Llenar el formulario del modal sin el email
					cy.get('input[name="member-name"]').type("Nombre");
					cy.get('input[name="member-lastname"]').type("Apellido");
					cy.get('input[name="member-dni"]').type("123456789");
					cy.get('input[name="member-nickname"]').type("Nickname");

					// Hacer clic en el botón "Add Member"
					cy.get('button:contains("Add Member")').click();

					// Verificar que se muestra el mensaje de error
					cy.get('p.text-negative.text-center').should('exist').contains('email is required and must be a valid email');

					// Verificar que no se agregó un nuevo miembro
					cy.getMembers(token, clubes[0]._id).then((finalMembers) => {
						expect(finalMembers.length).to.eq(initialMembersCount);
					});
				});
			});
		});
	});

	it("[Error C-5] No action when doing click on delete created member", () => {
		cy.login().then((token) => {
			cy.getClubs(token).then((clubes) => {
				cy.visit("/", {
					failOnStatusCode: false,
				});

				cy.get(`div[id=${clubes[0]._id}]`).click();
				cy.get('span[class="text-h3"]').contains(clubes[0].name);

				// Verificar si el elemento existe
				cy.get('table.q-table tbody tr').should('exist').then(() => {
					// Hacer clic en el botón de eliminar
					cy.get('table.q-table tbody tr:first-child i.material-icons:contains("delete_forever")').click();

					// Esperar a que la notificación aparezca y contenga el mensaje específico
					cy.contains('.q-notification', 'Unavailable').should('exist');
				});
			});
		});
	});

});
