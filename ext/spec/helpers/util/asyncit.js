beforeEach(function() {
  var async_it = async_it;
});

function async_it(msg, func, expec)
{
    it(msg, function(done)
    {
        let result = func();
        result.then((result) => expec(result));
        done();
    });
}

module.exports = async_it;