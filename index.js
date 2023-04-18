const crypto = require('crypto');
const { exec } = require('child_process');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const { createProxyMiddleware } = require('http-proxy-middleware');
app.use(
    '*',
    createProxyMiddleware({
        target: 'http://localhost:26659/',
        changeOrigin: true,
        pathfilter: function (path, req) {
            return path.match('^/submit_pfb') || path.match('^/namespaced_shares/*');
        }
    })
);

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});