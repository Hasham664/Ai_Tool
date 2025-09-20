"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react"

export function ChatbotWidget() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (session?.user && messages.length === 0) {
      initializeConversation()
    }
  }, [session])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const initializeConversation = async () => {
    try {
      const response = await fetch("/api/chat/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      const data = await response.json()

      if (data.success) {
        setConversationId(data.conversationId)
        setMessages([
          {
            id: 1,
            text: "Hi! I'm your AI Career Assistant. I can help you with job search strategies, interview preparation, career advice, and questions about our platform. How can I assist you today?",
            sender: "bot",
            timestamp: new Date(),
          },
        ])
      }
    } catch (error) {
      console.error("Failed to initialize conversation:", error)
      setMessages([
        {
          id: 1,
          text: "Hi! I'm your AI Career Assistant. How can I help you today?",
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputValue,
          conversationId,
          userId: session?.user?.id,
        }),
      })
      

      const data = await response.json()

      if (data.success) {
        const botMessage = {
          id: Date.now() + 1,
          text: data.response,
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      } else {
        throw new Error(data.error || "Failed to get response")
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!session) {
    return null
  }

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className='fixed bottom-6 right-2 max-sm:right-6 z-50'
          >
            <Button
              onClick={() => setIsOpen(true)}
              className='sm:h-16 h-12 sm:w-16 w-12 rounded-full shadow-2xl bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 hover:scale-110 transition-all duration-300'
            >
              <MessageSquare className='h-7 w-7' />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='fixed bottom-6 right-2 sm:right-6 z-50'
          >
            <Card className=' w-80 mx-auto sm:w-96 h-[450px] sm:h-[500px] shadow-2xl flex flex-col py-0'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pt-2 pb-0 border-b bg-gradient-to-r from-primary/5 '>
                <div className='flex items-center space-x-3'>
                  <div className='p-2 bg-gradient-to-r from-primary to-chart-1 rounded-full'>
                    <Bot className='h-4 w-4 text-white' />
                  </div>
                  <div>
                    <CardTitle className='text-base font-semibold'>
                      AI Career Assistant
                    </CardTitle>
                    <p className='text-xs text-muted-foreground'>Online now</p>
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setIsOpen(false)}
                  className='hover:bg-red-100 hover:text-red-600'
                >
                  <X className='h-4 w-4' />
                </Button>
              </CardHeader>

              <CardContent className='flex-1 flex flex-col p-0 overflow-hidden'>
                {/* Messages Container - Fixed height and scroll */}
                <div className='flex-1 overflow-y-auto p-4 space-y-4 max-h-[350px]'>
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${
                          message.sender === 'user'
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`flex items-start space-x-2 max-w-[85%]`}
                        >
                          {message.sender === 'bot' && (
                            <div className='flex-shrink-0 w-7 h-7 bg-gradient-to-r from-primary to-chart-1 rounded-full flex items-center justify-center mt-1'>
                              <Bot className='h-3 w-3 text-white' />
                            </div>
                          )}
                          <div
                            className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                              message.sender === 'user'
                                ? 'bg-gradient-to-r from-primary to-purple-500 text-black ml-auto rounded-br-md'
                                : 'bg-muted text-muted-foreground rounded-bl-md'
                            }`}
                          >
                            {message.text}
                          </div>
                          {message.sender === 'user' && (
                            <div className='flex-shrink-0 w-7 h-7 bg-gradient-to-r from-chart-1 to-blue-500 rounded-full flex items-center justify-center mt-1'>
                              <User className='h-3 w-3 text-white' />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Loading indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='flex justify-start'
                    >
                      <div className='flex items-start space-x-2 max-w-[85%]'>
                        <div className='flex-shrink-0 w-7 h-7 bg-gradient-to-r from-primary to-chart-1 rounded-full flex items-center justify-center mt-1'>
                          <Bot className='h-3 w-3 text-white' />
                        </div>
                        <div className='bg-muted text-muted-foreground p-3 rounded-2xl rounded-bl-md text-sm shadow-sm'>
                          <div className='flex items-center space-x-2'>
                            <Loader2 className='h-3 w-3 animate-spin' />
                            <span>Thinking...</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area - Fixed positioning and improved styling */}
                <div className='p-4 border-t bg-card/50 backdrop-blur-sm'>
                  <div className='flex space-x-3'>
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder='Ask Ai How This Tool Work.'
                      className='flex-1 px-4 py-3 text-sm border border-input rounded-2xl bg-background resize-none min-h-[44px] max-h-[100px] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
                      rows={1}
                      disabled={isLoading}
                    />
                    <Button
                      size='sm'
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      className='self-end h-11 w-11 rounded-2xl bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 shadow-lg hover:shadow-xl transition-all'
                    >
                      <Send className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
