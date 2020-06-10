var dom = { 



frame:                      chrome.app.window.current(),
frameControls:              document.getElementById("frameControls"),


frameMinimize:              document.getElementById("frameMinimize"),
frameToggleMax:             document.getElementById("frameToggleMax"),
frameQuit:                  document.getElementById("frameQuit"),

palette:                    document.getElementById("palette"),
theme:                      document.getElementById("theme"),

appIcon:                    document.getElementById("appIcon"),

header:                     document.getElementById("header"),
body:                       document.getElementById("body"),
content:                    document.getElementById("content"),
tabs:                       document.getElementById("tabs"),
dragSpace:                  document.getElementById("dragSpace"),
menu:                       document.getElementById("menu"),
dialog:                     document.getElementById("dialog"),
footer:{
  left:                     document.getElementById("footerLeft"),
  center:                   document.getElementById("footerCenter"),
  right:                    document.getElementById("footerRight"),
  img:{
    left:                   document.getElementById("botLeftImg"),
    right:                  document.getElementById("botRightImg"),
  }
},
}

 var mac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

if (mac) {
  dom.header.insertBefore(dom.appIcon,dom.frameControls);
  dom.frameControls.insertBefore(dom.frameControls.children[2],dom.frameControls.children[0]);
  dom.header.insertBefore(dom.frameControls,dom.header.children[0]);
}

dom.dialog.clear = function (e){ while(this.children.length > 0) this.children[0].remove(); }
dom.dialog.push = function (e){ this.clear();dom.dialog.appendChild(e)}
Object.defineProperty(dom.dialog, 'isBusy',{get: function(){return dom.dialog.children.length>0}});

