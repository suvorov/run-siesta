var Harness = Siesta.Harness.Browser.ExtJS;

Harness.configure({
	title       : 'Awesome Test Suite',

	// автозапуск тестов
	autoRun		: true,

	preload     : [
		// version of ExtJS used by your application
		'../ext-4.1.1/resources/css/ext-all.css',
		'../resources/yourproject-css-all.css',

		// version of ExtJS used by your application
		'../ext-4.1.1/ext-all-debug.js',
		'../yourproject-all.js'
	],

	listeners:
	{
		// добавляем обработчик события о заврешении очередного теста
		testfinalize: function(event, test)
		{
			var fail = test.$failCount,
				pass = test.$passCount;

			var log = (fail ? '~~~~~~~~\n FAILED  ' : '[PASSED] ') +
				test.url + ' [pass: ' + pass + ', fail: ' + fail + ']' +
				(fail ? '\n~~~~~~~~' : '');

			console.log(log);
		},

		// добавляем обработчик события о заврешении всего пакета тестов
		testsuiteend: function(event, harness)
		{
			console.log('END_TESTS');
		}

	}

});

Harness.start(
	'010_sanity.t.js',
	'020_basic.t.js'
);
