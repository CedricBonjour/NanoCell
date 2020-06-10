class Tab extends HTMLElement {
constructor(s=new Sheet()) {
  super();
  for (var t of dom.tabs.children) if(t.innerHTML===s.name) return t.select();
  this.content  = s;
  this.button = document.createElement("span");
  this.button.innerHTML = "&times;";
  this.button.addEventListener("click", e=>{ this.close();e.stopPropagation() })
  s.csvFile.onNameChange=name=>{this.innerHTML=name}
  this.innerHTML =s.csvFile.name;
  this.addEventListener("click",(e)=>{this.select()});
  this.appendChild(this.button);
  dom.tabs.appendChild(this);
  this.select();
}
static checkSingle    (){
  var single = dom.tabs.children.length<=1;
  dom.tabs.style.textAlign = single?"center":"left";
}


blur(){this.classList.remove("activeTab")}
confirmedClose(){
    
    if(activeTab===this) {
      if (this.nextSibling) this.nextSibling.select();
      else if (this.previousSibling) this.previousSibling.select();
      else cmd.quit.run();
    }
    this.remove();
    Tab.checkSingle();
}

close(){

  console.log(this.content.matrix);

  if(this.content.matrix.isSaved) this.confirmedClose();
  else Msg.choice ("Close without saving?", ()=>{this.confirmedClose()});
  

}
select  (bubbleUp = true){
  for(var s of dom.tabs.children)s.blur();
  this.classList.add("activeTab");
  dom.content.empty();
  dom.content.appendChild(this.content);
  activeTab = this;
  sheet= this.content;
  sheet.footerUpdate();
  if(bubbleUp) Tab.bubbleUp();
  this.content.reload();
  Tab.checkSingle();
}
static reload(){for (var tab of dom.tabs.children)if(tab.content.reload) tab.content.reload()}
static bubbleUp (){dom.tabs.insertBefore(activeTab,dom.tabs.children[0])}
  
}

customElements.define('ui-tab', Tab);
  