import Image from"@11ty/eleventy-img";
import path from "path";
import handlebarsPlugin from "@11ty/eleventy-plugin-handlebars";

export default async function(eleventyConfig) {
  // add plugin for handlebars
  eleventyConfig.addPlugin(handlebarsPlugin);

  // Async Shortcode for Optimized Images
  eleventyConfig.addAsyncShortcode("optimizedImage", async function(src, alt, widths = [300, 600, 900]) {
    let fullSrc = path.join(__dirname, "src", src);
    
    let metadata = await Image(fullSrc, {
      widths: widths,
      formats: ["avif", "webp", "jpeg"],
      outputDir: "./dist/img/",
      urlPath: "/img/"
    });

    let imageAttributes = {
      alt,
      sizes: "(min-width: 30em) 50vw, 100vw",
      loading: "lazy",
      decoding: "async",
    };

    return Image.generateHTML(metadata, imageAttributes);
  });
  
  // Return your configuration object
  return {
    dir: {
      input: "src",          // Source files
      output: "dist",        // Built static site
      includes: "_includes", // Partials and shortcodes (relative to input)
      layouts: "_layouts"    // Layout files (relative to input)
    },
    markdownTemplateEngine: "hbs",
  };
};
