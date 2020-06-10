class NumInput extends HTMLElement {
constructor(start=0,min=0, max=999 ) {
  super();
  this.n = start
  this.min = min;
  this.max = max;
  this.innerHTML = this.n;
  this.setAttribute('tabindex', '0');
  this.addEventListener("keydown",e=>{
      var k = e.key.toUpperCase();
            if (k==="ARROWRIGHT"||k==="ARROWUP"  ){this.value = this.value+1}
      else  if (k==="ARROWLEFT" ||k==="ARROWDOWN"){this.value  = this.value-1}
  })
}

get value(){return this.n}
set value(n){
    n=Number(n);
    if(n< this.min)n=this.min;
    if(n> this.max)n=this.max;
    this.n = n;
    this.innerHTML = this.n;
    var e = new Event("change")
    Object.defineProperty(e, 'target', {writable: false, value: this});
    if (this.onchange)this.onchange(e);
}

}

customElements.define('ui-num', NumInput);





  
  