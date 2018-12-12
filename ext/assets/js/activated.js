chrome.storage.local.get('activated', function(results)
{
   var activated;
   createForm();
   if(results['activated'])
   {
      loadSettings();
   }

   else
   {
      activated = false;
   }
});
