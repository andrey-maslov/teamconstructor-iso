'use strict';

module.exports = {
    plugins: [
        'scss',
        {
            name: "typescript",
            options: {
                useBabel: true,
                useEslint: true,
                forkTsChecker: {
                    tsconfig: "./tsconfig.json",
                    tslint: undefined,
                    watch: "./src",
                    typeCheck: true,
                },
            },
        },
    ]
};