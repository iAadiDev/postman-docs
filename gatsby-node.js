const path = require('path');
const fs = require('fs');
const { createFilePath } = require('gatsby-source-filesystem');
const glob = require('glob');
const { v4: uuidv4 } = require('uuid');
// const axios = require('axios');
const frontmatter = require('@github-docs/frontmatter');
const redirects = require('./redirects.json');
// const HeaderJson = require('./src/components/Header/Header.data.json');
const { execSync } = require("child_process");

const ignorePaths = [];


exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'Mdx') {
    const slug = createFilePath({ node, getNode, basePath: 'pages' });

    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });
    /* Used on doc.jsx / View GraphQL query
    /* Returns the latest commit log for a specific doc file */
    const lastModifiedDate = execSync(
      `git log -1 --pretty='%ad' --date=format:'%Y/%m/%d' ${node.internal.contentFilePath}`
    ).toString()
    actions.createNodeField({
      node,
      name: "lastModifiedDate",
      value: lastModifiedDate,
    })
    /* Returns the last modified time (SEO)  */
    const lastModifiedTime = execSync(
      `git log -1 --pretty="format:%cI" ${node.internal.contentFilePath}`
    ).toString();
    actions.createNodeField({
      node,
      name: "lastModifiedTime",
      value: lastModifiedTime,
    })
  }
  // display console error if algolia indexed frontmatter length exceeds 9999 bytes on build
  if (node.internal.type === 'frontmatterLength') {
    if(JSON.parse(node.internal.content).value > 9999) {
      console.error("IMPORTANT: Frontmatter has too many characters");
    }
  }
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createRedirect, createPage } = actions;

  redirects.forEach(({ from, to }) => {
    createRedirect({
      fromPath: from,
      isPermanent: true,
      redirectInBrowser: true,
      toPath: to,
    });
  });

  const result = await graphql(`
    query {
      allMdx {
        edges {
          node {
            internal {
              type
              contentFilePath
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `);
  result.data.allMdx.edges.forEach(({ node }) => {
    if (node.fields.slug.includes('-')) {
      const underscoreSlug = node.fields.slug.replace(/-/g, '_');

      createRedirect({
        fromPath: underscoreSlug,
        isPermanent: true,
        redirectInBrowser: true,
        toPath: node.fields.slug,
      });
    }
    // Handle errors
    if (result.errors) {
      reporter.panicOnBuild(`Error while running GraphQL query.`)
      return
    }

    const docTemplate = path.resolve('./src/templates/doc.jsx');
    // console.log('NODE _--------------------', node.internal.contentFilePath)
    createPage({
      path: node.fields.slug,
      // your-layout-component.js?__contentFilePath=absolute-path-to-your-mdx-file.mdx
      // component: path.resolve('./src/templates/doc.jsx'),
      // component: node.internal.contentFilePath,
      // component: `${docTemplate}?__contentFilePath=${node.fields.slug}`,
      component: `${path.resolve('./src/templates/doc.jsx')}?__contentFilePath=${node.internal.contentFilePath}`,
      // component: require.resolve('./src/templates/doc.jsx'),
      context: {
        slug: node.fields.slug,
      },
    });
  });
};

/* Create Header
/************************************************************************ */
exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const prepareNode = (obj, name) => {
    const data = {
      key: uuidv4(),
      value: JSON.stringify(obj),
    };
    const node = JSON.stringify(data);
    const nodeMeta = {
      id: createNodeId(`my-data-${data.key}`),
      parent: null,
      children: [],
      internal: {
        type: name,
        mediaType: 'text/json',
        content: node,
        contentDigest: createContentDigest(data),
      },
    };

    const output = { ...data, ...nodeMeta };
    return output;
  };
  const { createNode } = actions;
  let mdFrontmatterCharacterCount = [];
  let excerptCharacterCount = [];
  const getDirectories = (src) => glob.sync(`${src}/**/*`);
  const paths = getDirectories('./src/pages/docs')
    .filter((val) => val.slice(-3) === '.md')
    .map((val) => {
      const { data } = frontmatter(fs.readFileSync(val));
      mdFrontmatterCharacterCount.push(data.title, data.search_keyword);
      excerptCharacterCount.push(data.excerpt)
      // const algoliaLength = JSON.stringify(val[data]);
      // h = algoliaLength;
      const order = data.order || 200;
      return [val, order];
    })
    .sort((a, b) => Number(a[1]) - Number(b[1]))
    .map((val) => {
      let newVal = '';
      newVal = val[0].replace(/\.\/src\/pages/g, '');
      newVal = newVal.substring(0, newVal.length - 3);
      newVal = newVal.slice(-5) === 'index' ? newVal.substring(0, newVal.length - 5) : newVal;
      return `${newVal}/`;
    })
    .filter((val) => !ignorePaths.includes(val));

  const output = {};
  
  paths.forEach((val) => {
    let split = val.split('/');
    split = split.filter((url) => url !== '');

    let current = output;
    split.forEach((part) => {
      current[part] = current[part] || {}; 
      current = current[part];
    });
    current.url = `/${split.join('/')}/`;
  });
  mdFrontmatterCharacterCount = JSON.stringify(mdFrontmatterCharacterCount);
  // enable console.logs to view frontmatter object in terminal 'npm run dev'
  // console.log(mdFrontmatterCharacterCount, 'List of all frontmatter objects from md files')
  mdFrontmatterCharacterCount = mdFrontmatterCharacterCount.length;
  // console.log('Length of all frontmatter from md files', mdFrontmatterCharacterCount)
  excerptCharacterCount = JSON.stringify(excerptCharacterCount);
  excerptCharacterCount = excerptCharacterCount.length;
  
  createNode(prepareNode(mdFrontmatterCharacterCount, 'frontmatterLength'));
  createNode(prepareNode(output.docs, 'leftNavLinks'));
};
