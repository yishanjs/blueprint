/**
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 */

const { createKarmaConfig } = require("@yishanzhilubp/karma-build-scripts");
const fs = require("fs");
const path = require("path");

module.exports = function(config) {
    const baseConfig = createKarmaConfig({
        // TODO: fix coverage error https://github.com/SitePen/remap-istanbul/issues/96
        dirname: __dirname,
        coverageExcludes: [
            // not worth full coverage
            "src/accessibility/*",
            "src/common/abstractComponent*",
            "src/common/abstractPureComponent*",
        ],
    });
    config.set(baseConfig);
    config.set({
        // overrides here
    });
};
