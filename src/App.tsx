import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dexie, { EntityTable } from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

interface Friend {
  id: number;
  name: string;
  age: number;
}

const db = new Dexie("MyDatabase") as Dexie & {
  friends: EntityTable<Friend, 'id'>;
}
db.version(1).stores({
  friends: "++id,name,age"
});
db.on.populate.subscribe(() => {
  db.friends.bulkAdd([
    { name: "Foo", age: 10 },
    { name: "Bar", age: 20 },
    { name: "Baz", age: 30 },
  ]);
});


function App() {
  const [count, setCount] = useState(0)
  const friends = useLiveQuery(() => db.friends.toArray(), []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <p>Dexie Version: ${Dexie.semVer}</p>
      <h2>Friends</h2>
      <ul>
        {friends?.map((friend) => (
          <li key={friend.id}>
            {friend.name}, {friend.age}
          </li>
        ))}
      </ul>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
