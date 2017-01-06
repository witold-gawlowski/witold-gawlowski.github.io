---
layout: default
title: Projects
---
<table id="project-list">
{% assign sorted_pages = site.posts | sort:"weight" %}
{% for post in sorted_pages reversed %}
 {% if post.category == 'projects' and post.weight > 200 %}
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
