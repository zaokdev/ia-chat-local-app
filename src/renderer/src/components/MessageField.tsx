
const MessageField = () => {
  return (
    <form className="w-full flex gap-6 items-center justify-center h-12">
        <input placeholder="Type your message" className="rounded-xl min-h-full flex-grow outline-none bg-zinc-700 focus:shadow-sm px-4 focus:shadow-zinc-600 transition-shadow"/>
        <button type="submit" className="bg-[#3061E3] rounded-xl h-full px-4 hover:bg-blue-700 transition-all">Send</button>
    </form>
  )
}

export default MessageField