/*
 * Grunt Warn Logging
 * https://github.com/thekillerdev/grunt-warn-logging/
 *
 * Copyright (c) 2015 Mauricio Vargas
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  "use strict";

  var task = require("./lib/warnlogging").init(grunt);

  grunt.registerMultiTask("warnlogging", "Lets find and Warn any console logging", function() {
    var opts = this.options();

    var statementCount = 0, fileCount = 0;

    var process = function(srcFile) {
      var result = task(grunt.file.read(srcFile), opts);
      statementCount += result.count;
      fileCount++;
      if (opts.verbose) {
        grunt.log.writeln("Removed " + result.count + " logging statements from " + srcFile);
        grunt.fail.warn('There is ' + result.count + " console.logs on " + srcFile);
      }
      return result;
    };

    this.files.forEach(function(f) {
      if(typeof f.dest === "undefined") {
        f.src.forEach(function(srcFile) {
          var result = process(srcFile);
          grunt.file.write(srcFile, result.src);
        });
      } else {
        var ret = f.src.map(function(srcFile) {
          if(grunt.file.isFile(srcFile)){
            return process(srcFile).src;
          } else {
            grunt.log.error("File not found " + srcFile);
          }
        }).join("");

        if(ret) {
          grunt.file.write(f.dest, ret);
        }
      }
    });

    if (!opts.verbose) {
      grunt.log.writeln("Checked " + fileCount + " files, removed " + statementCount + " logging statements");
    }
  });
};
