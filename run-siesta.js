var system = require('system');

console.log('');
console.log('Start tests...');
console.log('');

if (system.args.length !== 2)
{
	globalLog.add('Usage:phantomjs run-siesta.js URL');
	myExit(1);
}

/**
 * Завершает работу программы и выводит код.
 *
 * @param exitCode код завершения (0 - ОК)
 */
function myExit(exitCode)
{
	globalLog.add('Exit code: ' + exitCode);
	globalLog.console();

	phantom.exit(exitCode);
}

var page = require('webpage').create();

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg)
{
	if (!msg.match(/\[object Object\]/))
	{
		console.log(msg);
	}
};

/**
 * Глобальный лог.
 */
var globalLog = (function()
{
	/**
	 * Логи.
	 *
	 * @type {Array}
	 */
	var store = [];

	return {
		/**
		 * Добавляет сообщение в лог.
		 *
		 * @param msg
		 */
		add: function(msg)
		{
			store.push(msg);
		},

		/**
		 * Выводит логи в консоль.
		 */
		console: function()
		{
			var log = '';

			for (var i= 0; i < store.length; i++)
			{
				log += store[i] + '\n';
			}

			console.log(log);
		}
	};
}());

/**
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param testFx javascript condition that evaluates to a boolean,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param onReady what to do when testFx condition is fulfilled,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
 */
function waitFor(testFx, onReady, timeOutMillis)
{
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3001, //< Default Max Timeout is 3s
        start = new Date().getTime(),
        condition = false,

        interval = setInterval(
			function()
			{
				if ((new Date().getTime() - start < maxtimeOutMillis) && !condition)
				{
					// If not time-out yet and condition not yet fulfilled
					condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
				}
				else
				{
					if(!condition)
					{
						// If condition still not fulfilled (timeout but condition is 'false')
						globalLog.add("'waitFor()' timeout");
						myExit(1);
					}
					else
					{
						// Condition fulfilled (timeout and/or condition is 'true')
						globalLog.add("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");

						typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled

						clearInterval(interval); //< Stop this interval
					}
				}
			}
			, 100
		); //< repeat check every 100ms
};

page.open(system.args[1], function(status)
{
    if (status !== "success")
	{
        globalLog.add("Unable to access network");
		myExit(1);
    }
	else
	{
        waitFor(
			function()
			{
				return true;
			},

			function()
			{
				page.onLoadFinished = function(status)
				{
					globalLog.add('Status: ' + status);

					var exitCode = status !== 'success' ?
						1 :
						page.evaluate(
							function()
							{
								var totalPass = document.getElementsByClassName('total-pass')[0].innerText;
								var totalFail = document.getElementsByClassName('total-fail')[0].innerText;

								console.log('');
								console.log(totalFail === '0' ? 'Completed!' : 'Failed!');
								console.log('');
								console.log('Total pass: ' + totalPass);
								console.log('Total fail: ' + totalFail);

								return totalFail === '0' ? 0 : 1;
							}
						);

					myExit(exitCode);
				};
			}
		);
    }
});
