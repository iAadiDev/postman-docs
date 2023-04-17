const queries = require('./src/utils/algolia');

// require('dotenv').config({
//   path: `.env.${process.env.GATSBY_ACTIVE_ENV}`,
// });

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const siteUrl = process.env.SITE_URL ? process.env.SITE_URL : 'https://learning.postman.com'

module.exports = {
  siteMetadata: {
    title: 'Postman Learning Center',
    description: '',
    author: 'Postman',
    siteUrl: siteUrl,
  },
  trailingSlash: 'always',
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    {
      resolve: "gatsby-plugin-mdx",
      extensions: [".mdx"],
      options: {
        gatsbyRemarkPlugins: [
          'gatsby-remark-autolink-headers',
          // 'gatsby-remark-check-links',
          'gatsby-remark-responsive-iframe',
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
            },
          },
        ]
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'src',
        path: `${__dirname}/src/`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    // {
    //   resolve: 'gatsby-source-filesystem',
    //   options: {
    //     name: 'src',
    //     path: `${__dirname}/src`,
    //   },
    // },
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
      },
    },
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Postman Learning Center',
        short_name: 'Postman Learning Center',
        start_url: '/',
        background_color: '#FF6C37',
        theme_color: '#FF6C37',
        display: 'minimal-ui',
        icon: 'src/images/favicon.png',
      },
    },
    'gatsby-plugin-meta-redirect',
    'gatsby-plugin-sass',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        excludes: ['/search/']
      }
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: siteUrl,
        sitemap:`${siteUrl}/sitemap/sitemap-index.xml`,
        resolveEnv: () => process.env.GATSBY_ACTIVE_ENV,
        env: {
          development: {
            policy: [{ userAgent: '*', disallow: ['/'] }],
          },
          production: {
            policy: [{ userAgent: '*', allow: '/' }],
          },
        },
      },
    },
    {
      resolve: 'gatsby-plugin-sri',
      options: {
        hash: 'sha512', // 'sha256', 'sha384' or 'sha512' ('sha512' = default)
        crossorigin: false, // Optional
      },
    },
    {
      resolve: 'gatsby-plugin-env-variables',
      options: {
        allowList: ['MUNCHKIN_ID'],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: "UA-43979731-4",
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: false,
        // Setting this parameter is optional
        anonymize: true
      },
    },
    {
      resolve: 'gatsby-plugin-newrelic',
      options: {
        config: {
          instrumentationType: 'pro',
          accountId: process.env.RELIC_ACCOUNT_ID,
          trustKey: process.env.RELIC_TRUST_KEY,
          agentID: process.env.RELIC_PRODUCTION_AGENT_ID,
          licenseKey: process.env.RELIC_LICENSE_KEY,
          applicationID: process.env.RELIC_PRODUCTION_APPLICATION_ID,
          beacon: 'bam.nr-data.net',
          errorBeacon: 'bam.nr-data.net'
        }
      }
    },
    // {
    //   resolve: 'gatsby-plugin-algolia',
    //   options: {
    //     appId: process.env.GATSBY_ALGOLIA_APP_ID,
    //     apiKey: process.env.ALGOLIA_ADMIN_KEY,
    //     queries,
    //     chunkSize: 10000, // default: 1000
    //     enablePartialUpdates: true, // only index new, changed, deleted records
    //     matchFields: ['excerpt', 'contextual_links', 'search_keyword', 'headings', 'fields', 'modified'],
    //     concurrentQueries: false,
    //   },
    // },
  ],
};
