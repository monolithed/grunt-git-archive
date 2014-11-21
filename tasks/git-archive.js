/*!
 * grunt-git-archive
 *
 * @author Abashkin Alexander <monolithed@gmail.com>
 * @license MIT, 2014
 */

'use strict';

var util = require('util'),
	child_process = require('child_process');

var Promise = require('es6-promises');


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
								value = value.call(options, helpers);
							}

							value = util.format('--%s="%s"', option, this.name = value);
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

			helpers: function (callback) {
				var list = [];

				for (var name in options.helpers) {
					var helper = new Promise(function (resolve) {
						var value = options.helpers[name];

						child_process.exec(value, function (name, error, stdout) {
							if (error) {
								grunt.fail.fatal(error);
							}

							resolve({
								name : name,
								value: stdout.trim()
							});
						}
						.bind(null, name));
					});

					list.push(helper);
				}

				return list;
			},

			exec: function (helpers) {
				var command = this.command(helpers);

				child_process.exec(command, function (error, stdout, stderr) {
					if (options.verbose) {
						grunt.log.writeln(stderr);
					}

					if (options.complete) {
						options.complete.call(options, this.name);
					}

					grunt.log.ok(command);

					if (error) {
						grunt.fail.fatal(error);
					}

					var message = util.format('Creating the archive "%s" completed', this.name);
					grunt.log.ok(message);

					resolve();
				}
				.bind(this));
			}
		};

		if (typeof options.output == 'function' && options.helpers) {
			var helpers = archive.helpers();

			Promise.all(helpers).then(function (helpers) {
				var result = {};

				helpers.forEach(function (helper) {
					result[helper.name] = helper.value;
				});

				archive.exec(result);
			});
		}
		else {
			archive.exec();
		}
	});
};
