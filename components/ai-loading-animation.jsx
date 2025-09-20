"use client"

export function AILoadingAnimation({ message = "AI is thinking..." }) {
  return (
    <div className="flex items-center space-x-3 p-4">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-chart-1 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
        <div className="w-2 h-2 bg-chart-2 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
      </div>
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  )
}

export function AiLoading() {
  return (
    <div className='flex flex-col items-center justify-center mt-6'>
      <div className='flex space-x-1'>
        <div className='w-1.5 h-6 bg-gradient-to-t from-pink-500 to-purple-500 rounded-full animate-[pulse_1s_ease-in-out_infinite]'></div>
        <div className='w-1.5 h-6 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full animate-[pulse_1s_ease-in-out_infinite_0.2s]'></div>
        <div className='w-1.5 h-6 bg-gradient-to-t from-pink-500 to-purple-500 rounded-full animate-[pulse_1s_ease-in-out_infinite_0.4s]'></div>
        <div className='w-1.5 h-6 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full animate-[pulse_1s_ease-in-out_infinite_0.6s]'></div>
        <div className='w-1.5 h-6 bg-gradient-to-t from-pink-500 to-purple-500 rounded-full animate-[pulse_1s_ease-in-out_infinite_0.8s]'></div>
      </div>
      <p className='mt-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-semibold'>
        AI is analyzing your answer…
      </p>
    </div>
  );
}