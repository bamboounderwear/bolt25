const Image = require("@11ty/eleventy-img");
const htmlmin = require("html-minifier");
const CleanCSS = require("clean-css");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const { DateTime } = require("luxon");

async function imageShortcode(src, alt, sizes = "100vw") {
  let metadata = await Image(src, {
    widths: [300, 600, 900, 1200],
    formats: ["avif", "webp", "jpeg"],
    outputDir: "./_site/img/"
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async"
  };

  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function(eleventyConfig) {
  // Passthrough copy
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");

  // Date filters
  eleventyConfig.addFilter("dateToISO", (date) => {
    return DateTime.fromJSDate(date).toISO();
  });

  eleventyConfig.addFilter("date", (date, format) => {
    return DateTime.fromJSDate(date).toFormat(format);
  });

  // Add limit filter
  eleventyConfig.addFilter("limit", function(arr, limit) {
    return arr.slice(0, limit);
  });

  // Add markdown filter
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor);

  eleventyConfig.setLibrary("md", markdownLibrary);
  eleventyConfig.addFilter("markdown", (content) => {
    return markdownLibrary.render(content);
  });

  // Image shortcode
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);

  // Minify CSS
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if(outputPath && outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  // Add collections for each language
  eleventyConfig.addCollection("posts_en", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/en/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  eleventyConfig.addCollection("posts_fr", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/fr/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  eleventyConfig.addCollection("projects_en", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/projects/en/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  eleventyConfig.addCollection("projects_fr", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/projects/fr/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  // Add permalink filter
  eleventyConfig.addFilter("generatePermalink", function(page) {
    const locale = page.data.locale || 'en';
    const collection = page.inputPath.includes('/posts/') ? 'blog' : 'projects';
    const slug = page.fileSlug;
    
    if (locale === 'fr') {
      return `/fr/${collection}/${slug}/`;
    }
    return `/${collection}/${slug}/`;
  });

  // Add URL localization filter
  eleventyConfig.addFilter("localizeUrl", function(url, targetLocale) {
    const currentLocale = url.startsWith('/fr/') ? 'fr' : 'en';
    
    if (currentLocale === targetLocale) {
      return url;
    }

    if (targetLocale === 'fr') {
      return `/fr${url}`;
    }
    
    return url.replace('/fr/', '/');
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};