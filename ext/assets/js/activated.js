chrome.storage.local.get('activated', function(results)
{
   var activated;
   if(results['activated'])
   {
      activated = true;
      createForm();
      loadSettings();
   }

   else
   {
      activated = false;
   }
});
