context('click 테스트', () => {
  beforeEach(() => {
    cy.demoPage();
  });

  it('기사 클릭하여 이동 시 navigate 추가', () => {
    cy.get('.list-item').then((items) => {
      cy.wrap(items[1]).click();
      cy.wait(100);

      cy.get('.log').then((logs) => {
        cy.wrap(logs[0]).contains('page-navigate /1');
      });
    });
  });

  it('뒤로 가기 시 navigate 추가', () => {
    cy.get('.list-item').then((items) => {
      cy.wrap(items[1]).click();
      cy.wait(100);

      cy.window().then((win) => {
        win.history.go(-1);
        cy.wait(100);

        cy.get('.log').then((logs) => {
          cy.wrap(logs[1]).contains('page-navigate /');
        });
      });
    });
  });

  it('앞으로 가기 시 navigate 추가', () => {
    cy.get('.list-item').then((items) => {
      cy.wrap(items[1]).click();
      cy.wait(100);

      cy.window().then((win) => {
        win.history.go(-1);

        cy.wait(100).then(() => {
          win.history.go(1);
          cy.wait(100);
          cy.get('.log')
            .should('have.length', 3)
            .then((logs) => {
              cy.wrap(logs[2]).contains('page-navigate /1');
            });
        });
      });
    });
  });
});
