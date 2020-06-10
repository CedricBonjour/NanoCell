class Solver  {
constructor(matrix) {
    this.matrix = matrix;
}

getFormula(x,y){var c=this.matrix.get(x,y);return(c.length>1&&c[0]==='>'&&c[1]==='>')?c.slice(2):undefined}
setRowFormulas(){
  this.formulas = [];
  for(var y=0;y<this.matrix.data.length;y++){
    var f = undefined;
    for(var x=this.matrix.data[y].length-1;x>0;x--){
      if(f) this.formulas.push({x:x,y:y,f:f});
      else f = this.getFormula(x,y);
    }
  }
//   console.log(this.formulas);
}

setRowHeaders(){
   var e_header    = /^[a-z]([a-z]|[0-9]|_)*( ([a-z]|[0-9]|_)+)*/i;
   this.rh =[];
   for(var y = 0 ; y < this.matrix.data.length;y++){
     var m = this.matrix.get(0,y).trim().match(e_header);
     if (m!==null) this.rh.push({t:m[0], y:y});
   }

}



replace(f,name,x,y, hash = false){
   for (var c of this.variables) if (name===c.t) return f.replace((hash)?'#'+name:name, c.n);
   for (var c of this.rh) if (name == c.t) { return f.replace((hash)?'#'+name:name, this.matrix.get(x,c.y));}
   throw "No header or variable ["+name+"] in ["+ f+"] at "+x+":"+y;
}

matchNames(f,x,y){
    var  e_title     =  /[a-z]([a-z]|[0-9]|_)*( ([a-z]|[0-9]|_)+)*/ig;
    var names = [...f.matchAll(e_title)];
    for (var n of names) f = this.replace(f, n[0],x,y);
    return f;
} 

matchPre(f,x,y){
    var e_pre       = /pre\([^\)]*\)/ig
    var names = [...f.matchAll(e_pre)];
    for (var n of names){
        var side = n[0].slice(4).slice(0, -1).split(':');
        if(side.length<2){
          if (x>1)f = f.replace(n[0],this.matrix.get(x-1,y));
          else {f = f.replace(n[0],side[0]);}
        }else{
          if (x>1){f = f.replace(n[0],'#'+side[0].trim());f=this.replace(f,side[0].trim(),x-1,y,true) }
          else{f = f.replace(n[0],side[1])}

        }
    }
    return f;
       
      
}


compute(f,x,y){

  try{
    var n = f.replace('²', "^2 ").replace('³', "^3 ");
    n = this.matchPre(n,x,y);
    n = this.matchNames(n,x,y);
    n = nerdamer(n).evaluate().text();
    if (isNaN(n)) throw n;
    return n;

  }catch(err){
//     console.error(err);
    return "!"+f
  }
}

solveCell(x,y){
    for (var f of this.formulas) if(f.x===x && f.y===y){this.matrix.edit(x,y, this.compute(f.f,x,y));return}
    var c = this.matrix.get(x,y);
    if (c.length<1)return;
    if (c[0]==='=') {this.matrix.edit(x,y, this.compute(c.slice(1),x,y));return}
    var e = c.split('=');
    if (e.length>1){
      e[2] = this.compute(e[1],x,y);
      this.variables.push({t:e[0].trim(), n:e[2]}) 
      this.matrix.edit(x,y, e.join("="))
    }
    

}


run(){
  if (this.matrix.data.length >1000) return Msg.confirm("File too large for solver to work!")
  this.variables=[];
  this.setRowFormulas();
  this.setRowHeaders();
  for(var y=0;y<this.matrix.data.length;y++){
    for(var x=0 ; x<this.matrix.data[y].length;x++){
      this.solveCell(x,y);
    }
  }
}


}    



const e_unit      =    /\([^\)]*\)/g
const e_sum       = /sum\([^\)]*\)/ig
const e_extension =    /\.[^\.]*$/