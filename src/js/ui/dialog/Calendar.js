class Calendar extends HTMLElement {
constructor() {
        super();
        this.cal = new Table();
        this.cal.pushRow(["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]);        
        this.cal.setAttribute('tabindex', 0);
        this.today = document.createElement("button");
        this.today.innerHTML = "Today";
        this.today.onclick = e=> {this.date = new Date(); this.update()}
        this.date = new Date ();
        this.year  = new NumInput(this.yr, this.yr-100, this.yr+100);
        this.month = new ListInput(this.date.monthList, true);
        this.year.onchange  = ()=>{this.date.setYear(this.year.value);this.update()};
        this.month.onchange = ()=>{this.date.setMonth(this.month.idx);this.update()};
        this.pick = document.createElement("button");
        this.pick.innerHTML = "Pick";
        this.pick.onclick=e=>{sheet.rangeEdit(this.date.getFormated(stg.dateFormat));sheet.refresh();this.remove()}
        this.appendChild(this.today);
        this.appendChild(document.createElement("hr"));
        this.appendChild(this.year);
        this.appendChild(document.createElement("hr"));
        this.appendChild(this.month);
        this.appendChild(document.createElement("hr"));
        this.appendChild(this.cal);
        this.appendChild(document.createElement("hr"));
        this.appendChild(this.pick);
        dom.dialog.push(this); 
        this.update();
        this.pick.focus();  
        this.cal.addEventListener('click', e=>{if (e.target.nodeName==="DIV"){this.date.setDate(Number(e.target.innerHTML));this.update()}});
        this.cal.addEventListener('keydown', e=>{
                var k = e.key.toUpperCase();
                switch(k){
                        case "ARROWUP": this.date.setDate(this.date.getDate() - 7);this.update();break;
                        case "ARROWLEFT":this.date.setDate(this.date.getDate() - 1) ;this.update();break;
                        case "ARROWRIGHT":this.date.setDate(this.date.getDate() + 1) ;this.update();break;
                        case "ARROWDOWN":this.date.setDate(this.date.getDate() + 7) ;this.update();break;
                }

        });
}

get yr () {return this.date.getFullYear()}
update(){
        if ( this.year.value !==this.yr) return  this.year.value   = this.yr;
        if ( this.month.idx  != this.date.getMonth()) return  this.month.value  = this.date.monthList[this.date.getMonth()];
        while(this.cal.rows.length >1) this.cal.rows[this.cal.rows.length-1].remove();
        this.dayList = [];
        var first = new Date(this.year.value, this.month.idx, 1);
        var pass =  (first.getDay()+6)%7;
        for (var i = 0 ; i <pass; i++) this.dayList.push("");
        while(first.getMonth() === this.month.idx){
           var div = document.createElement("div")
           div.innerHTML = first.getDate();
           if (first.getDate()===this.date.getDate()) div.classList.add("picked");
           this.dayList.push(div);
           first.setDate(first.getDate() + 1);
        }
        var max = this.dayList.length;
        while(this.dayList.length < 42)this.dayList.push("&#x200b;");
        for (var i = 0 ; i < this.dayList.length;i++){
                if (i%7===0)this.cal.br();
                this.cal.push(this.dayList[i]);
        }
        this.pick.innerHTML = this.date.getFormated(stg.dateFormat);       
}
}
customElements.define('ui-calendar', Calendar );