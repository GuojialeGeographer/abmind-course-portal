#!/usr/bin/env node

const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

class UptimeMonitor {
  constructor() {
    this.urls = [
      'https://abmind-course-portal.vercel.app',
      'https://your-username.github.io/abmind-course-portal'
    ];
    this.timeout = 10000; // 10 seconds
    this.logFile = path.join(__dirname, '../logs/uptime.log');
    this.statusFile = path.join(__dirname, '../logs/status.json');
    
    // Ensure logs directory exists
    const logsDir = path.dirname(this.logFile);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    
    console.log(logEntry);
    
    // Append to log file
    fs.appendFileSync(this.logFile, logEntry + '\n');
  }

  async checkUrl(url) {
    return new Promise((resolve) => {
      try {
        const urlObj = new URL(url);
        const client = urlObj.protocol === 'https:' ? https : http;
        const startTime = Date.now();
        
        const req = client.request({
          hostname: urlObj.hostname,
          port: urlObj.port,
          path: urlObj.pathname + urlObj.search,
          method: 'GET',
          timeout: this.timeout,
          headers: {
            'User-Agent': 'ABMind-Uptime-Monitor/1.0'
          }
        }, (res) => {
          const responseTime = Date.now() - startTime;
          const isUp = res.statusCode >= 200 && res.statusCode < 400;
          
          resolve({
            url,
            status: res.statusCode,
            responseTime,
            isUp,
            error: null
          });
        });

        req.on('error', (error) => {
          const responseTime = Date.now() - startTime;
          resolve({
            url,
            status: null,
            responseTime,
            isUp: false,
            error: error.message
          });
        });

        req.on('timeout', () => {
          req.destroy();
          const responseTime = Date.now() - startTime;
          resolve({
            url,
            status: null,
            responseTime,
            isUp: false,
            error: 'Request timeout'
          });
        });

        req.end();
      } catch (error) {
        resolve({
          url,
          status: null,
          responseTime: 0,
          isUp: false,
          error: error.message
        });
      }
    });
  }

  async checkAllUrls() {
    this.log('Starting uptime check...');
    
    const results = await Promise.all(
      this.urls.map(url => this.checkUrl(url))
    );
    
    const timestamp = new Date().toISOString();
    const summary = {
      timestamp,
      results,
      totalChecked: results.length,
      upCount: results.filter(r => r.isUp).length,
      downCount: results.filter(r => !r.isUp).length
    };
    
    // Log results
    results.forEach(result => {
      const status = result.isUp ? '✅ UP' : '❌ DOWN';
      const responseTime = result.responseTime ? `${result.responseTime}ms` : 'N/A';
      const error = result.error ? ` (${result.error})` : '';
      
      this.log(`${status} ${result.url} - ${responseTime}${error}`);
    });
    
    // Save status to file
    this.saveStatus(summary);
    
    return summary;
  }

  saveStatus(summary) {
    try {
      // Load existing status history
      let statusHistory = [];
      if (fs.existsSync(this.statusFile)) {
        const existingData = fs.readFileSync(this.statusFile, 'utf8');
        statusHistory = JSON.parse(existingData);
      }
      
      // Add current status
      statusHistory.push(summary);
      
      // Keep only last 100 entries
      if (statusHistory.length > 100) {
        statusHistory = statusHistory.slice(-100);
      }
      
      // Save updated history
      fs.writeFileSync(this.statusFile, JSON.stringify(statusHistory, null, 2));
    } catch (error) {
      this.log(`Error saving status: ${error.message}`, 'error');
    }
  }

  generateReport() {
    try {
      if (!fs.existsSync(this.statusFile)) {
        this.log('No status data available for report');
        return;
      }
      
      const statusHistory = JSON.parse(fs.readFileSync(this.statusFile, 'utf8'));
      
      if (statusHistory.length === 0) {
        this.log('No status history available');
        return;
      }
      
      this.log('=== UPTIME REPORT ===');
      
      // Calculate uptime percentage for each URL
      const urlStats = {};
      
      statusHistory.forEach(entry => {
        entry.results.forEach(result => {
          if (!urlStats[result.url]) {
            urlStats[result.url] = { total: 0, up: 0, responseTimes: [] };
          }
          
          urlStats[result.url].total++;
          if (result.isUp) {
            urlStats[result.url].up++;
          }
          if (result.responseTime) {
            urlStats[result.url].responseTimes.push(result.responseTime);
          }
        });
      });
      
      Object.entries(urlStats).forEach(([url, stats]) => {
        const uptime = ((stats.up / stats.total) * 100).toFixed(2);
        const avgResponseTime = stats.responseTimes.length > 0 
          ? (stats.responseTimes.reduce((a, b) => a + b, 0) / stats.responseTimes.length).toFixed(0)
          : 'N/A';
        
        this.log(`${url}:`);
        this.log(`  Uptime: ${uptime}% (${stats.up}/${stats.total} checks)`);
        this.log(`  Avg Response Time: ${avgResponseTime}ms`);
      });
      
      // Recent status
      const latest = statusHistory[statusHistory.length - 1];
      this.log(`\nLast Check: ${latest.timestamp}`);
      this.log(`Status: ${latest.upCount}/${latest.totalChecked} services up`);
      
    } catch (error) {
      this.log(`Error generating report: ${error.message}`, 'error');
    }
  }

  async runContinuous(intervalMinutes = 5) {
    this.log(`Starting continuous monitoring (every ${intervalMinutes} minutes)...`);
    
    const runCheck = async () => {
      try {
        const summary = await this.checkAllUrls();
        
        // Alert if any services are down
        if (summary.downCount > 0) {
          this.log(`🚨 ALERT: ${summary.downCount} service(s) are down!`, 'error');
          // In a real setup, this would send notifications
        }
      } catch (error) {
        this.log(`Monitoring error: ${error.message}`, 'error');
      }
    };
    
    // Run initial check
    await runCheck();
    
    // Schedule recurring checks
    setInterval(runCheck, intervalMinutes * 60 * 1000);
  }

  async run() {
    const command = process.argv[2] || 'check';
    
    switch (command) {
      case 'check':
        await this.checkAllUrls();
        break;
      case 'report':
        this.generateReport();
        break;
      case 'monitor':
        const interval = parseInt(process.argv[3]) || 5;
        await this.runContinuous(interval);
        break;
      default:
        console.log('Usage: node monitor.js <command>');
        console.log('Commands:');
        console.log('  check   - Run a single uptime check');
        console.log('  report  - Generate uptime report');
        console.log('  monitor [minutes] - Run continuous monitoring (default: 5 minutes)');
        process.exit(1);
    }
  }
}

// Run monitor if called directly
if (require.main === module) {
  const monitor = new UptimeMonitor();
  monitor.run().catch(error => {
    console.error('Monitor failed:', error);
    process.exit(1);
  });
}

module.exports = UptimeMonitor;