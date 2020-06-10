document.onkeydown = function(e) {
  var k = e.key.toUpperCase(); 
  var ctrlDown  =e.metaKey || e.ctrlKey; 
 
  if (ctrlDown && (k==="C" || k==="V"))return;
  if (ctrlDown  ||k==="ESCAPE")e.preventDefault();
  if (k==="BROWSERREFRESH" || ctrlDown && k==="ESCAPE") return chrome.runtime.reload();
  if (k==="TAB" && e.altKey)return;
  if (dom.dialog.isBusy && k==="ESCAPE")return dom.dialog.clear();
  if (dom.dialog.isBusy || sheet.inputing)return;
  
  var alt = e.altKey;
  if (e.code==="Space") k = "SPACE";
  if (k==="PAGEUP"    ){ k = "ARROWUP" ;alt= true}
  if (k==="PAGEDOWN"  ){ k = "ARROWDOWN";alt= true}

  if(alt){
    switch(k) {
      case "ARROWUP"    :sheet.y= 0; sheet.slctRefresh();return;
      case "ARROWRIGHT" :sheet.x= sheet.matrix.width -1; sheet.slctRefresh();return
      case "ARROWDOWN"  :sheet.y= sheet.matrix.height -1;sheet.slctRefresh(); return;
      case "ARROWLEFT"  :sheet.x= 0; sheet.slctRefresh();return;
    }
    
  }
  
  if (e.key.length===1 && !ctrlDown && !e.metaKey ){e.preventDefault();return sheet.input(e.key);}
  
  if(ctrlDown && k.includes("ARROW")){
    var action = (e.shiftKey)? stg.arrow.split('|')[1]:stg.arrow.split('|')[0];
    switch(k) {
      case "ARROWUP"    :cmd[action].run(0); break;
      case "ARROWRIGHT" :cmd[action].run(1); break
      case "ARROWDOWN"  :cmd[action].run(2); break;
      case "ARROWLEFT"  :cmd[action].run(3); break;
    }
    return e.preventDefault();
  }




  for (var c of Object.values(cmd)) 
  if(k===c.k && c.ctrl === ctrlDown && c.shift===e.shiftKey && c.alt=== e.altKey){c.run();return e.preventDefault()}

    

  switch(k) {
    case "ARROWUP"    :sheet.y--;sheet.slctRefresh(); return;
    case "ARROWDOWN"  :sheet.y++;sheet.slctRefresh(); return;
    case "ARROWLEFT"  :sheet.x--;sheet.slctRefresh(); return;
    case "ARROWRIGHT" :sheet.x++;sheet.slctRefresh(); return;
    case "TAB"        :sheet.x++;sheet.slctRefresh(); return;
    case "SHIFT"      :if(!ctrlDown)sheet.slctRange=true;return;
    case "ENTER"      :sheet.input();return;
    case "BACKSPACE"  :sheet.delete();return;
  }
}

document.onkeyup = function(e){
   var k = e.key.toUpperCase();
   switch(k) {
    case "CONTROL"    :Tab.bubbleUp(); if(e.shiftKey)sheet.slctRange=true;return;
    case "SHIFT"      :sheet.slctRange=false;return;
  }
}