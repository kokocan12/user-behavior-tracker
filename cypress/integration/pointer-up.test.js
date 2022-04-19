/// <reference types="cypress" />

context('pointer up 이벤트 테스트', () => {
  beforeEach(() => {
    cy.demoPage();
  });
  it('drag text', () => {
    cy.get('.list-item').then((items) => {
      cy.wrap(items[0]).click();

      cy.get('.contents-wrap').setSelection({
        anchorQuery: '.contents',
        anchorOffset: 0,
        focusQuery: '.contents',
        focusOffset: 2,
      });
      cy.contains('text-select 광주');
    });
  });
});
