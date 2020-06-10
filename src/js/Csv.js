class Csv {
constructor(e, cb) {
  this.content = "";
  this.entry = e;
  this.file;
 
  this.name = "sheet_"+(dom.tabs.children.length+1)+".csv"; 
  if (e) this.reload(cb);
}

static open (cb){chrome.fileSystem.chooseEntry(this.openOptions,(entries)=>{if(!chrome.runtime.lastError) for(var e of entries)new Csv(e,cb) })}
  
reload(callback){
    this.entry.file(file => {
        this.file = file;  
        this.name = file.name;
        if(this.onNameChange) this.onNameChange(this.name);
        var reader = new FileReader();
        reader.onloadend =readResult=>{
            this.content = readResult.target.result;  
            callback(this);
        };
        reader.readAsText(file, stg.encoding);
    });
}


saveAs  (txt, successCb){this.content = txt;   chrome.fileSystem.chooseEntry({type: 'saveFile',suggestedName: this.name},e=>{if(!chrome.runtime.lastError)this.write(e, successCb)})}
save    (txt, successCb){this.content = txt;   if(this.entry)this.write(this.entry, successCb);else this.saveAs(txt, successCb)}





write(entry , successCb){
    this.entry = entry;
    this.entry.createWriter((fileWriter)=>{
      fileWriter.onerror = (e)=>{Msg.confirm("File could not be saved");throw e};
      var blob = new Blob([this.content]);
      fileWriter.onwriteend =()=>{
        fileWriter.onwriteend =()=>{
          this.name=entry.name; if(this.onNameChange) this.onNameChange(this.name);
          if (successCb) successCb();
        };
        fileWriter.write(blob);
      };
      fileWriter.truncate(blob.size, stg.encoding);
    });
}

static from2D(matrix){
  var txt = "";
  var newMat = [];
  for (var row of matrix){
    var newRow = [];
    for (var cell of row){
      var data = cell;
      var quote = false;
      for (var i = 0 ; i < data.length;i++){
        if (data[i]===stg.delimiter) quote = true;
        if (data[i]==='"'){quote=true;data=data.slice(0, i)+'"'+data.slice(i);i++}
      }
      if (quote) data = '"' +data +'"';
      newRow.push(data);
    }
    newMat.push(newRow.join(stg.delimiter));
  }
  return newMat.join('\n');
}


static parse(txt, d = stg.delimiter){
  return  txt.split(/\r?\n/).map(s=>{
    var r = [];     //result;
    var q = '"';    //quote
    var f = false;  //force
    var len = s.length;
    var c,j;
    for (var i=0;i<len;i++){
        c =  s[i];
        if(c===' ')continue;
        if(c===d){r.push("");continue}
        if(c===q){f=true;i++}
        j=i;
        if(f)while(j<len && s[j]!==q || s[j]===q && s[j+1]===q){
            if(s[j]===q && s[j+1]===q)j++;
            j++;
        }else{
            while(j<len && s[j]!==d)j++;
            while(j>i && s[j-1]===' ')j--;
        }
        r.push(s.substring(i,j).replace(/""/g,'"'));
        if (f) j++;
        i=j;
        f=false;
    }return r;
})
  
}

}







Object.defineProperty(Csv, 'openOptions', {
value: {
  type: "openWritableFile",
  acceptsAllTypes: false,
  acceptsMultiple: true,
  accepts:[
    {description:"Select one or more files of type '.csv' or '.tsv' "},
    {mimeTypes:["text/csv", "text/tsv"]},
    {extensions:["csv","tsv"]}
  ]
}
});


