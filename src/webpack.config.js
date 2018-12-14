module.exports = [
{
    name: 'tabx',
    entry: './main',
    output:
    {
      path: __dirname + "../dist/scripts",
      filename: "[name].js"
    },
},
{
   name: 'models',
   entry: './models/bgmodels',
   output:
   {
     path: __dirname + "../dist/scripts",
     filename: "[name].js"
   },
}]
