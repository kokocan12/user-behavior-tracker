// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('demoPage', { prevSubject: 'optional' }, () => {
  return cy.visit('https://bucolic-pie-ca1277.netlify.app/');
});

Cypress.Commands.add('selection', { prevSubject: true }, (subject, fn) => {
  cy.wrap(subject).trigger('pointerdown').then(fn).trigger('pointerup');

  return cy.wrap(subject);
});

Cypress.Commands.add('setSelection', { prevSubject: true }, (subject, query) => {
  return cy.wrap(subject).selection(($el) => {
    const el = $el[0];
    const anchorNode = getTextNode(el.querySelector(query.anchorQuery));
    const anchorOffset = query.anchorOffset || 0;
    const focusNode = getTextNode(el.querySelector(query.focusQuery));
    const focusOffset = query.focusOffset || 0;
    setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
  });
});

function getTextNode(el) {
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);

  return walk.nextNode();
}

function setBaseAndExtent(...args) {
  const document = args[0].ownerDocument;
  document.getSelection().removeAllRanges();
  document.getSelection().setBaseAndExtent(...args);
}
