/// <reference types="cypress" />

context('Test keyboard event', () => {
  beforeEach(() => {
    cy.demoPage();
  });

  it('리스트 페이지 내에서 input에 검색어 입력 후 엔터', () => {
    cy.get('.search-input').type('리사{enter}');
    cy.get('.log').contains('관심 텍스트 리사');
  });
});