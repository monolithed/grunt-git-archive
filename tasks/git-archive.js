/*!
 * grunt-git-archive
 *
 * @author Abashkin Alexander <monolithed@gmail.com>
 * @license MIT, 2014
 */

'use strict';

var util = require('util'),
	child_process = require('child_process');

var async = require('async');


module.exports = function (grunt) {
	grunt.registerMultiTask('git-archive', 'Create an archive of files', function () {
		var resolve = this.async(),
			options = this.options();

		var archive = {
			command: function (helpers) {
				var data = ['git archive'];

				for (var option in options) {
					var value = options[option];

					if (value === undefined) {
						continue;
					}

					switch (option) {
						case 'extra':
							data.push('-' + value);
							break;

						case 'verbose':
						case 'worktree-attributes':
							if (value) {
								data.push('--' + option);
							}
							break;

						case 'output':
						case 'format':
						case 'prefix':
						case 'remote':
							if (option === 'output' && helpers) {
								value = value(helpers);
							}

							value = util.format('--%s="%s"', option, value);
							data.push(value);

							break;
					}
				}

				var tree = options['tree-ish'],
					path = options.path;

				if (tree) {
					data.push(tree);
				}
				else {
					grunt.fail.fatal('Missing a required parameter <tree-ish>');
				}

				if (path) {
					data.push(path);
				}

				return data.join(' ');
			},

			exec: function (helpers) {
				var command = this.command(helpers);

				child_process.exec(command, function (error, stdout, stderr) {
					if (options.verbose) {
						if (error) {
							grunt.log.writeln(stdout);
						}
						else {
							grunt.log.error(stderr);
						}
					}

					grunt.log.ok(command);

					if (options.process) {
						options.process.apply(arguments);
					}

					if (error) {
						grunt.fail.fatal(error);
					}

					grunt.log.ok('Creating an archive completed');

					resolve();
				});
			}
		};

		if (typeof options.output == 'function' && options.helpers) {
			var helpers = Object.keys(options.helpers);

			async.each(helpers, function (command, resolve) {
				child_process.exec(options.helpers[command], function (error, stdout) {
					if (error) {
						grunt.fail.fatal(error);
					}
					else {
						stdout = stdout.trim();
						helpers[command] = stdout.split('\n');
					}

					resolve();
				});
			},
			function (error) {
				if (error) {
					grunt.fail.fatal(error);
				}
				else {
					archive.exec(helpers);
				}
			});
		}
		else {
			archive.exec();
		}
	});
};
