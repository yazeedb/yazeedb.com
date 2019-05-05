---
title: How to Build a Todo List with React Hooks
date: '2018-11-19'
---

![](https://cdn-images-1.medium.com/max/1600/1*mKtppOPghvXQKu0jte2B_g.jpeg)

React v16.7.0-alpha introduced [Hooks](https://reactjs.org/docs/hooks-intro.html), and I’m excited.

### What Are Hooks?

They’re functions that give you React features like state and lifecycle hooks without ES6 classes.

Some benefits are

- Isolating stateful logic, making it easier to test.
- Sharing stateful logic without render props or higher-order components.
- Separating your app’s concerns based on logic, not lifecycle hooks.
- Avoiding ES6 classes, because they’re quirky, _not actually classes,_ and trip up even experienced JavaScript developers.

For more detail see [React’s official Hooks intro](https://reactjs.org/docs/hooks-intro.html).

#### Don’t Use in Production!

At the time of this writing, **Hooks are in alpha. Their API can change at any time.**

I recommend you experiment, have fun, and use Hooks in your side projects, but not in production code until they’re stable.

### Let’s Build a Todo List

![](https://cdn-images-1.medium.com/max/1600/1*zRNbgEedt8wchJNrZ1NuHg.gif)

Todo lists are the most overused example for a good reason — they’re fantastic practice. I recommend this for any language or library you want to try out.

Ours will only do a few things

- Display todos in a nice Material Design fashion
- Allow adding todos via input
- Delete todos

### Setup

Here are the [GitHub](https://github.com/yazeedb/react-hooks-todo) and [CodeSandbox](https://codesandbox.io/s/github/yazeedb/react-hooks-todo) links.

<pre name="df24" id="df24" class="graf graf--pre graf-after--p">git clone [https://github.com/yazeedb/react-hooks-todo](https://github.com/yazeedb/react-hooks-todo)
cd react-hooks-todo
npm install</pre>

The `master` branch has the finished project, so checkout the `start` branch if you wish to follow along.

<pre name="c222" id="c222" class="graf graf--pre graf-after--p">git checkout start</pre>

And run the project.

<pre name="310d" id="310d" class="graf graf--pre graf-after--p">npm start</pre>

The app should be running on `localhost:3000`, and here’s our initial UI.

![](https://cdn-images-1.medium.com/max/1600/1*ohwA9I861XXghIFAL2Kpcw.png)

It’s already set up with [material-ui](http://material-ui.com/) to give our page a professional look. Let’s start adding some functionality!

### The TodoForm Component

Add a new file, `src/TodoForm.js`. Here’s the starting code.

<pre name="b9ab" id="b9ab" class="graf graf--pre graf-after--p">import React from 'react';
import TextField from '@material-ui/core/TextField';</pre>

<pre name="458f" id="458f" class="graf graf--pre graf-after--pre">const TodoForm = ({ saveTodo }) => {
  return (
    <form>
      <TextField
        variant="outlined"
        placeholder="Add todo"
        margin="normal"
      />
    </form>
  );
};</pre>

<pre name="3e80" id="3e80" class="graf graf--pre graf-after--pre">export default TodoForm;</pre>

Given the name, we know its job is to add todos to our state. Speaking of which, **here’s our first hook**.

### useState

Check this code out

<pre name="01bf" id="01bf" class="graf graf--pre graf-after--p">import { useState } from 'react';</pre>

<pre name="44f1" id="44f1" class="graf graf--pre graf-after--pre">const [value, setValue] = useState('');</pre>

`useState` is just a function that takes initial state and returns an array. Go ahead and `console.log` it.

The array’s first index is your state’s current value, and the second index is an updater function.

So we appropriately named them `value` and `setValue` using [ES6 destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

### useState with Forms

Our form should track the input’s value and call `saveTodo` upon submit. `useState` can help us with that!

Update `TodoForm.js`, the new code’s in **bold**.

<pre name="aa45" id="aa45" class="graf graf--pre graf-after--p">import React, **{ useState }** from 'react';
import TextField from '@material-ui/core/TextField';</pre>

<pre name="149c" id="149c" class="graf graf--pre graf-after--pre">const TodoForm = ({ saveTodo }) => {
 **const [value, setValue] = useState('');**</pre>

<pre name="bd9b" id="bd9b" class="graf graf--pre graf-after--pre">  return (
    <form
      **onSubmit={event => {
        event.preventDefault();**</pre>

<pre name="758b" id="758b" class="graf graf--pre graf-after--pre"> **saveTodo(value);
      }}**
    >
      <TextField
        variant="outlined"
        placeholder="Add todo"
        margin="normal"
 **onChange={event => {
          setValue(event.target.value);
        }}
        value={value}**      />
    </form>
  );
};</pre>

<pre name="7289" id="7289" class="graf graf--pre graf-after--pre">export default TodoForm;</pre>

Back in `index.js`, import and use this component.

<pre name="8bf1" id="8bf1" class="graf graf--pre graf-after--p">...</pre>

<pre name="96ca" id="96ca" class="graf graf--pre graf-after--pre">import TodoForm from './TodoForm';</pre>

<pre name="72eb" id="72eb" class="graf graf--pre graf-after--pre">...</pre>

<pre name="866d" id="866d" class="graf graf--pre graf-after--pre">const App = () => {
  return (
    <div className="App">
    <Typography component="h1" variant="h2">
      Todos
    </Typography></pre>

<pre name="7f58" id="7f58" class="graf graf--pre graf-after--pre">    **<TodoForm saveTodo={console.warn} />**
   </div>
  );
};</pre>

Now your value’s logged on submit (press enter).

![](https://cdn-images-1.medium.com/max/1600/1*R3Bf_6tAIC9nGyBSoW48Tg.png)

### useState With Todos

We also need state for our todos. Import `useState` in `index.js`. Our initial state should be an empty array.

<pre name="e4ab" id="e4ab" class="graf graf--pre graf-after--p">import React, { useState } from 'react';</pre>

<pre name="2295" id="2295" class="graf graf--pre graf-after--pre">...</pre>

<pre name="9e67" id="9e67" class="graf graf--pre graf-after--pre">const App = () => {
  const [todos, setTodos] = useState([]);</pre>

<pre name="bcfd" id="bcfd" class="graf graf--pre graf-after--pre">  return ...</pre>

### TodoList Component

Create a new file called `src/TodoList.js`.

Much of the code is fancy components from the Material-UI library. The important stuff’s in **bold** font.

Edit: Thank you [Takahiro Hata](https://medium.com/@takahirohata) for helping me move `onClick` to the correct spot!

<pre name="b241" id="b241" class="graf graf--pre graf-after--p">import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const TodoList = ({ **todos, deleteTodo** }) => (
  <List>
    {**todos.map((todo, index) => (**
      <ListItem key={index.toString()} dense button>
        <Checkbox tabIndex={-1} disableRipple />
        <ListItemText **primary={todo}** />
        <ListItemSecondaryAction>
          **<IconButton
            aria-label="Delete"
            onClick={() => {
              deleteTodo(index);
            }}
          >
            <DeleteIcon />
          </IconButton>**
        </ListItemSecondaryAction>
      </ListItem>
 **))**}
  </List>
);

export default TodoList;</pre>

It takes two props

- `todos`: The array of todos. We `map` over each one and create a list item.
- `deleteTodo`: Clicking a todo’s `IconButton` fires this function. It passes the `index`, which will uniquely identify a todo in our list.

Import this component in your `index.js`.

<pre name="1fee" id="1fee" class="graf graf--pre graf-after--p">...</pre>

<pre name="48d9" id="48d9" class="graf graf--pre graf-after--pre">**import TodoList from './TodoList';**
import './styles.css';</pre>

<pre name="a2ef" id="a2ef" class="graf graf--pre graf-after--pre">const App = () => { ...</pre>

And use it in your `App` function like so

<pre name="8b0c" id="8b0c" class="graf graf--pre graf-after--p">...</pre>

<pre name="f4c2" id="f4c2" class="graf graf--pre graf-after--pre"><TodoForm saveTodo={console.warn} />
**<TodoList todos={todos} />**</pre>

### Adding Todos

Still in `index.js`, let’s edit our `TodoForm`’s prop, `saveTodo`.

<pre name="dbce" id="dbce" class="graf graf--pre graf-after--p"><TodoForm
  saveTodo={todoText => {
    const trimmedText = todoText.trim();</pre>

<pre name="bf55" id="bf55" class="graf graf--pre graf-after--pre">    if (trimmedText.length > 0) {
      setTodos([...todos, trimmedText]);
    }
  }}
/></pre>

Simply merge the existing todos with our new one, extra whitespace cut out.

We can add todos now!

![](https://cdn-images-1.medium.com/max/1600/1*3fiAjGTZh6umusulyIqbkg.gif)

### Clearing the Input

Notice the input isn’t clearing after adding a new todo. That’s a bad user experience!

We can fix it with a small code change in `TodoForm.js`.

<pre name="0c76" id="0c76" class="graf graf--pre graf-after--p"><form
  onSubmit={event => {
    event.preventDefault();</pre>

<pre name="b5c4" id="b5c4" class="graf graf--pre graf-after--pre">    saveTodo(value);</pre>

<pre name="19e6" id="19e6" class="graf graf--pre graf-after--pre"> **setValue('');**
  }}
></pre>

Once a todo’s saved, set the form state to an empty string.

It’s looking good now!

![](https://cdn-images-1.medium.com/max/1600/1*N9EeEN3ZG12VubC10OT-9A.gif)

### Deleting Todos

`TodoList` provides each todo’s `index`, as it’s a guaranteed way to find the one we want to delete.

<pre name="20f4" id="20f4" class="graf graf--pre graf-after--p">// TodoList.js</pre>

<pre name="4c06" id="4c06" class="graf graf--pre graf-after--pre"><IconButton
  aria-label="Delete"
  onClick={() => {
    deleteTodo(index);
  }}
>
  <DeleteIcon />
</IconButton></pre>

We’ll take advantage of that in `index.js`.

<pre name="ed4b" id="ed4b" class="graf graf--pre graf-after--p"><TodoList
  todos={todos}
  **deleteTodo={todoIndex => {
    const newTodos = todos
      .filter((_, index) => index !== todoIndex);

    setTodos(newTodos);
  }}**
/></pre>

Whatever todos don’t match the provided `index` are kept and stored in state using `setTodos`.

Delete functionality is complete!

![](https://cdn-images-1.medium.com/max/1600/1*i7WsUbuF0pI2HS0b6ddZ8Q.gif)

### Abstracting Todos useState

I mentioned that Hooks are great for separating state and component logic. Here’s what that may look like in our todo app.

Create a new file called `src/useTodoState.js`.

<pre name="d36f" id="d36f" class="graf graf--pre graf-after--p">import { useState } from 'react';

export default initialValue => {
  const [todos, setTodos] = useState(initialValue);

  return {
    todos,
    addTodo: todoText => {
      setTodos([...todos, todoText]);
    },
    deleteTodo: todoIndex => {
      const newTodos = todos
        .filter((_, index) => index !== todoIndex);

      setTodos(newTodos);
    }
  };
};</pre>

It’s our same code from `index.js`, but separated! Our state management’s no longer tightly coupled to the component.

Now just import it. The new code’s in **bold**.

<pre name="aa3f" id="aa3f" class="graf graf--pre graf-after--p">import React from 'react';
import ReactDOM from 'react-dom';
import Typography from '@material-ui/core/Typography';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
**import useTodoState from './useTodoState';**
import './styles.css';

const App = () => {
 **const { todos, addTodo, deleteTodo } = useTodoState([]);**

  return (
    <div className="App">
      <Typography component="h1" variant="h2">
        Todos
      </Typography>

      **<TodoForm
        saveTodo={todoText => {
          const trimmedText = todoText.trim();

          if (trimmedText.length > 0) {
            addTodo(trimmedText);
          }
        }}
      />**

 **<TodoList todos={todos} deleteTodo={deleteTodo} />**
    </div>
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);</pre>

And everything still works like normal.

![](https://cdn-images-1.medium.com/max/1600/1*i7WsUbuF0pI2HS0b6ddZ8Q.gif)

### Abstracting Form Input useState

We can do the same with our form!

Create a new file, `src/useInputState.js`.

<pre name="49c0" id="49c0" class="graf graf--pre graf-after--p">import { useState } from 'react';

export default initialValue => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    onChange: event => {
      setValue(event.target.value);
    },
    reset: () => setValue('')
  };
};</pre>

And now `TodoForm.js` should look like this.

<pre name="0cd3" id="0cd3" class="graf graf--pre graf-after--p">import React from 'react';
import TextField from '@material-ui/core/TextField';
**import useInputState from './useInputState';**

const TodoForm = ({ saveTodo }) => {
 **const { value, reset, onChange } = useInputState('');**

  return (
    <form
      onSubmit={event => {
        event.preventDefault();

 **saveTodo(value);
        reset();**
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Add todo"
        margin="normal"
 **onChange={onChange}**
        value={value}
      />
    </form>
  );
};

export default TodoForm;</pre>

And we’re all done!

Hope you enjoyed, until next time!

Take care,
Yazeed Bzadough
[http://yazeedb.com/](http://yazeedb.com/)
