// site-html-exporter.js - Comprehensive HTML Export for SEO Analysis
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// =====================================================
// CONFIGURATION - Update these for your site
// =====================================================
const SITE_URL = 'http://localhost:3000'; // Updated for local development
const OUTPUT_DIR = './html-export';
const MAX_PAGES = 100; // Safety limit
const DELAY_MS = 500; // Reduced delay for localhost

// Pages to crawl - based on your /ru/ route structure
const STATIC_PAGES = [
  '/ru',
  '/ru/articles', 
  '/ru/search',
  '/ru/rubrics',
  '/ru/authors'
];

// =====================================================
// CRAWLER IMPLEMENTATION
// =====================================================
class SiteHTMLExporter {
  constructor() {
    this.browser = null;
    this.crawledUrls = new Set();
    this.foundUrls = new Set(STATIC_PAGES.map(page => SITE_URL + page));
    this.seoAnalysis = {
      pages: [],
      issues: [],
      summary: {}
    };
  }

  async init() {
    console.log('🚀 Initializing HTML Export...');
    
    // Create output directory
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    // Launch browser with WSL-friendly options
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process', // This helps with WSL
        '--disable-gpu'
      ]
    });
    
    console.log('✅ Browser launched successfully');
  }

  async discoverUrls() {
    console.log('🔍 Discovering URLs from your Directus content...');
    
    // You can expand this to call your Directus API directly
    // For now, we'll discover URLs by crawling
    const page = await this.browser.newPage();
    
    try {
      await page.goto(`${SITE_URL}/ru`, { waitUntil: 'networkidle0' });
      
      // Extract article links
      const articleLinks = await page.evaluate(() => {
        const links = [];
        document.querySelectorAll('a[href*="/ru/"]').forEach(link => {
          const href = link.getAttribute('href');
          if (href && !href.includes('javascript:') && !href.includes('mailto:')) {
            links.push(href.startsWith('/') ? window.location.origin + href : href);
          }
        });
        return [...new Set(links)];
      });
      
      articleLinks.forEach(url => this.foundUrls.add(url));
      console.log(`📋 Found ${this.foundUrls.size} URLs to crawl`);
      
    } catch (error) {
      console.warn('⚠️  Could not discover URLs from homepage:', error.message);
    } finally {
      await page.close();
    }
  }

  async crawlPage(url) {
    if (this.crawledUrls.has(url) || this.crawledUrls.size >= MAX_PAGES) {
      return;
    }

    console.log(`📄 Crawling: ${url}`);
    
    const page = await this.browser.newPage();
    
    try {
      // Configure page for better crawling
      await page.setUserAgent('Mozilla/5.0 (compatible; SEOBot/1.0; +http://example.com/bot)');
      await page.setViewport({ width: 1920, height: 1080 });
      
      // Navigate and wait for content
      await page.goto(url, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });

      // Wait for React hydration and Next.js content - improved version
      try {
        await page.waitForFunction(() => {
          // Check multiple indicators that the page is ready
          const hasContent = document.body && document.body.innerHTML.length > 1000;
          const hasReactElements = document.querySelectorAll('[class*="tw-"], article, section').length > 0;
          const hasHeadings = document.querySelectorAll('h1, h2, h3').length > 0;
          const notLoading = !document.querySelector('[class*="loading"], [class*="skeleton"]');
          
          return hasContent && hasReactElements && hasHeadings && notLoading;
        }, { timeout: 15000 });
        
        // Extra wait for any final rendering
        await new Promise(resolve => setTimeout(resolve, 1500));
        
      } catch (waitError) {
        console.warn(`⚠️  Timeout waiting for full render of ${url}, proceeding anyway`);
        // Give it a basic wait and continue
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      // Get the fully rendered HTML
      const html = await page.content();
      
      // Analyze SEO elements
      const seoData = await this.analyzePage(page, url);
      
      // Save HTML file
      const filename = this.urlToFilename(url);
      const filepath = path.join(OUTPUT_DIR, filename);
      await fs.writeFile(filepath, html, 'utf8');
      
      // Save SEO analysis
      this.seoAnalysis.pages.push({
        url,
        filename,
        ...seoData
      });
      
      this.crawledUrls.add(url);
      console.log(`✅ Saved: ${filename}`);
      
      // Discover more URLs from this page
      const newUrls = await page.evaluate((siteUrl) => {
        const links = [];
        document.querySelectorAll('a[href*="/ru/"]').forEach(link => {
          const href = link.getAttribute('href');
          if (href && !href.includes('javascript:') && !href.includes('mailto:')) {
            const fullUrl = href.startsWith('/') ? siteUrl + href : href;
            if (fullUrl.startsWith(siteUrl)) {
              links.push(fullUrl);
            }
          }
        });
        return [...new Set(links)];
      }, SITE_URL);
      
      newUrls.forEach(newUrl => this.foundUrls.add(newUrl));
      
    } catch (error) {
      console.error(`❌ Error crawling ${url}:`, error.message);
      this.seoAnalysis.issues.push({
        url,
        error: error.message,
        type: 'crawl_error'
      });
    } finally {
      await page.close();
      // Respectful delay using Promise-based approach
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }

  async analyzePage(page, url) {
    return await page.evaluate(() => {
      const analysis = {
        title: document.title || '',
        metaDescription: '',
        h1Count: document.querySelectorAll('h1').length,
        h2Count: document.querySelectorAll('h2').length,
        images: document.querySelectorAll('img').length,
        internalLinks: 0,
        externalLinks: 0,
        hasStructuredData: false,
        wordCount: 0,
        issues: []
      };

      // Meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      analysis.metaDescription = metaDesc ? metaDesc.getAttribute('content') || '' : '';

      // Links analysis
      document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (href.startsWith('/') || href.includes(window.location.host)) {
          analysis.internalLinks++;
        } else if (href.startsWith('http')) {
          analysis.externalLinks++;
        }
      });

      // Structured data
      analysis.hasStructuredData = document.querySelectorAll('script[type="application/ld+json"]').length > 0;

      // Word count (approximate)
      const textContent = document.body.textContent || '';
      analysis.wordCount = textContent.trim().split(/\s+/).length;

      // SEO Issues Detection
      if (!analysis.title) analysis.issues.push('Missing title tag');
      if (!analysis.metaDescription) analysis.issues.push('Missing meta description');
      if (analysis.title.length > 60) analysis.issues.push('Title too long (>60 chars)');
      if (analysis.metaDescription.length > 160) analysis.issues.push('Meta description too long (>160 chars)');
      if (analysis.h1Count === 0) analysis.issues.push('Missing H1 tag');
      if (analysis.h1Count > 1) analysis.issues.push('Multiple H1 tags');

      return analysis;
    });
  }

  urlToFilename(url) {
    let filename = url.replace(SITE_URL, '');
    filename = filename.replace(/\//g, '_');
    filename = filename.replace(/[^a-zA-Z0-9_-]/g, '');
    filename = filename || 'homepage';
    return `${filename}.html`;
  }

  async generateReport() {
    console.log('📊 Generating SEO Analysis Report...');
    
    // Calculate summary statistics
    this.seoAnalysis.summary = {
      totalPages: this.seoAnalysis.pages.length,
      totalIssues: this.seoAnalysis.pages.reduce((sum, page) => sum + page.issues.length, 0),
      averageWordCount: Math.round(
        this.seoAnalysis.pages.reduce((sum, page) => sum + page.wordCount, 0) / this.seoAnalysis.pages.length
      ),
      pagesWithStructuredData: this.seoAnalysis.pages.filter(page => page.hasStructuredData).length,
      commonIssues: {}
    };

    // Count common issues
    this.seoAnalysis.pages.forEach(page => {
      page.issues.forEach(issue => {
        this.seoAnalysis.summary.commonIssues[issue] = 
          (this.seoAnalysis.summary.commonIssues[issue] || 0) + 1;
      });
    });

    // Save detailed report
    const reportPath = path.join(OUTPUT_DIR, 'seo-analysis-report.json');
    await fs.writeFile(reportPath, JSON.stringify(this.seoAnalysis, null, 2));
    
    // Generate human-readable report
    const readableReport = this.generateReadableReport();
    const readableReportPath = path.join(OUTPUT_DIR, 'SEO_ANALYSIS_REPORT.md');
    await fs.writeFile(readableReportPath, readableReport);
    
    console.log('✅ SEO Analysis Report saved!');
  }

  generateReadableReport() {
    const { summary, pages, issues } = this.seoAnalysis;
    
    let report = `# SEO Analysis Report\n\n`;
    report += `**Generated:** ${new Date().toISOString()}\n`;
    report += `**Site:** ${SITE_URL}\n\n`;
    
    report += `## Summary Statistics\n\n`;
    report += `- **Total Pages Analyzed:** ${summary.totalPages}\n`;
    report += `- **Total SEO Issues:** ${summary.totalIssues}\n`;
    report += `- **Average Word Count:** ${summary.averageWordCount}\n`;
    report += `- **Pages with Structured Data:** ${summary.pagesWithStructuredData}/${summary.totalPages}\n\n`;
    
    report += `## Common Issues\n\n`;
    Object.entries(summary.commonIssues)
      .sort(([,a], [,b]) => b - a)
      .forEach(([issue, count]) => {
        report += `- **${issue}:** ${count} pages\n`;
      });
    
    report += `\n## Page Details\n\n`;
    pages.forEach(page => {
      report += `### ${page.title || 'Untitled'}\n`;
      report += `- **URL:** ${page.url}\n`;
      report += `- **File:** ${page.filename}\n`;
      report += `- **Word Count:** ${page.wordCount}\n`;
      report += `- **H1 Count:** ${page.h1Count}\n`;
      report += `- **Images:** ${page.images}\n`;
      report += `- **Structured Data:** ${page.hasStructuredData ? '✅' : '❌'}\n`;
      if (page.issues.length > 0) {
        report += `- **Issues:** ${page.issues.join(', ')}\n`;
      }
      report += `\n`;
    });
    
    return report;
  }

  async run() {
    try {
      await this.init();
      await this.discoverUrls();
      
      console.log(`🔄 Starting to crawl ${this.foundUrls.size} URLs...`);
      
      // Crawl all discovered URLs
      for (const url of this.foundUrls) {
        if (this.crawledUrls.size >= MAX_PAGES) {
          console.log(`⚠️  Reached maximum page limit (${MAX_PAGES})`);
          break;
        }
        await this.crawlPage(url);
      }
      
      await this.generateReport();
      
      console.log(`\n🎉 Export Complete!`);
      console.log(`📁 Files saved to: ${OUTPUT_DIR}`);
      console.log(`📊 Pages crawled: ${this.crawledUrls.size}`);
      console.log(`📋 SEO issues found: ${this.seoAnalysis.pages.reduce((sum, page) => sum + page.issues.length, 0)}`);
      
    } catch (error) {
      console.error('💥 Export failed:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// =====================================================
// RUN THE EXPORTER
// =====================================================
if (require.main === module) {
  const exporter = new SiteHTMLExporter();
  exporter.run().catch(console.error);
}

module.exports = SiteHTMLExporter;