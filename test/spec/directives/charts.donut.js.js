'use strict';

describe('Directive: charts.donut.js', function () {

  // load the directive's module
  beforeEach(module('d3ChartsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<charts.donut.js></charts.donut.js>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the charts.donut.js directive');
  }));
});
