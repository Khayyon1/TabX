/*            
* This is the file which will call our java script file that need to be tested. 
* Each describe block is equivalent to one test case    
*     
*/    

describe("Get Suggestions", function(){
   it("should return non-empty suggestions list ", function(){
      expect(getSuggestions("hello").length > 0).toBe(true);
   });

    it('should currently return a suggestion list of size 3', function () {
       expect(getSuggestions("hello").length == 3).toBe(true);
    });


});

