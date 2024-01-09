---
publishDate: 2024-01-6T00:00:00Z
title: "Git不区分大小写导致文件冲突"
excerpt: 解决Git仓库对文件/文件夹变更命名冲突
tags:
    - git
authors:
    - huangpeng
---

# Git不区分大小写导致文件冲突

## 前言

Git仓库对文件/文件夹进行命名，命名大小写变更提交后，Git不会发现命名冲突。

导致仓库中文件命名未变更/或者同时存在两个文件，但是本地命名是变更的文件。

## 根本原因

Windows、Mac的文件系统不区分大小写，而Linux文件系统区分大小写，Git默认不区分大小写，可以变更配置改为区分大小写。

## 问题复现

1. 创建一个`test`文件(Git默认配置不区分大小写的情况下)提交
2. 本地修改文件命名`test`为`Test`，文件内容无变更进行提交
3. 远程仓库文件还是`test`，本地为`Test`(git pull也没问题)导致组件引入路径不正确报错

## 解决方法

```bash
git mv Test Temp

git mv Temp Test
```

文件系统、URL底层设计上不区分大小写。

## Git大小写区分配置

```bash
# git命令查看配置，默认为true
git config --get core.ignorecase
# git配置，建议保留git配置
git config core.ignorecase false
```
