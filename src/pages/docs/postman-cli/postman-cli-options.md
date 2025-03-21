---
title: "Postman CLI command options"
updated: 2022-10-18
warning: false
tags:
  - "Postman CLI"
contextual_links:
  - type: section
    name: "Additional resources"
  - type: subtitle
    name: "Videos"
  - type: link
    name: "Run collections with Postman CLI | The Exploratory"
    url: "https://youtu.be/DKxCVo1_ELg"
  - type: subtitle
    name: "Blog posts"
  - type: link
    name: "Streamline your API release process with the Postman CLI"
    url: "https://blog.postman.com/streamline-your-api-release-process-with-the-postman-cli/"
---

Commands and options for using the Postman CLI.

## Contents

* [Basic command line options](#basic-command-line-options)
* [Signing in and out](#signing-in-and-out)
* [Running collections](#running-collections)
* [Governance and security](#governance-and-security)
* [Publishing an API version](#publishing-an-api-version)

## Basic command line options

### postman

This is the base command, usually combined with `collection run` or `api lint`.

#### Example

```plaintext
postman -v
```

#### Options

| Option | Details |
|:--|:--|
| `--help`, `-h` | Returns information about Postman CLI commands and options.|
| `--version`, `-v`| Returns the version number for the Postman CLI.|

## Signing in and out

You can use the Postman CLI to sign in and out of Postman with the [`login`](#postman-login) and [`logout`](#postman-logout) commands.

### postman login

This command authenticates the user and locally caches the [Postman API key](/docs/developer/intro-api#generating-a-postman-api-key). `login` requires one option, `--with-api-key`, that accepts the Postman API key. The `login` command is required only once per session. Once you've signed in, you remain signed in until you use the `logout` command or your Postman API key expires.

#### Example

```plaintext
postman login --with-api-key ABCD-1234-1234-1234-1234-1234
```

### postman logout

This command signs you out of Postman and deletes the stored API key.

#### Example

```plaintext
postman logout
```

#### Options

 Option | Details |
|:--|:--|
| `--with-api-key [api-key]` | Authenticate the user with the given API key. |

## Running collections

You can run your collections with the `postman collection run` command:

### **postman collection run**

This command runs a collection and sends all run results and responses to Postman servers. You can specify the collection with its file path or Collection ID.

> You can find the collection ID in Postman. First, select **Collections** in the sidebar and select a collection. Then select the information icon <img alt="Information icon" src="https://assets.postman.com/postman-docs/icon-information-v9-5.jpg#icon" width="16px"> in the right sidebar to access the collection ID.

#### Examples

```plaintext
postman collection run /myCollectionFolderName/myCollectionFile.json

postman collection run 12345678-12345ab-1234-1ab2-1ab2-ab1234112a12
```

#### Options

| Option | Details |
|:--|:--|
| `--bail [optional modifiers]` | Specifies whether or not to stop a collection run on encountering the first test script error. `--bail` can optionally accept two modifiers: `--folder` and `--failure`. `--folder` skips the entire collection run if there are any errors. If a test fails, `--failure` gracefully stops the collection run after completing the current test script. |
| `--color [value]` | Controls colored CLI output. Accepts `on`, `off`, and `auto`. Default is `auto`. With `auto`, the Postman CLI attempts to automatically turn color on or off based on the color support in the terminal. This behavior can be modified by using the on or off value accordingly.|
| `--cookie-jar [path]` | Specifies the file path for a `JSON` cookie jar. Uses `tough-cookie` to deserialize the file. |
| `--delay-request [number]` | Specifies a delay (in milliseconds) between requests. |
| `--disable-unicode` | Replaces all symbols in the output with their plain text equivalents. |
| `--environment [UID] or [file-path]`, `-e` | Specifies an environment file path or UID. |
| `--env-var "[environment-variable-name]=[environment-variable-value]"` | Specifies environment variables via the command line, in a `key=value` format. Multiple CLI environment variables can be added by using `--env-var` multiple times, for example: `--env-var "this=that" --env-var "alpha=beta"`.|
| `--export-cookie-jar [path]` | Specifies the path where the Postman CLI will output the final cookie jar file before completing a run. Uses `tough-cookie` to serialize the file. |
| `--global-var "[global-variable-name]=[global-variable-value]"` | Specifies global variables via the command line, in a `key=value` format. Multiple CLI global variables can be added by using `--global-var` multiple times, for example: `--global-var "this=that" --global-var "alpha=beta".`|
| `--globals [file-path]`, `-g` | Specifies the file path for global variables. Global variables are similar to environment variables but have lower precedence and can be overridden by environment variables having the same name. |
| `--iteration-count [number]`, `-n` | Specifies the number of times the collection will run when used in conjunction with the iteration data file. |
| `--iteration-data [file-path] or [URL]`, `-d` | Specifies a data source file (`JSON` or `CSV`) to be used for iteration as a path to a file or as a URL.|
|  `-i [requestUID] or [folderUID]` | Runs only the specified folder UID or request UID from the collection. Multiple items can be run in order by specifying `-i` multiple times, for example: `postman collection run collectionUID -i folder1UID -i folder2UID`|
| `-i [requestName] or [folderName]` | Runs only the specified folder name or request name from the collection. If there are duplicate names, the Postman CLI runs the folder or request that appears first.|
| `--ignore-redirects` | Prevents the Postman CLI from automatically following 3XX redirect responses.|
| `--insecure`, `-k` | Turns off SSL verification checks and allows self-signed SSL certificates. |
| `--no-insecure-file-read` | Prevents reading of files situated outside of the working directory.|
| `--silent` | Turns off terminal output.|
| `--suppress-exit-code`, `-x`| Specify whether or not to override the default exit code for the current run.|
| `--timeout [number]`| Specifies the time (in milliseconds) to wait for the entire collection run to complete execution.|
| `--timeout-request [number]`| Specifies a time (in milliseconds) to wait for requests to return a response.|
| `--timeout-script [number]`| Specifies the time (in milliseconds) to wait for scripts to complete execution.|
| `--verbose` | Shows detailed information of collection run and each request sent.|
| `--working-dir [path]`| Sets the path of the working directory to use while reading files with relative paths. Defaults to current directory.

## Governance and security

API governance is the practice of applying a defined set of standards consistently across your API design and testing phases of your development process. The Postman CLI includes a command that checks your API definitions against your team's configured Postman API Governance and API Security rules. (This feature is available for [Enterprise teams only](https://www.postman.com/pricing/)).

### postman api lint

This command runs validation checks for governance and security rules against the API definition provided in the Postman config file, a local file, or a UUID. `api lint` shows a warning if unable to find the API ID to send data back to Postman.

> This command supports APIs that are stored on Postman and aren't linked to Git.

#### Example

```plaintext
postman api lint my-definition-file.json
postman api lint 8854915-bb7236b2-536e-4bdc-bfa2-fbe2fe1941eb
```

#### Options

Option | Details
--- | ---
`--fail-severity [severity]`, `-f` | Triggers an exit failure code for rule violations at or above the specified severity level. The options, in order of lowest to highest severity, are `HINT`, `INFO`, `WARN`, and `ERROR` (default).
`--suppress-exit-code`, `-x`| Specifies whether to override the default exit code for the current run.

## Publishing an API version

You can [publish API versions](/docs/designing-and-developing-your-api/versioning-an-api/api-versions/) from the command line with the Postman CLI. This enables you to automate the API version publishing process.

### postman publish api

Publish a snapshot of an API for the given `apiId`. All entities linked to the API will be published by default. You can choose which entities to publish by using additional options.

When publishing an API that is linked with git, you must enter the command from inside the local git repo and provide paths to the schema directory and collection paths instead of IDs.

#### Example for repos not linked with git

```plaintext
postman api publish <apiId> --name v1\
--release-notes "# Some release notes information"\
--collections <collectionId1> <collectionId2>\
--api-definition <apiDefinitionId>
```

#### Examples for repos linked with git

The options for the `api publish` command differ depending on if you specified a schema folder or schema root file when setting up the Git integration. Git integrations added in Postman v10.18 or later use a schema root file. Git integrations added in other Postman versions use a schema folder. Learn more about [connecting an API to a Git repository](/docs/designing-and-developing-your-api/versioning-an-api/versioning-an-api-overview/).

* If the API uses a schema folder, publish the API using the `--api-definition <schemaDirectoryPath>` option:

    ```plaintext
    postman api publish <apiId> --name v1\
    --release-notes "# Some release notes information"\
    --collections <collectionPath1> <collectionPath2>\
    --api-definition <schemaDirectoryPath>
    ```

* If the API uses a schema root file, publish the API using the `--api-definition <schemaRootFilePath>` option:

    ```plaintext
    postman api publish <apiId> --name v1\
    --release-notes "# Some release notes information"\
    --collections <collectionPath1> <collectionPath2>\
    --api-definition <schemaRootFilePath>
    ```

> If you specify a file when a folder is required, or a folder when a file is required, the `api publish` command returns the following error: `API Definition <file/folder> is not part of API <apiId>`. Try the command again using the other option.

#### Options

| Option | Details |
|:--|:--|
| `--name <name>` | Specifies the name of the version to publish. |
| `--release-notes <releaseNotes>` | Enter release notes as a string in quotes for the version to publish. This option supports markdown. |
| `--collections <collectionIds/paths...>` | Specifies the collections to publish. If the API is linked with git, provide the `filePath` instead of the ID. |
| `--api-definition <apiDefinitionId/directory/file>` | Specifies the API definition to publish. If the API is linked with git, provide the `schemaDirectoryPath` or `schemaRootFilePath` instead of the ID. |
|`--do-not-poll` | Specifies not to poll for completion status of the publish action.
| `--suppress-exit-code, -x` | Specifies whether to override the default exit code for the current run. |
