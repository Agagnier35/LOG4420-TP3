"use strict";

var self = {};

/**
 * Modification de la valeur d'un input et déplace un événement 'change'.
 *
 * @param sel Le sélecteur CSS
 * @param value Nouvelle valeur du input
 */
self.setValue =  function(sel, value) {
  const e = document.querySelector(sel)
  e.value = value
  e.dispatchEvent(new Event('change'))
}

module.exports = self;
