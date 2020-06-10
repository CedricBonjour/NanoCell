var parser = {
 showProgress(txt, d=','){
     console.log("prog parse");
     var data = [];
     var lines = txt.split(/\r?\n/);
     var len = lines.length
     for (var i = 0 ; i < len; i++){
         if(i%1000===0)setProgress(i/len);
         data.push(this.line(lines[i]));
     }
     console.log(data);
     return data;
            
 },

 simple :function(t,d=','){return t.split(/\r?\n/).map(r=>r.split(d).map(e=>{e=e.trim();  return (e[0]==='"'&& e[e.length-1]==='"')?e.slice(1,-1):e}))},
 csv    :function(txt, d=','){return  txt.split(/\r?\n/).map(r=>this.line(r,d))},
 line   :function(s,d=','){
    var r = [];     //result;
    var q = '"';    //quote
    var f = false;  //force
    var len = s.length;
    var c,j;
    for (var i=0;i<len;i++){
        c =  s[i];
        if(c===d||c===' ')continue;
        if(c===q){f=true;i++}
        j=i;
        if(f)while(j<len && s[j]!==q || s[j]===q && s[j+1]===q){
             if(s[j]===q && s[j+1]===q)j++;
          //  if (j+2<len&&s[j+1]===q&&s[j+2]===q)j+=2;
            j++;
        }else{
            while(j<len && s[j]!==d)j++;
            while(j>i && s[j-1]===' ')j--;
        }
        r.push(s.substring(i,j).replace(/""/g,'"'));
        i=j;
        f=false;
    }return r;
}
}
