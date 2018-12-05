let features = document.getElementById("settings")['feature']

chrome.storage.local.get(["Current Word"], function(res){
       console.log(res);
   })
       for(let i = 0; i < features.length; ++i)
       {
           let feature = features[i]
           console.log(feature.value);
           let key = feature.value;
           chrome.storage.local.get([key], function(res){
                   if(res[feature.value] != undefined){
                       feature.checked = "checked";
                   }});
       }

       for(let i = 0; i < features.length; i++ )
       {
           let feature = features[i];
           feature.onclick = function ()
           {
               let key = feature.value;
               let value = feature.checked
               let data = {}
               data[key.toString()] = value
               chrome.storage.local.set(data, function(result){
                            console.log(data);
               });

   }
}
