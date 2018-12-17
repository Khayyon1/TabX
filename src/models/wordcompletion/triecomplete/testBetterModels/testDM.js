//Test Better

const expect = require('expect.js');
const train = require("./understandDM.js");

var ab = train.addBegW;
var am = train.addMidW;
var ae = train.addEndW;
var swg = train.swapGenW;
var sbg = train.subGenW;
var db = train.delBegW;
var dm = train.delMidW;
var de = train.delEndW;


dmod = train.myTrain
//Prelim tests


expect(dmod.distance("","")).to.be(0)
expect(dmod.distance("a", "a")).to.be(0);

expect(dmod.distance("abc", "abc")).to.be(0);
expect(dmod.distance(" ", " ")).to.be(0);

//Test for Add
expect(dmod.distance("a", "ab")).to.be(ae);
expect(dmod.distance("a", "ba")).to.be(ab);
expect(dmod.distance("ac", "abc")).to.be(am);
expect(dmod.distance("a", "abc")).to.be(ae*2);
expect(dmod.distance("b", "abc")).to.be(ab + ae);
expect(dmod.distance("ac", "abcd")).to.be(am + ae);
expect(dmod.distance("bd", "abcde")).to.be(ab + am + ae);

//Tests For Delete


expect(dmod.distance("ab", "a")).to.be(de);
expect(dmod.distance("ba", "a")).to.be(db);
expect(dmod.distance("abc", "ac")).to.be(dm);
expect(dmod.distance("abc", "a")).to.be(de*2);
expect(dmod.distance("abc", "b")).to.be(db + de);
expect(dmod.distance("abcd", "ac")).to.be(dm + de);
expect(dmod.distance("abcde", "bd")).to.be(db + dm + de);


expect(dmod.distance("a", "b")).to.be(sbg);
expect(dmod.distance("ab", "ac")).to.be(sbg);

expect(dmod.distance("abc", "zyx")).to.be(sbg*3);
expect(dmod.distance("ab", "ba")).to.be(swg);


expect(dmod.distance("a", "az")).to.be(ae);
dmod.changeValue("addEnd", 0.1 ,"z");
expect(dmod.distance("a", "az")).to.be(0.1);

expect(dmod.distance("ac", "abc")).to.be(am);
dmod.changeValue("addMid", 0.2 ,"b");
expect(dmod.distance("ac", "abc")).to.be(0.2);

expect(dmod.distance("bc", "ybc")).to.be(ab);
dmod.changeValue("addBeg", 0.8 ,"y");
expect(dmod.distance("bc", "ybc")).to.be(0.8);

//expect(dmod.distance("abc", "ybc")).to.be(ab);
