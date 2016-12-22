---
layout: default
title: Projects
---
<table id="project-list">
{% for post in site.posts %}
 {% if post.category == 'projects' %}
 <tr>
 <td>
  <a href="{{ post.url }}">
  <img id="thumb" src="/images/thumbs/{{ post.title | slugify }}.jpg" alt="{{ post.title }}" />
  </a>
 </td>
 <td>
 <a href="{{ post.url }}" id="short-note">
  {{ post.title }} ({{ post.date | date: "%m/%Y" }})
  <br>
  </a>
  <small>  {{post.note}}</small>
 </td>
 </tr>
 {% endif %}
{% endfor %}
</table>
