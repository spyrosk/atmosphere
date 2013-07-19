
// Packages

Packages = new Meteor.Collection('packages');
PackagesCount = new Meteor.Collection('packagesCount');

Session.set('packages.loading', true);
Session.setDefault("pageNumber", 0);
Session.setDefault("perPage", 10);
Session.setDefault("search_keywords", '');

Deps.autorun(function () {
  Meteor.subscribe('packagesCount', Session.get("search_keywords"), 'packagesCount');
  Meteor.subscribe('packages', Session.get("pageNumber"), Session.get("perPage"), Session.get("search_keywords"), function() {
    Session.set('packages.loading', false);
  });
});

// Logs

Logs = new Meteor.Collection('logs');

// Meteor.subscribe('logs');
