// == BSD2 LICENSE ==
// Copyright (c) 2014, Tidepool Project
//
// This program is free software; you can redistribute it and/or modify it under
// the terms of the associated License, which is identical to the BSD 2-Clause
// License as published by the Open Source Initiative at opensource.org.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the License for more details.
//
// You should have received a copy of the License along with this program; if
// not, you can obtain one from Tidepool Project at tidepool.org.
// == BSD2 LICENSE ==

'use strict';

var salinity = require('salinity');
var expect = salinity.expect;
var testMoment = require('moment');

describe('sundial', function() {

  describe('datetimeWrapper',function(){
    var datetimeWrapper = require('../sundial');

    it('should not break require',function(){
      expect(datetimeWrapper).exists;
    });
    it('should have applyTimezone method',function(){
      expect(datetimeWrapper.applyTimezone).exists;
    });
    it('should have formatDeviceTime method',function(){
      expect(datetimeWrapper.formatDeviceTime).exists;
    });
    it('should have formatFromOffset method',function(){
      expect(datetimeWrapper.formatFromOffset).exists;
    });
    it('should have formatForStorage method',function(){
      expect(datetimeWrapper.formatForStorage).exists;
    });
    it('should have a formatInTimezone method', function(){
      expect(datetimeWrapper.formatInTimezone).exists;
    });
    it('should have getDeviceTimezone method',function() {
      expect(datetimeWrapper.getDeviceTimezone).exists;
    });
    it('should have getMsFromMidnight method',function() {
      expect(datetimeWrapper.getMsFromMidnight).exists;
    });
    it('should have getOffset method',function(){
      expect(datetimeWrapper.getOffset).exists;
    });
    it('should have getOffsetFromTime method',function(){
      expect(datetimeWrapper.getOffsetFromTime).exists;
    });
    it('should have getTimezones method',function(){
      expect(datetimeWrapper.getTimezones).exists;
    });
    it('should have isISODate method',function(){
      expect(datetimeWrapper.isISODate).exists;
    });
    it('should have isValidDate method',function(){
      expect(datetimeWrapper.isValidDate).exists;
    });
    it('should have parseAndApplyTimezone method',function(){
      expect(datetimeWrapper.parseAndApplyTimezone).exists;
    });
    it('should have utcString method',function(){
      expect(datetimeWrapper.utcDateString).exists;
    });

    describe('applyTimezone', function() {
      it('should yield a UTC time offset five hours later when non-DST and given `US/Eastern` timezone', function() {
        var res = datetimeWrapper.applyTimezone('2014-01-01T00:00:00', 'US/Eastern').toISOString();
        expect(res).to.equal('2014-01-01T05:00:00.000Z');
      });

      it('should yield a UTC time offset four hours later when DST and given `US/Eastern` timezone', function() {
        var res = datetimeWrapper.applyTimezone('2014-06-01T00:00:00', 'US/Eastern').toISOString();
        expect(res).to.equal('2014-06-01T04:00:00.000Z');
      });

      it('should assume UTC time when no timezone provided', function() {
        var res = datetimeWrapper.applyTimezone('2014-01-01T00:00:00').toISOString();
        expect(res).to.equal('2014-01-01T00:00:00.000Z');
      });
    });

    describe('formatDeviceTime', function() {
      it('returns a string formatted as ISO-format without milliseconds or timezone offset', function() {
        expect(datetimeWrapper.formatDeviceTime('2014-01-01T00:00:00.000Z')).to.equal('2014-01-01T00:00:00');
      });

      it('always speaks UTC, even when given non-Zulu ISO timestamp', function() {
        expect(datetimeWrapper.formatDeviceTime('2013-12-31T16:00:00-08:00')).to.equal('2014-01-01T00:00:00');
      });

      it('interprets a timezone-naive timestamp as if it is Zulu time', function() {
        expect(datetimeWrapper.formatDeviceTime('2014-01-01T00:00:00')).to.equal('2014-01-01T00:00:00');
      });

      it('speaks integer timestamps fluently', function() {
        expect(datetimeWrapper.formatDeviceTime(Date.parse('2014-01-01T00:00:00.000Z'))).to.equal('2014-01-01T00:00:00');
      });

      it('speaks JavaScript Date fluently too', function() {
        expect(datetimeWrapper.formatDeviceTime(new Date('2014-01-01T00:00:00.000Z'))).to.equal('2014-01-01T00:00:00');
      });
    });

    describe('formatFromOffset', function() {
      var utcDateString = '2013-05-09T00:00:00-00:00';
      it('returns a string formatted as MMMM D [at] h:mm a with the given offset applied', function() {
        expect(datetimeWrapper.formatFromOffset(utcDateString, -240)).to.equal('May 8 at 8:00 pm');
      });
    });

    describe('formatForStorage', function() {
      var basicTimestamp = '2014-10-03T13:23';
      var offsetMins = -780;

      it('returns a string',function(){

        var utcString = datetimeWrapper.formatForStorage(basicTimestamp,offsetMins);
        expect(utcString).is.a.String;
      });

      it('returns a valid date',function(){

        var utcString = datetimeWrapper.formatForStorage(basicTimestamp,offsetMins);
        expect(testMoment(utcString).isValid()).is.true;

      });
      it('has the offset from UTC',function(){

        var utcString = datetimeWrapper.formatForStorage(basicTimestamp,offsetMins);
        var offsetFromTimestamp = testMoment.parseZone(utcString).zone();
        expect(-offsetFromTimestamp).to.equal(offsetMins);

      });
      it('does not contain the `Z` designator for the zero UTC offset',function(){

        var utcString = datetimeWrapper.utcDateString();

        expect(utcString).to.not.contain('Z');
        expect(utcString).to.not.contain('z');

      });
    });

    describe('getDeviceTimezone', function() {

      it('returns a valid timezone object',function(){
        var timezone = datetimeWrapper.getDeviceTimezone();
        expect(timezone.name).to.have.length.above(0);
        expect(timezone.label).to.have.length.above(0);
      });
    });

    describe('getMsFromMidnight', function() {
      it('should return 1 when 1ms from UTC midnight and no offset', function() {
        expect(datetimeWrapper.getMsFromMidnight('2014-01-01T00:00:00.001Z')).to.equal(1);
      });

      it('should return 25 when 25ms from US/Eastern midnight during non-DST', function() {
        var easternNoDSTOffset = -300;
        expect(datetimeWrapper.getMsFromMidnight('2014-01-01T05:00:00.025Z', easternNoDSTOffset)).to.equal(25);
      });

      it('should return 25 when 25ms from US/Eastern midnight during non-DST', function() {
        var easternNoDSTOffset = -300;
        expect(datetimeWrapper.getMsFromMidnight('2014-01-01T00:00:00.025-05:00', easternNoDSTOffset)).to.equal(25);
      });

      it('should return 300000 when 5 min from Pacific/Auckland midnight during DST', function() {
        var aucklandDSTOffset = 780;
        expect(datetimeWrapper.getMsFromMidnight('2013-12-31T11:05:00.000Z', aucklandDSTOffset)).to.equal(300000);
      });
    });

    describe('getOffset', function() {
      it('returns the browser local offset from UTC in minutes',function(){

        var offset = datetimeWrapper.getOffset();
        var usersZone = new Date().getTimezoneOffset();
        expect(offset).to.equal(-usersZone);
      });
    });

    describe('getOffsetFromTime', function() {
      it('returns the offset from UTC in minutes',function(){

        var timestamp = '2013-01-01T00:00:00-13:00';

        var offset = datetimeWrapper.getOffsetFromTime(timestamp);
        expect(offset).to.equal(-780);
      });
    });

    describe('getTimezones', function() {

      it('returns 131 timezone objects',function(){
        expect(datetimeWrapper.getTimezones()).to.have.length(131);
      });

      it('returns timezone objects with a non-empty string name and label each',function(){
        datetimeWrapper.getTimezones().forEach(function(timezone){
          expect(timezone.name).to.have.length.above(0);
          expect(timezone.label).to.have.length.above(0);
        });
      });
    });

    describe('isISODate', function() {
      it('returns false for null',function(){
        expect(datetimeWrapper.isISODate(null)).is.false;
      });

      it('returns false for empty string',function(){
        expect(datetimeWrapper.isISODate('')).is.false;
      });

      it('returns false for invalid date',function(){
        expect(datetimeWrapper.isISODate('Junk')).is.false;
      });

      it('return false for valid but non-ISO (i.e., timezone-naive) date',function(){
        expect(datetimeWrapper.isISODate(new Date().toISOString().slice(0,-5))).is.false;
      });

      it('returns true for valid non-Zulu ISO date',function(){
        expect(datetimeWrapper.isISODate(testMoment().parseZone().format())).is.true;
      });

      it('returns true for valid Zulu ISO date',function(){
        expect(datetimeWrapper.isISODate(new Date().toISOString())).is.true;
      });
    });

    describe('isValidDate', function() {

      it('returns false for null',function(){
        expect(datetimeWrapper.isValidDate(null)).is.false;
      });
      it('returns false for empty string',function(){
        expect(datetimeWrapper.isValidDate('')).is.false;
      });
      it('returns false for invalid date',function(){
        expect(datetimeWrapper.isValidDate('Junk')).is.false;
      });
      it('returns true for a valid date',function(){
        expect(datetimeWrapper.isValidDate(new Date().toISOString())).is.true;
      });
    });

    describe('parseAndApplyTimezone', function() {
      var euroFormat = 'DD-MM-YYYY hh:mm a';
      it('should yield a UTC time offset five hours later when non-DST and given `US/Eastern` timezone', function() {
        var res = datetimeWrapper.parseAndApplyTimezone('31-12-2013 06:32 p.m.', euroFormat, 'US/Eastern').toISOString();
        expect(res).to.equal('2013-12-31T23:32:00.000Z');
      });

      it('should yield a UTC time offset four hours later when DST and given `US/Eastern` timezone', function() {
        var res = datetimeWrapper.parseAndApplyTimezone('30-06-2014 07:32 p.m.', euroFormat, 'US/Eastern').toISOString();
        expect(res).to.equal('2014-06-30T23:32:00.000Z');
      });

      it('should assume UTC time when no timezone provided', function() {
        var res = datetimeWrapper.parseAndApplyTimezone('30-06-2014 07:32 p.m.', euroFormat).toISOString();
        expect(res).to.equal('2014-06-30T19:32:00.000Z');
      });
    });

    describe('utcDateString', function() {
      /*
       * http://en.wikipedia.org/wiki/Iso8601#Time_offsets_from_UTC
       */
      it('returns a string',function(){

        var utcString = datetimeWrapper.utcDateString();
        expect(utcString).is.a.String;
      });

      it('returns a valid date',function(){

        var utcString = datetimeWrapper.utcDateString();
        expect(testMoment(utcString).isValid()).is.true;

      });
      it('has the offset from UTC or is Zulu time',function(){

        var utcString = datetimeWrapper.utcDateString();

        expect(datetimeWrapper.isISODate(utcString)).to.be.true;

      });
      it('does not contain the `Z` designator for the zero UTC offset',function(){

        var utcString = datetimeWrapper.utcDateString();

        expect(utcString).to.not.contain('Z');
        expect(utcString).to.not.contain('z');

      });
    });

  });
});
