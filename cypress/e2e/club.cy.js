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

				cy.get('table.q-table tbody tr').then((rows) => {
				// Obtener el número inicial de filas en la tabla
					let initialRowCount = rows.length;
					
					// Hacer clic en el botón "New member" dentro de la sección
					cy.get('div.q-card__section:contains("Members") button:contains("New member")').click();

					// Llenar el formulario del modal
					cy.get('input[name="member-name"]').type(`Nombre${initialRowCount + 1}`);
					cy.get('input[name="member-lastname"]').type(`Apellido${initialRowCount + 1}`);
					cy.get('input[name="member-email"]').type(`correo${initialRowCount + 1}@ejemplo.com`);
					cy.get('input[name="member-dni"]').type("123456789");
					cy.get('input[name="member-nickname"]').type(`Nickname${initialRowCount + 1}`);

					// Hacer clic en el botón "Add Member"
					cy.get('button:contains("Add Member")').click();

					// Verificar que el modal se ha cerrado
					cy.get('div.text-h6:contains("Add member")').should("not.exist");

					// Esperar a que la notificación aparezca y contenga el mensaje específico
					cy.contains('.q-notification', 'Member added successfully').should('exist');

					cy.get('table.q-table tbody tr').should('have.length', initialRowCount + 1);
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

				// Hacer clic en el botón "New member" dentro de la sección
				cy.get('div.q-card__section:contains("Members") button:contains("New member")').click();

				// Llenar el formulario del modal
				cy.get('input[name="member-name"]').type("Nombre");
				cy.get('input[name="member-lastname"]').type("Apellido");
				cy.get('input[name="member-dni"]').type("123456789");
				cy.get('input[name="member-nickname"]').type("Nickname");

				// Hacer clic en el botón "Add Member"
				cy.get('button:contains("Add Member")').click();

				// Verificar que se muestra el mensaje de error
				cy.get('p.text-negative.text-center').should('exist').contains('email is required and must be a valid email');
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
