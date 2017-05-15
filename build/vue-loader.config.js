module.exports = {
    preserveWhitespace: false,

    postcss: [
        require('autoprefixer')({
            browsers: [
                'Android >= 4',
                'Chrome >= 35',
                'Firefox >= 31',
                'iOS >= 7',
                'Opera >= 12',
                'Safari >= 7.1'
            ]
        })
    ]
}