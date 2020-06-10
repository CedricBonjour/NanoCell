var stg = {};


class Setting {
constructor(s){
    this.key = s.key;
    this.value = s.dflt;
    this.cb = s.cb;
     
    Object.defineProperty(stg, this.key, {
        get:( )=>{return this.value},
        set:(e)=>{this.value=e;if(this.cb)this.cb(this.value);var o={};o[this.key]=e; chrome.storage.sync.set(o)}
    });    
}



static init(cb){
    for(var s of Setting.list) if(!s.title) new Setting(s);
    chrome.storage.sync.get(null, r=>{
         for (var k of Object.keys(r))if(stg[k]!==undefined) stg[k]=r[k];
         if(cb)cb();
    })
}


static build(setting){
    var row = document.createElement("tr");
    var name = document.createElement("td");
    if(setting.title) {
        var title = document.createElement("h3");
        title.innerHTML = setting.title;
        name.appendChild(title);
        row.appendChild(name);
        return row;
    }


    var inputCell = document.createElement("td");
    name.innerHTML= setting.name;
    var input = document.createElement("input");
    if (setting.list) input = new ListInput(setting.list, setting.hide);
    else if (setting.max){
        input = new NumInput(setting.dflt, setting.min, setting.max);
    }else if (typeof setting.dflt === "boolean"){
        input = new BoolInput();
    }


    input.value = stg[setting.key];
    input.onchange=e=>{var c=e.target.value;stg[setting.key]=isNaN(c)?c:Number(c)}
//     input.addEventListener('select', function(){this.selectionStart = this.selectionEnd}, false);
    inputCell.appendChild(input);

    row.appendChild(name);
    row.appendChild(inputCell);
    return row;
}


static show(){
    var content = document.createElement("div");
    content.classList.add("stg");
    var table = document.createElement("table");
    for(var s of Setting.list) table.appendChild(Setting.build(s));
    var b = document.createElement("button");
    b.innerHTML = "Reset to default settings";
    b.onclick = Setting.resetDefault;
    content.appendChild(table);
    content.appendChild(b);
    dom.dialog.push(content);     
}


static setTheme(){
    dom.theme.href = "css/themes/"+stg.theme+".css";
    dom.palette.href = "css/palettes/"+stg.theme+".css";
}


static setMenu(){dom.menu.style.display=stg.menu?'flex':'none'}

static arrowNext(){stg.arrow = Setting.arrowList[(Setting.arrowList.indexOf(stg.arrow)+1)%Setting.arrowList.length]}

static updateArrow(){
    var side = stg.arrow.split('|');
    dom.footer.img.left.src ="icn/"+side[0]+".svg";
    dom.footer.img.right.src="icn/"+side[1]+".svg"
}




static resetDefault(){
    for(var s of Setting.list) if (s.key) stg[s.key] = s.dflt;
    cmd.settings.run();
}

}

Object.defineProperty(Setting, 'arrowList', {value: ["insert|shift", "increment|decrement" , "delta|ratio"]});
Object.defineProperty(Setting, 'list', {value: [
{title:"Appearance"},
    {key:"font"         ,dflt:16            ,name:"Font-size",   min:7, max:24 ,cb:n=>{dom.body.style.fontSize = n+"px"; }   },
    {key:"rows"         ,dflt:25            ,name:"Rows",        min:5, max:60 ,cb:n=>{if (sheet)sheet.reload()}   },
    {key:"cols"         ,dflt:10            ,name:"Cols",        min:3, max:30 ,cb:n=>{if (sheet)sheet.reload()} },
    {key:"theme"        ,dflt:"light"       ,name:"Theme", list:[ "light" , "dark"],hide:true, cb:Setting.setTheme},
    {key:"menu"         ,dflt:true          ,name:"Menu",    cb:Setting.setMenu},    

{title:"Controle"},      
    {key:"autoRound"    ,dflt:false         ,name:"Auto-round 2nd decimal"},    
    {key:"dateFormat"   ,dflt:"yyyy/mm/dd"  ,name:"Date"    },
    {key:"arrow"        ,dflt:"insert|shift",name:"Arrow Function (Ctrl|Shift)", list:Setting.arrowList,hide:true, cb:Setting.updateArrow},
{title:"Csv Read & Write"},
    {key:"encoding"     ,dflt:"utf-8"       ,name:"Encoding"},
    {key:"delimiter"    ,dflt:","           ,name:"Delimiter", list:[",", ";" , ":"],hide:true},
//     {key:"strict"       ,dflt:false         ,name:"Save-Strict (error on comma or quote)"},
    
    
]});
 
