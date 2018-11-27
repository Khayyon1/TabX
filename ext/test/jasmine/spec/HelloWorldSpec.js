/*            
* This is the file which will call our java script file that need to be tested. 
* Each describe block is equivalent to one test case    
*     
*/    

describe("Hello World", function(){ 
   
   it("should Return Hello world",function(){ 
      expect(helloworld()).toEqual('Hello World'); 
   }); 

});