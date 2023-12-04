describe("Home", () => {
	it("[Error H-1] Redirect to /login page when token is not provided", () => {
		cy.visit("/");
		cy.url().should(
			"eq",
			"http://pruebas-soft.s3-website.us-east-2.amazonaws.com/login"
		);
	});

	it("[H-2] Give welcome to user when token is provided",()=>{

		cy.login().then(()=>{
			cy.visit("/")

			const user = JSON.parse(localStorage.getItem("user"));

			cy.get("h2").contains(`Welcome ${user.user.name},`)
		});

	});

	it("[H-3] Get clubs when token is provided",()=>{
		cy.login().then((token)=>{
			cy.getClubs(token).then((clubs)=>{
				cy.visit("/");

				cy.get("div[class='q-item q-item-type row no-wrap q-item--clickable q-link cursor-pointer q-focusable q-hoverable']").should("have.length",clubs.length);
			})
		})
	});

	it("[H-4] Add a club with a name and description",()=>{	

		cy.login().then((token)=>{
			let clubLength = 0;
			cy.visit("/");
			
			cy.getClubs(token).then((clubs)=>{
				clubLength = clubs.length;
				console.log("Club len1", clubLength);
			});

			cy.get('div').contains("Add Club").click();

			cy.get('input[aria-label="Club name"]').type("Club de prueba");
			cy.get('input[aria-label="Club description"]').type("Descripcion de prueba");
			cy.get('span').contains("Add Club").click();

			cy.visit("/");

			cy.getClubs(token).then((clubs)=>{
				expect(clubs.length).to.eq(clubLength+1)
			});
		});
	});

	it("[H-5] Show error when club name is not provided",()=>{

		cy.login().then(()=>{
			cy.visit("/");

			cy.get('div').contains("Add Club").click();

			cy.get('input[aria-label="Club description"]').type("Descripcion de prueba");
			cy.get('span').contains("Add Club").click();

			cy.get(".text-negative").should("text","name is required");
		});
	});
});
