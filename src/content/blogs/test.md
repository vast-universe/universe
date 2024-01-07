---
publishDate: 2023-07-15T00:00:00Z
title: "文档测试"
description: 文档测试描述
authors:
    - huangpeng
published: true # 是否已发布，可以用于控制是否显示在导航中
tags:
    - Astro
    - Markdown
categories:
    - Web Development
featuredImage: "/images/cover.jpg" # 页面的封面图像路径
draft: false # 是否是草稿，如果是草稿，则不会被生成和发布
private: false # 是否为私有页面，私有页面可能需要权限访问
---

After a small break for the holidays, we're back with a new release of Astro! Astro 4.1 includes a number of bug fixes and improvements. As we're all getting back into the swing of things, this release is a bit smaller than usual, but we're all excited to get back to work on Astro and have some exciting things planned for 2024!

Highlights include:

-   **[New accessibility audit rules](#new-accessibility-audit-rules)**
-   **[New configuration option for `client:visible`](#extended-clientvisible-directive)**
-   **[Custom cookie encoding and decoding](#custom-cookie-encoding-and-decoding)**

To take advantage of the latest features, make sure you're running the latest version of Astro. You can upgrade to Astro 4.1 by running the `@astrojs/upgrade` command:

```sh
npx @astrojs/upgrade
```

or by running the upgrade command for your package manager:

```sh
npm install astro@latest
pnpm upgrade astro --latest
yarn upgrade astro --latest
```

## New accessibility audit rules

We've added two new audit rules for the dev toolbar. You will now be warned about:

-   Unsupported ARIA attributes
-   Missing attributes required for ARIA role

Both these rules help ensure that the elements on your page have correct and valid ARIA roles.

## Extended `client:visible` directive

The `client:visible` directive now accepts a `rootMargin` option, which allows you to specify a margin around the viewport to calculate visibility. This allows a component to be hydrated when it is close to the viewport instead of waiting for it to become visible.

```astro
<!-- Load component when it's within 200px away from entering the viewport -->
<Component client:visible={{ rootMargin: "200px" }} />
```

## Custom cookie encoding and decoding

Cookie encoding/decoding can now be customized through new `encode` and `decode` functions when setting and getting cookies.

For example, you can bypass the default encoding via `encodeURIComponent` when adding a URL as part of a cookie:

```astro
---
import { encodeCookieValue } from "./cookies";
Astro.cookies.set("url", Astro.url.toString(), {
    // Override the default encoding so that URI components are not encoded
    encode: (value) => encodeCookieValue(value),
});
---
```

Later, you can decode the URL in the same way:

```astro
---
import { decodeCookieValue } from "./cookies";
const url = Astro.cookies.get("url", {
    decode: (value) => decodeCookieValue(value),
});
---
```

## Bug Fixes

Additional bug fixes are included in this release. Check out the [release notes](https://github.com/withastro/astro/blob/refs/heads/main/packages/astro/CHANGELOG.md#410) to learn more.
