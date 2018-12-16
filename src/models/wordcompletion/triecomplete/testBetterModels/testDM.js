//Test Better

const expect = require('expect.js');
const train = require("./understandDM.js");

var ab = train.addBegW;
var am = train.addMidW;
var ae = train.addEndW;
var swg = train.swapGenW;
var sbg = train.subGenW;


//Prelim tests
expect(train.distance("","")).to.be(0)
expect(train.distance("a", "a")).to.be(0);
expect(train.distance("abc", "abc")).to.be(0);
expect(train.distance(" ", " ")).to.be(0);
expect(train.distance("a", "ab")).to.be(ae);


expect(train.distance("a", "ba")).to.be(ab);




expect(train.distance("ac", "abc")).to.be(am);
expect(train.distance("a", "abc")).to.be(ae*2);

expect(train.distance("b", "abc")).to.be(ab + ae);
expect(train.distance("ac", "abcd")).to.be(am + ae);
expect(train.distance("bd", "abcde")).to.be(ab + am + ae);

expect(train.distance("a", "b")).to.be(sbg);

expect(train.distance("ab", "ac")).to.be(sbg);
expect(train.distance("abc", "zyx")).to.be(sbg*3);

expect(train.distance("ab", "ba")).to.be(swg);
