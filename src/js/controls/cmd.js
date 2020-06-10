var cmd = {
    about       :{k:"H"    ,ctrl:true, run(){chrome.app.window.create('about.html', {id: "NanoCell-about"})}, description:"About"},
    solve       :{k:"ENTER",ctrl:true, run(){sheet.matrix.solver.run();sheet.refresh()}, description:"Compute"},
    new         :{k:"N"    ,ctrl:true, run(){new Tab()}, description:"New Tab"},
    nextTab     :{k:"TAB"  ,ctrl:true, run(){activeTab.next().select(false)}, description:"Next Tab"},
    closeTab    :{k:"W"    ,ctrl:true, run(){activeTab.close()}, description:"Close Tab"},
    deleteRow   :{k:"BACKSPACE",ctrl:true, run(){sheet.matrix.deleteRow(sheet.y);sheet.refresh()}, description:"Delete Row"},
    deleteCol   :{k:"BACKSPACE",ctrl:true,shift:true, run(){sheet.matrix.deleteCol(sheet.x);sheet.refresh()}, description:"Delete Col"},
    delete      :{k:"BACKSPACE",run(){sheet.rangeEdit('');sheet.refresh() }, description:"Delete Selection"},
    settings    :{k:"G"    ,ctrl:true, run(){Setting.show()}, description:"Display Settings"},
    shortcuts   :{k:"K"    ,ctrl:true, run(){new Shortcuts()}, description:"Display Shortcuts"},
    slctAll     :{k:"A"    ,ctrl:true, run(){sheet.slctAll()}, description:"Select All"},
    transpose   :{k:"T"    ,ctrl:true, run(){sheet.rangeTranspose();sheet.refresh()}, description:"Transpose Selection"},
    trim        :{k:"T"    ,ctrl:true, shift:true, run(){sheet.matrix.trimAll();sheet.refresh()}, description:"Trim : remove all empty rows/cols"},
    integer     :{k:"R"    ,ctrl:true, run(){sheet.round(true);sheet.refresh()}, description:"Round selection to integer"},
    decimal     :{k:","    ,ctrl:true, run(){sheet.round(false);sheet.refresh()}, description:"Round selection to decimal"},
    fixTop      :{k:"B"    ,ctrl:true, run(){sheet.fixTop = !sheet.fixTop;sheet.refresh()}, description:"Fix Header Top"},
    fixLeft     :{k:"B"    ,ctrl:true, shift:true, run(){sheet.fixLeft = !sheet.fixLeft;sheet.refresh()}, description:"Fix Header Left"},
    undo        :{k:"Z"    ,ctrl:true, run(){sheet.matrix.undo();sheet.refresh()}, description:"Undo"},
    redo        :{k:"Z"    ,ctrl:true, shift:true, run(){sheet.matrix.redo();sheet.refresh()}, description:"Redo"},
    quit        :{k:"Q"    ,ctrl:true, run(){dom.frame.close()}, description:"Exit Application"},
    date        :{k:"D"    ,ctrl:true, run(){new Calendar()}, description:"Pick a date"},
    find        :{k:"F"    ,ctrl:true, run(){sheet.finder.findMenu()}, description:"Quick find / match"},
    findAdvanced:{k:"F"    ,ctrl:true, shift:true,run(){sheet.finder.findMenu(true)}, description:"Advanced find / replace"},
    msg         :{k:"M"    ,ctrl:true, run(){stg.menu =  (!stg.menu) }, description:"Test message"},
    open        :{k:"O"    ,ctrl:true, run(){Csv.open(file=>{new Tab( new Sheet(file))})}, description:"Open one or more CSV files"},
    save        :{k:"S"    ,ctrl:true, run(){sheet.save()}, description:"Save"},
    saveAs      :{k:"S"    ,ctrl:true, shift:true, run(){sheet.saveAs()}, description:"Save As"},
    reloadFile  :{k:"R"    ,ctrl:true, shift:true, run(){sheet.reloadFile()}, description:"Round selection to integer"},
    arrowNext   :{k:"SPACE",ctrl:true, run(){Setting.arrowNext()}, description:"Next arrow functionality"},
    insert      :{k:"ARROW",ctrl:true, run(dir){sheet.insert(dir)}, description:"Insert row / col"},
    shift       :{k:"ARROW",ctrl:true, run(dir){sheet.shift(dir)}, description:"Shift row / col"},
    ratio       :{k:"ARROW",ctrl:true, run(dir){sheet.ratio(dir)}, description:"Compute ratio"},
    delta       :{k:"ARROW",ctrl:true, run(dir){sheet.delta(dir)}, description:"Compute difference"},
    increment   :{k:"ARROW",ctrl:true, run(dir){sheet.increment(dir)}, description:"Increment"},
    decrement   :{k:"ARROW",ctrl:true, run(dir){sheet.decrement(dir)}, description:"Decrement"},
}
document.addEventListener('copy', function (e) {
  if(sheet.inputing) return ;
  e.preventDefault();
  console.log("copy");
  var clip = sheet.rangeArray().map(r=>r.join('\t')).join('\n');
  e.clipboardData.setData('text/plain', clip);
});

document.addEventListener('paste', function (e) {
  if(sheet.inputing) return ;
  e.preventDefault();
  sheet.paste((e.clipboardData).getData('text').split('\n').map(r=>r.split('\t')));
  sheet.refresh();
});

function buildCommands(){
  for (var c of Object.values(cmd)){
      if(!c.ctrl)c.ctrl=false;
      if(!c.shift)c.shift=false;
      if(!c.alt)c.alt=false;
  } 
}


function buildMenu(){
  var menuItems = ["new","open","save","reloadFile","","undo","redo","fixLeft","fixTop","transpose","trim","date","integer","decimal","solve","find","","about","settings","shortcuts"];
  function buildMenuItem(item){ 
      if (item==="")return dom.menu.appendChild(document.createElement("hr"));   
      var img = document.createElement("img");
      img.src = "icn/menu/"+item+".svg";
      img.setAttribute("title",item);

      img.addEventListener("click",function(){cmd[item].run()})
      dom.menu.appendChild(img);   
  }
  for (var m of menuItems )buildMenuItem(m); 

}


dom.frameMinimize.addEventListener("click",function(){dom.frame.minimize()});
dom.frameToggleMax.addEventListener("click",function(){dom.frame.isMaximized()?dom.frame.restore():dom.frame.maximize()})
dom.frameQuit.addEventListener("click",function(){cmd.quit.run()});



buildMenu();

buildCommands();





