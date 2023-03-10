(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.LunarPhase = {}));
  })(this, (function (exports) { 'use strict';
  
    /**
     * Earth's hemispheres.
     *
     * @typedef {string} Hemisphere
     * @enum {Hemisphere}
     */
    const Hemisphere = {
      NORTHERN: "Northern",
      SOUTHERN: "Southern",
    };
  
    /**
     * Enumeration of lunar phases as emoji
     *
     * @typedef {string} LunarEmoji
     */
    const LunarEmoji = {
      /**
       * Enumeration of lunar phases as emoji for the Northern Hemisphere.
       * @num {LunarPhase}
       */
      NorthernHemisphere: {
        NEW: "🌑",
        WAXING_CRESCENT: "🌒",
        FIRST_QUARTER: "🌓",
        WAXING_GIBBOUS: "🌔",
        FULL: "🌕",
        WANING_GIBBOUS: "🌖",
        LAST_QUARTER: "🌗",
        WANING_CRESCENT: "🌘",
      },
  
      /**
       * Enumeration of lunar phases as emoji for the Southern Hemisphere.
       * @num {LunarPhase}
       */
      SouthernHemisphere: {
        NEW: "🌑",
        WAXING_CRESCENT: "🌘",
        FIRST_QUARTER: "🌗",
        WAXING_GIBBOUS: "🌖",
        FULL: "🌕",
        WANING_GIBBOUS: "🌔",
        LAST_QUARTER: "🌓",
        WANING_CRESCENT: "🌒",
      },
    };
  
    /**
     * Lunar month, time between two successive syzygies of the
     * same type: new moons or full moons
     *
     * @typedef {string} LunarMonth
     * @enum {LunarMonth}
     */
    const LunarMonth = {
      ANOMALISTIC: "Anomalistic",
      DRACONIC: "Draconic",
      SIDEREAL: "Sidereal",
      SYNODIC: "Synodic",
      TROPICAL: "Tropical",
    };
  
    /**
     * Enumeration of lunar phases
     *
     * @typedef {string} LunarPhase
     * @enum {LunarPhase}
     */
    const LunarPhase = {
      NEW: "New",
      WAXING_CRESCENT: "Waxing Crescent",
      FIRST_QUARTER: "First Quarter",
      WAXING_GIBBOUS: "Waxing Gibbous",
      FULL: "Full",
      WANING_GIBBOUS: "Waning Gibbous",
      LAST_QUARTER: "Last Quarter",
      WANING_CRESCENT: "Waning Crescent",
    };
  
    /**
     * Units of measure
     *
     * @typedef {string} Unit
     * @enum {Unit}
     */
    const Unit = {
      EARTH_RADII: "Earth Radii",
      KILOMETERS: "km",
      MILES: "m",
    };
  
    /**
     * Timestamp epoch, January 1, 1970, in Julian Days.
     * @type {number}
     */
    const EPOCH = 2440587.5;
  
    /**
     * Lunation 1 as the first new moon of 1923 at approximately
     * 02:41 UTC, January 17, 1923 per Ernest William Brown's lunar theory.
     * @type {number}
     */
    const LUNATION_BASE_JULIAN_DAY = 2423436.6115277777;
  
    /**
     * Length of one phase (1/8 of a synodic month) in Earth days.
     * @type {number}
     */
    const PHASE_LENGTH = 3.69132346322;
  
    /**
     * Orbital period of the Moon from perigee to apogee and back to perigee
     * @type {number}
     */
    const ANOMALISTIC_MONTH = 27.55454988;
  
    /**
     * Length of one synodic month - lunation, or days for the phases to complete a cycle.
     * Time between two identical syzygies, equivalent of 29.53059 Earth days.
     *
     * Based on Mean Synodic Month, 2000 AD mean solar days.
     * @type {number}
     */
    const SYNODIC_MONTH = 29.53058770576;
  
    var Time = /*#__PURE__*/Object.freeze({
      __proto__: null,
      EPOCH: EPOCH,
      LUNATION_BASE_JULIAN_DAY: LUNATION_BASE_JULIAN_DAY,
      PHASE_LENGTH: PHASE_LENGTH,
      ANOMALISTIC_MONTH: ANOMALISTIC_MONTH,
      SYNODIC_MONTH: SYNODIC_MONTH
    });
  
    /**
     * Normalization utility for percentage calculations.
     *
     * @param {number} value Percent value.
     * @returns {number} Normalized value
     */
    const normalize = (value) => {
      value -= Math.floor(value);
      if (value < 0) {
        value += 1;
      }
  
      return value;
    };
  
    /**
     * Julian day from Gregorian date.
     * @param {Date} date Gregorian date to convert to Julian day.
     * @returns {number} Julian Day
     */
    const fromDate = (date = new Date()) => {
      const time = date.getTime();
      return time / 86400000 - date.getTimezoneOffset() / 1440 + EPOCH;
    };
  
    /**
     * Gregorian date from Julian day
     * @param {number} julian Julian dat to convert to Gregorian date
     * @returns {Date} Gregorian date
     */
    const toDate = (julian) => {
      let date = new Date();
      date.setTime((julian - EPOCH + date.getTimezoneOffset() / 1440) * 86400000);
      return date;
    };
  
    var JulianDay = /*#__PURE__*/Object.freeze({
      __proto__: null,
      fromDate: fromDate,
      toDate: toDate
    });
  
    /**
     * Moon's age, or Earth days since the last new moon.
     *
     * @param {Date} date Date used for calculation.
     * @returns {number} Age of the moon, normalized within a 29.53059 Earth days calendar.
     */
    const lunarAge = (date = new Date()) => {
      const percent = lunarAgePercent(date);
      return percent * SYNODIC_MONTH;
    };
  
    /**
     * Percentage through the lunar synodic month.
     *
     * @param {Date} date Date used for calculation.
     * @returns {number} Percentage through the lunar month.
     */
    const lunarAgePercent = (date = new Date()) => {
      return normalize((fromDate(date) - 2451550.1) / SYNODIC_MONTH);
    };
  
    /**
     * Brown Lunation Number (BLN), per Ernest William Brown's lunar theory,
     * defining Lunation 1 as the first new moon of 1923 at
     * approximately 02:41 UTC, January 17, 1923.
     *
     * @param {Date} date Date used for calculation.
     * @returns {number} Lunation Number
     */
    const lunationNumber = (date = new Date()) => {
      return Math.round((fromDate(date) - LUNATION_BASE_JULIAN_DAY) / SYNODIC_MONTH) + 1;
    };
  
    /**
     * Distance to the moon measured in units of Earth radii, with
     * perigee at 56 and apogee at 63.8.
     *
     * @param {Date} date Date used for calculation
     * @returns {number} Distance to the moon in Earth radii
     */
    const lunarDistance = (date = new Date()) => {
      const julian = fromDate(date);
      const agePercent = lunarAgePercent(date);
      const radians = agePercent * 2 * Math.PI;
      const percent = 2 * Math.PI * normalize((julian - 2451562.2) / ANOMALISTIC_MONTH);
  
      return 60.4 - 3.3 * Math.cos(percent) - 0.6 * Math.cos(2 * radians - percent) - 0.5 * Math.cos(2 * radians);
    };
  
    /**
     * Name of the lunar phase per date submitted.
     *
     * @param {Date} date Date used to calculate lunar phase.
     * @returns {string} Name as string of the current lunar phase.
     */
    const lunarPhase = (date = new Date()) => {
      const age = lunarAge(date);
  
      if (age < 1.84566173161) return LunarPhase.NEW;
      else if (age < 5.53698519483) return LunarPhase.WAXING_CRESCENT;
      else if (age < 9.22830865805) return LunarPhase.FIRST_QUARTER;
      else if (age < 12.91963212127) return LunarPhase.WAXING_GIBBOUS;
      else if (age < 16.61095558449) return LunarPhase.FULL;
      else if (age < 20.30227904771) return LunarPhase.WANING_GIBBOUS;
      else if (age < 23.99360251093) return LunarPhase.LAST_QUARTER;
      else if (age < 27.68492597415) return LunarPhase.WANING_CRESCENT;
  
      return LunarPhase.NEW;
    };
  
    /**
     * Emoji of the lunar phase per date submitted.
     *
     * @param {Date} date Date used to calculate lunar phase.
     * @param {Hemisphere} hemisphere Northern or Southern Hemisphere.
     * @returns Emoji of the current lunar phase.
     */
    const lunarPhaseEmoji = (date = new Date(), hemisphere = Hemisphere.NORTHERN) => {
      const phase = lunarPhase(date);
  
      return emojiForLunarPhase(phase, hemisphere);
    };
  
    /**
     * Emoji for specified lunar phase.
     *
     * @param {LunarPhase} phase Lunar phase, per the LunarPhase enum
     * @param {Hemisphere} hemisphere Northern or Southern Hemisphere.
     * @returns {string} Emoji of the current lunar phase.
     */
    const emojiForLunarPhase = (phase, hemisphere = Hemisphere.NORTHERN) => {
      let emoji;
  
      if (hemisphere === Hemisphere.SOUTHERN) {
        emoji = LunarEmoji.SouthernHemisphere;
      } else {
        emoji = LunarEmoji.NorthernHemisphere;
      }
  
      switch (phase) {
        case LunarPhase.WANING_CRESCENT:
          return emoji["WANING_CRESCENT"];
        case LunarPhase.LAST_QUARTER:
          return emoji["LAST_QUARTER"];
        case LunarPhase.WANING_GIBBOUS:
          return emoji["WANING_GIBBOUS"];
        case LunarPhase.FULL:
          return emoji["FULL"];
        case LunarPhase.WAXING_GIBBOUS:
          return emoji["WAXING_GIBBOUS"];
        case LunarPhase.FIRST_QUARTER:
          return emoji["FIRST_QUARTER"];
        case LunarPhase.WAXING_CRESCENT:
          return emoji["WAXING_CRESCENT"];
  
        default:
        case LunarPhase.NEW:
          return emoji["NEW"];
      }
    };
  
    /**
     * Whether the moon is currently waxing (growing).
     *
     * @param {Date} date Date used for calculation.
     * @returns {boolean} True if moon is waxing.
     */
    const isWaxing = (date = new Date()) => {
      const age = lunarAge(date);
      return age <= 14.765;
    };
  
    /**
     * Whether the moon is currently waning (shrinking).
     *
     * @param {Date} date Date used for calculation.
     * @returns {boolean} True if moon is waning.
     */
    const isWaning = (date = new Date()) => {
      const age = lunarAge(date);
      return age > 14.765;
    };
  
    var Moon = /*#__PURE__*/Object.freeze({
      __proto__: null,
      lunarAge: lunarAge,
      lunarAgePercent: lunarAgePercent,
      lunationNumber: lunationNumber,
      lunarDistance: lunarDistance,
      lunarPhase: lunarPhase,
      lunarPhaseEmoji: lunarPhaseEmoji,
      emojiForLunarPhase: emojiForLunarPhase,
      isWaxing: isWaxing,
      isWaning: isWaning
    });
  
    exports.Hemisphere = Hemisphere;
    exports.JulianDay = JulianDay;
    exports.LunarEmoji = LunarEmoji;
    exports.LunarMonth = LunarMonth;
    exports.LunarPhase = LunarPhase;
    exports.Moon = Moon;
    exports.Time = Time;
    exports.Unit = Unit;
  
    Object.defineProperty(exports, '__esModule', { value: true });
  
  }));
  //# sourceMappingURL=lunarphase-js..js.map
  