/*global module:false*/
module.exports = function(grunt)
{
	grunt.initConfig(
	{
		pkg: '<json:package.json>',
		meta:
		{
			banner: '/*!\n' +
				'*	@Class: <%= pkg.title %>\n'+
				'*	@Created on: <%= grunt.template.today("yyyy-mm-dd") %>\n'+
				'*	@Description: <%= pkg.description %>\n'+
				'*	@Author: <%= pkg.author.name %> <<%= pkg.author.email %>>\n'+
				' ------------------------------------------------------------- */'
		},

		min:
		{
			dist:
			{
				src: ['<banner:meta.banner>', 'src/ClassInstantiator.js'],
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		}
	});

	// Default task.
	grunt.registerTask('default', 'min');
};