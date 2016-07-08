{* Smarty *}
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <title>smarty example</title>
</head>
<body>
  <h1>Hello, {$name|upper}</h1>
  <ul>
    {foreach from=$languages item=language}
      <li><%=language%></li>
    {/foreach}
  </ul>
</body>
</html>
