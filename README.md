run-siesta
==========

Running tests of Siesta by Phantom JS

###run-siesta.js
> phantomjs run-siesta.js http://localhost/tests/index.html

###index.js

Please read http://www.bryntum.com/docs/siesta/#!/guide/siesta_getting_started-section-4

####Important

...

Harness.configure({
	
	...

	autoRun		: true,

	preload     : [
		...
	],

	listeners:
	{
		testfinalize: function(event, test)
		{
			var fail = test.$failCount,
				pass = test.$passCount;

			var log = (fail ? '~~~~~~~~\n FAILED  ' : '[PASSED] ') +
				test.url + ' [pass: ' + pass + ', fail: ' + fail + ']' +
				(fail ? '\n~~~~~~~~' : '');

			console.log(log);
		},
		testsuiteend: function(event, harness)
		{
			console.log('END_TESTS');
		}

	}

});

...