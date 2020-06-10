chrome.app.runtime.onLaunched.addListener(function(launchData) {
  var windowProperties = {
      id: "NanoCell",
      frame: "none",
      minWidth: 300,
      minHeight: 200,
  }
  chrome.app.window.create('main.html',windowProperties,function(win){
   win.contentWindow.initialLaunchData = launchData.items;
  });
});


/*

TODO long term
graph 2 cols  or 2 rows display save as png



TODO Very BIG
Check for updates
sort col
Help
website
replace , replace all


TODO BIG
Context Menu
  insert row/col left/top ...
  del row
  del col


TODO SMALL
toggle commas to dots
opening multiple times a file should refocus that file 
saved file icon + close tab

  

TODO BUG
Range restart does not behave properly, add a 2nd var to track ranging property
Paste csv should format CSV

Test on all os
test memory (ram)



*/

