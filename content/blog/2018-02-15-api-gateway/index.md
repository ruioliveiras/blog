---
path: /api-gateway
date: '2018-02-15T23:36:56.503Z'
title: Designing a Api Gateway with authentication and authorization
tags: []
excerpt: ''
draft: true
---

## Motivation
Authentication and authorization may be a problem in a micro service environment. 
If every micro services has its own authentication and authorization, you end up 
with multiple services doing the same thing, and perhaps with different implementations.

The cleanest way of doing it is with a service dedicated to authentication and authorization, I'm going to call this service the **bouncer service**.

**Abstract:**
1. [Concept map - the problem domain](#concept-map)
1. [High level implementation](#high-level-implementation)
   1. [Identified implementation problems](#problems)
1. [Implementation](#implemetation)
    1. [ Flow: new 'http request' comes](#flow-new-request-comes)
    1. [ Registration of a new micro-service](#new-micro-service)
    1. [ Extract 'auth resources' from http request](#extract-auth-resource)
    1. [ Store data in Couchbase](#data-storage)

<a name="concept-map"></a>

## Concept map - the problem domain 

$the image

Example of instantiation:
- **Resource1**
- **Resource2** with levels: admin, lvl1, actions, reports
- **Role1** has Resource1, resource2(lvl1)
- **Role2** has Resource1, resource2(lvl1, reports)
- **Role3** has Resource1, resource2(lvl1, actions)
- **Role4** has Resource1, resource2(admin)
- **User1** has role2
- **User2** has role3
- **User3** has role2 and role3

The **user3** has the resource2 with levels lv1, actions and reports

<a name="high-level-implementation"></a>

## High level implementation

$ grafico de high level implementation

<a name="problems"></a>

### Identified implementation problems

- When we receive a Http Request, how what flow we should have ? [Awnser](#flow-new-request-comes)
- How can the Boucer service knows all the micro-services and what resources it has ? [Awnser](#new-micro-service)
- How can we extract from Http request the required resources ? [Awnser](#extract-auth-resource)
- How can we store the our data model ? [Awnser](#data-storage)

<a name="implementation"></a>

## Implementation

<a name="flow-new-request-comes"></a>

### Flow new request comes
 
 1. The request come to the system
 2. The request is **authenticated** (convert the jwt, into the user)    
 2. The http path is processed to: 
 		1. Extract the service want to rich.
 		2. [Extract the resource in that request](#extract-auth-resource) want to use.
 2. We know the user, the micro-service and the resource.
 2. Now we can process the all the information to do **Authorization**
 	1.1. The answer could be negative
 	1.2. Or Positive
 	1.2. Or Positive, but with conditions (levels of access)  
 3. The request is forwarded to the to the micro-service, with the levels of access.  


<a name="new-micro-service"></a>

### Registration of a new micro-service

1. When a new micro-service start, it should have configured a end point to rich the bouncer service.
2. And the new micro-service will send to the bouncer service something like this to register thanself: 

~~~json   
{
   "name":"name-of-example1",
   "version":"v0.0.1",
   "forwardHost":"api-internal.example1.com",
   "paths":{
	 "GET:/path1/" : {
	 	"require":["resource1"]
	 },
	 "POST:/path1/" : {
	 	"require":["resource1"]
	 },
	 "GET:/path1/:ID" : {
	 	"require":["resource1", "resource2"]
	 }
   },
   "resources":[
   	 {"code":"resource1", "levels":["level1", "level2", "level3"]},
   	 {"code":"resource2"}
   ]

}
~~~

With the version would be possible to **run multiple versions at time**, and the bouncer-service could have special behaviour to handle multiple versions. This feature could facilitate [blue-green deploys](https://martinfowler.com/bliki/BlueGreenDeployment.html). 

All paths are declared and mapped to resources. So that, when the service bouncer receive the request:
`GET <host>/path1/125` it know that it **requires**: `resource1` and `resource2`. 
So will search if the authorized user has it.
 - if the user doesn't have, the request will not be forwarded.
 - if the user has, will forward and add in the http headers the *level* of resource1. 

<a name="extract-auth-resource"></a>

### Extract 'auth resources' from http request

The service bouncer could create a suffix tree of all paths in the infrastructure, [Suffix tree](https://en.wikipedia.org/wiki/Suffix_tree).

Something like this:

~~~~
"path1/"
   -> <endPath> 
          -> GET  {fullPath: GET:path1, requires:["resource1"]}
   -> <endPath> 
           -> POST {fullPath: POST:path1, requires:["resource1"]}
   -> <anyIntValue> 
          -> <endPath> 
                 -> GET {fullPpath: POST:path1/:id, requires:["resource1", "resource2"]}
~~~~

The information stored in leaf of that tree could store the required **resources**.

Knowing this, the Bouncer service will extract from the http resource what resources it requires.
The Http request only be forwarded to the Micro-service it the actual user has the resources. 

<a name="data-storage"></a>

### Store data in Couchbase

1. First authentication:
 The request will arrive to the Bouncer Service with a [Json web token (JWT)](https://jwt.io/introduction/).
  Using the secret we will certify that is a valid token.
     OR
   We could use the old fashon RANDOM TOKEN that maps the database to the userId.

2. After having a valid user id, we can search in the couchbase for the key `p:$user1`
3. Now search all the roles of that user, example `r:role1` and `r:role2`
4. Now we know all the resources and levels for that user.
5. Since the resource was already [parsed bellow](#extract-auth-resource),
   we know everything to authorize and forward this request.   

#### Couchbase keys
~~~~
p:$userId => {"roles":["role1", "role2"]}

r:$roleCode => {"resources":{"resource1":{"with":["level1"]}, "resource2":{}}}
~~~~
