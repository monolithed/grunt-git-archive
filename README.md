# grunt-git-archive

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

[![NPM](https://nodei.co/npm/grunt-git-archive.png?downloads=true)](https://nodei.co/npm/grunt-git-archive/)


> An implementation git archive command

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-git-archive --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-git-archive');
```

## git-archive task
_Run this task with the `grunt git-archive` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.


### Usage Example

```js
module.exports = function (grunt) {
	grunt.config.init({
		'git-archive': {
			archive: {
				options: {
					'extra'   : 6,
					'format'  : 'tar.gz',
					'output'  : 'file.tar.gz',
					'tree-ish': 'master',
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-git-archive');

	grunt.registerTask('archive', ['git-archive']);
	grunt.registerTask('default', [archive]);
};

```

### Options

#### format
Type: `String`
Default: `tar`

Format of the resulting archive: tar or zip. If this option is not given, and the output file is specified, the format is inferred from the filename if possible (e.g. writing to "foo.zip" makes the output to be in the zip format). Otherwise the output format is tar.

```js
'git-archive': {
	archive: {
		options: {
			'output'  : 'file.tar.gz',
			'tree-ish': 'master'
			'format'  : 'tar.gz'
		}
	}
}
```

#### verbose
Type: `Boolean`
Default: `false`

Report progress to stderr.

```js
'git-archive': {
	archive: {
		options: {
			'output'  : 'file.tar',
			'tree-ish': 'master'
			'verbose'  : true
		}
	}
}
```

#### prefix
Type: `String`

Prepend <prefix>/ to each filename in the archive.

```js
'git-archive': {
	archive: {
		options: {
			'output'  : 'file.tar',
			'tree-ish': 'master'
			'prefix'  : 'path/' // path/file.tar
		}
	}
}
```


#### output (required)
Type: `String|Function (helper)`

Write the archive to <file> instead of stdout.

```js
'git-archive': {
	archive: {
		options: {
			'output'  : 'file.tar',
			'tree-ish': 'master'
		}
	}
}
```

```js
'git-archive': {
	archive: {
		options: {
			'output'  : function () {
				return 'file.tar';
			},

			'tree-ish': 'master'
		}
	}
}
```

#### worktree-attributes
Type: `String`

Look for attributes in [.gitattributes](http://git-scm.com/docs/gitattributes) files in the working tree as well


##### Attributes

`export-ignore`
Files and directories with the attribute export-ignore won’t be added to archive files. See [gitattributes](http://git-scm.com/docs/gitattributes) for details.

`export-subst`
If the attribute export-subst is set for a file then Git will expand several placeholders when adding this file to an archive. See [gitattributes](http://git-scm.com/docs/gitattributes) for details.

Note that attributes are by default taken from the .gitattributes files in the tree that is being archived. If you want to tweak the way the output is generated after the fact (e.g. you committed without adding an appropriate export-ignore in its .gitattributes), adjust the checked out .gitattributes file as necessary and use --worktree-attributes option. Alternatively you can keep necessary attributes that should apply while archiving any tree in your $GIT_DIR/info/attributes file.


```js
'git-archive': {
	archive: {
		options: {
			'output'                : 'file.tar',
			'tree-ish'              : 'master'
			'worktree-attributes'   : true
		}
	}
}
```

#### extra
Type: `Number`

This can be any options that the archiver backend understands.


#### Backend extra options

`-0`
Store the files instead of deflating them.

`-9`
Highest and slowest compression level. You can specify any number from 1 to 9 to adjust compression speed and ratio.

```js
'git-archive': {
	archive: {
		options: {
			'output'  : 'file.tar',
			'tree-ish': 'master'
			'extra'   : 6
		}
	}
}
```

#### remote
Type: `String`

Instead of making a tar archive from the local repository, retrieve a tar archive from a remote repository. Note that the remote repository may place restrictions on which sha1 expressions may be allowed in <tree-ish>. See [git-upload-archive](http://git-scm.com/docs/git-upload-archive) for details.


##### exec
Type: `String`

Used with --remote to specify the path to the git-upload-archive on the remote side.


```js
'git-archive': {
	archive: {
		options: {
			'output'  : 'file.tar',
			'tree-ish': 'master/tasks', // Archive only the tasks directory in master branch
			'remote'  : 'origin v1.0:Documentation'
		}
	}
}
```


#### tree-ish  (required)
Type: `String`

The tree or commit to produce an archive for.

```js
'git-archive': {
	archive: {
		options: {
			'output'  : 'file.tar',
			'tree-ish': 'master/tasks', // Archive only the tasks directory in master branch
		}
	}
}
```

A complete list of commit-ish and tree-ish identifiers

|    Commit-ish/Tree-ish    |                Examples                  |
|:--------------------------|:-----------------------------------------|
|  1. <sha1>                | dae86e1950b1277e545cee180551750029cfe735 |
|  2. <describeOutput>      | v1.7.4.2-679-g3bee7fb                    |
|  3. <refname>             | master, heads/master, refs/heads/master  |
|  4. <refname>@{<date>}    | master@{yesterday}, HEAD@{5 minutes ago} |
|  5. <refname>@{<n>}       | master@{1}                               |
|  6. @{<n>}                | @{1}                                     |
|  7. @{-<n>}               | @{-1}                                    |
|  8. <refname>@{upstream}  | master@{upstream}, @{u}                  |
|  9. <rev>^                | HEAD^, v1.5.1^0                          |
| 10. <rev>~<n>             | master~3                                 |
| 11. <rev>^{<type>}        | v0.99.8^{commit}                         |
| 12. <rev>^{}              | v0.99.8^{}                               |
| 13. <rev>^{/<text>}       | HEAD^{/fix nasty bug}                    |
| 14. :/<text>              | :/fix nasty bug                          |
|     **Tree-ish only**     |              **Examples**                |
| 15. <rev>:<path>          | HEAD:README.txt, master:sub-directory/   |
|       **Tree-ish?**       |              **Examples**                |
| 16. :<n>:<path>           | :0:README, :README                       |


Identifiers #1-14 are all "commit-ish", because they all lead to commits, but because commits also point to directory trees, they all ultimately lead to (sub)directory tree objects, and can therefore also be used as "tree-ish".

#15 can also be used as tree-ish when it refers to a (sub)directory, but it can also be used to identify specific files. When it refers to files, I'm not sure if it's still considered "tree-ish", or if acts more like "blob-ish" (Git refers to files as "blobs").

For more info see [specifying revisions](https://www.kernel.org/pub/software/scm/git/docs/gitrevisions.html#_specifying_revisions)


#### path
Type: `String`

Without an optional path parameter, all files and subdirectories of the current working directory are included in the archive. If one or more paths are specified, only these are included.

```js
'git-archive': {
	archive: {
		options: {
			'output'  : 'file.tar',
			'tree-ish': 'master',
			'path'    : '.gitignore .npmignore package.json', // Archive only this files
		}
	}
}
```

#### complete
Type: `Function (file)`
Context: `options`

Callback

```js
'git-archive': {
	archive: {
		options: {
			'output'  : 'file.tar',
			'tree-ish': 'master',

			'complete': function (file) {
				grunt.log.write('Creating the %s archive completed!', file);
			}
		}
	}
}
```

#### helpers
Type: `Object`
Context: `options`

Optional commands that can be set as an `output` option.

```js
'git-archive': {
	archive: {
		options: {
			'output': function (helper) {
				return helper.branch + '.tar'; // master.tar
			},

			'tree-ish': 'master',

			'helpers' : {
				'branch': 'git rev-parse --abbrev-ref HEAD'
			}
		}
	}
}
```

The most popular helpers:

```js
{
	'user'      : 'git config --get user.name',
	'email'     : 'git config --get user.email',
	'branch'    : 'git rev-parse --abbrev-ref HEAD',
	'directory' : 'basename `git rev-parse --show-toplevel`'
}
```


Task submitted by [Alexander Abashkin](https://github.com/monolithed)
