/// <reference types="cypress" />

context('키보드 이벤트 테스트', () => {
  beforeEach(() => {
    cy.demoPage();
  });

  it('리스트 페이지 내에서 input에 검색어 입력', () => {
    cy.get('.search-input').type('리사');
    cy.get('.log').contains('keyboard 리사');
  });

  it('리스트 페이지 내에서 input에 여러번 검색어 입력', () => {
    cy.get('.search-input').type('리사{enter}');
    cy.wait(500);
    cy.get('.search-input').type('{backspace}{backspace}라치카{enter}');
    cy.wait(500);

    cy.get('.log').then((logs) => {
      cy.wrap(logs[0]).contains('keyboard 리사');
      cy.wrap(logs[1]).contains('keyboard 라치카');
    });
  });

  it('리스트 페이지 내에서 input에 검색어 입력 후 엔터', () => {
    cy.get('.search-input').type('리사{enter}');
    cy.get('.log').contains('keyboard 리사');
  });

  it('input 포커스 하지 않고 키보드 입력', () => {
    cy.get('body').type('리사{enter}');
    cy.wait(500);
    cy.get('.log').should('have.length', 0);
  });
});
