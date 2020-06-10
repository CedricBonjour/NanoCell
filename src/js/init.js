"use strict";

document.onkeydown = function(e) {
  var k = e.key.toUpperCase();
  if (k==="BROWSERREFRESH" || e.ctrlKey && k==="ESCAPE") return chrome.runtime.reload();
}

var sheet;
var activeTab;


