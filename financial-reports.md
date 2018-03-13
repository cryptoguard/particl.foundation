---
layout: default
title: Financial Reports
---

Reports to be uploaded via PDF every quarter.

<div class="financial-statements">
{% assign financial_statements = site.static_files | where: "pdf", true %}
{% for statement in financial_statements %}
  <a class="statement" href="{{ statement.path }}" title="Download PDF" target="_blank">
    <i class="ico ico-pdf"></i>
    <span class="name">{{ statement.name }}</span>
    <span class="date">{{ statement.modified_time | date_to_string }}</span>
  </a>
{% endfor %}
</div>