import { useState } from "react"
import MessageField from "./components/MessageField"

function App(): JSX.Element {

  const [messages,setMessages] = useState([])

  return (
    <>
      <main className="dark:bg-zinc-800 h-screen dark:text-white px-6 py-4 flex flex-col">
        <div className="flex-grow">
          {messages.length > 0 && messages.map((message:any)=>(
            <div>
              <span className="text-lg font-bold">{message.name && message.name}</span>
              <p>{message.message}</p>
            </div>
          ))}
        </div>
        <MessageField setMessages={setMessages} messages={messages} />
      </main>
    </>
  )
}

export default App
