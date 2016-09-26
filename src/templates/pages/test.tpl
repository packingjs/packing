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
