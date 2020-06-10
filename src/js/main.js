// chrome.storage.local.clear();
// chrome.storage.sync.clear();




var firstLaunch = true;
function appLaunch(d=[]){
    if (firstLaunch && initialLaunchData )d=d.concat(initialLaunchData);
    firstLaunch = false;
    if (d.length === 0) return new Tab();
    var entries = [];
    for (var item of d) if(item.entry.isFile) entries.push(item.entry);
    for(var e of entries)new Csv(e,file=>{new Tab( new Sheet(file))});
}

chrome.app.runtime.onLaunched.addListener(function(launchData) {appLaunch(launchData.items);});
Setting.init(appLaunch);







