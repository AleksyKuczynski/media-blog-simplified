// simple-html-exporter.js - No Puppeteer Required
const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');
const { JSDOM } = require('jsdom');

// Install with: pnpm add node-fetch jsdom

const SITE_URL = 'http://localhost:3000';
const OUTPUT_DIR = './html-export-simple';

// Known routes from your project structure
const ROUTES_TO_EXPORT = [
  '/ru',
  '/ru/articles', 
  '/ru/search',
  '/ru/rubrics',
  '/ru/authors',
  // Add specific article/author/rubric URLs you want to test
  '/ru/search?search=test',
];

class SimpleHTMLExporter {
  constructor() {
    this.exportedPages = [];
    this.seoAnalysis = [];
  }

  async init() {
    console.log('🚀 Starting simple HTML export...');
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  }

  async fetchPage(route) {
    const url = `${SITE_URL}${route}`;
    console.log(`📄 Fetching: ${url}`);
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEOBot/1.0; +http://localhost:3000/bot)'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const html = await response.text();
      
      // Basic SEO analysis with JSDOM
      const seoData = this.analyzeHTML(html, url);
      
      // Save HTML file
      const filename = this.routeToFilename(route);
      const filepath = path.join(OUTPUT_DIR, filename);
      await fs.writeFile(filepath, html, 'utf8');
      
      this.exportedPages.push({ route, filename, url });
      this.seoAnalysis.push({ url, filename, ...seoData });
      
      console.log(`✅ Saved: ${filename}`);
      
      // Small delay to be respectful
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(`❌ Error fetching ${url}:`, error.message);
    }
  }

  analyzeHTML(html, url) {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    const analysis = {
      title: document.title || '',
      metaDescription: '',
      h1Count: document.querySelectorAll('h1').length,
      h1Text: '',
      h2Count: document.querySelectorAll('h2').length,
      images: document.querySelectorAll('img').length,
      imagesWithoutAlt: 0,
      internalLinks: 0,
      externalLinks: 0,
      hasStructuredData: document.querySelectorAll('script[type="application/ld+json"]').length > 0,
      wordCount: 0,
      issues: []
    };

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    analysis.metaDescription = metaDesc ? metaDesc.getAttribute('content') || '' : '';

    // H1 text
    const h1 = document.querySelector('h1');
    analysis.h1Text = h1 ? h1.textContent.trim() : '';

    // Images without alt
    document.querySelectorAll('img').forEach(img => {
      if (!img.getAttribute('alt')) {
        analysis.imagesWithoutAlt++;
      }
    });

    // Links analysis
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (href.startsWith('/') || href.includes('localhost:3000')) {
        analysis.internalLinks++;
      } else if (href.startsWith('http')) {
        analysis.externalLinks++;
      }
    });

    // Word count (approximate)
    const textContent = document.body ? document.body.textContent || '' : '';
    analysis.wordCount = textContent.trim().split(/\s+/).filter(word => word.length > 0).length;

    // SEO Issues Detection
    if (!analysis.title) analysis.issues.push('Missing title tag');
    if (!analysis.metaDescription) analysis.issues.push('Missing meta description');
    if (analysis.title && analysis.title.length > 60) analysis.issues.push(`Title too long (${analysis.title.length} chars)`);
    if (analysis.metaDescription && analysis.metaDescription.length > 160) analysis.issues.push(`Meta description too long (${analysis.metaDescription.length} chars)`);
    if (analysis.h1Count === 0) analysis.issues.push('Missing H1 tag');
    if (analysis.h1Count > 1) analysis.issues.push(`Multiple H1 tags (${analysis.h1Count})`);
    if (analysis.imagesWithoutAlt > 0) analysis.issues.push(`${analysis.imagesWithoutAlt} images missing alt text`);

    return analysis;
  }

  routeToFilename(route) {
    let filename = route.replace(/\//g, '_');
    filename = filename.replace(/[^a-zA-Z0-9_-]/g, '_');
    filename = filename || 'homepage';
    filename = filename.replace(/^_/, ''); // Remove leading underscore
    return `${filename}.html`;
  }

  async generateReport() {
    console.log('📊 Generating SEO Report...');
    
    // Generate readable report
    let report = `# SEO Analysis Report - Local Development\n\n`;
    report += `**Generated:** ${new Date().toISOString()}\n`;
    report += `**Site:** ${SITE_URL}\n`;
    report += `**Total Pages:** ${this.seoAnalysis.length}\n\n`;
    
    // Summary statistics
    const totalIssues = this.seoAnalysis.reduce((sum, page) => sum + page.issues.length, 0);
    const avgWordCount = Math.round(
      this.seoAnalysis.reduce((sum, page) => sum + page.wordCount, 0) / this.seoAnalysis.length
    );
    const pagesWithStructuredData = this.seoAnalysis.filter(page => page.hasStructuredData).length;
    
    report += `## Summary\n\n`;
    report += `- **Total SEO Issues:** ${totalIssues}\n`;
    report += `- **Average Word Count:** ${avgWordCount}\n`;
    report += `- **Pages with Structured Data:** ${pagesWithStructuredData}/${this.seoAnalysis.length}\n\n`;
    
    // Common issues
    const issueCount = {};
    this.seoAnalysis.forEach(page => {
      page.issues.forEach(issue => {
        issueCount[issue] = (issueCount[issue] || 0) + 1;
      });
    });
    
    if (Object.keys(issueCount).length > 0) {
      report += `## Common Issues\n\n`;
      Object.entries(issueCount)
        .sort(([,a], [,b]) => b - a)
        .forEach(([issue, count]) => {
          report += `- **${issue}:** ${count} pages\n`;
        });
      report += `\n`;
    }
    
    // Page details
    report += `## Page Analysis\n\n`;
    this.seoAnalysis.forEach(page => {
      report += `### ${page.title || 'Untitled Page'}\n`;
      report += `- **URL:** ${page.url}\n`;
      report += `- **File:** ${page.filename}\n`;
      report += `- **H1:** ${page.h1Text || 'Missing'}\n`;
      report += `- **Meta Description:** ${page.metaDescription || 'Missing'} (${page.metaDescription.length} chars)\n`;
      report += `- **Word Count:** ${page.wordCount}\n`;
      report += `- **Images:** ${page.images} (${page.imagesWithoutAlt} without alt)\n`;
      report += `- **Internal Links:** ${page.internalLinks}\n`;
      report += `- **Structured Data:** ${page.hasStructuredData ? '✅ Yes' : '❌ No'}\n`;
      
      if (page.issues.length > 0) {
        report += `- **Issues:** ${page.issues.join(', ')}\n`;
      } else {
        report += `- **Issues:** None ✅\n`;
      }
      report += `\n`;
    });
    
    // Save reports
    await fs.writeFile(path.join(OUTPUT_DIR, 'SEO_ANALYSIS_REPORT.md'), report);
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'seo-analysis-data.json'), 
      JSON.stringify(this.seoAnalysis, null, 2)
    );
    
    console.log('✅ Reports generated!');
  }

  async run() {
    try {
      await this.init();
      
      // Export all known routes
      for (const route of ROUTES_TO_EXPORT) {
        await this.fetchPage(route);
      }
      
      await this.generateReport();
      
      console.log(`\n🎉 Export Complete!`);
      console.log(`📁 Files saved to: ${OUTPUT_DIR}`);
      console.log(`📊 Pages exported: ${this.exportedPages.length}`);
      console.log(`📋 Total SEO issues: ${this.seoAnalysis.reduce((sum, page) => sum + page.issues.length, 0)}`);
      
    } catch (error) {
      console.error('💥 Export failed:', error);
    }
  }
}

// Run the exporter
if (require.main === module) {
  const exporter = new SimpleHTMLExporter();
  exporter.run().catch(console.error);
}

module.exports = SimpleHTMLExporter;