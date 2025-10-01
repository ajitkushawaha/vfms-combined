const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve React app static files
app.use(express.static(__dirname));

// Proxy WordPress requests to WordPress service
app.use('/blog', createProxyMiddleware({
  target: 'https://vfms-blog.onrender.com',
  changeOrigin: true,
  pathRewrite: {
    '^/blog': '', // Remove /blog prefix when forwarding to WordPress
  },
  onProxyReq: (proxyReq, req, res) => {
    // Update the host header
    proxyReq.setHeader('host', 'vfms-blog.onrender.com');
  },
  onProxyRes: (proxyRes, req, res) => {
    // Update any absolute URLs in the response
    let body = '';
    proxyRes.on('data', (chunk) => {
      body += chunk;
    });
    proxyRes.on('end', () => {
      // Replace WordPress URLs with /blog URLs
      body = body.replace(/https:\/\/vfms-blog\.onrender\.com/g, '/blog');
      res.end(body);
    });
  }
}));

// Handle React Router (catch all handler)
app.get('*', (req, res) => {
  // Don't serve React for /blog routes
  if (req.path.startsWith('/blog')) {
    return res.status(404).send('Blog not found');
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`React app: http://localhost:${PORT}`);
  console.log(`WordPress blog: http://localhost:${PORT}/blog`);
});
