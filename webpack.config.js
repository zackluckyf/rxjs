module.exports = {
    entry: "./main.ts",
    output: {
        filename: "app.js"
    },
    resolve: {
        extenstions: ['', '.ts', '.js']
    },
    module: {
        loaders: [{
            test: /.ts$/,
            loader: "ts-loader"
        }]
    }
};
