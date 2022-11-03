# Twig cheatsheet

**Source:** [http://twig.sensiolabs.org/documentation](http://twig.sensiolabs.org/documentation)

## Links

Declare your pages links like this to always use the root project path :

```
<a href="{{ path('html_page', {'template': 'pages:02.hotel/02.hotel-activities.html.twig'}) }}">Activities</a>
```

## Assets

Declare your img, js, css, ... path like this to always use the root project path :

```
<img src="{{ asset('images/dynamic/chef-header-detail.jpg') }}" >
```

__For a matter of cache version, a data (?v=xxxxxxxx) can be added to the end of the generated asset path__

if you need to set an asset path without data at the end of the path, declare the asset like this :

```
var sMyPathOnly = {{ asset('my/path/only.js', null, false, false) }}
```

## Extends

```
{% extends "base.html" %}

{% block monBLock %}
    Content to be overwrite from base.html
{% endblock monBLock %}
```

## Include

```
{% include "C2isOneTeaBundle:includes:components/blocCitation/citation-circled.html.twig" %}
```

### Include with variables
```
{% include "C2isOneTeaBundle:includes:02.hotel/property/room.html.twig" with {'myVariable':true, 'myVariable':'lorem', 'myVariable': 345} %}
```

## Variables

### Set
```
{% set myVariable = 'foo' %}
{% set myVariable = [1, 3] %}
{% set myVariable = {'foo': 'bar'} %}
{% set myVariable = app.request.query.get('myVariable') %} // $_GET methode
{% set myVariable = app.request.request.get('myVariable') %} // $_POST methode
```

Set default value (with 'default' filter) :
```
{% set myVariable = myVariable|default('myDefaultValue') %}
{% set myVariable = myVariable|default('') %}
```

### Get
```
<h1>{{myVariable}}</h1>
```

## if

```
{% if myVariable == 0 %}
    //do stuff
{% endif %}

{% if myVariable %}
    //do stuff
{% endif %}
```

## for

```
{% for i in 0..10 %}
    * {{ i }}
{% endfor %}
```

## Mobile

### Twig
```
{% if not is_phone() %}
    //do desktop & tablet stuff
{% endif %}

{% if is_phone() %}
    //do phone stuff
{% endif %}

{% if not is_mobile() %}
    //do desktop stuff
{% endif %}

{% if is_mobile() %}
    //do phone & tablet stuff
{% endif %}

{% if is_tablet() %}
    //do tablet stuff
{% endif %}

{% if is_ios() %}
    //do ios stuff
{% endif %}

{% if is_phone() %}
    //do phone stuff
{% else %}
    //do not phone stuff
{% endif %}

// anotate markup change with
{# TODO:RWD:DEV #} // start anotate before modification
{# // TODO:RWD:DEV #} // finish anotate after modification
```

### CSS
```
html.is-phone / html.is-not-phone
html.is-tablet / html.is-not-tablet
html.is-desktop / html.is-not-desktop
html.is-ios / html.is-not-ios
```

### JS
```
bIsPhone
bIsTablet
bIsDesktop
bIsIos
```
* if you have small differences :
    * use var *bIsPhone* in the js function to manage different cases
* if the differences are too important :
    * move the function in *js/functions/desktop/* and duplicate it in *js/functions/desktop/*
    * anotate it in the top of each files and in *js/front.js* or *js/functions/fn_initAndAjax.js* just before the call of the function
* if you need to call the function just for *only* one device :
    * /!\ place specific mobile function in js/functions/mobile/
    * /!\ place specific desktop function in js/functions/desktop/
    * create / move the function file in the device repository
    * anotate it in the top of the file and in *js/front.js* or *js/functions/fn_initAndAjax.js* just before the call of the function
    * dant forget to add the condition bIsPhone / !bIsPhone around the call function
