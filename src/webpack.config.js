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
      },

      optimization:
      {
         minimize: false
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
