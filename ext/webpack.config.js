module.exports = {
   mode: 'production',
   entry: './src/entry',

   node:
   {
      fs: "empty"
   },

   optimization:
   {
      // We no not want to minimize our code.
      minimize: false
   },
   
   output:
   {
      path: __dirname + "/chrome/scripts",
   },

   target: "web"
}
