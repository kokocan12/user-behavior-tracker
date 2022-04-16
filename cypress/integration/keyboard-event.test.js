/// <reference types="cypress" />

context('키보드 이벤트 테스트', () => {
  beforeEach(() => {
    cy.demoPage();
  });

  it('리스트 페이지 내에서 input에 검색어 입력 후 엔터', () => {
    cy.get('.search-input').type('리사{enter}');
    cy.get('.log').contains('');
  });
});
