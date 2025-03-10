---
title: "Pass information between blocks"
updated: 2023-08-15
---

A typical flow often involves making a request, and then doing something with the result of that request. To do this, flows pass information between blocks to perform tasks.

## Contents

* [Using one block's output as another block's input](#using-one-blocks-output-as-another-blocks-input)
* [Blocks inside of other blocks](#blocks-inside-of-other-blocks)

### Using one block's output as another block's input

Once data is selected, it can be used with other blocks. Sending it to an **Output** block is great for seeing that the request worked, but it doesn't actually do anything with the value.

<img src="https://assets.postman.com/postman-labs-docs/concepts/updated-using-selected-data.gif" alt="Using selected data" fetchpriority="low" loading="lazy" />

Adding another **Send Request** block and then dragging a connection to its `value1` and `value2` variable inputs lets the request use the value for `eur` and `date` that was returned in the first request.

### Blocks inside of other blocks

You may have noticed in the previous step that the **Send Request** block has a variable named `value1` that's using a **Select** block with no value set. When this happens, it's selecting everything that's being sent to it (which in this case is `eur`).

This flow can be simplified to remove the extra **Select** block and instead use the existing ones in the second **Send Request** block.

<img src="https://assets.postman.com/postman-labs-docs/concepts/updated-simplifying-the-flow.gif" alt="Simplifying the flow" fetchpriority="low" loading="lazy" />
