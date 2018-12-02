module.exports = {
   mode: 'production',
   entry: './src/entry',
   optimization: {
   // We no not want to minimize our code.
   minimize: false
   },
   output: {
      path: __dirname + "/chrome/scripts",

   }
}
