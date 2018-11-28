/*
* This is the file which will call our java script file that need to be tested.
* Each describe block is equivalent to one test case
*
*/

describe("Get Suggestions", suggestionsTestSuite);

function suggestionsTestSuite()
{
   it("should return non-empty suggestions list", function()
   {
      expect(getSuggestions("hello").length > 0).toBe(true);
   });

   it("shoud return an empty suggestions list for a nonsense word", function(){
      expect(getSuggestions("fjuernf").length == 0).toBe(true);
   });
}
