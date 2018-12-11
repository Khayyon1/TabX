chrome.storage.local.get('activated', function(results)
{
   var activated;
   if(results['activated'])
   {
      activated = true;
      createButton(activated);
      createForm();
      loadSettings();
   }

   else
   {
      activated = false;
      createButton(activated);
   }
});
