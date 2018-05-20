---
path: /jvm-bytecode
date: '2017-01-10T23:36:56.503Z'
title: JVM Bytecode
tags:
  - "Scala, Java & JVM"
excerpt: 'Java and Scala and other languages that compiles to JVM, **are more dynamic that you may thing**.

As you already know Java and Scala compiles to JVM Bytecode. And this bytecode that probably scares you
is easy that you may thing. I will not explain it on this post, but lets take a look.'
draft: false
---
# Runtime JVM Bytecode manipulation

Java and Scala and other languages that compiles to JVM, **are more dynamic that you may thing**.

As you already know Java and Scala compiles to JVM Bytecode. And this bytecode that probably scares you
is easy that you may thing. I will not explain it on this post, but lets take a look.

## JVM ByteCode Overview    

The Full spessification can be found on the [Oracle, Chapter 2. The Structure of the Java Virtual Machine](https://docs.oracle.com/javase/specs/jvms/se8/html/)

 - Each java class or scala class will create a *'.class'* file.
   Note, in Scala each Lamda function will create  each own .class file, this is just a trick of the Scala compiler.
 - A good way to understed the data releated to each '.class' is with ASM:
     - in the java ASM guide, go to section 2.1, Class / Structure  
 - Primitive types and Reference types,
      - in the JVM there exist two kind of types primitives and references.

 - Method Call Example
  Original Code
~~~~java
public void m(Example a) {
 this.hello((String) a.get("ola"));
}
~~~~
  The ASM code, you can generate something like this using ASMifier.
~~~~scala
mv.visitVarInsn(ALOAD, 0)
//stack [this]
mv.visitVarInsn(ALOAD, 1); // put the first argument in the stack
// stack:[this, <1º argument>]
mv.visitLdcInsn("ola");
// stack:[this, <1º argument>, "ola"]
mv.visitMethodInsn(INVOKEVIRTUAL, "com/Example", "get", "(Ljava/lang/String;)Ljava/lang/Object;", false);
// will call method <1º argument>.get("ola")
// stack:[this, <result of get method>]
mv.visitTypeInsn(CHECKCAST, "java/lang/String");
mv.visitMethodInsn(INVOKEVIRTUAL, "com/Main", "hello", "(Ljava/lang/String;)Ljava/lang/String;", false);
// Stack: [<the result of hello>]
~~~~

 - Instantiate new Varible
~~~~scala
 mv.visitTypeInsn(NEW, "com/Hello");
 // stack: [newObjReference ]
 mv.visitInsn(DUP); // duplicate the top of the stack
 // stack: [newObjReference , newObjReference  ]
 // local variable access, the initialization was omitted
 mv.visitVarInsn(ALOAD, 2);
// stack: [newObjReference , newObjReference, localVariable2 ]
 mv.visitVarInsn(ALOAD, 3);
  // stack: [newObjReference , newObjReference, localVariable2,  localVariable3 ]
 mv.visitVarInsn(ALOAD, 4);
  // stack: [newObjReference , newObjReference, localVariable2,  localVariable3, localVariable4 ]
 mv.visitMethodInsn(INVOKESPECIAL, "com/Hello", "<init>", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", false);
 // call the constructor, the constructor is a special method called <init>
~~~~

## Java class-loader

How this '.class' files with byte code inside are loaded by the JVM? The answer is by the **classLoader.**

On any object, you can do `.getClass()` this is the runtime representation of the Class. An if you pay attention that `Class` object has a method `.getClassLoader()`.

[ClassLoader in the oracle documentation](https://docs.oracle.com/javase/7/docs/api/java/lang/ClassLoader.html)

The most incredible thing is that you use custom class-loader to for example load `.jar` into your application in runtime [URLClassLoader](https://docs.oracle.com/javase/7/docs/api/java/net/URLClassLoader.html">uriClassLoader). Or store your `.class` in a [S3 class loader](https://github.com/RGBz/aws-s3-class-loader)

## Bytecode manipulation tools    

 - **Java ASM** [http://asm.ow2.org](http://asm.ow2.org) - it is very flexible you can do almost everything.
   From change existing .class to create new .class, to just analysis the code.
   It has a nice [guide](http://download.forge.objectweb.org/asm/asm4-guide.pdf).

   Also it includes a tool (ASMifier) that inspect a class and generate the source
   code to create the provided class in runtime. This is very useful for debug proposes

 - **ByteBuddy** [bytebuddy.net](http://bytebuddy.net/#/) - is a easy way to manipulate class.
    It is just possible to do some common use-cases, like for example fields manipulation, create mocks, proxies, etc..
    It has a very simple interface and does not require an understanding of Java byte code.

 - ** Janino ** [janino-compiler.github.io/janino/](http://janino-compiler.github.io/janino/) - Janino is a ligth-weigh runtime Java compiler. It can create bytecode in runtime, you write a string with valid Java Code and Janino will create the bytecode.
  janino does not implement all the Java features, but just the sufficient.
  It is way more easy to write Java code and compile it using Janino than create the same code with ASM.

  The uses-cases of something like that are unlimited, use your imagination!!  
