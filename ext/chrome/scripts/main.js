/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const wordcomplete = __webpack_require__(1);
wordcomplete.registerEventListeners();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// document.addEventListener("keyup", displaySuggestions);

var _current_word = "";

//import {wordCompleteModel} from './models/wordcomplete.js';

const WordCompleteModel = __webpack_require__(2);

function displaySuggestions(activeElement)
{
   if(!activeElementIsTextField()){
      return;
   }

   var current_table = document.getElementById("suggestionsTable");

   console.log("current word: " + getCurrentWord(document.activeElement))
   console.log(current_table);
   if(current_table != null)
   {
      document.body.removeChild(current_table);
   }

   if(document.activeElement.value == "" || getCurrentWord(document.activeElement) == ""){
         return;
   }

   var table = document.createElement("table");
   table.id = "suggestionsTable"

    table.style.position = 'fixed';
    var input_bounds = document.activeElement.getBoundingClientRect();

    table.style.left = (input_bounds.left).toString() + "px";
    table.style.top = (input_bounds.top + 20).toString()+"px";

   console.log(document.activeElement.value);
   var suggestions = getSuggestions(getCurrentWord(document.activeElement));
   for(var i = 0; i < suggestions.length; i++)
   {
       var row = document.createElement("tr");
       var column1 = document.createElement("td");
       var column2 = document.createElement("td");
       column1.appendChild(document.createTextNode(((i+1).toString())));
       column2.appendChild(document.createTextNode(suggestions[i]));
       row.append(column1);
       row.append(column2);
       table.appendChild(row);
   }

   document.body.appendChild(table);
}

function activeElementIsTextField()
{
   var activeElement = document.activeElement;
   return activeElement.tagName == 'INPUT';
}

function wordCompletion(activeElement, userChoice ='world')
{
    activeElement.value = replaceWordAt(
        activeElement.value,
        activeElement.selectionStart,
        userChoice);
}

function replaceWordAt(str, i, word, delimiter=' ')
{
    var startOfWord = str.lastIndexOf(delimiter, i - 1);
    var before = str.substring(0, startOfWord);

    if (before != "" && before != null)
    {
        before += " "
    }

    var after  = str.substring(i);

    if(after.charAt(0) != "" && after.charAt(0) != " ")
    {
      after = " " + after;
    }

    console.log("Start   : " + startOfWord.toString());
    console.log("Before  : " + before);
    console.log("Replace : " + word);
    console.log("After   : " + after);

    return before + word + after;
}

function storeCurrentWord(){
    if(activeElementIsTextField())
    {
        _current_word = getCurrentWord(document.activeElement);
        console.log(_current_word);
        console.log("Suggestions: " + getSuggestions(_current_word));
    }
}


//Assumes that the caret is at the end of a word in a text field
function getCurrentWord(inputField)
{
   var text = inputField.value;
   var caret = inputField.selectionStart;

   if(caret == 0)
   {
      return "";
   }

   var prev = text.charAt(caret - 1);

   //Make sure caret is at the end of a developing word
   if(prev.match(/\w/))
   {
      //Iterate backwards to find the first instance of a white space
       // 0 to caret
      var startOfWord = indexOfStartOfCurrentWord(text, caret);

      if(startOfWord == 0)
      {
         return text.substring(0, caret);
      }
      else
      {
         return text.substring(startOfWord, caret);
      }
   }

   else
   {
      return "";
   }
}

function indexOfStartOfCurrentWord(text, caret)
{
      //Iterate backwards to find the first instance of a white space
      var i = caret;
      while(i > 0 && text.charAt(i - 1).match(/\w/))
      {
          i--;
      }

      return i;
}

function getSuggestions(incomplete_string)
{
   console.log(WordCompleteModel);
   return WordCompleteModel.WordCompleteModel.predictCurrentWord(incomplete_string);
}

function handleUserInput(event)
{
    if (activeElementIsTextField())
    {
        displaySuggestions(document.activeElement);
    }
}

function registerEventListeners(){
   document.addEventListener('keydown', handleWordComplete);
   document.addEventListener('keyup', handleUserInput);
}

function suggestionsAreBeingDisplayed() {
    return document.getElementById("suggestionsTable") != null
}

function handleWordComplete(event){
    var keyname = event.key;
    var choices = ["1", "2", "3"];
    if(activeElementIsTextField() && choices.includes(keyname) && suggestionsAreBeingDisplayed())
    {
        event.preventDefault();
        wordCompletion(document.activeElement, getSuggestions(getCurrentWord(document.activeElement))[parseInt(keyname) - 1])
    }
}

module.exports = {
   getSuggestions: getSuggestions,
   getCurrentWord: getCurrentWord,
   wordCompletion: wordCompletion,
   registerEventListeners: registerEventListeners
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

function simpleReadFileSync(filePath){

var buffer =`the
of
to
and
a
in
is
it
you
that
he
was
for
on
are
with
as
I
his
they
be
at
one
have
this
from
or
had
by
hot
word
but
what
some
we
can
out
other
were
all
there
when
up
use
your
how
said
an
each
she
which
do
their
time
if
will
way
about
many
then
them
write
would
like
so
these
her
long
make
thing
see
him
two
has
look
more
day
could
go
come
did
number
sound
no
most
people
my
over
know
water
than
call
first
who
may
down
side
been
now
find
any
new
work
part
take
get
place
made
live
where
after
back
little
only
round
man
year
came
show
every
good
me
give
our
under
name
very
through
just
form
sentence
great
think
say
help
low
line
differ
turn
cause
much
mean
before
move
right
boy
old
too
same
tell
does
set
three
want
air
well
also
play
small
end
put
home
read
hand
port
large
spell
add
even
land
here
must
big
high
such
follow
act
why
ask
men
change
went
light
kind
off
need
house
picture
try
us
again
animal
point
mother
world
near
build
self
earth
father
head
stand
own
page
should
country
found
answer
school
grow
study
still
learn
plant
cover
food
sun
four
between
state
keep
eye
never
last
let
thought
city
tree
cross
farm
hard
start
might
story
saw
far
sea
draw
left
late
run
don't
while
press
close
night
real
life
few
north
open
seem
together
next
white
children
begin
got
walk
example
ease
paper
group
always
music
those
both
mark
often
letter
until
mile
river
car
feet
care
second
book
carry
took
science
eat
room
friend
began
idea
fish
mountain
stop
once
base
hear
horse
cut
sure
watch
color
face
wood
main
enough
plain
girl
usual
young
ready
above
ever
red
list
though
feel
talk
bird
soon
body
dog
family
direct
pose
leave
song
measure
door
product
black
short
numeral
class
wind
question
happen
complete
ship
area
half
rock
order
fire
south
problem
piece
told
knew
pass
since
top
whole
king
space
heard
best
hour
better
true
during
hundred
five
remember
step
early
hold
west
ground
interest
reach
fast
verb
sing
listen
six
table
travel
less
morning
ten
simple
several
vowel
toward
war
lay
against
pattern
slow
center
love
person
money
serve
appear
road
map
rain
rule
govern
pull
cold
notice
voice
unit
power
town
fine
certain
fly
fall
lead
cry
dark
machine
note
wait
plan
figure
star
box
noun
field
rest
correct
able
pound
done
beauty
drive
stood
contain
front
teach
week
final
gave
green
oh
quick
develop
ocean
warm
free
minute
strong
special
mind
behind
clear
tail
produce
fact
street
inch
multiply
nothing
course
stay
wheel
full
force
blue
object
decide
surface
deep
moon
island
foot
system
busy
test
record
boat
common
gold
possible
plane
stead
dry
wonder
laugh
thousand
ago
ran
check
game
shape
equate
hot
miss
brought
heat
snow
tire
bring
yes
distant
fill
east
paint
language
among
grand
ball
yet
wave
drop
heart
am
present
heavy
dance
engine
position
arm
wide
sail
material
size
vary
settle
speak
weight
general
ice
matter
circle
pair
include
divide
syllable
felt
perhaps
pick
sudden
count
square
reason
length
represent
art
subject
region
energy
hunt
probable
bed
brother
egg
ride
cell
believe
fraction
forest
sit
race
window
store
summer
train
sleep
prove
lone
leg
exercise
wall
catch
mount
wish
sky
board
joy
winter
sat
written
wild
instrument
kept
glass
grass
cow
job
edge
sign
visit
past
soft
fun
bright
gas
weather
month
million
bear
finish
happy
hope
flower
clothe
strange
gone
jump
baby
eight
village
meet
root
buy
raise
solve
metal
whether
push
seven
paragraph
third
shall
held
hair
describe
cook
floor
either
result
burn
hill
safe
cat
century
consider
type
law
bit
coast
copy
phrase
silent
tall
sand
soil
roll
temperature
finger
industry
value
fight
lie
beat
excite
natural
view
sense
ear
else
quite
broke
case
middle
kill
son
lake
moment
scale
loud
spring
observe
child
straight
consonant
nation
dictionary
milk
speed
method
organ
pay
age
section
dress
cloud
surprise
quiet
stone
tiny
climb
cool
design
poor
lot
experiment
bottom
key
iron
single
stick
flat
twenty
skin
smile
crease
hole
trade
melody
trip
office
receive
row
mouth
exact
symbol
die
least
trouble
shout
except
wrote
seed
tone
join
suggest
clean
break
lady
yard
rise
bad
blow
oil
blood
touch
grew
cent
mix
team
wire
cost
lost
brown
wear
garden
equal
sent
choose
fell
fit
flow
fair
bank
collect
save
control
decimal
gentle
woman
captain
practice
separate
difficult
doctor
please
protect
noon
whose
locate
ring
character
insect
caught
period
indicate
radio
spoke
atom
human
history
effect
electric
expect
crop
modern
element
hit
student
corner
party
supply
bone
rail
imagine
provide
agree
thus
capital
won't
chair
danger
fruit
rich
thick
soldier
process
operate
guess
necessary
sharp
wing
create
neighbor
wash
bat
rather
crowd
corn
compare
poem
string
bell
depend
meat
rub
tube
famous
dollar
stream
fear
sight
thin
triangle
planet
hurry
chief
colony
clock
mine
tie
enter
major
fresh
search
send
yellow
gun
allow
print
dead
spot
desert
suit
current
lift
rose
continue
block
chart
hat
sell
success
company
subtract
event
particular
deal
swim
term
opposite
wife
shoe
shoulder
spread
arrange
camp
invent
cotton
born
determine
quart
nine
truck
noise
level
chance
gather
shop
stretch
throw
shine
property
column
molecule
select
wrong
gray
repeat
require
broad
prepare
salt
nose
plural
anger
claim
continent
oxygen
sugar
death
pretty
skill
women
season
solution
magnet
silver
thank
branch
match
suffix
especially
fig
afraid
huge
sister
steel
discuss
forward
similar
guide
experience
score
apple
bought
led
pitch
coat
mass
card
band
rope
slip
win
dream
evening
condition
feed
tool
total
basic
smell
valley
nor
double
seat
arrive
master
track
parent
shore
division
sheet
substance
favor
connect
post
spend
chord
fat
glad
original
share
station
dad
bread
charge
proper
bar
offer
segment
slave
duck
instant
market
degree
populate
chick
dear
enemy
reply
drink
occur
support
speech
nature
range
steam
motion
path
liquid
log
meant
quotient
teeth
shell
neck`
    // var fs = require('fs');
    // var options = {encoding:'utf-8', flag:'r'};
    // var buffer = fs.readFileSync(filePath, options);
    return buffer.replace( /\n/g, " " ).split( " " );
}


var node = {
  key : null
  , value : null
  , children : []
}

function Trie() {
  	this.head = {
  			key : ''
  		, children: {}
    };
}

// Prototype adds a characteristic to the Trie, in this case it adds a function
Trie.prototype.add = function(key) {
    key = key.toLowerCase();

    // Make a copy of key
    var keyHold = JSON.parse(JSON.stringify(key));
    //See if it works
    var curNode = this.head
    	, newNode = null
    	, curChar = key.slice(0,1)
    , parNode = this.head;
    key = key.slice(1);

	while(typeof curNode.children[curChar] !== "undefined"
		&& curChar.length > 0){
		curNode = curNode.children[curChar];
		curChar = key.slice(0,1);
		key = key.slice(1);
	}

	while(curChar.length > 0) {
		newNode = {
			key : curChar
        //places value of String if true, places undefined if not end of word
			, value : key.length === 0 ? keyHold : undefined
			, children : {}
      , parent : parNode
		};
		curNode.children[curChar] = newNode;
    parNode = curNode
		curNode = newNode;
		curChar = key.slice(0,1);
		key = key.slice(1);
	}

};

Trie.prototype.search = function(key) {
  key = key.toLowerCase();

	var curNode = this.head
		, curChar = key.slice(0,1)
		, d = 0;

	key = key.slice(1);

	while(typeof curNode.children[curChar] !== "undefined" && curChar.length > 0){
		curNode = curNode.children[curChar];
		curChar = key.slice(0,1);
		key = key.slice(1);
		d += 1;
	}

	if (curNode.value === null && key.length === 0) {
		return d;
	} else {
		return -1;
	}

}

Trie.prototype.getChildren = function(finalArray, total, curNode){
    var cQueue = []
    cQueue.push(curNode)

    // find current Value and nearest children.
    while (total > 0 && cQueue.length > 0){
        var tempNode = cQueue.shift();
        // console.log("Key " + tempNode.key);
        // console.log("value " + tempNode.value);

        if (tempNode.value !== undefined){
            finalArray.push(tempNode.value)
            total --;
        }
        for (var key in tempNode.children){
            cQueue.push(tempNode.children[key])
        }
    }
    return [finalArray, total]
}

Trie.prototype.predictCurrentWord = function(key){
    key = key.toLowerCase();
    var total = 3;
    var finalArray = new Array();
    var curNode = this.head;
  	var curChar = key.slice(0,1);
    var cQueue = []
    key = key.slice(1);

    //findNode
    while(typeof curNode.children[curChar] !== "undefined" && curChar.length > 0){
        //Traverse 1 layer down the tree
        curNode = curNode.children[curChar];
        //add next character
        curChar = key.slice(0,1);
        //remove 1 character from key
        key = key.slice(1);
    }

    // find nearest Children
    var arrayChild = this.getChildren(finalArray,total, curNode);
    finalArray = arrayChild[0]
    total = arrayChild[1]

    //Find nearest Nodes
    // if (total > 0){
    //     var cQueue = []
    //     cQueue.push(curNode);
    // //This checks each word one away from the length of the word
    // while (total > 0 && cQueue.length > 0 && curNode.parent !== undefined){
    //
    //         tempArrayChild = this.getChildren(finalArray,total, curNode);
    //         finalArray = arrayChild[0]
    //         total = arrayChild[1]
    //         curNode = curNode.parent
    //     }
    // }
    console.log(total)

    return finalArray

}


Trie.prototype.remove = function(key) {
    key = key.toLowerCase();
	var d = this.search(key);
    	if (d > -1){
    		removeH(this.head, key, d);
    	}
}


var testTrie = new Trie();

var wordList = simpleReadFileSync("1-1000.txt")
for(var i = 0; i < wordList.length; i++){
    testTrie.add(wordList[i])
}

module.exports = {
   WordCompleteModel: testTrie
}

// expect(testTrie.nearestChildren("the")).toEqual(['the', 'they', 'then']);
//console.log(testTrie.nearestChildren("neered"))
//expect(testTrie.nearestChildren("the")).toEqual(['the', 'they', 'then']);


/***/ })
/******/ ]);