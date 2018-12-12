chrome.storage.local.get('activated', function(results)
{
   var activated;
   createForm();
   loadSettings();
});