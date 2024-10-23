import { decode } from "punycode"
import { useCallback, useState } from "react"

const MessageField = ({setMessages,messages,setTemporal}:any) => {
    
    const [input,setInput] = useState("")
    const [disabled,setDisabled] = useState(false)
    const [messageId,setMessageId] = useState(0)


    const savingUserMessage = async (event:any) => {
        console.log("Guardando...")
        if(input === "") { return }
        event.preventDefault()
        const message = input
        setMessages([...messages,{
            id: messageId,
            name: "Kevin",
            message
        }])
        setMessageId(messageId + 1)

        await answeringWithLlama()
        setDisabled(true)
        setInput("")
    }

    const answeringWithLlama = async () => {
       try{
        console.log("Ejecutando respuesta...")
        const response = await fetch('http://127.0.0.1:11434/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: input, 
              model: 'llama3.2',
              stream: true
            })
          })

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        setTemporal("")

        while(true){
            const {done,value} = await reader?.read()
            if (done) {
                break;
            }

            const decodedChunk:any = decoder.decode(value, {stream: true})
            console.log(decodedChunk)

        }

       }catch(e){ 

       }
    }



  return (
    <form className="w-full flex gap-6 items-center justify-center h-12" onSubmit={async (event)=>{
        savingUserMessage(event)
        await answeringWithLlama()

    }}>
        <input placeholder="Type your message" name="messageUser" disabled={disabled} value={input} className="rounded-xl min-h-full flex-grow outline-none bg-zinc-700 disabled:bg-none focus:shadow-sm px-4 focus:shadow-zinc-600 transition-shadow" onChange={(e) => setInput(e.target.value)}/>
        <button type="submit" disabled={disabled} className="disabled:bg-zinc-700 disabled:text-zinc-400 bg-[#3061E3] rounded-xl h-full px-4 hover:bg-blue-700 transition-all">Send</button>
    </form>
  )
}

export default MessageField