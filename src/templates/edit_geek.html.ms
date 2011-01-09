<img src="/images/geek_Mascotte.png"/>
<div id="upload_avatar">
  {{#avatar_fname}}
    <img src="/images/geeks/{{avatar_fname}}"/>
  {{/avatar_fname}}
  {{^avatar_fname}}
    <img src="/images/smiley.png"/>
  {{/avatar_fname}}
</div>

<form method="post" action="/geeks/{{id}}">
  <input type="text" name="name" value="{{name}}" title="Name" placeholder="Name"/>
  <input type="text" name="nickname" value="{{nickname}}" title="Nickname" placeholder="Nickname"/>
  <input type="text" name="pole" value="{{pole}}" title="Pool" placeholder="Pool"/>
  <input type="submit" value="save"/>
</form>
<form method="delete" action="/geeks/{{id}}">
  <input type="submit" value="delete"/>
</form>

