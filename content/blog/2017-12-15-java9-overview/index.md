---
path: /java9-overview
date: '2017-12-15T23:36:56.503Z'
title: Java 9 Overview
tags: 
  - "Scala, Java & JVM"
excerpt: Java 9 had released at September 2017. On this post you will found a global overview of the changes, and some useful links.
draft: false
---

# Overview over java9 

Java 9 had released at September 2017. On this post you will found a global overview of the changes, and some useful links. 

[Complete change log - from Oracle](https://docs.oracle.com/javase/9/whatsnew/toc.html)

## Minor changes
 - A new tool the [jsheel](https://www.youtube.com/watch?v=PHJ8-Ef1ZE4) - "interactive command-line interface for evaluating declarations, statements, and expressions of the Java programming language."
 - Support private interface methods
 - Complete the removal, begun in Java SE 8, of the underscore from the set of legal identifier names.
   - That means we currently could create a variable with name '_' ?
 - Collection methods: `Set.of(...), List.of(...),  Map.of(...)` [doc here](https://docs.oracle.com/javase/9/core/creating-immutable-lists-sets-and-maps.htm#JSCOR-GUID-202D195E-6E18-41F6-90C0-7423B2C9B381)
 - [Concurrency updates](http://openjdk.java.net/jeps/266): An interoperable publish-subscribe framework, enhancements to theCompletableFuture API, and various other improvements.

## Big news: Jigsaw 
The project jigsaw have arrived with native java modularization

[Jigsaw 32min video](https://www.youtube.com/watch?v=Ks7J_qQVR7Y)

- [Advantages of jigsaw](https://www.quora.com/What-benefits-will-the-new-Java-9-module-system-bring-compared-to-using-jars): "With Jigsaw I hope to restrict access to the modules so that only one or two classes are accessible outside module which will make the code more maintainable"
- The jigsaw doesn't support versioning, **It will not replace maven or sbt**.
- For sbt users like me, we must wait to see what integration sbt will create for jigsaw ([ticket](https://github.com/sbt/sbt/issues/3368))

Note that is possible to **use java9 without noticing jigsaw**, java will create a monolithic 'unamed module' for retro-compatibility,

Thank you for your attention