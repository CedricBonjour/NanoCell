class Sheet extends HTMLTableElement {
constructor(f=new Csv()) {
  super();
  this.csvFile    = f;
  this.finder     = new Finder(this);
  this.matrix     = new Matrix(Csv.parse(f.content));
  this.inputField = document.createElement("input");
  this.inputing   = false;
  this.escape     = false;
  this.fixTop     = false;
  this.fixLeft    = false;
  this.slctRange  = false;
  this.rangeInit  = undefined;
  this.xx=0;
  this.yy=0;
  this.bx=0;
  this.by=0;
  this.addEventListener("mousewheel", this.scroll, {passive: true});
  this.addEventListener("mousedown", this.click);
  this.addEventListener("dblclick", this.dblclick);
  this.inputField.addEventListener("focusout",e=>{this.inputBlur()});
  this.inputField.addEventListener("keydown",e=>{
    switch(e.key.toUpperCase()) {
        case "ENTER"          :e.stopPropagation();this.inputField.blur(); this.y++;this.slctRefresh();this.refresh();break;
        case "TAB"            :this.inputField.blur() ;break;
        case "ESCAPE"         :this.escape=true;sheet.inputField.blur();break;
    }
  });
  this.colResize = undefined;
  this.reload();
  this.x =0;
  this.classList.add('sheet');

}

save(){
  this.csvFile.save(Csv.from2D(this.matrix.data),()=>{this.matrix.isSaved = true;} );
  
}

saveAs(){
  this.csvFile.saveAs(Csv.from2D(this.matrix.data, ()=>{this.matrix.isSaved = true;}))
}


get x     (){return this.xx}
get y     (){return this.yy}
get width (){return this.rows[0]? this.rows[0].cells.length-1:0}
get height(){return this.rows.length -1}
get slct  (){return this.rows[this.y - this.baseY+1].cells[this.x - this.baseX+1]}
get baseX (){return this.bx}
get baseY (){return this.by}
set baseX(n){
  if (n<0) n=0;
  if (n>=this.matrix.width)n=this.matrix.width-1;
  var delta=n-this.bx;
  this.bx=n; 
  switch(delta){
    case  0: break;
    case  1: this.scrollRight();break;
    case -1: this.scrollLeft();break;
    default : this.refresh();
    }
};

set baseY(n){ 
  if (n<0) n=0;
  if (n>=this.matrix.height)n=this.matrix.height-1;
  var delta=n-this.by;
  this.by= n; 
  switch(delta){
    case  0: break;
    case  1: this.scrollDown();break;
    case -1: this.scrollUp();break;
    default : this.refresh();
    }
};


set x(n){ 
  if (!this.slctRange)this.rangeInit = undefined;
  if (n>=this.matrix.width+this.width-1) n =this.matrix.width+this.width-2;
  if (this.slctRange && !this.rangeInit)this.rangeInit = {x:this.x,y:this.y};
  this.xx=n<0?0:n;
}
set y(n){
  if (!this.slctRange)this.rangeInit = undefined; 
  if (n>=this.matrix.height+this.height-1) n =this.matrix.height+this.height-2;
  if (this.slctRange && !this.rangeInit)this.rangeInit = {x:this.x,y:this.y};
  this.yy=n<0?0:n;
}

slctAll(){
  this.x=0;this.y=0;this.rangeInit={x:this.matrix.width-1,y:this.matrix.height-1};this.slctRefresh(false)
}


scrollLeft(){
 for(var y = 0 ; y < this.rows.length; y ++){
    var r = this.rows[y];
    var c = r.cells[r.cells.length-1];
    if (y>0)this.loadCell(c, this.baseX, this.baseY+y-1);
    r.insertBefore(c, r.cells[1]);
  }

 this.rows[0].cells[1].innerHTML = this.baseX+1;
 
}
scrollRight(){
 this.rows[0].cells[1].innerHTML = this.baseX+this.width;
 for(var y = 0 ; y < this.rows.length; y ++){
    var r = this.rows[y];
    var c = r.cells[1];
    if (y>0) this.loadCell(c, this.baseX+this.width-1, this.baseY+y-1);
    r.appendChild(c);
  }
}


scrollUp(){
 var r = this.rows[this.rows.length-1];
  for (var x = 1 ; x < r.cells.length ; x++ ){
    this.loadCell(r.cells[x], this.baseX+x-1, this.baseY);
  }
  r.cells[0].innerHTML =this.baseY+1;
  this.insertBefore(r, this.rows[1]);

}

scrollDown(){
  var r = this.rows[1];
  for (var x = 1 ; x < r.cells.length ; x++ ){
    this.loadCell(r.cells[x], this.baseX+x-1, this.baseY+this.height-1);
  }
  r.cells[0].innerHTML =this.baseY+this.height;
  this.appendChild(r);
  
}

shift(direction){
  switch(direction){
    case 0:this.matrix.shiftRow(this.y-1);this.y--;break;
    case 1:this.matrix.shiftCol(this.x) ;this.x++ ;break;
    case 2:this.matrix.shiftRow(this.y);this.y++ ;break;
    case 3:this.matrix.shiftCol(this.x-1) ;this.x--; break;
  }
  this.refresh();
  this.slctRefresh();
}


insert(direction){
  switch(direction){
    case 0:this.matrix.insertRow(this.y) ;this.y++;break;
    case 1:this.matrix.insertCol(this.x+1) ;break;
    case 2:this.matrix.insertRow(this.y+1) ;break;
    case 3:this.matrix.insertCol(this.x) ; this.x++ ;break;
  }
  this.refresh();
  this.slctRefresh();
}
delta(direction){this.deltaRatio(direction,true )}
ratio(direction){this.deltaRatio(direction,false)}
deltaRatio(direction, delta){
  var m;
  switch(direction){
    case 0: m=this.matrix.get(this.x, this.y+1);break;
    case 1: m=this.matrix.get(this.x-1, this.y);break;
    case 2: m=this.matrix.get(this.x, this.y-1);break;
    case 3: m=this.matrix.get(this.x+1, this.y);break;
  }
  var n = this.matrix.get(this.x, this.y);
  if (!isNaN(n) && !isNaN(m))n= delta? Number(n)*2 - Number(m):Number(n)*Number(n)/Number(m) ;
  switch(direction){
    case 0: this.y--;break;
    case 1: this.x++;break;
    case 2: this.y++;break;
    case 3: this.x--;break;
  }
  this.matrix.edit(this.x, this.y, n);
  this.slctRefresh();
  this.refresh();
}


increment(direction){this.incdec(direction,true )}
decrement(direction){this.incdec(direction,false)}
incdec(direction, inc){
  var n = this.matrix.get(this.x, this.y);
  if (!isNaN(n))n= inc? Number(n)+1:Number(n)-1;
  switch(direction){
    case 0: this.y--;break;
    case 1: this.x++;break;
    case 2: this.y++;break;
    case 3: this.x--;break;
  }
  this.matrix.edit(this.x, this.y, n);
  this.slctRefresh();
  this.refresh();
}




input(txt){
  if (!this.slct)return;
  this.inputing = true;
  this.inputField.value = txt ? txt : this.matrix.get(this.x,this.y);
  this.slct.appendChild(this.inputField);
  this.inputField.focus();
}

inputBlur(){
  var e = this.inputField.value;
  if(!this.escape){
    this.rangeEdit(e);
    if(!this.rangeInit) this.loadCell(this.inputField.parentNode, this.x, this.y);
    else this.refresh();
  }
  this.inputField.remove();
  this.inputing = false;
  this.escape = false;
}

dblclick(e){
  var t = e.target;
  if (t.tagName==="TD")this.input();
 
}


click(e){
  var t = e.target;
  if (t.tagName=="TD"){
    var x = t.cellIndex+this.baseX -1;
    var y = t.parentNode.rowIndex+this.baseY - 1; 
    if(this.inputing && e.ctrlKey){
      e.preventDefault();
      this.inputField.value+= this.matrix.get(x,y).split('=')[0];
      this.inputField.selectionStart = this.inputField.value.length;
      return 
    }


    this.x = x;
    this.y = y;
    this.slctRefresh();
  }
  if(t.tagName==="TH" && t.cellIndex >0) this.slctCol(this.baseX+t.cellIndex -1);
  if(t.tagName==="TH" && t.parentNode.rowIndex >0) this.slctRow(this.baseY+t.parentNode.rowIndex -1);
}


footerUpdate(){
  var f = dom.footer;
  if(this.rangeInit) f.left.innerHTML = (this.rangeInit.x+1)+":"+(this.rangeInit.y+1)+" to "+(this.x+1)+":"+(this.y+1)+"";
  else  f.left.innerHTML =(this.x+1)+":"+(this.y+1);
  f.right.innerHTML =this.matrix.width+":"+this.matrix.height;
  f.center.innerHTML = this.matrix.get(this.x, this.y).replace('&','&amp;').replace('<' , '&lt;');
}

slctCol(n){
  this.slctRange =true;
  this.rangeInit = {x:n, y:0}
  this.x = n;
  this.y = this.matrix.height-1;
  this.slctRange =false;
  this.slctRefresh(); 
}

slctRow(n){
  this.slctRange =true;
  this.rangeInit = {x:0, y:n}
  this.x = this.matrix.width-1;
  this.y =n;
  this.slctRange =false;
  this.slctRefresh(); 
}

rangeArray(){
  if(!this.rangeInit)return [[this.matrix.get(this.x,this.y)]];
  var xStart = Math.min(this.x, this.rangeInit.x);
  var yStart = Math.min(this.y, this.rangeInit.y);
  var xEnd   = Math.max(this.x ,this.rangeInit.x);
  var yEnd   = Math.max(this.y, this.rangeInit.y);
  var mat = [];
  for(var y = yStart; y <= yEnd; y++) {
    var row = []; 
    for(var x = xStart;x<=xEnd;x++)row.push(this.matrix.get(x,y)); 
    mat.push(row);
  }
  return mat;
}
rangeEdit(value){
  if(!this.rangeInit)return this.matrix.edit(this.x,this.y,value);
  var xStart = Math.min(this.x, this.rangeInit.x);
  var yStart = Math.min(this.y, this.rangeInit.y);
  var xEnd   = Math.max(this.x ,this.rangeInit.x);
  var yEnd   = Math.max(this.y, this.rangeInit.y);
  for(var x = xStart; x <= xEnd ; x++ ) for(var y = yStart; y <= yEnd; y++) this.matrix.edit(x,y,value);

} 



rangeApply(cb){
  if(!this.rangeInit)return cb(this.x,this.y);
  var xStart = Math.min(this.x, this.rangeInit.x);
  var yStart = Math.min(this.y, this.rangeInit.y);
  var xEnd   = Math.max(this.x ,this.rangeInit.x);
  var yEnd   = Math.max(this.y, this.rangeInit.y);
  for(var x = xStart; x <= xEnd ; x++ ) for(var y = yStart; y <= yEnd; y++) cb(x,y);

} 

rangeTranspose(){
  if (!this.rangeInit)return;
  var r = this.rangeArray();
  var t = [];
  for (var x = 0 ; x < r[0].length;x++ ){
    var row = [];
    for(var y =0; y<r.length;y++){
      row.push(r[y][x]);
    }
    t.push(row);
  }
  this.rangeEdit('');
  this.paste(t);
}
 

rangeRender(){
  var xStart = Math.min(this.x, this.rangeInit.x) - this.baseX;
  var yStart = Math.min(this.y, this.rangeInit.y) - this.baseY;
  var xEnd   = Math.max(this.x ,this.rangeInit.x) - this.baseX;
  var yEnd   = Math.max(this.y, this.rangeInit.y) - this.baseY;
  if(xStart<0) xStart=0;
  if(yStart<0) yStart=0;
  if (xEnd>=this.width) xEnd = this.width-1;
  if (yEnd>=this.height) yEnd = this.height-1;
  for(var x = xStart; x <= xEnd ; x++ )
    for(var y = yStart; y <= yEnd; y++)
      this.rows[y+1].cells[x+1].classList.add("slct");
}



round(integer=true){
  this.rangeApply((x,y)=>{
    var n = this.matrix.get(x,y);
    if (!isNaN(n) && n!==''){
      n= Number(n);
      if(!integer) n*=100;
      n= Math.round(n+Number.EPSILON);
      if(!integer){
        n/=100;
        n+=0.001;
        n= Math.round(n*1000)/1000;
        n=String(n).slice(0,-1);
      }
    }
    this.matrix.edit(x,y,n);
  })  
}


paste(mat){
  var minX = this.x;
  var minY = this.y;
  if(this.rangeInit){ minX= Math.min(minX, this.rangeInit.x); minY = Math.min(minY, this.rangeInit.y)}
  for(var y = 0 ; y < mat.length; y++ )for(var x = 0 ; x < mat[y].length; x++)this.matrix.edit(minX+x, minY+y, mat[y][x]);
}




slctRefresh(focus = true){
  this.slctClear();
  if(focus)this.slctFocus();
  if (this.rangeInit)return this.rangeRender();
  this.footerUpdate();
  var y = this.y-this.baseY;
  var x = this.x-this.baseX;
  if (x<0||y<0||x>=this.width||y>=this.height)return;
  this.rows[y+1].cells[x+1].classList.add("slct");
}

slctFocus(){
       if (this.x < this.baseX) this.baseX = this.x;
  else if (this.y < this.baseY) this.baseY = this.y;
  else if (this.x >=this.baseX+this.width) this.baseX=this.x-this.width+1;
  else if (this.y >=this.baseY+this.height) this.baseY=this.y-this.height+1;
  else return;
}


slctClear(){var td;while(  td = this.getElementsByClassName('slct')[0]) td.classList.remove('slct');}

scroll(e){
    var coef = 16;
    this.baseX+= (e.deltaX>0)? Math.floor(e.deltaX/coef):Math.ceil(e.deltaX/coef);
    this.baseY+= (e.deltaY>0)? Math.floor(e.deltaY/coef):Math.ceil(e.deltaY/coef);
    this.slctRefresh(false);

}

loadCell(c, x, y){
    c.innerHTML = "";
    var d = this.matrix.get(x,y);
    if (d.length<1)return;
    d=d.replace('&','&amp;').replace('<','&lt;').split("=");
    for (var txt of d){
      var div = document.createElement("div");
      if(txt.length>3  && txt[0]==='>' &&  txt[1]==='>') div.classList.add("formula");
      if(txt.length>0  && txt[0]==='!') div.classList.add("error");
      if (txt!=='' && !isNaN(txt) || txt[txt.length-1]==='%') div.classList.add("num");
      div.innerHTML=txt;
      c.appendChild(div);
    }    
}

loadTopHeader(x){
   if (this.fixTop){
      var d = this.matrix.get(this.baseX+x,0);
      if(d.length>0){  
      this.rows[0].cells[x+1].innerHTML =  "<div>"+this.matrix.get(this.baseX+x,0)+"</div>";
        return ;
      }
   }
   this.rows[0].cells[x+1].innerHTML = this.baseX+x+1; 
}


loadLeftHeader(y){
   if (this.fixLeft){
      var d = this.matrix.get(0,this.baseY+y);
      if(d.length>0){  
      this.rows[y+1].cells[0].innerHTML =  "<div>"+this.matrix.get(0,this.baseY+y)+"</div>";
        return ;
      }
   }
   this.rows[y+1].cells[0].innerHTML = this.baseY+y+1; 
}


refresh(){window.requestAnimationFrame(()=>{
  for(var x=0;x<this.width;x++) this.loadTopHeader(x);
//   var time = new Timer();
  for(var y=0;y<this.height;y++) {
      var by=this.baseY+y;
      this.loadLeftHeader(y);
//       if( this.fixTop)this.rows[y+1].cells[0].innerHTML += "<div>"+this.matrix.get(0,this.baseY+y)+"</div>"
 
      for(var x=0;x<this.width;x++)this.loadCell(this.rows[y+1].cells[x+1],this.baseX+x,by) ;
  }
  if (this.inputing) this.slct.appendChild(this.inputField);
  this.footerUpdate();
//   time.log();
})}

reloadFile(){
   if(this.csvFile.file === undefined)return Msg.quick("No file to reload");
  Msg.choice("File will reload to last saved state.<br>Changes made since last save will be lost!",()=>{
  this.csvFile.reload(f=>{this.matrix=new Matrix(Csv.parse(f.content)) ;this.reload()})
  })
}

reload(){
    while(this.rows[0]) this.rows[0].remove();
    for(var y=0; y< stg.rows+1; y++){
        var tr = document.createElement("tr");
        this.appendChild(tr);
        for(var x=0; x< stg.cols+1; x++)tr.appendChild(document.createElement((y===0||x===0)?"th":"td"));
    }
    for(var y=0; y< this.height; y++){
        for(var x=0; x<this.width; x++){
          this.rows[y+1].cells[x+1].onpointerenter = e=> { 
            var t = e.target;
            if(e.buttons===1){
              this.rangeInit = {x:t.cellIndex-1 +this.baseX,y:t.parentNode.rowIndex -1+this.baseY};
//               console.log(this.rangeInit);
              this.slctRefresh();
            }
          };
        }
    }
    for (var i =0 ; i < this.width; i++){
        this.rows[0].cells[i+1].onmousedown= e=>{var startWidth  = e.target.offsetWidth;document.onmousemove=(d)=>{requestAnimationFrame(()=>e.target.style.width=Math.abs(startWidth+d.pageX-e.pageX)+"px") };}
        this.rows[0].cells[i+1].ondblclick=e=>{e.target.style.width=(e.target.style.width!=="auto")?"auto":"100vw"};
    }
    this.rows[0].cells[0].ondblclick=e=>{for (var i =0 ; i < this.width; i++)this.rows[0].cells[i+1].style.width="auto";console.log("x "+this);this.slctAll();}
    this.refresh();
}
}


customElements.define('ui-sheet', Sheet, { extends: 'table' });




 