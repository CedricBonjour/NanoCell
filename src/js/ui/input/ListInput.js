class ListInput extends HTMLElement {
constructor(list, hide=false) {
  super();
  this.list = list;
  this.idx = 0;
  this.setAttribute('tabindex', 0);
  this.setAttribute('hide', hide);
  this.addEventListener("keydown",e=>{
      var k = e.key.toUpperCase();
            if (k==="ARROWRIGHT"||k==="ARROWDOWN"){this.idx= (this.idx+1)%this.list.length;this.value=this.list[this.idx]}
      else  if (k==="ARROWLEFT" ||k==="ARROWUP"  ){this.idx= (this.idx+this.list.length-1)%this.list.length;this.value=this.list[this.idx]}
  })
  for(var ele of list){
    var td = document.createElement("span");
    td.innerHTML = ele;
    td.addEventListener("click",e=>{this.value = e.target.innerHTML});
    this.appendChild(td);
  }

}

get value(){return  this.children[this.idx].innerHTML}
set value(txt){
  for(var i = 0 ; i < this.list.length; i++){
    if(this.list[i]===txt){
      this.idx=i;
      for (var child of this.children) child.setAttribute('selected',"false");
      this.children[i].setAttribute('selected', "true");
      var e = new Event("change")
      Object.defineProperty(e, 'target', {writable: false, value: this});
      if (this.onchange)this.onchange(e);
      return ;
    }
  }
}

}

customElements.define('ui-list', ListInput);





  
  