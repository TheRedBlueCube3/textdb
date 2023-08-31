# textdb

### A database system

This database uses TDB syntax. It looks like this.

```
headerlessKey=sdiufghg
{part}
key=3giuvfhiug
```

# Using the module

To start, initialize the module by using `let db = new DB('data.tdb')`.  
Then make a few commands to the database by using `DB.write('hello','world','yes')`.  
You can read out the value by running `console.log(DB.read())`.
You can also make headerless keys by running `DB.write(null,'hello','world')`.
