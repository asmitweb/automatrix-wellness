document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    let chatHistory = [
      {
        role: "model",
        parts: [{ text: "Hello! I'm your AI Wellbeing Assistant. How are you feeling today?" }]
      }
    ];
  
    // Function to add message to chat
    function addMessage(text, isUser) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `chat-message ${isUser ? 'user-message' : 'ai-message'}`;
      messageDiv.innerHTML = `<p>${text}</p>`;
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  
    // Function to send message to backend
    async function sendMessage() {
      const message = userInput.value.trim();
      if (!message) return;
      
      // Add user message to chat
      addMessage(message, true);
      userInput.value = '';
      
      // Add user message to history
      chatHistory.push({
        role: "user",
        parts: [{ text: message }]
      });
      
      try {
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chat-message ai-message';
        typingIndicator.innerHTML = '<p><i class="fas fa-ellipsis-h"></i></p>';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Send to backend
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,
            history: chatHistory
          }),
        });
        
        // Remove typing indicator
        chatMessages.removeChild(typingIndicator);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        // Add AI response to chat and history
        addMessage(data.response, false);
        chatHistory.push({
          role: "model",
          parts: [{ text: data.response }]
        });
        
      } catch (error) {
        console.error('Error:', error);
        addMessage("I'm having trouble connecting right now. Please try again later.", false);
      }
    }
  
    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  });
  