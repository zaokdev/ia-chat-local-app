import { useEffect, useState } from "react"
import MessageField from "./components/MessageField"

function App(): JSX.Element {

  const [messages,setMessages] = useState([])
  const [temporal,setTemporal] = useState("Se está enviando...")

  useEffect(()=>{
    console.log(temporal)
  },[temporal])

  return (
    <>
      <main className="dark:bg-zinc-800 h-screen dark:text-white px-6 py-4 flex flex-col">
        <div className="flex-grow">
          {messages.length > 0 && messages.map((message:any)=>(
            <div key={}>
              <span className="text-lg font-bold">{message.name}</span>
              <p>{message.message}</p>
            </div>
            
          ))}
                       {<div><span></span><p>{temporal}</p></div>}
        </div>
        <MessageField setMessages={setMessages} messages={messages} setTemporal= {temporal}/>
      </main>
    </>
  )
}

export default App
