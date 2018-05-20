---
path: /scala
date: '2017-01-15T23:36:56.503Z'
title: 'Scala Language Tutorial'
tags: 
  - "Scala, Java & JVM"
excerpt: '<p>I will start with some generic concepts <b>Mutability and Immutability</b> and <b>Singleton object</b> that are not specific of the scala language.</p>

<p>Next, I have separated the main features in 3 Charters:  <b>Scala as a Object Oriented Language</b>, <b>Scala as a Functional language</b>, <b>Scala as a Script language</b>. 
I like to say that scala was the qualities of all kind paradigms.
It is possible to take advantage of each paradigm.
</p>
'
draft: false
---

Scala Language Tutorial
=======================

#### Hot links

Scala Oficial: http://www.scala-lang.org

Nice post: http://lampwww.epfl.ch/~michelou/scala/using-scala-from-java.html

**How Install**: http://www.scala-lang.org/download/install.html ;

It is just:
  1. Download scala
  2. Crete path variable $SCALA_HOME 
  3. Update the variable $PATH to have the $SCALA_HOME/bin
And you have the 'scala' command wich gives you a Scala intepretor

**Scala Ide**: http://scala-ide.org
(an easy way to install and work with scala)

**SBT**: http://www.scala-sbt.org/
Is the scala build tool which manage dependencies. Sbt is for scala like Maven is for JAVA.

## Introduction
I will start with some generic concepts ([Mutability and Immutability](#mutability-ummitability) and [Singleton object](#singleton)) that are not specific of the scala language.

Next, I have separated the main features in 3 Charters:  [Scala as a Object Oriented Language](#scala-oo), [Scala as a Functional language](#scala-functional), [Scala as a Script language](#scala-script). 
I like to say that scala was the qualities of all kind paradigms.
It is possible to take advantage of each paradigm.
 
In the future I would like to pick some other topic: Reflection and Macros - this two things are still currently in experimental, but they are very cool and usable; 
Concurrency  which in Scala is very intuitive; 
Native XML scala feature;
and notes about string processing. 

This tutorial is currently beeing writed in my free times, so in the end there are some topics which are not writed yet .
   
## Scala Ecosystem
Tools
   
<a name="concepts"></a>
## Concepts

Before we get started, we must know about a few general concepts. 
Concepts that are not specific from the Scala language but general from the programming.
But where in Scala they are more used or has more importance.

<a name="mutability-ummitability"></a>
### Mutability and Immutability

Immutability is one of pillars of a functional language.

** Mutable variable ** its state can change over time.

** Immutable variable ** its state can't change over time.

Immutability advantages
  * Is very good for concurrency (many threads changing the value of one variable at same time may be dangerous )
  * Code more clean

Immutability disadvantages
  * May be  costly to be recreating objects on each change

<a name="singleton"></a>
### Singleton object

Singleton objects are unique at the runtime. There will not exist at same time two instances of this objects types.

In Java, a class have its own static scope, where are declared static methods and variables. This static scope of the class, in java, are nothing more that a built-in singleton object

But in Scala there aren't the keyword static.
Instead there are classes and singleton objects, they are managed differently.


<a name="scala-oo"></a>
## Scala as a Object Oriented Language

In Scala you can do everything that you already could do in JAVA, or in other Object oriented language.
The main difference could be that in Scala there aren't static scope variables. But an equivalent thing:
If you need a static variable for the class A, you create an object A in the same file, and place 
the variable there. 

<a name="objects-class"></a>
### Objects and Class
**Class**: is equivalent to Java. 
~~~~scala
// declaring a class you can create a default constructor. This constructor 
// define the constructor arguments and class Attribute at same time. 
class Example(favoriteNumber:Int, name:String) {
//  an attribute
private val dadFavoriteNumber:Int = favoriteNumber * 2
// defining other constructor, on this case calling the default constructor
def this(favoriteNumber:Long) = this(favoriteNumber.toInt, "default-name");
// defining a method without arguments with Int Return
def dadNumber():Int = dadFavoriteNumber
// this is equivalent to
// def dadNumber():Int = {return dadFavoriteNumber; }
}
// instantiating with firt constructor
new Example(1, "ruiOliveira").dadNumber()
// instantiating with second constructor
new Example(2l).dadNumber()
// 2l -> is a scala way to create Longs
~~~~
Run scala intepretor in the shell (command 'scala'), and copy-paste this code and test.


**Object**: is a tool that can be used in different situations.
One used situation is to work has a singleton, as you can see:

~~~~~scala
// (Requires the Example class definition in the intepretor)

// a singleton object 
object Example{
// This variable can be seen has a static variable in Example 
var counter:Int = 10
// this method can be seend has a Static method in the Example
def counterPlusOne():Int ={ counter += 1; counter }  
// On this method we are creating a variable of class Example and using 
// the object Example. The compiler is very smart, and they know when 
// you are using the Class or when you are using the Object. Even if 
// they have the same name.
def newExample(name:String) = new Example(Example.counterPlusOne(), name);
}
val ro1 = Example.newExample("Rui Oliveira 1");
ro1.dadNumber()
val ro2 = Example.newExample("Rui Oliveira 2");
ro2.dadNumber()
val ro3 = Example.newExample("Rui Oliveira 3");
ro3.dadNumber()
// the dadNumber is growing, 
~~~~~
Run scala intepretor in the shell (command 'scala'), and copy-paste this code.

In scala a class don't have static methods or variables, what you can do is create a Object with the same name of the class, this object is called **Companion object**

~~~~scala
// The class
class TheClass
// The companion object
oject TheClass
// PERSONAL NOTE: need intepretor validation
~~~~ 

<a name="traits"></a>
### Traits

A trait is a **tool**, a tool that can be compared to a JAVA interface. With the different
that you can have method implementations and variable initialization.

After the compilation, as trait is nothing more that a interface for the JVM. 
So the definitions of the method and variable will be the in the class that uses the trait.
  

**Creating a Trait**
~~~~~scala
trait Person{
//who use this trait must define a value Name with type String
val name:String;
var nameCounter = 0
def getName():String = {
nameCounter += 1
// value name is the last thing of this block so will be returned 
// Keep this in mind, scala don't require return keyword 
name
}

def howManyTimesNameWasCalled() = nameCounter
}
// you can create an object with the same name has the trait
object Person{
  // you can variables of a spessfic Trait
  def testTraitPerson(p:Person) = {
println(p.howManyTimesNameWasCalled())
p.getName(); p.getName()
println(p.howManyTimesNameWasCalled())
  }
  
}
~~~~~ 

**Object using a Trait**, note that we are defining name value.
~~~~~scala
object RuiOliveira extends Person{
val name = "rui Oliveira";
}
Person.testTraitPerson(RuiOliveira)
~~~~~
Has you can see a object is a variable that uses Person so it can be used in the testTraitPerson

**Class using a trait**, note that we are declaring value 'name' in the constructor parameters.
~~~~~scala
class OtherPerson(val name:String) extends Person

val p = new OtherPerson("pedro")
Person.testTraitPerson(p)
~~~~~

Has was expected we can use traits in class's


**Trait on variable**. (Anonymous declaration) 
~~~~scala
// Dog are not Persons, so it don't extends to trait Person
class Dog(val dogName:String)

// but this specialDog are a Person, its type is 'Dog with Person'
val specialDog:Dog with Person = new Dog("doggy") with Person {
val name = dogName;
}
Person.testTraitPerson(p)
~~~~

<a name="case-class"></a>
### Case Class

Case class are a "modification" to normal classes
~~~~~scala
// normal class
class Onwer( name:String)
class Phone( number:String,  owner:Onwer)
// case class
case class Owner2( name:String)
case class Phone2( number:String, owner:Owner2)
~~~~~

Creating a case class you will be access:
  * default create functions: toString, copy, equal and hashcode.
  * class will be immutable by default
  * default create singleton object with method unapplay and apply functions

<a name="apply-unapply"></a>
### Methods `apply` and `unapply`

The methods `apply` and `unapply` are created in the companion object

~~~~scala
case class Person(name:String)

object Person {
  // methods create automaticly by case class:
  // def apply(name:String) = new Person(name)
  // def unapply()
}


// NEED intrepretor vadidation
~~~~

!explain !
!Here explain the power of unapplay and apply!

<a name="generic-class"></a>
### Generic Class


### Inner Class and Object 

<a name="scala-functional"></a>
## Scala as a Functional language

On this section, there will be explained some of the Scala features that are related to Functional World:
  * var and val (Mutability and Immutability)
  * Lambda functions
  * handling collection in a functional way
  * implicit things (variable, method and class) 

<a name="var-val"></a>
### Var and Val
Var and Val keyword can be used to declare objects or in class parameter.

**var** stands for variable
**val** stands for value

~~~~scala
var counter = 1;
val max = 100;

while(counter < max) {
  counter += 1;
  // in scala there aren't ++ operator
}
~~~~

On this example counter variable are being setted multiple times. While if you try to set a new value in the counter, it will gives you a compile error.

Usage on as a class parameter:

~~~~scala
class Person(val name:String, var age:Int) {
  def doBirthdate:Unit = age += 1;
}
~~~~

The parameter name will never got changed while age can be changed.

Var and Val with class types

~~~~scala
class Club(val peopleList:List[Person], val owner:Person)
~~~~

On this example we have the owner parameter as val, but this don't mean that we cannot use 'onwer.doBirthdate' and change the state of owner.
When we set a parameter has val, we are telling the compiler that the 'symbol' named 'owner' will only be setted one time.

We say that a class is Immutable when all the parameters are 'val' and all the parameters Types are also immutable.

<a name="higter-order"></a>
### Lambda functions

The syntax to create a lambda function are:

~~~~scala
val f = (x:Int) => x*2
f(2) 
// will give 4
~~~~

We can receive function as parameter

~~~~scala
val op1 = (x:Int, y:Int) => x * 2 + y
val f = (x:Int, y:Int, op: ((Int,Int) => Int) ) => op(x,y)
f(2,3,op1) 
// will give 7
~~~~

<a name="collections-functions"></a>
### Collections functions
To know more Collectons, check the Collection section. On this sub-section I will only 
explain the functinal approuch of the Collections

**Map** Transforming a List into an other list with an operation
~~~~scala
val l:List[Int] = List(1,2,3,4);
val op = (x:Int) => x * 2
// running the operation 'op' over each element 
val l2:List[Int] = l.map(op);
// l2 will have: List(2,4,6,8)
// l1 will keep the List(1,2,3,4)
~~~~

With some systatix sugar (which i'm gooing to explain in [ref section3]).
We can simplie write
~~~~scala
val l:List[Int] = List(1,2,3,4);
val l2:List[Int] = l.map({ x => x * 2});
val l3:List[Int] = l.map{ x => x * 2};
val l4:List[Int] = l.map(x => x * 2);
val l5:List[Int] = l.map(_ * 2);
// l2, l3, l4, l5 are exatly the same
~~~~

** Filter ** will select some elements
~~~~scala
val l:List[Int] = List(1,2,3,4);
val l2 = l.map(x => x * 2).filter(x => x > 5).map(x => x + 1)
// 1º map result List(2,4,6,8)
// 2º filter result List(6,8)
// final result List(7,8)
~~~~

** Useful functions ** there are many useful functions over collections.
<put here some examples>

** reduce ** will transform a list[A] into an A, this method assumes that the List,
are not empty.
~~~~scala
// Lets see the reduce signure:
def reduce[A1 >: A](op: (A1, A1) ⇒ A1): A1
// ...
val l:List[Int] = List(1,2,3,4);
l.reduce{ (a,b) => a + b }
// will give 9
List[Int]().reduce{ (a,b) => a + b }
// empty list will throw excepton!!
~~~~

** foldRight and foldLeft ** is like reduce, but more useful.

~~~~scala
// Lets see the signures:
def foldRight[B](z: B)(op: (A, B) ⇒ B): B
// will produce something like 'op(x_1, op(x_2, ... op(x_n, z)...))'
def foldLeft[B](z: B)(f: (B, A) ⇒ B): B
// will produce something like 'op(...op(z, x_1), x_2, ..., x_n)'
~~~~

With the fold we can transform a list into objects, example:
~~~~scala
val l:List[Int] = List(1,2,3,4);
l.foldLeft("0"){(z:String, i:Int) => z + "," +  i.toString }
// will produce 0,1,2,3,4
// op(op(op(op("0", 1), 2 ), 3), 4)
~~~~

~~~~scala
val l:List[Int] = List(1,2,3,4);
l.foldRight("0"){(i:Int, z:String) => z + "," + i.toString  }
// will produce 0,4,3,2,1
// op(1,op(2,op(3,op(4,"0"))))
~~~~

<a name="-implicit-variable"></a>
### Implicit Variable

Implicit variables are a mechanism to avoid always be passing some variable into a function, normally this is very useful on recursive functions.

~~~~scala
// also on this example we are using Scala string processing
def f(name:String)(implicit location:String) = s"hello $name, you are at $location"
implicit  val l = "lisbon"
f("rui")
// will give 'hello rui, you are at lisbon'
f("rui")("porto")
// will give 'hello rui, you are at porto'
~~~~

The value l is been declared as implicit of type String, when ever its needed a Implicit String the value l will be used.

We can import implicit variable and use in other context:
~~~~scala
object o1{ implicit val i = 500}
def f(implicit h:Int) = h * 2
// importing the variable i
import o1._
// we are calling the function f (no parentheses need)
// and with the result call toString
printf(f.toString);
~~~~

Also we can have more than one variable as implicit input:

~~~~scala
def f(i:Int)(implicit k:Int, s:String):String = i match {
  case 0 => s + k
  case _ => f(i - 1)
}
implicit val i = 100;
implicit val i = "i has ";
f(50)
~~~~

<a name="-implicit-method"></a>
### Implicit Method

Implicit methods are used to convert a variable into other

<a name="-implicit-class"></a>
### Implicit Class

Implicit class are used to lay methods in certain types

<a name="scala-script"></a>
## Scala as a Script language

WARNING: Not writed yet
TODO: write this topic.

<a name="type-inference"></a>
### Type Inference

WARNING: Not writed yet
TODO: write this topic.

<a name="syntax-sugar"></a>
### Syntax Sugar

WARNING: Not writed yet
TODO: write this topic.

<!---

# ,"#scala-concurrency":{"title":"Scala Concurrency","sub":{"#futures-promises":{"title":"Futures and Promises"},"#todo":{"title":"todo: add topics here"}}},"#scala-reflection":{"title":"Scala Reflection","sub":{"#universe":{"title":"Universe"},"#todo2":{"title":"Add something here"}}},"#scala-macros":{"title":"Scala Macros","sub":{"#whitebox-blackbox":{"title":"Whitebox and blackbox macros"},"#annotations-macros":{"title":"Annotations Macros"}}},"#scala-xml":{"title":"Scala XML"},"#scala-string":{"title":"Scala String Processing"}   }
 
# <a name="scala-cool"></a>
# ## Scala as a cool language
#
# WARNING: Not writed yet
# TODO: write this topic.
# 
# <a name="scala-concurrency"></a>
# ### Scala Concurrency
# 
# WARNING: Not writed yet
# TODO: write this topic.
# 
# <a name="futures-promises"></a>
# #### Futures and Promises
# 
# WARNING: Not writed yet
# TODO: write this topic.
# 
# <a name="todo"></a>
# #### @todo: add topics here
# 
# WARNING: Not writed yet
# TODO: write this topic.
# 
# <a name="scala-reflection"></a>
# ### Scala Reflection
# 
# WARNING: Not writed yet
# TODO: write this topic.
# 
# <a name="universe"></a>
# #### Universe
# 
# WARNING: Not writed yet
# TODO: write this topic.
# 
# <a name="todo2"></a>
# #### Add something here
# 
# WARNING: Not writed yet
# TODO: write this topic.
# 
# <a name="scala-macros"></a>
# ### Scala Macros
# 
# WARNING: Not writed yet
# TODO: write this topic.
# 
# <a name="whitebox-blackbox"></a>
# #### Whitebox and blackbox macros
# 
# WARNING: Not writed yet
# TODO: write this topic.
# 
# <a name="annotations-macros"></a>
# #### Annotations Macros
# 
# WARNING: Not writed yet
# TODO: write this topic.
# 
# <a name="scala-xml"></a>
# ### Scala XML
# 
# WARNING: Not writed yet
# TODO: write this topic.
# 
# <a name="scala-string"></a>
# ### Scala String Processing
# 
# WARNING: Not writed yet
# TODO: write this topic.
# 
-->   