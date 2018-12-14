module.exports =
 [
   {
       name: 'tabx',
       entry: './main',
       output:
       {
         path: __dirname + "/../dist/scripts",
         filename: "tabx.js"
       },
       node:
       {
          fs: 'empty'
      }
   }
   ,
   {
      name: 'models',
      entry: './models/bgmodels',
      output:
      {
        path: __dirname + "/../dist/scripts",
        filename: "models.js"
      },

      node:
      {
        fs: 'empty'
      }
   }
];
