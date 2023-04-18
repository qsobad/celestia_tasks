const crypto = require('crypto');
const { exec } = require('child_process');
const express = require('express');
const app = express();

app.use(express.static('public'));

const { createProxyMiddleware } = require('http-proxy-middleware');
app.use(
    '/',
    createProxyMiddleware({
        target: 'http://127.0.0.1:26659/',
        changeOrigin: true,
        pathFilter: "**",
        connection:'keep-alive',
        logger: console,
        secure: false,

        onProxyReq : (proxyReq, req, res) => {
            console.log(req)
            if ((req.method == "POST" ||req.method == "PUT")  && req.body) {
                let body = req.body;
                let newBody = '';
                delete req.body;

                try {
                    newBody = JSON.stringify(body);
                    proxyReq.setHeader( 'content-length', Buffer.byteLength(newBody, 'utf8'));
                    proxyReq.write( newBody );
                    proxyReq.end();
                } catch (e) {
                    console.log('Stringify err', e)
                }
            }
        }
    })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
