<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'>
    <title>html test</title>
  </head>

  <body>
    <h1>{$greeting}</h1>

    {foreach $books as $i => $book}
        <div style="background-color: {cycle values="cyan,yellow"};">
            [{$i+1}] {$book.title|upper} by {$book.author}
                {if $book.price}
                    Price: <span style="color:red">${$book.price}</span>
                {/if}
        </div>
    {foreachelse}
        No books
    {/foreach}

    Total: {$book@total}

    <div>
      异步获取的时间戳: <span id="now"></span>
    </div>

    <script src="/vendor.js"></script>
    <script src="/index.js"></script>
  </body>
</html>
