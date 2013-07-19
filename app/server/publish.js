Meteor.publish('packages', function(pageNumber, perPage, search_keywords) {

  check(pageNumber, Number);
  check(perPage, Number);
  check(search_keywords, String);
  keywords = new RegExp(search_keywords, "i");

  Logs.insert({
    name: 'publish.packages',
    userId: this.userId,
    stamp: new Date()
  });

  var skipped = pageNumber*perPage;

  if (search_keywords) {
    return Packages.find({
      visible: { $ne: false },
      $or:[{name:keywords},{description:keywords}]
    }, {
      sort: {
        updatedAt: -1
      },
      skip: skipped,
      limit: perPage
    });
  } else {
    return Packages.find({
      visible: { $ne: false }
    }, {
      sort: {
        updatedAt: -1
      },
      skip: skipped,
      limit: perPage
    });
  }
});

Meteor.publish("packagesCount", function (search_keywords, countId) {
  var self = this;
  check(countId, String);
  check(search_keywords, String);
  keywords = new RegExp(search_keywords, "i");
  var count = 0;
  var initializing = true;

  if (search_keywords) {
    var handle = Packages.find({
      visible: { $ne: false },
      $or:[{name:keywords},{description:keywords}]
    }).observeChanges({
      added: function (id) {
        count++;
        if (!initializing)
          self.changed("packagesCount", countId, {count: count});
      },
      removed: function (id) {
        count--;
        self.changed("packagesCount", countId, {count: count});
      }
      // don't care about moved or changed
    });
  } else {
    var handle = Packages.find({
      visible: { $ne: false }
    }).observeChanges({
      added: function (id) {
        count++;
        if (!initializing)
          self.changed("packagesCount", countId, {count: count});
      },
      removed: function (id) {
        count--;
        self.changed("packagesCount", countId, {count: count});
      }
      // don't care about moved or changed
    });
  }

  // Observe only returns after the initial added callbacks have
  // run.  Now return an initial value and mark the subscription
  // as ready.
  initializing = false;
  self.added("packagesCount", countId, {count: count});
  self.ready();

  // Stop observing the cursor when client unsubs.
  // Stopping a subscription automatically takes
  // care of sending the client any removed messages.
  self.onStop(function () {
    handle.stop();
  });
});

Meteor.publish('allPackages', function() {

  Logs.insert({
    name: 'publish.allPackages',
    userId: this.userId,
    stamp: new Date()
  });

  return Packages.find({}, {
    sort: {
      updatedAt: -1
    }
  });
});
