Ember.LOG_BINDINGS = true;
App = Ember.Application.create({
	rootElement: '#github-app',
    LOG_TRANSITIONS: true,
    LOG_ACTIVE_GENERATIONS: true,
    LOG_VIEW_LOOKUPS: true
});

App.Router.map(function() {
	this.resource('user', {path: '/users/:login'}, function() {
		this.resource('repositories');
		this.resource('repository', {path: 'repositories/:name'});
	});
});

var devs = [
	{
		login: 'robconery',
		name: 'Rob Conery'
	},
	{
		login: 'shanselman',
		name: 'Scoot Hanselman'
	},
	{
		login: 'tomdale',
		name: 'Tom Dale',
	},
	{
		login: 'wycats',
		name: 'Yahuda Katz'
	},
	{
		login: 'haacked',
		name: 'Phil Hack'
	}
];

App.IndexRoute = Ember.Route.extend({
	model: function() {
		return devs;
	}
});
App.UserRoute = Ember.Route.extend({
	model: function(params) {
		return Ember.$.getJSON('https://api.github.com/users/' +params.login);
	}
});
App.UserIndexRoute = Ember.Route.extend({
	model: function() {
		return this.modelFor('user');
	}
});
App.RepositoriesRoute = Ember.Route.extend({
	model: function() {
		var user = this.modelFor('user');
		return Ember.$.getJSON(user.repos_url);
	}
});
App.RepositoryRoute = Ember.Route.extend({
	model: function(params) {
		var user = this.modelFor('user');
		var url = 'https://api.github.com/repos' +user.login + '/' + params.reponame;
		return Ember.$.getJSON(url);
	}
});

App.IndexController = Ember.ArrayController.extend({
	renderedOn: function() {
		return new Date();
	}.property()
});
App.RepositoriesController = Ember.ArrayController.extend({
	needs: ['user'],
	user: Ember.computed.alias('controllers.user')
});
App.RepositoryController = Ember.ObjectController.extend({
	needs: ['user'],
	user: Ember.computed.alias('controllers.user')
});
