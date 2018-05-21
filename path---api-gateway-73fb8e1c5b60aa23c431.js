webpackJsonp([29909625834292],{486:function(e,a){e.exports={data:{site:{siteMetadata:{title:"Rui Oliveiras - Blog",author:"Rui Oliveiras"}},markdownRemark:{id:"C:/Users/ruioliveiras/Desktop/ruioliveiras.com/content/blog/2018-02-15-api-gateway/index.md absPath of file >>> MarkdownRemark",html:'<h2 id="motivation"><a href="#motivation" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Motivation</h2>\n<p>Authentication and authorization may be a problem in a micro service environment.\nIf every micro service has its own authentication and authorization, you end up\nwith multiple services doing the same thing, and perhaps with different implementations.</p>\n<p>The cleanest way of doing it is with a service dedicated to authentication and authorization, I’m going to call this service the <strong>bouncer service</strong>.</p>\n<p><strong>Abstract:</strong></p>\n<ol>\n<li><a href="#concept-map">Concept map - the problem domain</a></li>\n<li>\n<p><a href="#high-level-implementation">High level implementation</a></p>\n<ol>\n<li><a href="#problems">Identified implementation problems</a></li>\n</ol>\n</li>\n<li>\n<p><a href="#implemetation">Implementation</a></p>\n<ol>\n<li><a href="#flow-new-request-comes"> Flow: new ‘http request’ comes</a></li>\n<li><a href="#new-micro-service"> Registration of a new micro-service</a></li>\n<li><a href="#extract-auth-resource"> Extract ‘auth resources’ from http request</a></li>\n<li><a href="#data-storage"> Store data in Couchbase</a></li>\n<li><a href="#care-about-your-developer">Easy to use in Development Environment</a></li>\n</ol>\n</li>\n</ol>\n<p><a name="concept-map"></a></p>\n<h2 id="concept-map---the-problem-domain"><a href="#concept-map---the-problem-domain" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Concept map - the problem domain</h2>\n<p>\n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 650px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 46.324549237170594%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAJCAIAAAC9o5sfAAAACXBIWXMAAAsSAAALEgHS3X78AAAA+klEQVQoz3WRyW6EMBBE/f//xyUjgQCbTeCFHUNCnrAGRdFQB2O3q11VjaiqKkmS1+ur67p1XbcL8zxrrbM8S9NsGAbv/foHP2+Itm37vjfGTNP0/cZxHJCstVzxFpXAPs8zHM8LwjnHJ1z8A5pQw35ZFryUZSmVVErh11r3uZkjVpWSdV1vm0fK9U7rLs+zOImlzHloP47PzbCJbbTBOXHQN1oTDf2iUGQJzh9t796naVoUJRYCgZ4kiaMoimPEJeKC0lPm+QLNKDM/LDRNQxB7gaIgOhf4gXRPe993KuM40sz+fIBggDxJP9QgwkoFR2G9Bx4M3v8M/AITPQhAf/2vVQAAAABJRU5ErkJggg==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="text"\n        title=""\n        src="/static/domain-diagram-b9c59f26524b5be82f676d8953e90f72-83a8b.png"\n        srcset="/static/domain-diagram-b9c59f26524b5be82f676d8953e90f72-8992e.png 163w,\n/static/domain-diagram-b9c59f26524b5be82f676d8953e90f72-ae0a7.png 325w,\n/static/domain-diagram-b9c59f26524b5be82f676d8953e90f72-83a8b.png 650w,\n/static/domain-diagram-b9c59f26524b5be82f676d8953e90f72-28f5c.png 721w"\n        sizes="(max-width: 650px) 100vw, 650px"\n      />\n    </span>\n  </span>\n  </p>\n<p>Example of instantiation:</p>\n<ul>\n<li><strong>Resource1</strong></li>\n<li><strong>Resource2</strong> with levels: admin, lvl1, actions, reports</li>\n<li><strong>Role1</strong> has Resource1, resource2(lvl1)</li>\n<li><strong>Role2</strong> has Resource1, resource2(lvl1, reports)</li>\n<li><strong>Role3</strong> has Resource1, resource2(lvl1, actions)</li>\n<li><strong>Role4</strong> has Resource1, resource2(admin)</li>\n<li><strong>User1</strong> has role2</li>\n<li><strong>User2</strong> has role3</li>\n<li><strong>User3</strong> has role2 and role3</li>\n</ul>\n<p>The <strong>user3</strong> has the resource2 with levels lv1, actions and reports</p>\n<p><a name="high-level-implementation"></a></p>\n<h2 id="high-level-implementation"><a href="#high-level-implementation" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>High level implementation</h2>\n<p>\n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 650px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 48.0392156862745%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAIAAAA7N+mxAAAACXBIWXMAAAsSAAALEgHS3X78AAABOUlEQVQoz1WS2ZKCMBBF/f+vG30RQWsYBwwmLCFRQBaZQ1LKeB9STbpPL2k25/PZGPN4PNq25ayqSimV5zmGNQYjd5/W2qIocietNZHzPG+4HccR6/l8csJkWQav65p0Ssp3tNZLXgQyO2085oXd9/3tpQVW6urka5ZlSaVpmlb4v/D5lianruuEuERRdDqdwjBM03QYRl9mgQnFnS66MBM+D/uIpmn6fvBJ6cVaQ8/3+32tXGud/CZx/ENXtOpHAmYEGHjSDcOANwgC6pPlo23c70ngIcGOx2i3RV+77a4sKxgpJc/2UZnoSmuueiftbGBs1iPl1RiLLYQID4f4O6aFFSafyIRSkg7LomBVFyHabll7ucCSaF7O1LV0m/OPslb2YjD/t5DFr6RxarsOV5IkexTsb6+2/wDrDzseazjZ5gAAAABJRU5ErkJggg==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="text"\n        title=""\n        src="/static/high-level-c4bcd4736c2379945f3239a932bd89af-83a8b.png"\n        srcset="/static/high-level-c4bcd4736c2379945f3239a932bd89af-8992e.png 163w,\n/static/high-level-c4bcd4736c2379945f3239a932bd89af-ae0a7.png 325w,\n/static/high-level-c4bcd4736c2379945f3239a932bd89af-83a8b.png 650w,\n/static/high-level-c4bcd4736c2379945f3239a932bd89af-282b5.png 714w"\n        sizes="(max-width: 650px) 100vw, 650px"\n      />\n    </span>\n  </span>\n  </p>\n<p><a name="problems"></a></p>\n<h3 id="identified-implementation-problems"><a href="#identified-implementation-problems" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Identified implementation problems</h3>\n<ul>\n<li>When we receive an Http Request, what flow should we have ? <a href="#flow-new-request-comes">Answer</a></li>\n<li>How can the Bouncer service know all the micro-services and what resources does it have ? <a href="#new-micro-service">Answer</a></li>\n<li>How can we extract the required resources from an Http request ? <a href="#extract-auth-resource">Answer</a></li>\n<li>How can we store our data model ? <a href="#data-storage">Answer</a></li>\n<li>Should the micro services communicate between than ? Or should they use the Service Bouncer? To be answered in the future post!</li>\n<li>Forcing differents teams, perhaps with different technologies, to use the Service bouncer may be a problem. What care should we take to be easy to use in development environment? <a href="#care-about-your-developer">Answer</a></li>\n</ul>\n<p><a name="implementation"></a></p>\n<h2 id="implementation"><a href="#implementation" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Implementation</h2>\n<p><a name="flow-new-request-comes"></a></p>\n<h3 id="flow-new-request-comes"><a href="#flow-new-request-comes" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Flow new request comes</h3>\n<ol>\n<li>The request arrives to the system</li>\n<li>The request is <strong>authenticated</strong> (convert the jwt, into the user)    </li>\n<li>The http path is processed to:\n1. Extract the micro service we want to reach.\n2. <a href="#extract-auth-resource">Extract the resource in that request</a> we want to use.</li>\n<li>We know the user, the micro-service and the resource.</li>\n<li>Now we can process all the information to perform <strong>Authorization</strong>\n1.1. The answer could be negative\n1.2. Or Positive\n1.2. Or Positive, but with conditions (levels of access)  </li>\n<li>The request is forwarded to the micro service, with levels of access.</li>\n</ol>\n<p><a name="new-micro-service"></a></p>\n<h3 id="registration-of-a-new-micro-service"><a href="#registration-of-a-new-micro-service" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Registration of a new micro-service</h3>\n<ol>\n<li>When a new micro service launches, it should have a configured end point to reach the bouncer service.</li>\n<li>And the new micro service will send, to the bouncer service, something like this to register itself: </li>\n</ol>\n<div class="gatsby-highlight">\n      <pre class="language-json"><code><span class="token punctuation">{</span>\n   <span class="token property">"name"</span><span class="token operator">:</span><span class="token string">"name-of-example1"</span><span class="token punctuation">,</span>\n   <span class="token property">"version"</span><span class="token operator">:</span><span class="token string">"v0.0.1"</span><span class="token punctuation">,</span>\n   <span class="token property">"forwardHost"</span><span class="token operator">:</span><span class="token string">"api-internal.example1.com"</span><span class="token punctuation">,</span>\n   <span class="token property">"paths"</span><span class="token operator">:</span><span class="token punctuation">{</span>\n\t <span class="token property">"GET:/path1/"</span> <span class="token operator">:</span> <span class="token punctuation">{</span>\n\t \t<span class="token property">"require"</span><span class="token operator">:</span><span class="token punctuation">[</span><span class="token string">"resource1"</span><span class="token punctuation">]</span>\n\t <span class="token punctuation">}</span><span class="token punctuation">,</span>\n\t <span class="token property">"POST:/path1/"</span> <span class="token operator">:</span> <span class="token punctuation">{</span>\n\t \t<span class="token property">"require"</span><span class="token operator">:</span><span class="token punctuation">[</span><span class="token string">"resource1"</span><span class="token punctuation">]</span>\n\t <span class="token punctuation">}</span><span class="token punctuation">,</span>\n\t <span class="token property">"GET:/path1/:ID"</span> <span class="token operator">:</span> <span class="token punctuation">{</span>\n\t \t<span class="token property">"require"</span><span class="token operator">:</span><span class="token punctuation">[</span><span class="token string">"resource1"</span><span class="token punctuation">,</span> <span class="token string">"resource2"</span><span class="token punctuation">]</span>\n\t <span class="token punctuation">}</span>\n   <span class="token punctuation">}</span><span class="token punctuation">,</span>\n   <span class="token property">"resources"</span><span class="token operator">:</span><span class="token punctuation">[</span>\n   \t <span class="token punctuation">{</span><span class="token property">"code"</span><span class="token operator">:</span><span class="token string">"resource1"</span><span class="token punctuation">,</span> <span class="token property">"levels"</span><span class="token operator">:</span><span class="token punctuation">[</span><span class="token string">"level1"</span><span class="token punctuation">,</span> <span class="token string">"level2"</span><span class="token punctuation">,</span> <span class="token string">"level3"</span><span class="token punctuation">]</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n   \t <span class="token punctuation">{</span><span class="token property">"code"</span><span class="token operator">:</span><span class="token string">"resource2"</span><span class="token punctuation">}</span>\n   <span class="token punctuation">]</span>\n\n<span class="token punctuation">}</span>\n</code></pre>\n      </div>\n<p>With the version it should be possible to <strong>run multiple versions at a time</strong>, and the bouncer service could have special behaviours to handle multiple versions. This feature could facilitate <a href="https://martinfowler.com/bliki/BlueGreenDeployment.html">blue-green deploys</a>. </p>\n<p>All paths are declared and mapped to resources. So that, when the service bouncer receives the request:\n<code>GET &#x3C;host>/path1/125</code> it knows that it <strong>requires</strong>: <code>resource1</code> and <code>resource2</code>.\nSo it will search if the authorized user has access it.</p>\n<ul>\n<li>if the user doesn’t have access to it, the request will not be forwarded.</li>\n<li>if the user has access to it, the request will be forwarded, adding in to the http headers the <em>level</em> of resource1. </li>\n</ul>\n<p><a name="extract-auth-resource"></a></p>\n<h3 id="extract-auth-resources-from-http-request"><a href="#extract-auth-resources-from-http-request" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Extract ‘auth resources’ from http request</h3>\n<p>The service bouncer could create a suffix tree of all paths in the infrastructure, <a href="https://en.wikipedia.org/wiki/Suffix_tree">Suffix tree</a>.</p>\n<p>Something like this:</p>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>"path1/"\n   -> <endPath> \n          -> GET  {fullPath: GET:path1, requires:["resource1"]}\n   -> <endPath> \n           -> POST {fullPath: POST:path1, requires:["resource1"]}\n   -> <anyIntValue> \n          -> <endPath> \n                 -> GET {fullPpath: POST:path1/:id, requires:["resource1", "resource2"]}</code></pre>\n      </div>\n<p>The information stored in the leaf of that tree could store the required <strong>resources</strong>.</p>\n<p>Knowing this, the Bouncer service will extract from the http headers the resources it requires.\nThe Http request will only be forwarded to the micro service if the actual user has access to the resources. </p>\n<p><a name="data-storage"></a></p>\n<h3 id="store-data-in-couchbase"><a href="#store-data-in-couchbase" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Store data in Couchbase</h3>\n<ol>\n<li>\n<p>First authentication:\nThe request will arrive to the Bouncer Service with a <a href="https://jwt.io/introduction/">Json web token (JWT)</a>.\nUsing the secret we will guarantee that it is a valid token.\nOR\nWe could use the old fashioned RANDOM TOKEN that maps the database to the userId.</p>\n</li>\n<li>\n<p>After having a valid user id, we can search in the couchbase for the key <code>p:$user1</code></p>\n</li>\n<li>\n<p>Now we search all the roles of that user, example <code>r:role1</code> and <code>r:role2</code></p>\n</li>\n<li>\n<p>Then we know all the resources and levels for that user.</p>\n</li>\n<li>\n<p>Since the resource was already <a href="#extract-auth-resource">parsed bellow</a>,\nwe know everything to authorize and forward this request.   </p>\n</li>\n</ol>\n<h4 id="couchbase-keys"><a href="#couchbase-keys" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Couchbase keys</h4>\n<div class="gatsby-highlight">\n      <pre class="language-none"><code>p:$userId => {"roles":["role1", "role2"]}\n\nr:$roleCode => {"resources":{"resource1":{"with":["level1"]}, "resource2":{}}}</code></pre>\n      </div>\n<p><a name="care-about-your-developer"></a></p>\n<h3 id="easy-to-use-in-development-environment"><a href="#easy-to-use-in-development-environment" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Easy to use in Development Environment</h3>\n<p>There are multiple differents things to do:</p>\n<ul>\n<li>Distribute the Service Bouncer inside a docker (You can use also have the couchbase inside a docker).</li>\n<li>Have SDK for your different languages</li>\n<li>Create good error messages, that can provide you real information.</li>\n</ul>\n<p>It is not difficult to create easy to use systems, but you should keep this in mind when you build something that is going to be used by multiples teams.</p>',excerpt:"Motivation Authentication and authorization may be a problem in a micro service environment. \nIf every micro service has its own authentication and…",timeToRead:6,frontmatter:{date:"February 15, 2018",rawDate:"2018-02-15T23:36:56.503Z",excerpt:"",path:"/api-gateway",tags:[],title:"Designing an Api Gateway with authentication and authorization",image:null}}},pathContext:{prev:{excerpt:"Overview over java9 Java 9 had released at September 2017. On this post you will found a global overview of the changes, and some useful links.  Complete change log - from Oracle Minor changes A new tool the  jsheel  - “interactive command-line…",html:'<h1 id="overview-over-java9"><a href="#overview-over-java9" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Overview over java9</h1>\n<p>Java 9 had released at September 2017. On this post you will found a global overview of the changes, and some useful links. </p>\n<p><a href="https://docs.oracle.com/javase/9/whatsnew/toc.html">Complete change log - from Oracle</a></p>\n<h2 id="minor-changes"><a href="#minor-changes" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Minor changes</h2>\n<ul>\n<li>A new tool the <a href="https://www.youtube.com/watch?v=PHJ8-Ef1ZE4">jsheel</a> - “interactive command-line interface for evaluating declarations, statements, and expressions of the Java programming language.”</li>\n<li>Support private interface methods</li>\n<li>\n<p>Complete the removal, begun in Java SE 8, of the underscore from the set of legal identifier names.</p>\n<ul>\n<li>That means we currently could create a variable with name ’_’ ?</li>\n</ul>\n</li>\n<li>Collection methods: <code>Set.of(...), List.of(...), Map.of(...)</code> <a href="https://docs.oracle.com/javase/9/core/creating-immutable-lists-sets-and-maps.htm#JSCOR-GUID-202D195E-6E18-41F6-90C0-7423B2C9B381">doc here</a></li>\n<li><a href="http://openjdk.java.net/jeps/266">Concurrency updates</a>: An interoperable publish-subscribe framework, enhancements to theCompletableFuture API, and various other improvements.</li>\n</ul>\n<h2 id="big-news-jigsaw"><a href="#big-news-jigsaw" aria-hidden="true" class="anchor"><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Big news: Jigsaw</h2>\n<p>The project jigsaw have arrived with native java modularization</p>\n<p><a href="https://www.youtube.com/watch?v=Ks7J_qQVR7Y">Jigsaw 32min video</a></p>\n<ul>\n<li><a href="https://www.quora.com/What-benefits-will-the-new-Java-9-module-system-bring-compared-to-using-jars">Advantages of jigsaw</a>: “With Jigsaw I hope to restrict access to the modules so that only one or two classes are accessible outside module which will make the code more maintainable”</li>\n<li>The jigsaw doesn’t support versioning, <strong>It will not replace maven or sbt</strong>.</li>\n<li>For sbt users like me, we must wait to see what integration sbt will create for jigsaw (<a href="https://github.com/sbt/sbt/issues/3368">ticket</a>)</li>\n</ul>\n<p>Note that is possible to <strong>use java9 without noticing jigsaw</strong>, java will create a monolithic ‘unamed module’ for retro-compatibility,</p>\n<p>Thank you for your attention</p>',id:"C:/Users/ruioliveiras/Desktop/ruioliveiras.com/content/blog/2017-12-15-java9-overview/index.md absPath of file >>> MarkdownRemark",timeToRead:2,frontmatter:{date:"December 15, 2017",draft:!1,path:"/java9-overview",tags:["Scala, Java & JVM"],title:"Java 9 Overview"}},next:!1}}}});
//# sourceMappingURL=path---api-gateway-73fb8e1c5b60aa23c431.js.map