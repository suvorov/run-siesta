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

	// добавляем обработчик события о заврешении очередного теста
	listeners:
	{
		testfinalize: function (event, test)
		{
			var fail = test.$failCount,
				pass = test.$failCount;

			var log = fail ? '>>>>>FAILED<<<<< ' : '[PASSED] ';

			log += test.url + ' [pass: ' + pass + ', fail: ' + fail + ']';

			// пишем в лог информацию о тесте
			console.log(log);
		}
	}

});

Harness.start(
	'010_sanity.t.js',
	'020_basic.t.js'
);
